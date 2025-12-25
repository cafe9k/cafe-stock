/**
 * 数据库相关 IPC 处理器
 */

import { ipcMain, BrowserWindow, app } from "electron";
import { createServer, Server } from "http";
import { URL } from "url";
import fs from "fs";
import path from "path";
import { getDbPath, closeDatabase } from "../db.js";

// SQLite HTTP Server State
let sqliteHttpServer: Server | null = null;
let sqliteHttpPort: number = 8080;
let sqliteHttpUsername: string = "";
let sqliteHttpPassword: string = "";

/**
 * 获取列宽配置文件路径
 */
function getColumnWidthConfigPath(): string {
	return path.join(app.getPath("userData"), "column-widths.json");
}

/**
 * 注册数据库相关 IPC 处理器
 */
export function registerDatabaseHandlers(mainWindow: BrowserWindow | null): void {
	// 获取数据库连接信息
	ipcMain.handle("get-db-connection-info", async () => {
		try {
			const dbPath = getDbPath();
			const isServerRunning = sqliteHttpServer !== null;
			const serverUrl = isServerRunning ? `http://localhost:${sqliteHttpPort}` : null;
			const hasAuth = !!(sqliteHttpUsername && sqliteHttpPassword);
			console.log(`[IPC] get-db-connection-info: ${dbPath}`);
			return {
				success: true,
				dbPath,
				connectionString: `sqlite://${dbPath}`,
				httpServerUrl: serverUrl,
				isServerRunning,
				port: sqliteHttpPort,
				hasAuth,
				username: sqliteHttpUsername || null,
				password: hasAuth ? sqliteHttpPassword : "",
			};
		} catch (error: any) {
			console.error("Failed to get DB connection info:", error);
			return {
				success: false,
				message: error.message || "获取数据库信息失败",
			};
		}
	});

	// 启动 SQLite HTTP 服务器
	ipcMain.handle("start-sqlite-http-server", async (_event, port?: number) => {
		try {
			if (sqliteHttpServer) {
				return {
					success: false,
					message: "HTTP 服务器已在运行",
					port: sqliteHttpPort,
				};
			}

			const serverPort = port || sqliteHttpPort;
			const dbPath = getDbPath();
			// 动态导入数据库实例
			const dbModule = await import("../db.js");
			const db = dbModule.default;

			sqliteHttpServer = createServer(async (req, res) => {
				// 设置 CORS 头
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
				res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
				res.setHeader("Content-Type", "application/json; charset=utf-8");

				if (req.method === "OPTIONS") {
					res.writeHead(200);
					res.end();
					return;
				}

				// 基本认证检查
				if (sqliteHttpUsername && sqliteHttpPassword) {
					const authHeader = req.headers.authorization;
					if (!authHeader || !authHeader.startsWith("Basic ")) {
						res.writeHead(401, { "WWW-Authenticate": 'Basic realm="SQLite Database"' });
						res.end(JSON.stringify({ error: "Authentication required" }));
						return;
					}

					const credentials = Buffer.from(authHeader.substring(6), "base64").toString("utf-8");
					const [username, password] = credentials.split(":");

					if (username !== sqliteHttpUsername || password !== sqliteHttpPassword) {
						res.writeHead(401, { "WWW-Authenticate": 'Basic realm="SQLite Database"' });
						res.end(JSON.stringify({ error: "Invalid credentials" }));
						return;
					}
				}

				try {
					const url = new URL(req.url || "/", `http://${req.headers.host}`);
					const pathname = url.pathname;

					// 健康检查
					if (pathname === "/health" || pathname === "/") {
						res.writeHead(200);
						res.end(
							JSON.stringify({
								status: "ok",
								database: dbPath,
								port: serverPort,
								timestamp: new Date().toISOString(),
							})
						);
						return;
					}

					// 执行 SQL 查询
					if (pathname === "/query" && req.method === "POST") {
						let body = "";
						req.on("data", (chunk) => {
							body += chunk.toString();
						});

						req.on("end", () => {
							try {
								const { sql, params = [] } = JSON.parse(body);
								if (!sql || typeof sql !== "string") {
									res.writeHead(400);
									res.end(JSON.stringify({ error: "SQL query is required" }));
									return;
								}

								// 只允许 SELECT 查询（安全考虑）
								if (!sql.trim().toUpperCase().startsWith("SELECT")) {
									res.writeHead(403);
									res.end(JSON.stringify({ error: "Only SELECT queries are allowed" }));
									return;
								}

								const stmt = db.prepare(sql);
								const result = params.length > 0 ? stmt.all(...params) : stmt.all();

								res.writeHead(200);
								res.end(JSON.stringify({ success: true, data: result }));
							} catch (error: any) {
								res.writeHead(500);
								res.end(JSON.stringify({ error: error.message || "Query execution failed" }));
							}
						});
						return;
					}

					// 获取表列表
					if (pathname === "/tables" && req.method === "GET") {
						const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all() as Array<{ name: string }>;
						res.writeHead(200);
						res.end(JSON.stringify({ success: true, data: tables.map((t) => t.name) }));
						return;
					}

					// 获取表结构
					if (pathname.startsWith("/table/") && req.method === "GET") {
						const tableName = pathname.split("/")[2];
						if (!tableName) {
							res.writeHead(400);
							res.end(JSON.stringify({ error: "Table name is required" }));
							return;
						}

						const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
						res.writeHead(200);
						res.end(JSON.stringify({ success: true, data: columns }));
						return;
					}

					// 404
					res.writeHead(404);
					res.end(JSON.stringify({ error: "Not found" }));
				} catch (error: any) {
					res.writeHead(500);
					res.end(JSON.stringify({ error: error.message || "Internal server error" }));
				}
			});

			sqliteHttpServer.listen(serverPort, () => {
				const authInfo = sqliteHttpUsername && sqliteHttpPassword ? ` (认证: ${sqliteHttpUsername})` : " (无认证)";
				console.log(`[SQLite HTTP Server] Started on http://localhost:${serverPort}${authInfo}`);
				mainWindow?.webContents.send("sqlite-http-server-started", {
					port: serverPort,
					hasAuth: !!(sqliteHttpUsername && sqliteHttpPassword),
					username: sqliteHttpUsername || null,
				});
			});

			sqliteHttpServer.on("error", (error: any) => {
				console.error("[SQLite HTTP Server] Error:", error);
				if (error.code === "EADDRINUSE") {
					mainWindow?.webContents.send("sqlite-http-server-error", {
						message: `端口 ${serverPort} 已被占用`,
					});
				}
			});

			sqliteHttpPort = serverPort;
			return {
				success: true,
				port: serverPort,
				url: `http://localhost:${serverPort}`,
			};
		} catch (error: any) {
			console.error("Failed to start SQLite HTTP server:", error);
			return {
				success: false,
				message: error.message || "启动 HTTP 服务器失败",
			};
		}
	});

	// 停止 SQLite HTTP 服务器
	ipcMain.handle("stop-sqlite-http-server", async () => {
		try {
			if (!sqliteHttpServer) {
				return {
					success: false,
					message: "HTTP 服务器未运行",
				};
			}

			return new Promise((resolve) => {
				sqliteHttpServer?.close(() => {
					console.log("[SQLite HTTP Server] Stopped");
					sqliteHttpServer = null;
					mainWindow?.webContents.send("sqlite-http-server-stopped");
					resolve({
						success: true,
						message: "HTTP 服务器已停止",
					});
				});
			});
		} catch (error: any) {
			console.error("Failed to stop SQLite HTTP server:", error);
			return {
				success: false,
				message: error.message || "停止 HTTP 服务器失败",
			};
		}
	});

	// 获取 SQLite HTTP 服务器状态
	ipcMain.handle("get-sqlite-http-server-status", async () => {
		return {
			isRunning: sqliteHttpServer !== null,
			port: sqliteHttpPort,
			url: sqliteHttpServer ? `http://localhost:${sqliteHttpPort}` : null,
			hasAuth: !!(sqliteHttpUsername && sqliteHttpPassword),
			username: sqliteHttpUsername || null,
		};
	});

	// 设置 SQLite HTTP 服务器认证信息
	ipcMain.handle("set-sqlite-http-auth", async (_event, username: string, password: string) => {
		try {
			if (!username || !password) {
				return {
					success: false,
					message: "用户名和密码不能为空",
				};
			}

			sqliteHttpUsername = username;
			sqliteHttpPassword = password;
			console.log(`[SQLite HTTP Server] Auth configured: username=${username}`);

			return {
				success: true,
				message: "认证信息已设置",
			};
		} catch (error: any) {
			console.error("Failed to set SQLite HTTP auth:", error);
			return {
				success: false,
				message: error.message || "设置认证信息失败",
			};
		}
	});

	// 清除 SQLite HTTP 服务器认证信息
	ipcMain.handle("clear-sqlite-http-auth", async () => {
		try {
			sqliteHttpUsername = "";
			sqliteHttpPassword = "";
			console.log("[SQLite HTTP Server] Auth cleared");

			return {
				success: true,
				message: "认证信息已清除",
			};
		} catch (error: any) {
			console.error("Failed to clear SQLite HTTP auth:", error);
			return {
				success: false,
				message: error.message || "清除认证信息失败",
			};
		}
	});

	// 保存列宽配置
	ipcMain.handle("save-column-widths", async (_event, tableId: string, columnWidths: Record<string, number>) => {
		try {
			const configPath = getColumnWidthConfigPath();

			// 读取现有配置
			let config: Record<string, Record<string, number>> = {};
			if (fs.existsSync(configPath)) {
				const content = fs.readFileSync(configPath, "utf-8");
				config = JSON.parse(content);
			}

			// 更新配置
			config[tableId] = columnWidths;

			// 写入文件
			fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

			console.log(`[IPC] save-column-widths: tableId=${tableId}`);
			return { success: true };
		} catch (error: any) {
			console.error("Failed to save column widths:", error);
			return {
				success: false,
				error: error.message || "保存列宽配置失败",
			};
		}
	});

	// 获取列宽配置
	ipcMain.handle("get-column-widths", async (_event, tableId: string) => {
		try {
			const configPath = getColumnWidthConfigPath();

			if (!fs.existsSync(configPath)) {
				return { success: true, columnWidths: {} };
			}

			const content = fs.readFileSync(configPath, "utf-8");
			const config: Record<string, Record<string, number>> = JSON.parse(content);

			console.log(`[IPC] get-column-widths: tableId=${tableId}`);
			return {
				success: true,
				columnWidths: config[tableId] || {},
			};
		} catch (error: any) {
			console.error("Failed to get column widths:", error);
			return {
				success: false,
				error: error.message || "读取列宽配置失败",
				columnWidths: {},
			};
		}
	});

	// 获取数据库所有表列表
	ipcMain.handle("get-database-tables", async () => {
		try {
			const dbModule = await import("../db.js");
			const db = dbModule.default;
			const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all() as Array<{ name: string }>;
			return {
				success: true,
				tables: tables.map((t) => t.name),
			};
		} catch (error: any) {
			console.error("Failed to get database tables:", error);
			return {
				success: false,
				error: error.message || "获取表列表失败",
				tables: [],
			};
		}
	});

	// 验证表名安全性（防止 SQL 注入）
	function validateTableName(tableName: string): boolean {
		// 只允许字母、数字、下划线
		return /^[a-zA-Z0-9_]+$/.test(tableName);
	}

	// 获取表的 schema 信息
	ipcMain.handle("get-table-schema", async (_event, tableName: string) => {
		try {
			if (!tableName) {
				return {
					success: false,
					error: "表名不能为空",
				};
			}

			if (!validateTableName(tableName)) {
				return {
					success: false,
					error: "无效的表名",
				};
			}

			const dbModule = await import("../db.js");
			const db = dbModule.default;

			// 获取表结构信息
			const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{
				cid: number;
				name: string;
				type: string;
				notnull: number;
				dflt_value: any;
				pk: number;
			}>;

			// 获取索引信息
			const indexes = db.prepare(`SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name=?`).all(tableName) as Array<{
				name: string;
				sql: string | null;
			}>;

			// 获取表的创建 SQL
			const createSql = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(tableName) as {
				sql: string | null;
			} | undefined;

			return {
				success: true,
				tableName,
				columns: columns.map((col) => ({
					cid: col.cid,
					name: col.name,
					type: col.type,
					notNull: col.notnull === 1,
					defaultValue: col.dflt_value,
					primaryKey: col.pk === 1,
				})),
				indexes: indexes.map((idx) => ({
					name: idx.name,
					sql: idx.sql,
				})),
				createSql: createSql?.sql || null,
			};
		} catch (error: any) {
			console.error(`Failed to get table schema for ${tableName}:`, error);
			return {
				success: false,
				error: error.message || "获取表结构失败",
			};
		}
	});

	// 获取表的样本数据
	ipcMain.handle("get-table-sample-data", async (_event, tableName: string, limit: number = 10) => {
		try {
			if (!tableName) {
				return {
					success: false,
					error: "表名不能为空",
				};
			}

			if (!validateTableName(tableName)) {
				return {
					success: false,
					error: "无效的表名",
				};
			}

			// 限制 limit 范围
			const safeLimit = Math.min(Math.max(1, limit || 10), 1000);

			const dbModule = await import("../db.js");
			const db = dbModule.default;

			// 获取总记录数
			const countResult = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as { count: number };
			const totalCount = countResult.count;

			// 获取样本数据
			const sampleData = db.prepare(`SELECT * FROM ${tableName} LIMIT ?`).all(safeLimit) as any[];

			return {
				success: true,
				tableName,
				totalCount,
				sampleData,
				limit,
			};
		} catch (error: any) {
			console.error(`Failed to get sample data for ${tableName}:`, error);
			return {
				success: false,
				error: error.message || "获取样本数据失败",
			};
		}
	});

	// 重置数据库
	ipcMain.handle("reset-database", async (_event, options: { backup: boolean }) => {
		try {
			console.log("[IPC] reset-database: 开始重置数据库", options);

			const dbPath = getDbPath();
			let backupPath: string | null = null;

			// 1. 如果需要备份，先创建备份
			if (options.backup) {
				try {
					const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
					backupPath = path.join(app.getPath("userData"), `cafe_stock_backup_${timestamp}.db`);

					console.log(`[DB Reset] 正在备份数据库到: ${backupPath}`);
					fs.copyFileSync(dbPath, backupPath);
					console.log("[DB Reset] 数据库备份成功");
				} catch (backupError: any) {
					console.error("[DB Reset] 备份失败:", backupError);
					return {
						success: false,
						message: `备份失败: ${backupError.message}`,
					};
				}
			}

			// 2. 停止 SQLite HTTP 服务器（如果正在运行）
			if (sqliteHttpServer) {
				try {
					console.log("[DB Reset] 正在停止 SQLite HTTP 服务器...");
					sqliteHttpServer.close();
					sqliteHttpServer = null;
					console.log("[DB Reset] SQLite HTTP 服务器已停止");
				} catch (serverError: any) {
					console.error("[DB Reset] 停止服务器失败:", serverError);
					// 继续执行，不中断重置流程
				}
			}

			// 3. 关闭数据库连接
			try {
				console.log("[DB Reset] 正在关闭数据库连接...");
				closeDatabase();
				console.log("[DB Reset] 数据库连接已关闭");
			} catch (closeError: any) {
				console.error("[DB Reset] 关闭数据库失败:", closeError);
				return {
					success: false,
					message: `关闭数据库失败: ${closeError.message}`,
				};
			}

			// 4. 删除数据库文件
			try {
				console.log("[DB Reset] 正在删除数据库文件...");
				if (fs.existsSync(dbPath)) {
					fs.unlinkSync(dbPath);
					console.log("[DB Reset] 数据库文件已删除");
				}
			} catch (deleteError: any) {
				console.error("[DB Reset] 删除数据库文件失败:", deleteError);
				return {
					success: false,
					message: `删除数据库文件失败: ${deleteError.message}`,
					backupPath,
				};
			}

			// 5. 重启应用以重新初始化数据库
			console.log("[DB Reset] 数据库重置成功，准备重启应用...");
			setTimeout(() => {
				app.relaunch();
				app.exit(0);
			}, 1000);

			return {
				success: true,
				message: "数据库重置成功，应用将在 1 秒后重启",
				backupPath,
			};
		} catch (error: any) {
			console.error("[DB Reset] 重置数据库失败:", error);
			return {
				success: false,
				message: `重置数据库失败: ${error.message}`,
			};
		}
	});
}

/**
 * 清理资源（应用退出时调用）
 */
export function cleanupDatabaseResources(): void {
	if (sqliteHttpServer) {
		sqliteHttpServer.close();
		sqliteHttpServer = null;
	}
}

