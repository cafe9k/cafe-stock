// Electron API 类型定义
export interface ElectronAPI {
	showNotification: (title: string, body: string) => Promise<void>;
	getAppVersion: () => Promise<string>;
	getAnnouncements: (page: number, pageSize: number) => Promise<{ items: any[]; total: number; shouldLoadHistory: boolean }>;
	triggerIncrementalSync: () => Promise<{
		status: "success" | "failed" | "skipped";
		message: string;
		totalSynced?: number;
	}>;
	loadHistoricalData: () => Promise<{
		status: "success" | "failed" | "skipped";
		message: string;
		totalLoaded?: number;
		startDate?: string;
		endDate?: string;
	}>;
	onDataUpdated: (
		callback: (data: { type: "incremental" | "historical"; totalSynced?: number; totalLoaded?: number; currentBatchSize: number }) => void
	) => () => void;

	// 股票相关
	syncStockList: () => Promise<{
		status: "success" | "failed" | "skipped";
		message: string;
		totalSynced?: number;
		totalInDB?: number;
	}>;
	getAllStocks: () => Promise<any[]>;
	countStocks: () => Promise<number>;
	searchStocks: (keyword: string, limit?: number) => Promise<any[]>;
	getStockSyncStatus: () => Promise<{
		lastSync: string | null;
		syncedToday: boolean;
		totalStocks: number;
	}>;
	onStocksUpdated: (callback: (data: { totalSynced: number; totalInDB: number }) => void) => () => void;

	// 聚合公告相关
	getAnnouncementsGrouped: (
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string
	) => Promise<{
		items: Array<{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcement_count: number;
			latest_ann_date: string;
		}>;
		total: number;
		page: number;
		pageSize: number;
	}>;
	getStockAnnouncements: (
		tsCode: string,
		limit?: number
	) => Promise<
		Array<{
			id: number;
			ts_code: string;
			ann_date: string;
			ann_type: string;
			title: string;
			content: string;
			pub_time: string;
		}>
	>;
	searchAnnouncementsGrouped: (
		keyword: string,
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string
	) => Promise<{
		items: Array<{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcement_count: number;
			latest_ann_date: string;
		}>;
		total: number;
		page: number;
		pageSize: number;
	}>;

	// 获取最近交易日
	getLatestTradeDate: () => Promise<string>;

	// 自动更新相关
	checkForUpdates: () => Promise<{ available: boolean; updateInfo?: any; error?: string; message?: string }>;
	downloadUpdate: () => Promise<{ success: boolean; error?: string }>;
	installUpdate: () => Promise<void>;
	onUpdateChecking: (callback: () => void) => () => void;
	onUpdateAvailable: (callback: (info: { version: string; releaseDate: string; releaseNotes?: string }) => void) => () => void;
	onUpdateNotAvailable: (callback: (info: any) => void) => () => void;
	onUpdateDownloadProgress: (callback: (progress: { percent: number; transferred: number; total: number }) => void) => () => void;
	onUpdateDownloaded: (callback: (info: { version: string }) => void) => () => void;
	onUpdateError: (callback: (error: string) => void) => () => void;
}

declare global {
	interface Window {
		electronAPI: ElectronAPI;
	}
}

export {};
