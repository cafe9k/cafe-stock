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
