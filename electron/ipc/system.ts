/**
 * 系统相关 IPC 处理器
 */

import { ipcMain, Notification, shell, app } from "electron";
import { getCurrentVersion } from "../updater/index.js";

/**
 * 注册系统相关 IPC 处理器
 */
export function registerSystemHandlers(): void {
	// 显示通知
	ipcMain.handle("show-notification", async (_event, title: string, body: string) => {
		if (Notification.isSupported()) {
			new Notification({ title, body }).show();
		}
	});

	// 获取应用版本
	ipcMain.handle("get-app-version", async () => {
		return getCurrentVersion();
	});

	// 打开外部链接
	ipcMain.handle("open-external", async (_event, url: string) => {
		try {
			console.log(`[IPC] open-external: ${url}`);

			// 安全检查：只允许 http/https 协议
			if (!url.startsWith("http://") && !url.startsWith("https://")) {
				throw new Error("只支持 HTTP/HTTPS 协议");
			}

			await shell.openExternal(url);
			return { success: true };
		} catch (error: any) {
			console.error("Failed to open external URL:", error);
			return {
				success: false,
				error: error.message || "打开链接失败",
			};
		}
	});
}

