/**
 * 窗口管理模块
 * 负责创建和管理主窗口
 */

import { BrowserWindow, Notification, session, app } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import windowStateKeeper from "electron-window-state";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 开发环境判断
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

// Preload 脚本路径
const PRELOAD_PATH = isDev
	? path.join(process.cwd(), "dist-electron/preload.cjs")
	: path.join(__dirname, "../../preload.cjs");

let mainWindow: BrowserWindow | null = null;

/**
 * 创建主窗口
 */
export function createWindow(): BrowserWindow {
	// 设置内容安全策略 (仅在生产环境应用严格策略)
	if (!isDev) {
		session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
			callback({
				responseHeaders: {
					...details.responseHeaders,
					"Content-Security-Policy": [
						"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.tushare.pro https://github.com;",
					],
				},
			});
		});
	}

	// 使用 electron-window-state 保持窗口状态
	const mainWindowState = windowStateKeeper({
		defaultWidth: 1280,
		defaultHeight: 800,
	});

	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minWidth: 800,
		minHeight: 600,
		title: "酷咖啡",
		webPreferences: {
			preload: PRELOAD_PATH,
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			webSecurity: true,
			webviewTag: true, // 启用 webview 标签
		},
		show: false,
		backgroundColor: "#ffffff",
	});

	// 让 electron-window-state 管理窗口状态
	mainWindowState.manage(mainWindow);

	// Forward console logs to terminal with detailed information
	mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
		const levelMap: Record<number, string> = {
			0: "LOG",
			1: "INFO",
			2: "WARN",
			3: "ERROR",
		};
		const levelName = levelMap[level] || "UNKNOWN";
		const source = sourceId ? `[${sourceId}]` : "";
		const location = line ? `:${line}` : "";

		// 使用不同颜色和格式输出不同级别的日志
		switch (level) {
			case 0: // log
				console.log(`[Renderer ${levelName}]${source}${location} ${message}`);
				break;
			case 1: // info
				console.info(`[Renderer ${levelName}]${source}${location} ${message}`);
				break;
			case 2: // warn
				console.warn(`[Renderer ${levelName}]${source}${location} ${message}`);
				break;
			case 3: // error
				console.error(`[Renderer ${levelName}]${source}${location} ${message}`);
				break;
			default:
				console.log(`[Renderer ${levelName}]${source}${location} ${message}`);
		}
	});

	mainWindow.once("ready-to-show", () => {
		mainWindow?.show();
		if (Notification.isSupported()) {
			new Notification({
				title: "酷咖啡",
				body: "应用已启动，准备好为您服务！",
			}).show();
		}
	});

	if (isDev) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173");
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
	}

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	return mainWindow;
}

/**
 * 获取主窗口实例
 */
export function getMainWindow(): BrowserWindow | null {
	return mainWindow;
}

/**
 * 设置主窗口实例（用于外部管理）
 */
export function setMainWindow(window: BrowserWindow | null): void {
	mainWindow = window;
}

