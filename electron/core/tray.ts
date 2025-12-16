/**
 * 托盘管理模块
 * 负责创建和管理系统托盘图标
 */

import { Tray, Menu, nativeImage, NativeImage, Notification, app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { ExtendedApp } from "../types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 开发环境判断
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

let tray: Tray | null = null;

/**
 * 创建系统托盘
 */
export function createTray(mainWindow: BrowserWindow, extendedApp: typeof app & ExtendedApp): Tray {
	const iconPath = isDev ? path.join(__dirname, "../../build/tray-icon.png") : path.join(process.resourcesPath, "build/tray-icon.png");
	let trayIcon: NativeImage;
	
	try {
		trayIcon = nativeImage.createFromPath(iconPath);
		if (trayIcon.isEmpty()) {
			trayIcon = nativeImage.createEmpty();
		}
	} catch (error) {
		console.error("创建托盘图标失败:", error);
		trayIcon = nativeImage.createEmpty();
	}

	tray = new Tray(trayIcon);
	tray.setToolTip("酷咖啡");

	const contextMenu = Menu.buildFromTemplate([
		{
			label: "显示窗口",
			click: () => {
				mainWindow?.show();
			},
		},
		{ type: "separator" },
		{
			label: "关于",
			click: () => {
				if (Notification.isSupported()) {
					new Notification({
						title: "酷咖啡",
						body: `版本: ${app.getVersion()}\n基于 Electron + React`,
					}).show();
				}
			},
		},
		{ type: "separator" },
		{
			label: "退出",
			click: () => {
				extendedApp.isQuitting = true;
				app.quit();
			},
		},
	]);

	tray.setContextMenu(contextMenu);
	tray.on("click", () => {
		if (mainWindow?.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow?.show();
		}
	});

	return tray;
}

/**
 * 获取托盘实例
 */
export function getTray(): Tray | null {
	return tray;
}

