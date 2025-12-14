import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, Notification, nativeImage, session, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import { getAnnouncements, getLatestAnnDate, getOldestAnnDate, hasDataInDateRange, insertAnnouncements, countAnnouncements, upsertStocks, getAllStocks, countStocks, searchStocks, getLastSyncDate, updateSyncFlag, isSyncedToday, getAnnouncementsGroupedByStock, getAnnouncementsByStock, countStocksWithAnnouncements, searchAnnouncementsGroupedByStock, countSearchedStocksWithAnnouncements, } from "./db.js";
import { TushareClient } from "./tushare.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 开发环境判断
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
let mainWindow = null;
let tray = null;
const extendedApp = app;
// Sync State
let isSyncing = false;
let isLoadingHistory = false;
let isSyncingStocks = false;
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
        const levelMap = {
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
    }
    else {
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
    let trayIcon;
    try {
        trayIcon = nativeImage.createFromPath(iconPath);
        if (trayIcon.isEmpty()) {
            trayIcon = nativeImage.createEmpty();
        }
    }
    catch (error) {
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
        }
        else {
            mainWindow?.show();
        }
    });
}
function registerShortcuts() {
    globalShortcut.register("CommandOrControl+Shift+S", () => {
        if (mainWindow?.isVisible()) {
            mainWindow.hide();
        }
        else {
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
                }
                else {
                    offset += limit;
                }
            }
            else {
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
    }
    catch (error) {
        console.error("Incremental sync failed:", error);
        return { status: "failed", message: error.message || "Unknown error" };
    }
    finally {
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
        let endDate;
        if (!oldestDate) {
            const now = new Date();
            endDate = now.toISOString().slice(0, 10).replace(/-/g, "");
        }
        else {
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
                }
                else {
                    offset += limit;
                }
            }
            else {
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
    }
    catch (error) {
        console.error("Historical data load failed:", error);
        return { status: "failed", message: error.message || "Unknown error" };
    }
    finally {
        isLoadingHistory = false;
    }
}
// 同步A股股票列表（每天仅一次）
async function syncStockList() {
    const SYNC_TYPE = "stock_list";
    // 检查今天是否已同步
    if (isSyncedToday(SYNC_TYPE)) {
        console.log("Stock list already synced today.");
        return { status: "skipped", message: "Already synced today", totalStocks: countStocks() };
    }
    if (isSyncingStocks) {
        console.log("Stock sync already in progress");
        return { status: "skipped", message: "Sync already in progress" };
    }
    isSyncingStocks = true;
    console.log("Starting stock list sync...");
    let totalSynced = 0;
    try {
        // 获取上市股票（L）
        console.log("Fetching listed stocks...");
        const listedStocks = await TushareClient.getStockList(undefined, undefined, undefined, undefined, undefined, "L", 5000, 0);
        if (listedStocks.length > 0) {
            upsertStocks(listedStocks);
            totalSynced += listedStocks.length;
            console.log(`Synced ${listedStocks.length} listed stocks.`);
        }
        // 获取退市股票（D）
        console.log("Fetching delisted stocks...");
        const delistedStocks = await TushareClient.getStockList(undefined, undefined, undefined, undefined, undefined, "D", 5000, 0);
        if (delistedStocks.length > 0) {
            upsertStocks(delistedStocks);
            totalSynced += delistedStocks.length;
            console.log(`Synced ${delistedStocks.length} delisted stocks.`);
        }
        // 获取暂停上市股票（P）
        console.log("Fetching paused stocks...");
        const pausedStocks = await TushareClient.getStockList(undefined, undefined, undefined, undefined, undefined, "P", 5000, 0);
        if (pausedStocks.length > 0) {
            upsertStocks(pausedStocks);
            totalSynced += pausedStocks.length;
            console.log(`Synced ${pausedStocks.length} paused stocks.`);
        }
        // 更新同步标志位
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        updateSyncFlag(SYNC_TYPE, today);
        console.log(`Stock list sync completed. Total synced: ${totalSynced}, Total in DB: ${countStocks()}`);
        // 通知前端
        mainWindow?.webContents.send("stocks-updated", {
            totalSynced,
            totalInDB: countStocks(),
        });
        return {
            status: "success",
            message: "Stock list synced successfully",
            totalSynced,
            totalInDB: countStocks(),
        };
    }
    catch (error) {
        console.error("Stock list sync failed:", error);
        return { status: "failed", message: error.message || "Unknown error" };
    }
    finally {
        isSyncingStocks = false;
    }
}
function setupIPC() {
    ipcMain.handle("show-notification", async (_event, title, body) => {
        if (Notification.isSupported()) {
            new Notification({ title, body }).show();
        }
    });
    ipcMain.handle("get-app-version", async () => {
        return app.getVersion();
    });
    ipcMain.handle("get-announcements", async (_event, page, pageSize) => {
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
    // 股票相关 IPC
    ipcMain.handle("sync-stock-list", async () => {
        return await syncStockList();
    });
    ipcMain.handle("get-all-stocks", async () => {
        return getAllStocks();
    });
    ipcMain.handle("count-stocks", async () => {
        return countStocks();
    });
    ipcMain.handle("search-stocks", async (_event, keyword, limit) => {
        return searchStocks(keyword, limit);
    });
    ipcMain.handle("get-stock-sync-status", async () => {
        const lastSync = getLastSyncDate("stock_list");
        const syncedToday = isSyncedToday("stock_list");
        const totalStocks = countStocks();
        return {
            lastSync,
            syncedToday,
            totalStocks,
        };
    });
    // 获取按股票聚合的公告列表
    ipcMain.handle("get-announcements-grouped", async (_event, page, pageSize, startDate, endDate) => {
        try {
            const offset = (page - 1) * pageSize;
            const items = getAnnouncementsGroupedByStock(pageSize, offset, startDate, endDate);
            const total = countStocksWithAnnouncements(startDate, endDate);
            console.log(`[IPC] get-announcements-grouped: page=${page}, offset=${offset}, items=${items.length}, total=${total}, dateRange=${startDate}-${endDate}`);
            return {
                items,
                total,
                page,
                pageSize,
            };
        }
        catch (error) {
            console.error("Failed to get grouped announcements:", error);
            throw error;
        }
    });
    // 获取特定股票的公告列表
    ipcMain.handle("get-stock-announcements", async (_event, tsCode, limit = 100) => {
        try {
            console.log(`[IPC] get-stock-announcements: tsCode=${tsCode}, limit=${limit}`);
            return getAnnouncementsByStock(tsCode, limit);
        }
        catch (error) {
            console.error("Failed to get stock announcements:", error);
            throw error;
        }
    });
    // 搜索按股票聚合的公告数据
    ipcMain.handle("search-announcements-grouped", async (_event, keyword, page, pageSize, startDate, endDate) => {
        try {
            const offset = (page - 1) * pageSize;
            const items = searchAnnouncementsGroupedByStock(keyword, pageSize, offset, startDate, endDate);
            const total = countSearchedStocksWithAnnouncements(keyword, startDate, endDate);
            console.log(`[IPC] search-announcements-grouped: keyword=${keyword}, page=${page}, items=${items.length}, total=${total}, dateRange=${startDate}-${endDate}`);
            return {
                items,
                total,
                page,
                pageSize,
            };
        }
        catch (error) {
            console.error("Failed to search grouped announcements:", error);
            throw error;
        }
    });
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
                    .filter((item) => item.is_open === "1" || item.is_open === 1)
                    .sort((a, b) => b.cal_date.localeCompare(a.cal_date));
                if (sortedDates.length > 0) {
                    const latestTradeDate = sortedDates[0].cal_date;
                    console.log(`[IPC] get-latest-trade-date: found ${latestTradeDate}`);
                    return latestTradeDate;
                }
            }
            // 如果没有找到，返回今天
            console.log(`[IPC] get-latest-trade-date: no trade date found, returning today`);
            return endDate;
        }
        catch (error) {
            console.error("Failed to get latest trade date:", error);
            // 出错时返回今天
            return new Date().toISOString().slice(0, 10).replace(/-/g, "");
        }
    });
    // 获取公告 PDF 文件信息
    ipcMain.handle("get-announcement-pdf", async (_event, tsCode, annDate, title) => {
        try {
            console.log(`[IPC] get-announcement-pdf: tsCode=${tsCode}, annDate=${annDate}, title=${title}`);
            // 从 Tushare 获取公告原文信息（使用 anns_d 接口）
            const files = await TushareClient.getAnnouncementFiles(tsCode, annDate);
            console.log(`[IPC] Found ${files.length} announcements for ${tsCode} on ${annDate}`);
            // 查找匹配的公告
            // 尝试精确匹配标题
            let matchedFile = files.find((file) => file.title === title);
            // 如果精确匹配失败，尝试模糊匹配
            if (!matchedFile) {
                matchedFile = files.find((file) => {
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
        }
        catch (error) {
            console.error("Failed to get announcement PDF:", error);
            return {
                success: false,
                message: error.message || "获取 PDF 失败",
            };
        }
    });
    // 在浏览器中打开 URL
    ipcMain.handle("open-external", async (_event, url) => {
        try {
            console.log(`[IPC] open-external: ${url}`);
            await shell.openExternal(url);
            return { success: true };
        }
        catch (error) {
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
        }
        catch (error) {
            console.error("检查更新失败:", error);
            return { available: false, error: error.message };
        }
    });
    ipcMain.handle("download-update", async () => {
        try {
            await autoUpdater.downloadUpdate();
            return { success: true };
        }
        catch (error) {
            console.error("下载更新失败:", error);
            return { success: false, error: error.message };
        }
    });
    ipcMain.handle("install-update", async () => {
        autoUpdater.quitAndInstall();
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
}
else {
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
        // 启动时自动执行增量同步（异步，不阻塞）
        performIncrementalSync().catch((err) => console.error("Auto sync failed:", err));
        // 启动时自动同步股票列表（如果今天还没同步）
        syncStockList().catch((err) => console.error("Stock sync failed:", err));
        // 启动时检查更新（生产环境）
        if (!isDev) {
            setTimeout(() => {
                autoUpdater.checkForUpdates();
            }, 3000);
        }
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
            else {
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
