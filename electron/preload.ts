// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron");

console.log("[Preload] Script loading...");

// 暴露安全的 Electron API 到渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
	// 显示系统通知
	showNotification: (title: string, body: string) => {
		return ipcRenderer.invoke("show-notification", title, body);
	},

	// 获取应用版本
	getAppVersion: () => {
		return ipcRenderer.invoke("get-app-version");
	},

	// 获取公告列表
	getAnnouncements: (page: number, pageSize: number) => {
		return ipcRenderer.invoke("get-announcements", page, pageSize);
	},

	// 触发增量同步
	triggerIncrementalSync: () => {
		return ipcRenderer.invoke("trigger-incremental-sync");
	},

	// 加载历史数据
	loadHistoricalData: () => {
		return ipcRenderer.invoke("load-historical-data");
	},

	// 监听数据更新
	onDataUpdated: (callback: (data: any) => void) => {
		const subscription = (_event: any, data: any) => callback(data);
		ipcRenderer.on("data-updated", subscription);
		return () => ipcRenderer.removeListener("data-updated", subscription);
	},

	// 聚合公告相关
	getAnnouncementsGrouped: (page: number, pageSize: number, startDate?: string, endDate?: string, market?: string) => {
		return ipcRenderer.invoke("get-announcements-grouped", page, pageSize, startDate, endDate, market);
	},

	getStockAnnouncements: (tsCode: string, limit?: number) => {
		return ipcRenderer.invoke("get-stock-announcements", tsCode, limit);
	},

	searchAnnouncementsGrouped: (keyword: string, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string) => {
		return ipcRenderer.invoke("search-announcements-grouped", keyword, page, pageSize, startDate, endDate, market);
	},

	// 获取最近交易日
	getLatestTradeDate: () => {
		return ipcRenderer.invoke("get-latest-trade-date");
	},

	// 获取公告 PDF 文件信息
	getAnnouncementPdf: (tsCode: string, annDate: string, title: string) => {
		return ipcRenderer.invoke("get-announcement-pdf", tsCode, annDate, title);
	},

	// 在浏览器中打开 URL
	openExternal: (url: string) => {
		return ipcRenderer.invoke("open-external", url);
	},

	// 关注股票相关
	addFavoriteStock: (tsCode: string) => {
		return ipcRenderer.invoke("add-favorite-stock", tsCode);
	},

	removeFavoriteStock: (tsCode: string) => {
		return ipcRenderer.invoke("remove-favorite-stock", tsCode);
	},

	isFavoriteStock: (tsCode: string) => {
		return ipcRenderer.invoke("is-favorite-stock", tsCode);
	},

	getAllFavoriteStocks: () => {
		return ipcRenderer.invoke("get-all-favorite-stocks");
	},

	countFavoriteStocks: () => {
		return ipcRenderer.invoke("count-favorite-stocks");
	},

	getFavoriteStocksAnnouncementsGrouped: (page: number, pageSize: number, startDate?: string, endDate?: string) => {
		return ipcRenderer.invoke("get-favorite-stocks-announcements-grouped", page, pageSize, startDate, endDate);
	},

	// 资讯相关
	getNews: (src?: string, startDate?: string, endDate?: string) => {
		return ipcRenderer.invoke("get-news", src, startDate, endDate);
	},

	// 十大股东相关
	getTop10Holders: (tsCode: string, period?: string, annDate?: string, startDate?: string, endDate?: string) => {
		return ipcRenderer.invoke("get-top10-holders", tsCode, period, annDate, startDate, endDate);
	},

	// 搜索股票
	searchStocks: (keyword: string, limit?: number) => {
		return ipcRenderer.invoke("search-stocks", keyword, limit);
	},

	// 同步所有股票的十大股东
	syncAllTop10Holders: () => {
		return ipcRenderer.invoke("sync-all-top10-holders");
	},

	// 同步单个股票的十大股东
	syncStockTop10Holders: (tsCode: string) => {
		return ipcRenderer.invoke("sync-stock-top10-holders", tsCode);
	},

	// 从数据库获取十大股东数据
	getTop10HoldersFromDb: (tsCode: string, limit?: number) => {
		return ipcRenderer.invoke("get-top10-holders-from-db", tsCode, limit);
	},

	// 检查是否已有十大股东数据
	hasTop10HoldersData: (tsCode: string) => {
		return ipcRenderer.invoke("has-top10-holders-data", tsCode);
	},

	// 获取同步统计信息
	getTop10HoldersSyncStats: () => {
		return ipcRenderer.invoke("get-top10-holders-sync-stats");
	},

	// 监听十大股东同步进度
	onTop10HoldersSyncProgress: (callback: (progress: any) => void) => {
		const subscription = (_event: any, progress: any) => callback(progress);
		ipcRenderer.on("top10-holders-sync-progress", subscription);
		return () => ipcRenderer.removeListener("top10-holders-sync-progress", subscription);
	},

	// 自动更新相关
	checkForUpdates: () => {
		return ipcRenderer.invoke("check-for-updates");
	},

	downloadUpdate: () => {
		return ipcRenderer.invoke("download-update");
	},

	installUpdate: () => {
		return ipcRenderer.invoke("install-update");
	},

	// 监听更新事件
	onUpdateChecking: (callback: () => void) => {
		const subscription = () => callback();
		ipcRenderer.on("update-checking", subscription);
		return () => ipcRenderer.removeListener("update-checking", subscription);
	},

	onUpdateAvailable: (callback: (info: any) => void) => {
		const subscription = (_event: any, info: any) => callback(info);
		ipcRenderer.on("update-available", subscription);
		return () => ipcRenderer.removeListener("update-available", subscription);
	},

	onUpdateNotAvailable: (callback: (info: any) => void) => {
		const subscription = (_event: any, info: any) => callback(info);
		ipcRenderer.on("update-not-available", subscription);
		return () => ipcRenderer.removeListener("update-not-available", subscription);
	},

	onUpdateDownloadProgress: (callback: (progress: any) => void) => {
		const subscription = (_event: any, progress: any) => callback(progress);
		ipcRenderer.on("update-download-progress", subscription);
		return () => ipcRenderer.removeListener("update-download-progress", subscription);
	},

	onUpdateDownloaded: (callback: (info: any) => void) => {
		const subscription = (_event: any, info: any) => callback(info);
		ipcRenderer.on("update-downloaded", subscription);
		return () => ipcRenderer.removeListener("update-downloaded", subscription);
	},

	onUpdateError: (callback: (error: string) => void) => {
		const subscription = (_event: any, error: string) => callback(error);
		ipcRenderer.on("update-error", subscription);
		return () => ipcRenderer.removeListener("update-error", subscription);
	},
});
