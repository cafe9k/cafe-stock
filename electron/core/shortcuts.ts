/**
 * 全局快捷键模块
 * 负责注册和管理全局快捷键
 */

import { globalShortcut, BrowserWindow } from "electron";

/**
 * 注册全局快捷键
 */
export function registerShortcuts(mainWindow: BrowserWindow): void {
	// 注册显示/隐藏窗口快捷键
	globalShortcut.register("CommandOrControl+Shift+S", () => {
		if (mainWindow?.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow?.show();
		}
	});
}

/**
 * 注销所有全局快捷键
 */
export function unregisterAllShortcuts(): void {
	globalShortcut.unregisterAll();
}

