import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, Notification, nativeImage, NativeImage, session, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { URL } from "url";
import windowStateKeeper from "electron-window-state";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import {
	upsertStocks,
	getAllStocks,
	countStocks,
	searchStocks,
	addFavoriteStock,
	removeFavoriteStock,
	isFavoriteStock,
	getAllFavoriteStocks,
	countFavoriteStocks,
	upsertTop10Holders,
	getTop10HoldersByStock,
	hasTop10HoldersData,
	getStocksWithTop10Holders,
	countStocksWithTop10Holders,
	deleteTop10HoldersByStock,
	getTop10HoldersEndDates,
	getTop10HoldersByStockAndEndDate,
	getDbPath,
	getStockListSyncInfo,
	updateSyncFlag,
	isSyncedToday,
	getCacheDataStats,
	upsertAnnouncements,
	isAnnouncementRangeSynced,
	getUnsyncedAnnouncementRanges,
	recordAnnouncementSyncRange,
	getAnnouncementsByStock,
	getAnnouncementsByDateRange,
	searchAnnouncements,
	countAnnouncements,
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

// SQLite HTTP Server State
let sqliteHttpServer: ReturnType<typeof createServer> | null = null;
let sqliteHttpPort: number = 8080;
let sqliteHttpUsername: string = "";
let sqliteHttpPassword: string = "";

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

// 增量同步：已废弃，数据现在实时从 Tushare API 获取
async function performIncrementalSync() {
	console.log("Incremental sync is deprecated. Data is now fetched in real-time from Tushare API.");
	return { status: "success", message: "数据现在实时从服务端获取，无需同步", totalSynced: 0 };
}

// 历史数据回补：已废弃，数据现在实时从 Tushare API 获取
async function loadHistoricalData() {
	console.log("Historical data loading is deprecated. Data is now fetched in real-time from Tushare API.");
	return { status: "success", message: "数据现在实时从服务端获取，无需加载历史数据", totalLoaded: 0 };
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

// 从 Tushare API 获取公告数据并按股票聚合
async function getAnnouncementsGroupedFromAPI(
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string,
	market?: string
): Promise<{
	items: Array<{
		ts_code: string;
		stock_name: string;
		industry: string;
		market: string;
		announcement_count: number;
		latest_ann_date: string;
		latest_ann_title?: string;
	}>;
	total: number;
}> {
	// 获取所有股票列表
	const allStocks = getAllStocks();

	// 过滤市场
	let filteredStocks = allStocks;
	if (market && market !== "all") {
		filteredStocks = allStocks.filter((s: any) => s.market === market);
	}

	// 从 Tushare API 完整获取所有公告数据
	let announcements: any[] = [];

	if (startDate && endDate) {
		// 如果有日期范围，使用完整获取方式确保覆盖整个日期范围
		console.log(`[getAnnouncementsGroupedFromAPI] 使用完整获取方式获取公告: ${startDate} - ${endDate}`);
		announcements = await TushareClient.getAnnouncementsComplete(
			undefined, // 全市场
			startDate,
			endDate,
			(message, current, total) => {
				console.log(`[getAnnouncementsGroupedFromAPI] ${message}`);
			}
		);
	} else {
		// 没有日期范围，使用单次请求（限制2000条）
		announcements = await TushareClient.getAnnouncements(undefined, undefined, startDate, endDate, 2000, 0);
	}

	// 按股票聚合公告数据
	const stockMap = new Map<
		string,
		{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcements: any[];
		}
	>();

	// 初始化股票映射
	filteredStocks.forEach((stock: any) => {
		stockMap.set(stock.ts_code, {
			ts_code: stock.ts_code,
			stock_name: stock.name,
			industry: stock.industry || "",
			market: stock.market || "",
			announcements: [],
		});
	});

	// 将公告分配到对应的股票
	announcements.forEach((ann: any) => {
		const stock = stockMap.get(ann.ts_code);
		if (stock) {
			stock.announcements.push(ann);
		}
	});

	// 转换为数组并计算聚合信息
	const groupedData = Array.from(stockMap.values())
		.map((stock) => {
			if (stock.announcements.length === 0) {
				return null;
			}

			// 按日期和时间排序
			stock.announcements.sort((a, b) => {
				const dateCompare = (b.ann_date || "").localeCompare(a.ann_date || "");
				if (dateCompare !== 0) return dateCompare;
				return (b.pub_time || "").localeCompare(a.pub_time || "");
			});

			const latestAnn = stock.announcements[0];
			return {
				ts_code: stock.ts_code,
				stock_name: stock.stock_name,
				industry: stock.industry,
				market: stock.market,
				announcement_count: stock.announcements.length,
				latest_ann_date: latestAnn.ann_date,
				latest_ann_title: latestAnn.title,
			};
		})
		.filter((item) => item !== null)
		.sort((a, b) => {
			const dateCompare = (b?.latest_ann_date || "").localeCompare(a?.latest_ann_date || "");
			if (dateCompare !== 0) return dateCompare;
			return (a?.stock_name || "").localeCompare(b?.stock_name || "");
		}) as Array<{
		ts_code: string;
		stock_name: string;
		industry: string;
		market: string;
		announcement_count: number;
		latest_ann_date: string;
		latest_ann_title?: string;
	}>;

	const total = groupedData.length;
	const offset = (page - 1) * pageSize;
	const items = groupedData.slice(offset, offset + pageSize);

	return { items, total };
}

// 从 Tushare API 搜索公告数据并按股票聚合
async function searchAnnouncementsGroupedFromAPI(
	keyword: string,
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string,
	market?: string
): Promise<{
	items: Array<{
		ts_code: string;
		stock_name: string;
		industry: string;
		market: string;
		announcement_count: number;
		latest_ann_date: string;
		latest_ann_title?: string;
	}>;
	total: number;
}> {
	// 搜索匹配的股票
	const matchedStocks = searchStocks(keyword, 1000);

	// 过滤市场
	let filteredStocks = matchedStocks;
	if (market && market !== "all") {
		filteredStocks = matchedStocks.filter((s: any) => s.market === market);
	}

	if (filteredStocks.length === 0) {
		return { items: [], total: 0 };
	}

	// 获取匹配股票的代码列表
	const tsCodes = filteredStocks.map((s: any) => s.ts_code).join(",");

	// 从 Tushare API 获取公告数据
	const announcements = await TushareClient.getAnnouncements(tsCodes, undefined, startDate, endDate, 2000, 0);

	// 按股票聚合公告数据
	const stockMap = new Map<
		string,
		{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcements: any[];
		}
	>();

	// 初始化股票映射
	filteredStocks.forEach((stock: any) => {
		stockMap.set(stock.ts_code, {
			ts_code: stock.ts_code,
			stock_name: stock.name,
			industry: stock.industry || "",
			market: stock.market || "",
			announcements: [],
		});
	});

	// 将公告分配到对应的股票
	announcements.forEach((ann: any) => {
		const stock = stockMap.get(ann.ts_code);
		if (stock) {
			stock.announcements.push(ann);
		}
	});

	// 转换为数组并计算聚合信息
	const groupedData = Array.from(stockMap.values())
		.map((stock) => {
			if (stock.announcements.length === 0) {
				return null;
			}

			// 按日期和时间排序
			stock.announcements.sort((a, b) => {
				const dateCompare = (b.ann_date || "").localeCompare(a.ann_date || "");
				if (dateCompare !== 0) return dateCompare;
				return (b.pub_time || "").localeCompare(a.pub_time || "");
			});

			const latestAnn = stock.announcements[0];
			return {
				ts_code: stock.ts_code,
				stock_name: stock.stock_name,
				industry: stock.industry,
				market: stock.market,
				announcement_count: stock.announcements.length,
				latest_ann_date: latestAnn.ann_date,
				latest_ann_title: latestAnn.title,
			};
		})
		.filter((item) => item !== null)
		.sort((a, b) => {
			const dateCompare = (b?.latest_ann_date || "").localeCompare(a?.latest_ann_date || "");
			if (dateCompare !== 0) return dateCompare;
			return (a?.stock_name || "").localeCompare(b?.stock_name || "");
		}) as Array<{
		ts_code: string;
		stock_name: string;
		industry: string;
		market: string;
		announcement_count: number;
		latest_ann_date: string;
		latest_ann_title?: string;
	}>;

	const total = groupedData.length;
	const offset = (page - 1) * pageSize;
	const items = groupedData.slice(offset, offset + pageSize);

	return { items, total };
}

// 从 Tushare API 获取关注股票的公告数据并按股票聚合
async function getFavoriteStocksAnnouncementsGroupedFromAPI(
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string
): Promise<{
	items: Array<{
		ts_code: string;
		stock_name: string;
		industry: string;
		market: string;
		announcement_count: number;
		latest_ann_date: string;
		latest_ann_title?: string;
	}>;
	total: number;
}> {
	// 获取所有关注的股票代码
	const favoriteStocks = getAllFavoriteStocks();

	if (favoriteStocks.length === 0) {
		return { items: [], total: 0 };
	}

	// 获取关注的股票信息
	const allStocks = getAllStocks();
	const favoriteStockInfos = allStocks.filter((s: any) => favoriteStocks.includes(s.ts_code));

	// 获取关注股票的代码列表
	const tsCodes = favoriteStocks.join(",");

	// 从 Tushare API 获取公告数据
	const announcements = await TushareClient.getAnnouncements(tsCodes, undefined, startDate, endDate, 2000, 0);

	// 按股票聚合公告数据
	const stockMap = new Map<
		string,
		{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcements: any[];
		}
	>();

	// 初始化股票映射
	favoriteStockInfos.forEach((stock: any) => {
		stockMap.set(stock.ts_code, {
			ts_code: stock.ts_code,
			stock_name: stock.name,
			industry: stock.industry || "",
			market: stock.market || "",
			announcements: [],
		});
	});

	// 将公告分配到对应的股票
	announcements.forEach((ann: any) => {
		const stock = stockMap.get(ann.ts_code);
		if (stock) {
			stock.announcements.push(ann);
		}
	});

	// 转换为数组并计算聚合信息
	const groupedData = Array.from(stockMap.values())
		.map((stock) => {
			if (stock.announcements.length === 0) {
				return null;
			}

			// 按日期和时间排序
			stock.announcements.sort((a, b) => {
				const dateCompare = (b.ann_date || "").localeCompare(a.ann_date || "");
				if (dateCompare !== 0) return dateCompare;
				return (b.pub_time || "").localeCompare(a.pub_time || "");
			});

			const latestAnn = stock.announcements[0];
			return {
				ts_code: stock.ts_code,
				stock_name: stock.stock_name,
				industry: stock.industry,
				market: stock.market,
				announcement_count: stock.announcements.length,
				latest_ann_date: latestAnn.ann_date,
				latest_ann_title: latestAnn.title,
			};
		})
		.filter((item) => item !== null)
		.sort((a, b) => {
			const dateCompare = (b?.latest_ann_date || "").localeCompare(a?.latest_ann_date || "");
			if (dateCompare !== 0) return dateCompare;
			return (a?.stock_name || "").localeCompare(b?.stock_name || "");
		}) as Array<{
		ts_code: string;
		stock_name: string;
		industry: string;
		market: string;
		announcement_count: number;
		latest_ann_date: string;
		latest_ann_title?: string;
	}>;

	const total = groupedData.length;
	const offset = (page - 1) * pageSize;
	const items = groupedData.slice(offset, offset + pageSize);

	return { items, total };
}

// 重新同步全部股票列表数据
async function syncAllStocks() {
	try {
		console.log("Starting full stock list sync...");

		// 发送开始同步事件
		mainWindow?.webContents.send("stock-list-sync-progress", {
			status: "started",
			message: "开始同步股票列表...",
		});

		// 获取所有上市股票
		const stocks = await TushareClient.getStockList(undefined, undefined, undefined, undefined, undefined, "L", 5000, 0);

		if (stocks && stocks.length > 0) {
			// 发送同步中事件
			mainWindow?.webContents.send("stock-list-sync-progress", {
				status: "syncing",
				message: `正在同步 ${stocks.length} 只股票...`,
				total: stocks.length,
				current: 0,
			});

			upsertStocks(stocks);
			console.log(`Synced ${stocks.length} stocks to database`);

			// 更新同步标志位（使用今天的日期）
			const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			updateSyncFlag("stock_list", today);

			// 发送完成事件
			mainWindow?.webContents.send("stock-list-sync-progress", {
				status: "completed",
				message: `成功同步 ${stocks.length} 只股票`,
				total: stocks.length,
				current: stocks.length,
				stockCount: stocks.length,
			});

			if (Notification.isSupported()) {
				new Notification({
					title: "股票列表同步完成",
					body: `已同步 ${stocks.length} 只股票`,
				}).show();
			}

			return {
				success: true,
				stockCount: stocks.length,
				message: `成功同步 ${stocks.length} 只股票`,
			};
		} else {
			// 发送失败事件
			mainWindow?.webContents.send("stock-list-sync-progress", {
				status: "failed",
				message: "未获取到股票数据",
			});

			return {
				success: false,
				stockCount: 0,
				message: "未获取到股票数据",
			};
		}
	} catch (error: any) {
		console.error("Failed to sync stocks:", error);

		// 发送错误事件
		mainWindow?.webContents.send("stock-list-sync-progress", {
			status: "failed",
			message: error.message || "同步失败",
			error: error.message,
		});

		return {
			success: false,
			stockCount: 0,
			message: error.message || "同步失败",
		};
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

	// 获取按股票聚合的公告列表（从 Tushare API 实时获取）
	ipcMain.handle(
		"get-announcements-grouped",
		async (_event, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string) => {
			try {
				console.log(
					`[IPC] get-announcements-grouped: page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}, market=${market}`
				);

				const result = await getAnnouncementsGroupedFromAPI(page, pageSize, startDate, endDate, market);

				console.log(`[IPC] get-announcements-grouped: page=${page}, items=${result.items.length}, total=${result.total}`);

				return {
					items: result.items,
					total: result.total,
					page,
					pageSize,
				};
			} catch (error: any) {
				console.error("Failed to get grouped announcements:", error);
				throw error;
			}
		}
	);

	// 获取特定股票的公告列表（从 Tushare API 实时获取）
	ipcMain.handle("get-stock-announcements", async (_event, tsCode: string, limit: number = 100, startDate?: string, endDate?: string) => {
		try {
			console.log(`[IPC] get-stock-announcements: tsCode=${tsCode}, limit=${limit}, dateRange=${startDate}-${endDate}`);

			const announcements = await TushareClient.getAnnouncements(tsCode, undefined, startDate, endDate, limit, 0);

			// 按日期和时间排序
			announcements.sort((a: any, b: any) => {
				const dateCompare = (b.ann_date || "").localeCompare(a.ann_date || "");
				if (dateCompare !== 0) return dateCompare;
				return (b.pub_time || "").localeCompare(a.pub_time || "");
			});

			// 转换为前端期望的格式（移除 id 字段）
			return announcements.map((ann: any) => ({
				ts_code: ann.ts_code,
				ann_date: ann.ann_date,
				ann_type: ann.ann_type,
				title: ann.title,
				content: ann.content,
				pub_time: ann.pub_time,
			}));
		} catch (error: any) {
			console.error("Failed to get stock announcements:", error);
			throw error;
		}
	});

	// 搜索按股票聚合的公告数据（从 Tushare API 实时获取）
	ipcMain.handle(
		"search-announcements-grouped",
		async (_event, keyword: string, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string) => {
			try {
				console.log(
					`[IPC] search-announcements-grouped: keyword=${keyword}, page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}, market=${market}`
				);

				const result = await searchAnnouncementsGroupedFromAPI(keyword, page, pageSize, startDate, endDate, market);

				console.log(
					`[IPC] search-announcements-grouped: keyword=${keyword}, page=${page}, items=${result.items.length}, total=${result.total}`
				);

				return {
					items: result.items,
					total: result.total,
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

	// 获取数据库路径和连接信息
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
			const dbModule = await import("./db.js");
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
			console.error("Failed to set auth:", error);
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
			console.error("Failed to clear auth:", error);
			return {
				success: false,
				message: error.message || "清除认证信息失败",
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
				console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}`);

				const result = await getFavoriteStocksAnnouncementsGroupedFromAPI(page, pageSize, startDate, endDate);

				console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${page}, items=${result.items.length}, total=${result.total}`);

				return {
					items: result.items,
					total: result.total,
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

	// 获取股票列表同步信息
	ipcMain.handle("get-stock-list-sync-info", async () => {
		try {
			console.log("[IPC] get-stock-list-sync-info");
			return getStockListSyncInfo();
		} catch (error: any) {
			console.error("Failed to get stock list sync info:", error);
			throw error;
		}
	});

	// 重新同步全部股票列表数据
	ipcMain.handle("sync-all-stocks", async () => {
		try {
			console.log("[IPC] sync-all-stocks");
			return await syncAllStocks();
		} catch (error: any) {
			console.error("Failed to sync all stocks:", error);
			return {
				success: false,
				stockCount: 0,
				message: error.message || "同步失败",
			};
		}
	});

	// 检查股票列表今日是否已同步
	ipcMain.handle("check-stock-list-sync-status", async () => {
		try {
			console.log("[IPC] check-stock-list-sync-status");
			const synced = isSyncedToday("stock_list");
			const syncInfo = getStockListSyncInfo();
			return {
				isSyncedToday: synced,
				stockCount: syncInfo.stockCount,
				lastSyncTime: syncInfo.lastSyncTime,
			};
		} catch (error: any) {
			console.error("Failed to check stock list sync status:", error);
			return {
				isSyncedToday: false,
				stockCount: 0,
				lastSyncTime: null,
			};
		}
	});

	// 获取缓存数据统计信息
	ipcMain.handle("get-cache-data-stats", async () => {
		try {
			console.log("[IPC] get-cache-data-stats");
			return getCacheDataStats();
		} catch (error: any) {
			console.error("Failed to get cache data stats:", error);
			return {
				stocks: { count: 0, lastSyncTime: null },
				favoriteStocks: { count: 0 },
				top10Holders: { stockCount: 0, recordCount: 0 },
				syncFlags: [],
			};
		}
	});

	// ============= 公告缓存相关 IPC =============

	/**
	 * 获取公告（智能缓存）
	 * 如果本地已缓存，则从本地读取；否则从 Tushare API 获取并缓存
	 */
	ipcMain.handle(
		"get-announcements-with-cache",
		async (_event, tsCode: string | null, startDate: string, endDate: string, onProgressCallback?: boolean) => {
			try {
				console.log(`[IPC] get-announcements-with-cache: tsCode=${tsCode || "all"}, startDate=${startDate}, endDate=${endDate}`);

				// 检查时间范围是否已完全同步
				if (isAnnouncementRangeSynced(tsCode, startDate, endDate)) {
					console.log(`[IPC] 时间范围 ${startDate}-${endDate} 已缓存，从本地读取`);
					// 从本地数据库读取
					const announcements = getAnnouncementsByDateRange(startDate, endDate, tsCode || undefined);
					return {
						success: true,
						data: announcements,
						source: "cache",
						count: announcements.length,
					};
				}

				// 获取需要同步的时间段
				const unsyncedRanges = getUnsyncedAnnouncementRanges(tsCode, startDate, endDate);
				console.log(
					`[IPC] 需要同步 ${unsyncedRanges.length} 个时间段:`,
					unsyncedRanges.map((r) => `${r.start_date}-${r.end_date}`)
				);

				// 对每个未同步的时间段，迭代获取数据
				for (const range of unsyncedRanges) {
					console.log(`[IPC] 开始同步时间段: ${range.start_date} - ${range.end_date}`);

					// 使用迭代方法获取该时间段的所有公告
					const announcements = await TushareClient.getAnnouncementsIterative(
						tsCode || undefined,
						range.start_date,
						range.end_date,
						onProgressCallback
							? (currentCount: number, totalFetched: number) => {
									// 发送进度给渲染进程
									mainWindow?.webContents.send("announcement-sync-progress", {
										tsCode: tsCode || "all",
										startDate: range.start_date,
										endDate: range.end_date,
										currentBatch: currentCount,
										totalFetched: totalFetched,
									});
							  }
							: undefined
					);

					if (announcements.length > 0) {
						// 保存到本地数据库
						upsertAnnouncements(announcements);
						console.log(`[IPC] 已缓存 ${announcements.length} 条公告到本地数据库`);
					}

					// 记录该时间段已同步
					recordAnnouncementSyncRange(tsCode, range.start_date, range.end_date);
				}

				// 从本地数据库读取完整数据
				const announcements = getAnnouncementsByDateRange(startDate, endDate, tsCode || undefined);
				console.log(`[IPC] 返回 ${announcements.length} 条公告（来源：API + 缓存）`);

				return {
					success: true,
					data: announcements,
					source: "api",
					count: announcements.length,
				};
			} catch (error: any) {
				console.error("Failed to get announcements with cache:", error);
				return {
					success: false,
					error: error.message || "获取公告失败",
					data: [],
					source: "error",
					count: 0,
				};
			}
		}
	);

	/**
	 * 获取公告（仅从缓存）
	 */
	ipcMain.handle("get-announcements-from-cache", async (_event, tsCode: string | null, startDate: string, endDate: string) => {
		try {
			console.log(`[IPC] get-announcements-from-cache: tsCode=${tsCode || "all"}, startDate=${startDate}, endDate=${endDate}`);

			const announcements = getAnnouncementsByDateRange(startDate, endDate, tsCode || undefined);
			const isCached = isAnnouncementRangeSynced(tsCode, startDate, endDate);

			return {
				success: true,
				data: announcements,
				isCached,
				count: announcements.length,
			};
		} catch (error: any) {
			console.error("Failed to get announcements from cache:", error);
			return {
				success: false,
				error: error.message || "读取缓存失败",
				data: [],
				isCached: false,
				count: 0,
			};
		}
	});

	/**
	 * 检查公告时间范围是否已缓存
	 */
	ipcMain.handle("check-announcement-range-synced", async (_event, tsCode: string | null, startDate: string, endDate: string) => {
		try {
			console.log(`[IPC] check-announcement-range-synced: tsCode=${tsCode || "all"}, startDate=${startDate}, endDate=${endDate}`);

			const isSynced = isAnnouncementRangeSynced(tsCode, startDate, endDate);
			const unsyncedRanges = isSynced ? [] : getUnsyncedAnnouncementRanges(tsCode, startDate, endDate);

			return {
				success: true,
				isSynced,
				unsyncedRanges,
			};
		} catch (error: any) {
			console.error("Failed to check announcement range:", error);
			return {
				success: false,
				error: error.message || "检查失败",
				isSynced: false,
				unsyncedRanges: [],
			};
		}
	});

	/**
	 * 搜索公告（从缓存）
	 */
	ipcMain.handle("search-announcements-from-cache", async (_event, keyword: string, limit: number = 100) => {
		try {
			console.log(`[IPC] search-announcements-from-cache: keyword=${keyword}, limit=${limit}`);

			const announcements = searchAnnouncements(keyword, limit);

			return {
				success: true,
				data: announcements,
				count: announcements.length,
			};
		} catch (error: any) {
			console.error("Failed to search announcements:", error);
			return {
				success: false,
				error: error.message || "搜索失败",
				data: [],
				count: 0,
			};
		}
	});

	/**
	 * 获取缓存的公告统计信息
	 */
	ipcMain.handle("get-announcements-cache-stats", async () => {
		try {
			console.log("[IPC] get-announcements-cache-stats");

			const totalCount = countAnnouncements();

			return {
				success: true,
				totalCount,
			};
		} catch (error: any) {
			console.error("Failed to get announcements cache stats:", error);
			return {
				success: false,
				error: error.message || "获取统计失败",
				totalCount: 0,
			};
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

		// 每日自动同步检查：如果今日未同步，自动执行同步
		const checkDailySync = async () => {
			try {
				if (!isSyncedToday("stock_list")) {
					console.log("Today's stock list not synced yet, starting automatic sync...");
					// 延迟3秒后执行，避免阻塞应用启动
					setTimeout(async () => {
						await syncAllStocks();
					}, 3000);
				} else {
					console.log("Stock list already synced today");
				}
			} catch (error) {
				console.error("Daily sync check failed:", error);
			}
		};
		checkDailySync();

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
	// 关闭 SQLite HTTP 服务器
	if (sqliteHttpServer) {
		sqliteHttpServer.close();
		sqliteHttpServer = null;
		console.log("[SQLite HTTP Server] Closed on app quit");
	}
	extendedApp.isQuitting = true;
});

app.on("will-quit", () => {
	globalShortcut.unregisterAll();
});
