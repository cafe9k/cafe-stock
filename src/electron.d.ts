// Electron API 类型定义
export interface ElectronAPI {
	showNotification: (title: string, body: string) => Promise<void>;
	getAppVersion: () => Promise<string>;
	getAnnouncements: (page: number, pageSize: number) => Promise<{ items: any[]; total: number }>;
	syncAnnouncements: () => Promise<{
		status: "success" | "failed" | "skipped";
		message: string;
		startDate?: string;
		endDate?: string;
		totalSynced?: number;
	}>;
	onSyncProgress: (callback: (data: { status: string; totalSynced: number; currentBatchSize: number }) => void) => () => void;
}

declare global {
	interface Window {
		electronAPI: ElectronAPI;
	}
}

export {};
