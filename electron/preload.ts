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

	// 触发同步
	syncAnnouncements: () => {
		return ipcRenderer.invoke("sync-announcements");
	},

	// 监听同步进度
	onSyncProgress: (callback: (data: any) => void) => {
		const subscription = (_event: any, data: any) => callback(data);
		ipcRenderer.on("sync-progress", subscription);
		return () => ipcRenderer.removeListener("sync-progress", subscription);
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
