/**
 * 自动更新模块
 * 负责应用的自动更新功能
 */

import { BrowserWindow, Notification, app } from "electron";
import pkg from "electron-updater";
const { autoUpdater } = pkg;

// 配置自动更新
autoUpdater.autoDownload = false; // 不自动下载，让用户选择
autoUpdater.autoInstallOnAppQuit = true; // 退出时自动安装

/**
 * 设置自动更新事件监听
 */
export function setupAutoUpdater(mainWindow: BrowserWindow | null): void {
	// 检查更新时
	autoUpdater.on("checking-for-update", () => {
		console.log("正在检查更新...");
		mainWindow?.webContents.send("update-checking");
	});

	// 发现新版本
	autoUpdater.on("update-available", (info) => {
		console.log("发现新版本:", info.version);
		mainWindow?.webContents.send("update-available", info);

		if (Notification.isSupported()) {
			new Notification({
				title: "发现新版本",
				body: `版本 ${info.version} 可用，点击查看详情`,
			}).show();
		}
	});

	// 当前已是最新版本
	autoUpdater.on("update-not-available", (info) => {
		console.log("当前已是最新版本");
		mainWindow?.webContents.send("update-not-available", info);
	});

	// 下载进度
	autoUpdater.on("download-progress", (progressObj) => {
		console.log(`下载进度: ${progressObj.percent.toFixed(2)}%`);
		mainWindow?.webContents.send("update-download-progress", progressObj);
	});

	// 下载完成
	autoUpdater.on("update-downloaded", (info) => {
		console.log("更新下载完成:", info.version);
		mainWindow?.webContents.send("update-downloaded", info);

		if (Notification.isSupported()) {
			new Notification({
				title: "更新已下载",
				body: "新版本已准备就绪，重启应用即可安装",
			}).show();
		}
	});

	// 更新错误
	autoUpdater.on("error", (error) => {
		console.error("更新错误:", error);
		mainWindow?.webContents.send("update-error", error.message);
	});
}

/**
 * 检查更新
 */
export async function checkForUpdates(): Promise<any> {
	try {
		return await autoUpdater.checkForUpdates();
	} catch (error) {
		console.error("检查更新失败:", error);
		throw error;
	}
}

/**
 * 下载更新
 */
export async function downloadUpdate(): Promise<any> {
	try {
		return await autoUpdater.downloadUpdate();
	} catch (error) {
		console.error("下载更新失败:", error);
		throw error;
	}
}

/**
 * 安装更新并重启
 */
export function installUpdate(): void {
	autoUpdater.quitAndInstall();
}

/**
 * 获取当前版本
 */
export function getCurrentVersion(): string {
	return app.getVersion();
}

