/**
 * 自动更新相关 IPC 处理器
 */

import { ipcMain } from "electron";
import { checkForUpdates, downloadUpdate, installUpdate } from "../updater/index.js";

/**
 * 注册自动更新相关 IPC 处理器
 */
export function registerUpdaterHandlers(): void {
	// 检查更新
	ipcMain.handle("check-for-updates", async () => {
		try {
			console.log("[IPC] check-for-updates");
			return await checkForUpdates();
		} catch (error: any) {
			console.error("Failed to check for updates:", error);
			throw error;
		}
	});

	// 下载更新
	ipcMain.handle("download-update", async () => {
		try {
			console.log("[IPC] download-update");
			return await downloadUpdate();
		} catch (error: any) {
			console.error("Failed to download update:", error);
			throw error;
		}
	});

	// 安装更新
	ipcMain.handle("install-update", async () => {
		console.log("[IPC] install-update");
		installUpdate();
	});
}

