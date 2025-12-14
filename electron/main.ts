import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, Notification, nativeImage, NativeImage } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 扩展 app 对象类型
interface ExtendedApp {
	isQuitting?: boolean;
}

// 开发环境判断
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
const extendedApp = app as typeof app & ExtendedApp;

// 创建主窗口
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		title: "股神助手",
		webPreferences: {
			preload: path.join(__dirname, "preload.cjs"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			webSecurity: false, // 禁用同源策略
		},
		show: false,
		backgroundColor: "#ffffff",
	});

	// 窗口准备好后再显示，避免闪烁
	mainWindow.once("ready-to-show", () => {
		mainWindow?.show();

		// 显示启动通知
		if (Notification.isSupported()) {
			new Notification({
				title: "股神助手",
				body: "应用已启动，准备好为您服务！",
			}).show();
		}
	});

	// 加载应用
	if (isDev) {
		mainWindow.loadURL("http://localhost:5173");
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
	}

	// 窗口关闭时隐藏而不是退出（macOS 风格）
	mainWindow.on("close", (event) => {
		if (!extendedApp.isQuitting) {
			event.preventDefault();
			mainWindow?.hide();
		}
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

// 创建系统托盘
function createTray() {
	// 创建托盘图标（使用模板图片）
	const iconPath = isDev ? path.join(__dirname, "../build/tray-icon.png") : path.join(process.resourcesPath, "build/tray-icon.png");

	let trayIcon: NativeImage;
	try {
		trayIcon = nativeImage.createFromPath(iconPath);
		if (trayIcon.isEmpty()) {
			// 如果图标不存在，创建一个简单的占位图标
			trayIcon = nativeImage.createEmpty();
		}
	} catch (error) {
		console.error("创建托盘图标失败:", error);
		trayIcon = nativeImage.createEmpty();
	}

	tray = new Tray(trayIcon);
	tray.setToolTip("股神助手");

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
						title: "股神助手",
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

	// 点击托盘图标显示/隐藏窗口
	tray.on("click", () => {
		if (mainWindow?.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow?.show();
		}
	});
}

// 注册全局快捷键
function registerShortcuts() {
	// Cmd+Shift+S: 显示/隐藏窗口
	globalShortcut.register("CommandOrControl+Shift+S", () => {
		if (mainWindow?.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow?.show();
		}
	});
}

// 设置 IPC 通信处理器
function setupIPC() {
	// 显示通知
	ipcMain.handle("show-notification", async (_event, title: string, body: string) => {
		if (Notification.isSupported()) {
			new Notification({
				title,
				body,
			}).show();
		}
	});

	// 获取应用版本
	ipcMain.handle("get-app-version", async () => {
		return app.getVersion();
	});
}

// 应用准备就绪
app.whenReady().then(() => {
	createWindow();
	createTray();
	registerShortcuts();
	setupIPC();

	app.on("activate", () => {
		// macOS: 点击 Dock 图标时重新创建窗口
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		} else {
			mainWindow?.show();
		}
	});
});

// 所有窗口关闭时退出应用（Windows & Linux）
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// 在应用退出前设置 isQuitting 为 true，确保窗口可以正常关闭
app.on("before-quit", () => {
	extendedApp.isQuitting = true;
});

// 应用退出前清理
app.on("will-quit", () => {
	// 注销所有快捷键
	globalShortcut.unregisterAll();
});
