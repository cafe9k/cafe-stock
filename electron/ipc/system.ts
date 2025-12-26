/**
 * INPUT: ipcMain(Electron), Notification(通知), shell(系统shell), updater(更新器), errorHandler(错误处理)
 * OUTPUT: registerSystemHandlers() - 注册系统相关的IPC处理器（show-notification, get-app-version等）
 * POS: IPC通信层系统处理器，提供系统级功能（通知、版本、外部链接等）
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/ipc/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { ipcMain, Notification, shell } from "electron";
import { getCurrentVersion } from "../updater/index.js";
import { withErrorHandler } from "./middleware/errorHandler.js";
import { AppError, ErrorCode } from "../types/errors.js";
import { log } from "../utils/logger.js";

/**
 * 注册系统相关 IPC 处理器
 */
export function registerSystemHandlers(): void {
	// 显示通知
	ipcMain.handle(
		"show-notification",
		withErrorHandler(async (_event, title: string, body: string) => {
			if (Notification.isSupported()) {
				new Notification({ title, body }).show();
			}
			return { success: true };
		}, "show-notification")
	);

	// 获取应用版本
	ipcMain.handle(
		"get-app-version",
		withErrorHandler(async () => {
			return getCurrentVersion();
		}, "get-app-version")
	);

	// 打开外部链接
	ipcMain.handle(
		"open-external",
		withErrorHandler(async (_event, url: string) => {
			log.debug("IPC", `打开外部链接: ${url}`);

			// 安全检查：只允许 http/https 协议
			if (!url.startsWith("http://") && !url.startsWith("https://")) {
				throw new AppError(ErrorCode.INVALID_PARAMS, "只支持 HTTP/HTTPS 协议");
			}

			await shell.openExternal(url);
			return { success: true };
		}, "open-external")
	);
}

