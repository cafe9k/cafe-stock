import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, Notification, nativeImage, NativeImage, session, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import windowStateKeeper from "electron-window-state";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import {
	getAnnouncements,
	getLatestAnnDate,
	getOldestAnnDate,
	hasDataInDateRange,
	insertAnnouncements,
	countAnnouncements,
	upsertStocks,
	getAllStocks,
	countStocks,
	searchStocks,
	getAnnouncementsGroupedByStock,
	getAnnouncementsByStock,
	countStocksWithAnnouncements,
	searchAnnouncementsGroupedByStock,
	countSearchedStocksWithAnnouncements,
	addFavoriteStock,
	removeFavoriteStock,
	isFavoriteStock,
	getAllFavoriteStocks,
	countFavoriteStocks,
	getFavoriteStocksAnnouncementsGrouped,
	countFavoriteStocksWithAnnouncements,
	upsertTop10Holders,
	getTop10HoldersByStock,
	hasTop10HoldersData,
	getStocksWithTop10Holders,
	countStocksWithTop10Holders,
	deleteTop10HoldersByStock,
	getTop10HoldersEndDates,
	getTop10HoldersByStockAndEndDate,
} from "./db.js";
import { TushareClient } from "./tushare.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 扩展 app 对象类型
interface ExtendedApp {
	isQuitting?: boolean;
}

// 开发环境判断
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
const extendedApp = app as typeof app & ExtendedApp;

// Sync State
let isSyncing = false;
let isLoadingHistory = false;
let isSyncingHolders = false;
let isPausedHolders = false;

// 配置自动更新
autoUpdater.autoDownload = false; // 不自动下载，让用户选择
autoUpdater.autoInstallOnAppQuit = true; // 退出时自动安装

// Create Window
function createWindow() {
	// 设置内容安全策略 (仅在生产环境应用严格策略)
	if (!isDev) {
		session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
			callback({
				responseHeaders: {
					...details.responseHeaders,
					"Content-Security-Policy": [
						"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.tushare.pro https://github.com;",
					],
				},
			});
		});
	}

	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		title: "酷咖啡",
		webPreferences: {
			preload: path.join(__dirname, "preload.cjs"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			webSecurity: true,
			webviewTag: true, // 启用 webview 标签
		},
		show: false,
		backgroundColor: "#ffffff",
	});

	// Forward console logs to terminal with detailed information
	mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
		const levelMap: Record<number, string> = {
			0: "LOG",
			1: "INFO",
			2: "WARN",
			3: "ERROR",
		};
		const levelName = levelMap[level] || "UNKNOWN";
		const source = sourceId ? `[${sourceId}]` : "";
		const location = line ? `:${line}` : "";

		// 使用不同颜色和格式输出不同级别的日志
		switch (level) {
			case 0: // log
				console.log(`[Renderer ${levelName}]${source}${location} ${message}`);
				break;
			case 1: // info
				console.info(`[Renderer ${levelName}]${source}${location} ${message}`);
				break;
			case 2: // warn
				console.warn(`[Renderer ${levelName}]${source}${location} ${message}`);
				break;
			case 3: // error
				console.error(`[Renderer ${levelName}]${source}${location} ${message}`);
				break;
			default:
				console.log(`[Renderer ${levelName}]${source}${location} ${message}`);
		}
	});

	mainWindow.once("ready-to-show", () => {
		mainWindow?.show();
		if (Notification.isSupported()) {
			new Notification({
				title: "酷咖啡",
				body: "应用已启动，准备好为您服务！",
			}).show();
		}
	});

	if (isDev) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173");
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
	}

	mainWindow.on("close", (event) => {
		if (!extendedApp.isQuitting) {
			event.preventDefault();
			mainWindow?.hide();
		}
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

function createTray() {
	const iconPath = isDev ? path.join(__dirname, "../build/tray-icon.png") : path.join(process.resourcesPath, "build/tray-icon.png");
	let trayIcon: NativeImage;
	try {
		trayIcon = nativeImage.createFromPath(iconPath);
		if (trayIcon.isEmpty()) {
			trayIcon = nativeImage.createEmpty();
		}
	} catch (error) {
		console.error("创建托盘图标失败:", error);
		trayIcon = nativeImage.createEmpty();
	}

	tray = new Tray(trayIcon);
	tray.setToolTip("酷咖啡");

	const contextMenu = Menu.buildFromTemplate([
		{
			label: "显示窗口",
			click: () => {
				mainWindow?.show();
			},
		},
		{ type: "separator" },
		{
			label: "关于",
			click: () => {
				if (Notification.isSupported()) {
					new Notification({
						title: "酷咖啡",
						body: `版本: ${app.getVersion()}\n基于 Electron + React`,
					}).show();
				}
			},
		},
		{ type: "separator" },
		{
			label: "退出",
			click: () => {
				extendedApp.isQuitting = true;
				app.quit();
			},
		},
	]);

	tray.setContextMenu(contextMenu);
	tray.on("click", () => {
		if (mainWindow?.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow?.show();
		}
	});
}

function registerShortcuts() {
	globalShortcut.register("CommandOrControl+Shift+S", () => {
		if (mainWindow?.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow?.show();
		}
	});
}

// 增量同步：从最新数据到今天
async function performIncrementalSync() {
	if (isSyncing) {
		console.log("Sync already in progress, skipping");
		return { status: "skipped", message: "Sync already in progress" };
	}

	isSyncing = true;
	console.log("Starting incremental sync...");

	let totalSynced = 0;

	try {
		const lastDate = getLatestAnnDate();
		const now = new Date();
		const today = now.toISOString().slice(0, 10).replace(/-/g, "");

		// 如果已经是今天的数据，不需要同步
		if (lastDate === today) {
			console.log("Already synced to today.");
			return { status: "success", message: "Already up to date", totalSynced: 0 };
		}

		// 从最新日期的下一天开始同步
		const startDate = lastDate || today;
		console.log(`Incremental sync from ${startDate} to ${today}`);

		let offset = 0;
		const limit = 2000;
		let hasMore = true;

		while (hasMore) {
			const data = await TushareClient.getAnnouncements(undefined, undefined, startDate, today, limit, offset);

			if (data.length > 0) {
				insertAnnouncements(data);
				console.log(`Synced ${data.length} items.`);
				totalSynced += data.length;

				// 通知前端更新
				mainWindow?.webContents.send("data-updated", {
					type: "incremental",
					totalSynced,
					currentBatchSize: data.length,
				});

				if (data.length < limit) {
					hasMore = false;
				} else {
					offset += limit;
				}
			} else {
				hasMore = false;
			}

			// 安全限制
			if (offset > 100000) {
				console.warn("Sync limit reached (safety break).");
				break;
			}
		}

		console.log(`Incremental sync completed. Total: ${totalSynced}`);
		return { status: "success", message: "Sync completed", totalSynced };
	} catch (error: any) {
		console.error("Incremental sync failed:", error);
		return { status: "failed", message: error.message || "Unknown error" };
	} finally {
		isSyncing = false;
	}
}

// 历史数据回补：从最老数据往前一个月
async function loadHistoricalData() {
	if (isLoadingHistory) {
		console.log("History loading already in progress");
		return { status: "skipped", message: "Loading already in progress" };
	}

	isLoadingHistory = true;
	console.log("Loading historical data...");

	let totalLoaded = 0;

	try {
		const oldestDate = getOldestAnnDate();

		// 如果没有数据，从今天往前一个月开始
		let endDate: string;
		if (!oldestDate) {
			const now = new Date();
			endDate = now.toISOString().slice(0, 10).replace(/-/g, "");
		} else {
			endDate = oldestDate;
		}

		// 计算起始日期（往前一个月）
		const endDateObj = new Date(endDate.slice(0, 4) + "-" + endDate.slice(4, 6) + "-" + endDate.slice(6, 8));
		endDateObj.setMonth(endDateObj.getMonth() - 1);
		const startDate = endDateObj.toISOString().slice(0, 10).replace(/-/g, "");

		console.log(`Loading history from ${startDate} to ${endDate}`);

		// 检查这个范围是否已有数据
		if (hasDataInDateRange(startDate, endDate)) {
			console.log("Data already exists in this range");
			return { status: "success", message: "Data already exists", totalLoaded: 0 };
		}

		let offset = 0;
		const limit = 2000;
		let hasMore = true;

		while (hasMore) {
			const data = await TushareClient.getAnnouncements(undefined, undefined, startDate, endDate, limit, offset);

			if (data.length > 0) {
				insertAnnouncements(data);
				console.log(`Loaded ${data.length} historical items.`);
				totalLoaded += data.length;

				// 通知前端更新
				mainWindow?.webContents.send("data-updated", {
					type: "historical",
					totalLoaded,
					currentBatchSize: data.length,
					startDate,
					endDate,
				});

				if (data.length < limit) {
					hasMore = false;
				} else {
					offset += limit;
				}
			} else {
				hasMore = false;
			}

			// 安全限制
			if (offset > 50000) {
				console.warn("History load limit reached (safety break).");
				break;
			}
		}

		console.log(`Historical data loaded. Total: ${totalLoaded}`);
		return { status: "success", message: "History loaded", totalLoaded, startDate, endDate };
	} catch (error: any) {
		console.error("Historical data load failed:", error);
		return { status: "failed", message: error.message || "Unknown error" };
	} finally {
		isLoadingHistory = false;
	}
}

// 同步股票列表（首次启动或数据为空时）
async function syncStocksIfNeeded() {
	try {
		const stockCount = countStocks();

		if (stockCount > 0) {
			console.log(`Stock list already synced: ${stockCount} stocks`);
			return;
		}

		console.log("Stock list is empty, syncing...");

		// 获取所有上市股票
		const stocks = await TushareClient.getStockList(undefined, undefined, undefined, undefined, undefined, "L", 5000, 0);

		if (stocks && stocks.length > 0) {
			upsertStocks(stocks);
			console.log(`Synced ${stocks.length} stocks to database`);

			if (Notification.isSupported()) {
				new Notification({
					title: "股票列表同步完成",
					body: `已同步 ${stocks.length} 只股票`,
				}).show();
			}
		}
	} catch (error: any) {
		console.error("Failed to sync stocks:", error);
	}
}

function setupIPC() {
	ipcMain.handle("show-notification", async (_event, title: string, body: string) => {
		if (Notification.isSupported()) {
			new Notification({ title, body }).show();
		}
	});

	ipcMain.handle("get-app-version", async () => {
		return app.getVersion();
	});

	ipcMain.handle("get-announcements", async (_event, page: number, pageSize: number) => {
		const offset = (page - 1) * pageSize;
		const items = getAnnouncements(pageSize, offset);
		const total = countAnnouncements();
		console.log(`[IPC] get-announcements: page=${page}, offset=${offset}, items=${items.length}, total=${total}`);

		// 检查是否需要加载历史数据（接近数据末尾时）
		const totalPages = Math.ceil(total / pageSize);
		const shouldLoadHistory = page >= totalPages - 2 && total > 0; // 倒数第2页时触发

		return {
			items,
			total,
			shouldLoadHistory,
		};
	});

	// 触发增量同步
	ipcMain.handle("trigger-incremental-sync", async () => {
		return await performIncrementalSync();
	});

	// 触发历史数据加载
	ipcMain.handle("load-historical-data", async () => {
		return await loadHistoricalData();
	});

	// 获取按股票聚合的公告列表
	ipcMain.handle(
		"get-announcements-grouped",
		async (_event, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string) => {
			try {
				const offset = (page - 1) * pageSize;
				const items = getAnnouncementsGroupedByStock(pageSize, offset, startDate, endDate, market);
				const total = countStocksWithAnnouncements(startDate, endDate, market);

				console.log(
					`[IPC] get-announcements-grouped: page=${page}, offset=${offset}, items=${items.length}, total=${total}, dateRange=${startDate}-${endDate}, market=${market}`
				);

				return {
					items,
					total,
					page,
					pageSize,
				};
			} catch (error: any) {
				console.error("Failed to get grouped announcements:", error);
				throw error;
			}
		}
	);

	// 获取特定股票的公告列表
	ipcMain.handle("get-stock-announcements", async (_event, tsCode: string, limit: number = 100) => {
		try {
			console.log(`[IPC] get-stock-announcements: tsCode=${tsCode}, limit=${limit}`);
			return getAnnouncementsByStock(tsCode, limit);
		} catch (error: any) {
			console.error("Failed to get stock announcements:", error);
			throw error;
		}
	});

	// 搜索按股票聚合的公告数据
	ipcMain.handle(
		"search-announcements-grouped",
		async (_event, keyword: string, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string) => {
			try {
				const offset = (page - 1) * pageSize;
				const items = searchAnnouncementsGroupedByStock(keyword, pageSize, offset, startDate, endDate, market);
				const total = countSearchedStocksWithAnnouncements(keyword, startDate, endDate, market);

				console.log(
					`[IPC] search-announcements-grouped: keyword=${keyword}, page=${page}, items=${items.length}, total=${total}, dateRange=${startDate}-${endDate}, market=${market}`
				);

				return {
					items,
					total,
					page,
					pageSize,
				};
			} catch (error: any) {
				console.error("Failed to search grouped announcements:", error);
				throw error;
			}
		}
	);

	// 获取最近交易日
	ipcMain.handle("get-latest-trade-date", async () => {
		try {
			// 获取最近30天的交易日历
			const today = new Date();
			const endDate = today.toISOString().slice(0, 10).replace(/-/g, "");
			const startDateObj = new Date();
			startDateObj.setDate(startDateObj.getDate() - 30);
			const startDate = startDateObj.toISOString().slice(0, 10).replace(/-/g, "");

			console.log(`[IPC] get-latest-trade-date: fetching from ${startDate} to ${endDate}`);

			const calendar = await TushareClient.getTradeCalendar("SSE", startDate, endDate, "1");

			// 找到最近一个交易日
			if (calendar && calendar.length > 0) {
				// 按日期降序排序，取第一个
				const sortedDates = calendar
					.filter((item: any) => item.is_open === "1" || item.is_open === 1)
					.sort((a: any, b: any) => b.cal_date.localeCompare(a.cal_date));

				if (sortedDates.length > 0) {
					const latestTradeDate = sortedDates[0].cal_date;
					console.log(`[IPC] get-latest-trade-date: found ${latestTradeDate}`);
					return latestTradeDate;
				}
			}

			// 如果没有找到，返回今天
			console.log(`[IPC] get-latest-trade-date: no trade date found, returning today`);
			return endDate;
		} catch (error: any) {
			console.error("Failed to get latest trade date:", error);
			// 出错时返回今天
			return new Date().toISOString().slice(0, 10).replace(/-/g, "");
		}
	});

	// 获取公告 PDF 文件信息
	ipcMain.handle("get-announcement-pdf", async (_event, tsCode: string, annDate: string, title: string) => {
		try {
			console.log(`[IPC] get-announcement-pdf: tsCode=${tsCode}, annDate=${annDate}, title=${title}`);

			// 从 Tushare 获取公告原文信息（使用 anns_d 接口）
			const files = await TushareClient.getAnnouncementFiles(tsCode, annDate);

			console.log(`[IPC] Found ${files.length} announcements for ${tsCode} on ${annDate}`);

			// 查找匹配的公告
			// 尝试精确匹配标题
			let matchedFile = files.find((file: any) => file.title === title);

			// 如果精确匹配失败，尝试模糊匹配
			if (!matchedFile) {
				matchedFile = files.find((file: any) => {
					const fileTitle = file.title || "";
					const searchTitle = title || "";
					return fileTitle.includes(searchTitle) || searchTitle.includes(fileTitle);
				});
			}

			if (matchedFile && matchedFile.url) {
				console.log(`[IPC] Found PDF URL: ${matchedFile.url}`);
				return {
					success: true,
					url: matchedFile.url,
				};
			}

			console.log(`[IPC] No PDF found for announcement: ${title}`);
			return {
				success: false,
				message: "该公告暂无 PDF 文件",
			};
		} catch (error: any) {
			console.error("Failed to get announcement PDF:", error);
			return {
				success: false,
				message: error.message || "获取 PDF 失败",
			};
		}
	});

	// 在浏览器中打开 URL
	ipcMain.handle("open-external", async (_event, url: string) => {
		try {
			console.log(`[IPC] open-external: ${url}`);
			await shell.openExternal(url);
			return { success: true };
		} catch (error: any) {
			console.error("Failed to open external URL:", error);
			return {
				success: false,
				message: error.message || "打开链接失败",
			};
		}
	});

	// 自动更新相关 IPC
	ipcMain.handle("check-for-updates", async () => {
		if (isDev) {
			return { available: false, message: "开发环境不检查更新" };
		}
		try {
			const result = await autoUpdater.checkForUpdates();
			return { available: true, updateInfo: result?.updateInfo };
		} catch (error: any) {
			console.error("检查更新失败:", error);
			return { available: false, error: error.message };
		}
	});

	ipcMain.handle("download-update", async () => {
		try {
			await autoUpdater.downloadUpdate();
			return { success: true };
		} catch (error: any) {
			console.error("下载更新失败:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("install-update", async () => {
		autoUpdater.quitAndInstall();
	});

	// 关注股票相关 IPC
	ipcMain.handle("add-favorite-stock", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] add-favorite-stock: tsCode=${tsCode}`);
			const result = addFavoriteStock(tsCode);
			return { success: result };
		} catch (error: any) {
			console.error("Failed to add favorite stock:", error);
			return { success: false, message: error.message };
		}
	});

	ipcMain.handle("remove-favorite-stock", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] remove-favorite-stock: tsCode=${tsCode}`);
			const result = removeFavoriteStock(tsCode);
			return { success: result };
		} catch (error: any) {
			console.error("Failed to remove favorite stock:", error);
			return { success: false, message: error.message };
		}
	});

	ipcMain.handle("is-favorite-stock", async (_event, tsCode: string) => {
		try {
			return isFavoriteStock(tsCode);
		} catch (error: any) {
			console.error("Failed to check favorite stock:", error);
			return false;
		}
	});

	ipcMain.handle("get-all-favorite-stocks", async () => {
		try {
			return getAllFavoriteStocks();
		} catch (error: any) {
			console.error("Failed to get favorite stocks:", error);
			return [];
		}
	});

	ipcMain.handle("count-favorite-stocks", async () => {
		try {
			return countFavoriteStocks();
		} catch (error: any) {
			console.error("Failed to count favorite stocks:", error);
			return 0;
		}
	});

	ipcMain.handle(
		"get-favorite-stocks-announcements-grouped",
		async (_event, page: number, pageSize: number, startDate?: string, endDate?: string) => {
			try {
				const offset = (page - 1) * pageSize;
				const items = getFavoriteStocksAnnouncementsGrouped(pageSize, offset, startDate, endDate);
				const total = countFavoriteStocksWithAnnouncements(startDate, endDate);

				console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${page}, items=${items.length}, total=${total}`);

				return {
					items,
					total,
					page,
					pageSize,
				};
			} catch (error: any) {
				console.error("Failed to get favorite stocks announcements:", error);
				throw error;
			}
		}
	);

	// 获取财经资讯
	ipcMain.handle("get-news", async (_event, src?: string, startDate?: string, endDate?: string) => {
		try {
			console.log(`[IPC] get-news: src=${src}, startDate=${startDate}, endDate=${endDate}`);
			const news = await TushareClient.getNews(src, startDate, endDate);
			return news;
		} catch (error: any) {
			console.error("Failed to get news:", error);
			throw error;
		}
	});

	// 获取十大股东数据
	ipcMain.handle("get-top10-holders", async (_event, tsCode: string, period?: string, annDate?: string, startDate?: string, endDate?: string) => {
		try {
			console.log(
				`[IPC] get-top10-holders: tsCode=${tsCode}, period=${period}, annDate=${annDate}, startDate=${startDate}, endDate=${endDate}`
			);
			const holders = await TushareClient.getTop10Holders(tsCode, period, annDate, startDate, endDate);
			return holders;
		} catch (error: any) {
			console.error("Failed to get top10 holders:", error);
			throw error;
		}
	});

	// 搜索股票
	ipcMain.handle("search-stocks", async (_event, keyword: string, limit: number = 50) => {
		try {
			console.log(`[IPC] search-stocks: keyword=${keyword}, limit=${limit}`);
			return searchStocks(keyword, limit);
		} catch (error: any) {
			console.error("Failed to search stocks:", error);
			throw error;
		}
	});

	// 同步所有股票的十大股东数据
	ipcMain.handle("sync-all-top10-holders", async (_event) => {
		if (isSyncingHolders) {
			return { status: "skipped", message: "同步正在进行中" };
		}

		isSyncingHolders = true;
		isPausedHolders = false;
		console.log("[IPC] Starting sync all top10 holders...");

		try {
			// 获取所有股票
			const stocks = getAllStocks() as Array<{ ts_code: string; name: string; [key: string]: any }>;
			const totalStocks = stocks.length;

			if (totalStocks === 0) {
				return { status: "failed", message: "没有股票数据，请先同步股票列表" };
			}

			console.log(`[IPC] Total stocks to sync: ${totalStocks}`);

			let successCount = 0;
			let skipCount = 0;
			let failCount = 0;

			// 逐个股票同步
			for (let i = 0; i < stocks.length; i++) {
				// 检查是否被暂停
				while (isPausedHolders && isSyncingHolders) {
					await new Promise((resolve) => setTimeout(resolve, 500));
				}

				// 检查是否被停止
				if (!isSyncingHolders) {
					console.log("[IPC] Sync stopped by user");
					return {
						status: "stopped",
						message: `同步已停止。成功：${successCount}，跳过：${skipCount}，失败：${failCount}`,
						successCount,
						skipCount,
						failCount,
						totalStocks,
					};
				}

				const stock = stocks[i];

				// 检查是否已经有数据
				if (hasTop10HoldersData(stock.ts_code)) {
					skipCount++;
					console.log(`[${i + 1}/${totalStocks}] Skip ${stock.ts_code} ${stock.name} - already synced`);

					// 发送进度
					mainWindow?.webContents.send("top10-holders-sync-progress", {
						current: i + 1,
						total: totalStocks,
						tsCode: stock.ts_code,
						name: stock.name,
						status: "skipped",
						successCount,
						skipCount,
						failCount,
					});

					continue;
				}

				try {
					// 拉取该股票的十大股东数据
					const holders = await TushareClient.getTop10Holders(stock.ts_code);

					if (holders && holders.length > 0) {
						upsertTop10Holders(holders);
						successCount++;
						console.log(`[${i + 1}/${totalStocks}] Success ${stock.ts_code} ${stock.name} - ${holders.length} holders`);
					} else {
						skipCount++;
						console.log(`[${i + 1}/${totalStocks}] Skip ${stock.ts_code} ${stock.name} - no data`);
					}

					// 发送进度
					mainWindow?.webContents.send("top10-holders-sync-progress", {
						current: i + 1,
						total: totalStocks,
						tsCode: stock.ts_code,
						name: stock.name,
						status: "success",
						successCount,
						skipCount,
						failCount,
					});

					// 限速：每个请求间隔 200ms（Tushare API 限流）
					await new Promise((resolve) => setTimeout(resolve, 200));
				} catch (error: any) {
					failCount++;
					console.error(`[${i + 1}/${totalStocks}] Failed ${stock.ts_code} ${stock.name}:`, error.message);

					// 发送进度
					mainWindow?.webContents.send("top10-holders-sync-progress", {
						current: i + 1,
						total: totalStocks,
						tsCode: stock.ts_code,
						name: stock.name,
						status: "failed",
						error: error.message,
						successCount,
						skipCount,
						failCount,
					});

					// 如果是 API 限流错误，等待更长时间
					if (error.message?.includes("限流") || error.message?.includes("频繁")) {
						console.log("API 限流，等待 5 秒后继续...");
						await new Promise((resolve) => setTimeout(resolve, 5000));
					}
				}
			}

			console.log(`[IPC] Sync completed: success=${successCount}, skip=${skipCount}, fail=${failCount}`);

			return {
				status: "success",
				message: `同步完成：成功 ${successCount}，跳过 ${skipCount}，失败 ${failCount}`,
				successCount,
				skipCount,
				failCount,
				totalStocks,
			};
		} catch (error: any) {
			console.error("Failed to sync all top10 holders:", error);
			return { status: "failed", message: error.message || "同步失败" };
		} finally {
			isSyncingHolders = false;
			isPausedHolders = false;
		}
	});

	// 暂停/恢复同步
	ipcMain.handle("toggle-pause-top10-holders-sync", async () => {
		if (!isSyncingHolders) {
			return { status: "failed", message: "没有正在进行的同步任务" };
		}

		isPausedHolders = !isPausedHolders;
		const status = isPausedHolders ? "paused" : "resumed";
		const message = isPausedHolders ? "同步已暂停" : "同步已恢复";
		console.log(`[IPC] Sync ${status}`);

		return { status, message, isPaused: isPausedHolders };
	});

	// 停止同步
	ipcMain.handle("stop-top10-holders-sync", async () => {
		if (!isSyncingHolders) {
			return { status: "failed", message: "没有正在进行的同步任务" };
		}

		isSyncingHolders = false;
		isPausedHolders = false;
		console.log("[IPC] Sync stopped by user");

		return { status: "success", message: "同步已停止" };
	});

	// 同步单个股票的十大股东数据
	ipcMain.handle("sync-stock-top10-holders", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] sync-stock-top10-holders: tsCode=${tsCode}`);

			// 删除旧数据
			deleteTop10HoldersByStock(tsCode);

			// 拉取新数据
			const holders = await TushareClient.getTop10Holders(tsCode);

			if (holders && holders.length > 0) {
				upsertTop10Holders(holders);
				console.log(`[IPC] Synced ${holders.length} holders for ${tsCode}`);
				return {
					status: "success",
					message: `成功同步 ${holders.length} 条股东数据`,
					count: holders.length,
				};
			} else {
				return {
					status: "success",
					message: "该股票暂无十大股东数据",
					count: 0,
				};
			}
		} catch (error: any) {
			console.error("Failed to sync stock top10 holders:", error);
			return {
				status: "failed",
				message: error.message || "同步失败",
			};
		}
	});

	// 获取数据库中的十大股东数据
	ipcMain.handle("get-top10-holders-from-db", async (_event, tsCode: string, limit: number = 100) => {
		try {
			console.log(`[IPC] get-top10-holders-from-db: tsCode=${tsCode}, limit=${limit}`);
			return getTop10HoldersByStock(tsCode, limit);
		} catch (error: any) {
			console.error("Failed to get top10 holders from db:", error);
			throw error;
		}
	});

	// 检查股票是否已有十大股东数据
	ipcMain.handle("has-top10-holders-data", async (_event, tsCode: string) => {
		try {
			return hasTop10HoldersData(tsCode);
		} catch (error: any) {
			console.error("Failed to check top10 holders data:", error);
			return false;
		}
	});

	// 获取同步统计信息
	ipcMain.handle("get-top10-holders-sync-stats", async () => {
		try {
			const totalStocks = countStocks();
			const syncedStocks = countStocksWithTop10Holders();
			const syncedStockCodes = getStocksWithTop10Holders();

			return {
				totalStocks,
				syncedStocks,
				syncedStockCodes,
				syncRate: totalStocks > 0 ? ((syncedStocks / totalStocks) * 100).toFixed(2) : "0",
			};
		} catch (error: any) {
			console.error("Failed to get top10 holders sync stats:", error);
			throw error;
		}
	});

	// 获取股票的所有报告期
	ipcMain.handle("get-top10-holders-end-dates", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] get-top10-holders-end-dates: tsCode=${tsCode}`);
			return getTop10HoldersEndDates(tsCode);
		} catch (error: any) {
			console.error("Failed to get top10 holders end dates:", error);
			return [];
		}
	});

	// 根据报告期获取十大股东
	ipcMain.handle("get-top10-holders-by-end-date", async (_event, tsCode: string, endDate: string) => {
		try {
			console.log(`[IPC] get-top10-holders-by-end-date: tsCode=${tsCode}, endDate=${endDate}`);
			return getTop10HoldersByStockAndEndDate(tsCode, endDate);
		} catch (error: any) {
			console.error("Failed to get top10 holders by end date:", error);
			return [];
		}
	});
}

// 设置自动更新事件监听
function setupAutoUpdater() {
	// 检查更新时
	autoUpdater.on("checking-for-update", () => {
		console.log("正在检查更新...");
		mainWindow?.webContents.send("update-checking");
	});

	// 发现新版本
	autoUpdater.on("update-available", (info) => {
		console.log("发现新版本:", info.version);
		mainWindow?.webContents.send("update-available", info);

		if (Notification.isSupported()) {
			new Notification({
				title: "发现新版本",
				body: `版本 ${info.version} 可用，点击查看详情`,
			}).show();
		}
	});

	// 当前已是最新版本
	autoUpdater.on("update-not-available", (info) => {
		console.log("当前已是最新版本");
		mainWindow?.webContents.send("update-not-available", info);
	});

	// 下载进度
	autoUpdater.on("download-progress", (progressObj) => {
		console.log(`下载进度: ${progressObj.percent.toFixed(2)}%`);
		mainWindow?.webContents.send("update-download-progress", progressObj);
	});

	// 下载完成
	autoUpdater.on("update-downloaded", (info) => {
		console.log("更新下载完成:", info.version);
		mainWindow?.webContents.send("update-downloaded", info);

		if (Notification.isSupported()) {
			new Notification({
				title: "更新已下载",
				body: "新版本已准备就绪，重启应用即可安装",
			}).show();
		}
	});

	// 更新错误
	autoUpdater.on("error", (error) => {
		console.error("更新错误:", error);
		mainWindow?.webContents.send("update-error", error.message);
	});
}

// 单实例锁定 - 确保只运行一个应用实例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	// 如果获取锁失败，说明已经有一个实例在运行，直接退出
	console.log("应用已经在运行，退出当前实例");
	app.quit();
} else {
	// 当尝试启动第二个实例时，将焦点放回第一个实例的窗口
	app.on("second-instance", (event, commandLine, workingDirectory) => {
		console.log("检测到第二个实例尝试启动，聚焦到主窗口");
		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
			mainWindow.show();
		}
	});

	app.whenReady().then(() => {
		createWindow();
		createTray();
		registerShortcuts();
		setupIPC();
		setupAutoUpdater();

		// 启动时同步股票列表（如果为空）
		syncStocksIfNeeded().catch((err) => console.error("Stock sync failed:", err));

		// 启动时自动执行增量同步（异步，不阻塞）
		performIncrementalSync().catch((err) => console.error("Auto sync failed:", err));

		// 启动时检查更新（生产环境）
		if (!isDev) {
			setTimeout(() => {
				autoUpdater.checkForUpdates();
			}, 3000);
		}

		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				createWindow();
			} else {
				mainWindow?.show();
			}
		});
	});
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("before-quit", () => {
	extendedApp.isQuitting = true;
});

app.on("will-quit", () => {
	globalShortcut.unregisterAll();
});
