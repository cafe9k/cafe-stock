/**
 * 依赖: ipcMain(Electron), updater(更新器模块)
 * 输出: registerUpdaterHandlers() - 注册自动更新相关的IPC处理器（check-for-updates, download-update等）
 * 职责: IPC通信层更新处理器，连接渲染进程与主进程的自动更新功能
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/ipc/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
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
