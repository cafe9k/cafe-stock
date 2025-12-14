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
});
