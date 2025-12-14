import { app, BrowserWindow, globalShortcut, Notification, nativeImage, Tray, Menu, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
let mainWindow = null;
let tray = null;
const extendedApp = app;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "股神助手",
    webPreferences: {
      preload: path.join(__dirname$1, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false
      // 禁用同源策略
    },
    show: false,
    backgroundColor: "#ffffff"
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
    if (Notification.isSupported()) {
      new Notification({
        title: "股神助手",
        body: "应用已启动，准备好为您服务！"
      }).show();
    }
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname$1, "../dist/index.html"));
  }
  mainWindow.on("close", (event) => {
    if (!extendedApp.isQuitting) {
      event.preventDefault();
      mainWindow == null ? void 0 : mainWindow.hide();
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
function createTray() {
  const iconPath = isDev ? path.join(__dirname$1, "../build/tray-icon.png") : path.join(process.resourcesPath, "build/tray-icon.png");
  let trayIcon;
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
  tray.setToolTip("股神助手");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        mainWindow == null ? void 0 : mainWindow.show();
      }
    },
    { type: "separator" },
    {
      label: "关于",
      click: () => {
        if (Notification.isSupported()) {
          new Notification({
            title: "股神助手",
            body: `版本: ${app.getVersion()}
基于 Electron + React`
          }).show();
        }
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        extendedApp.isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (mainWindow == null ? void 0 : mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow == null ? void 0 : mainWindow.show();
    }
  });
}
function registerShortcuts() {
  globalShortcut.register("CommandOrControl+Shift+S", () => {
    if (mainWindow == null ? void 0 : mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow == null ? void 0 : mainWindow.show();
    }
  });
}
function setupIPC() {
  ipcMain.handle("show-notification", async (_event, title, body) => {
    if (Notification.isSupported()) {
      new Notification({
        title,
        body
      }).show();
    }
  });
  ipcMain.handle("get-app-version", async () => {
    return app.getVersion();
  });
}
app.whenReady().then(() => {
  createWindow();
  createTray();
  registerShortcuts();
  setupIPC();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow == null ? void 0 : mainWindow.show();
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
