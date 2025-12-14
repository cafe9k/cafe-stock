// Electron API 类型定义
export interface ElectronAPI {
	showNotification: (title: string, body: string) => Promise<void>;
	getAppVersion: () => Promise<string>;
}

declare global {
	interface Window {
		electronAPI: ElectronAPI;
	}
}

export {};
