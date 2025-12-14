import { contextBridge, ipcRenderer } from "electron";

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

	// 代理 Tushare 请求
	tushareRequest: (url: string, body: any) => {
		return ipcRenderer.invoke("tushare-request", url, body);
	},

	// 触发刷新数据
	refreshData: () => {
		ipcRenderer.send("refresh-data");
	},

	// 监听刷新数据事件（从主进程发送）
	onRefreshData: (callback: () => void) => {
		const subscription = (_event: Electron.IpcRendererEvent) => callback();
		ipcRenderer.on("refresh-data", subscription);

		// 返回清理函数
		return () => {
			ipcRenderer.removeListener("refresh-data", subscription);
		};
	},
});
