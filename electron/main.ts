import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, Notification, nativeImage, NativeImage } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { getAnnouncements, getLatestAnnDate, insertAnnouncements, countAnnouncements } from "./db.js";
import { TushareClient } from "./tushare.js";

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

// Sync State
let isSyncing = false;

// Create Window
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		title: "酷咖啡",
		webPreferences: {
			preload: path.join(__dirname, "preload.cjs"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			webSecurity: true,
		},
		show: false,
		backgroundColor: "#ffffff",
	});

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
		mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
	}

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

function createTray() {
	const iconPath = isDev ? path.join(__dirname, "../build/tray-icon.png") : path.join(process.resourcesPath, "build/tray-icon.png");
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
}

function registerShortcuts() {
	globalShortcut.register("CommandOrControl+Shift+S", () => {
		if (mainWindow?.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow?.show();
		}
	});
}

// Sync Logic
async function performSync() {
	if (isSyncing) return { status: "skipped", message: "Sync already in progress" };
	isSyncing = true;
	console.log("Starting sync...");

	let totalSynced = 0;
	let startDate = "";
	let endDate = "";

	try {
		const lastDate = getLatestAnnDate();
		const now = new Date();
		const today = now.toISOString().slice(0, 10).replace(/-/g, "");

		const pastDate = new Date(now);
		pastDate.setMonth(pastDate.getMonth() - 1);
		const oneMonthAgo = pastDate.toISOString().slice(0, 10).replace(/-/g, "");

		startDate = lastDate && lastDate > oneMonthAgo ? lastDate : oneMonthAgo;
		endDate = today;

		if (lastDate === today) {
			console.log("Already synced to today.");
			isSyncing = false;
			return { status: "success", message: "Already up to date", startDate, endDate, totalSynced: 0 };
		}

		console.log(`Syncing from ${startDate} to ${today}`);

		let offset = 0;
		const limit = 2000;
		let hasMore = true;

		while (hasMore) {
			// Fetch in batches
			const data = await TushareClient.getAnnouncements(undefined, undefined, startDate, today, limit, offset);

			if (data.length > 0) {
				insertAnnouncements(data);
				console.log(`Synced ${data.length} items.`);
				totalSynced += data.length;

				// Send progress update
				mainWindow?.webContents.send("sync-progress", {
					status: "syncing",
					totalSynced,
					currentBatchSize: data.length,
				});

				if (data.length < limit) {
					hasMore = false;
				} else {
					offset += limit;
				}
			} else {
				hasMore = false;
			}

			// Safety break to prevent infinite loops during dev
			if (offset > 100000) {
				console.warn("Sync limit reached (safety break).");
				break;
			}
		}

		return { status: "success", message: "Sync completed", startDate, endDate, totalSynced };
	} catch (error: any) {
		console.error("Sync failed:", error);
		return { status: "failed", message: error.message || "Unknown error" };
	} finally {
		isSyncing = false;
		console.log("Sync finished.");
	}
}

function setupIPC() {
	ipcMain.handle("show-notification", async (_event, title: string, body: string) => {
		if (Notification.isSupported()) {
			new Notification({ title, body }).show();
		}
	});

	ipcMain.handle("get-app-version", async () => {
		return app.getVersion();
	});

	ipcMain.handle("get-announcements", async (_event, page: number, pageSize: number) => {
		const offset = (page - 1) * pageSize;
		const items = getAnnouncements(pageSize, offset);
		const total = countAnnouncements();
		console.log(`[IPC] get-announcements: page=${page}, offset=${offset}, items=${items.length}, total=${total}`);
		return {
			items,
			total,
		};
	});

	ipcMain.handle("sync-announcements", async () => {
		return await performSync();
	});
}

app.whenReady().then(() => {
	createWindow();
	createTray();
	registerShortcuts();
	setupIPC();

	// Auto sync on startup
	performSync();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		} else {
			mainWindow?.show();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("before-quit", () => {
	extendedApp.isQuitting = true;
});

app.on("will-quit", () => {
	globalShortcut.unregisterAll();
});
