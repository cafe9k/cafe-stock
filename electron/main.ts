/**
 * Electron 主进程入口文件
 * 负责应用生命周期管理和模块初始化
 */

import { app, globalShortcut } from "electron";
import { createWindow, getMainWindow, setMainWindow } from "./core/window.js";
import { createTray } from "./core/tray.js";
import { registerShortcuts } from "./core/shortcuts.js";
import { setupIPC, cleanupDatabaseResources } from "./ipc/index.js";
import { setupAutoUpdater } from "./updater/index.js";
import { syncStocksIfNeeded } from "./services/stock.js";
import { ExtendedApp } from "./types/index.js";
import { log } from "./utils/logger.js";

// 扩展 app 对象
const extendedApp = app as typeof app & ExtendedApp;

/**
 * 应用初始化
 */
async function initialize(): Promise<void> {
	log.info("App", "=".repeat(60));
	log.info("App", "酷咖啡股票助手 - 启动中...");
	log.info("App", "=".repeat(60));

	// 创建主窗口
	const mainWindow = createWindow();

	// 设置窗口关闭行为（隐藏而不是退出）
	mainWindow.on("close", (event) => {
		if (!extendedApp.isQuitting) {
			event.preventDefault();
			mainWindow.hide();
		}
	});

	// 创建系统托盘
	createTray(mainWindow, extendedApp);

	// 注册全局快捷键
	registerShortcuts(mainWindow);

	// 注册 IPC 处理器
	setupIPC(mainWindow);

	// 设置自动更新
	setupAutoUpdater(mainWindow);

	// 启动时同步股票列表（如果为空）
	try {
		await syncStocksIfNeeded();
	} catch (error) {
		log.error("App", "Stock sync failed:", error);
	}

	log.info("App", "=".repeat(60));
	log.info("App", "酷咖啡股票助手 - 启动完成");
	log.info("App", "=".repeat(60));
}

/**
 * 单实例锁定 - 确保只运行一个应用实例
 */
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	// 如果获取锁失败，说明已经有一个实例在运行，直接退出
	log.info("App", "应用已经在运行，退出当前实例");
	app.quit();
} else {
	// 当尝试启动第二个实例时，将焦点放回第一个实例的窗口
	app.on("second-instance", () => {
		log.info("App", "检测到第二个实例尝试启动，聚焦到主窗口");
		const mainWindow = getMainWindow();
		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
			mainWindow.show();
		}
	});

	// 应用准备就绪时初始化
	app.whenReady().then(() => {
		initialize().catch((error) => {
			log.error("App", "Failed to initialize app:", error);
			app.quit();
		});
	});
}

/**
 * 所有窗口关闭时的处理
 * macOS 下通常不退出应用，其他平台退出
 */
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

/**
 * macOS 下点击 Dock 图标时重新创建窗口
 */
app.on("activate", () => {
	const mainWindow = getMainWindow();
	if (!mainWindow) {
		initialize().catch((error) => {
			log.error("App", "Failed to re-initialize app:", error);
		});
	} else {
		mainWindow.show();
	}
});

/**
 * 应用即将退出时的清理工作
 */
app.on("before-quit", () => {
	extendedApp.isQuitting = true;
	log.info("App", "Application is quitting...");
});

/**
 * 应用退出时的清理工作
 */
app.on("will-quit", () => {
	// 注销所有全局快捷键
	globalShortcut.unregisterAll();

	// 清理数据库资源
	cleanupDatabaseResources();

	log.info("App", "Application cleanup completed");
});

/**
 * 处理未捕获的异常
 */
process.on("uncaughtException", (error) => {
	log.error("App", "Uncaught Exception:", error);
});

/**
 * 处理未处理的 Promise 拒绝
 */
process.on("unhandledRejection", (reason, promise) => {
	log.error("App", "Unhandled Rejection at:", promise, "reason:", reason);
});
