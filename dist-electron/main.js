import { app, BrowserWindow, globalShortcut, Notification, nativeImage, Tray, Menu, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
const dbPath = path.join(app.getPath("userData"), "cafe_stock.db");
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL,
    ann_date TEXT NOT NULL,
    ann_type TEXT,
    title TEXT,
    content TEXT,
    pub_time TEXT,
    UNIQUE(ts_code, ann_date, title)
  );

  CREATE INDEX IF NOT EXISTS idx_ann_date_pub_time ON announcements (ann_date DESC, pub_time DESC);
`);
const insertAnnouncements = (items) => {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO announcements (ts_code, ann_date, ann_type, title, content, pub_time)
    VALUES (@ts_code, @ann_date, @ann_type, @title, @content, @pub_time)
  `);
  const insertMany = db.transaction((announcements) => {
    for (const ann of announcements) {
      insert.run({
        ts_code: ann.ts_code || null,
        ann_date: ann.ann_date || null,
        ann_type: ann.ann_type || null,
        title: ann.title || null,
        content: ann.content || null,
        pub_time: ann.pub_time || null
      });
    }
  });
  insertMany(items);
};
const getLatestAnnDate = () => {
  const row = db.prepare("SELECT MAX(ann_date) as max_date FROM announcements").get();
  return (row == null ? void 0 : row.max_date) || null;
};
const getAnnouncements = (limit, offset) => {
  return db.prepare(
    `
    SELECT * FROM announcements 
    ORDER BY ann_date DESC, pub_time DESC 
    LIMIT ? OFFSET ?
  `
  ).all(limit, offset);
};
const countAnnouncements = () => {
  const row = db.prepare("SELECT COUNT(*) as count FROM announcements").get();
  return row.count;
};
const _TushareClient = class _TushareClient {
  static async request(apiName, params = {}, fields = "") {
    const requestBody = {
      api_name: apiName,
      token: this.TOKEN,
      params,
      fields: Array.isArray(fields) ? fields.join(",") : fields
    };
    try {
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const res = await response.json();
      if (res.code !== 0) {
        throw new Error(`Tushare Error [${res.code}]: ${res.msg}`);
      }
      if (!res.data) {
        return [];
      }
      const { fields: columns, items } = res.data;
      return items.map((item) => {
        const obj = {};
        columns.forEach((col, index) => {
          obj[col] = item[index];
        });
        return obj;
      });
    } catch (error) {
      console.error("Tushare Request Failed:", error);
      throw error;
    }
  }
  /**
   * 获取全量公告数据
   * 文档: https://tushare.pro/document/2?doc_id=176
   * 接口：anns_d
   * 描述：获取上市公司公告数据
   * 限量：单次最大2000，总量不限制
   * 权限：用户需要至少2000积分才可以调取，5000积分以上频次相对较高，具体请参阅积分获取办法
   *
   * 输入参数：
   * ts_code: str, 股票代码（支持多个股票同时提取，逗号分隔）
   * ann_date: str, 公告日期（YYYYMMDD格式，支持单日和多日）
   * start_date: str, 公告开始日期
   * end_date: str, 公告结束日期
   *
   * 输出参数：
   * ts_code: str, 股票代码
   * ann_date: str, 公告日期
   * ann_type: str, 公告类型
   * title: str, 公告标题
   * content: str, 公告内容
   * pub_time: str, 公告发布时间
   */
  static async getAnnouncements(tsCode, annDate, startDate, endDate, limit = 2e3, offset = 0) {
    return this.request("anns_d", {
      ts_code: tsCode,
      ann_date: annDate,
      start_date: startDate,
      end_date: endDate,
      limit,
      // Internal support for pagination if API allows, or wrapper logic
      offset
    });
  }
};
_TushareClient.TOKEN = "834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d";
_TushareClient.BASE_URL = "http://api.tushare.pro";
let TushareClient = _TushareClient;
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
let mainWindow = null;
let tray = null;
const extendedApp = app;
let isSyncing = false;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "酷咖啡",
    webPreferences: {
      preload: path.join(__dirname$1, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true
    },
    show: false,
    backgroundColor: "#ffffff"
  });
  mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
    const levelMap = {
      0: "LOG",
      1: "INFO",
      2: "WARN",
      3: "ERROR"
    };
    const levelName = levelMap[level] || "UNKNOWN";
    const source = sourceId ? `[${sourceId}]` : "";
    const location = line ? `:${line}` : "";
    switch (level) {
      case 0:
        console.log(`[Renderer ${levelName}]${source}${location} ${message}`);
        break;
      case 1:
        console.info(`[Renderer ${levelName}]${source}${location} ${message}`);
        break;
      case 2:
        console.warn(`[Renderer ${levelName}]${source}${location} ${message}`);
        break;
      case 3:
        console.error(`[Renderer ${levelName}]${source}${location} ${message}`);
        break;
      default:
        console.log(`[Renderer ${levelName}]${source}${location} ${message}`);
    }
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
    if (Notification.isSupported()) {
      new Notification({
        title: "酷咖啡",
        body: "应用已启动，准备好为您服务！"
      }).show();
    }
  });
  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173");
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
  tray.setToolTip("酷咖啡");
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
            title: "酷咖啡",
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
async function performSync() {
  if (isSyncing) return { status: "skipped", message: "Sync already in progress" };
  isSyncing = true;
  console.log("Starting sync...");
  let totalSynced = 0;
  let startDate = "";
  let endDate = "";
  try {
    const lastDate = getLatestAnnDate();
    const now = /* @__PURE__ */ new Date();
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
    const limit = 2e3;
    let hasMore = true;
    while (hasMore) {
      const data = await TushareClient.getAnnouncements(void 0, void 0, startDate, today, limit, offset);
      if (data.length > 0) {
        insertAnnouncements(data);
        console.log(`Synced ${data.length} items.`);
        totalSynced += data.length;
        mainWindow == null ? void 0 : mainWindow.webContents.send("sync-progress", {
          status: "syncing",
          totalSynced,
          currentBatchSize: data.length
        });
        if (data.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      } else {
        hasMore = false;
      }
      if (offset > 1e5) {
        console.warn("Sync limit reached (safety break).");
        break;
      }
    }
    return { status: "success", message: "Sync completed", startDate, endDate, totalSynced };
  } catch (error) {
    console.error("Sync failed:", error);
    return { status: "failed", message: error.message || "Unknown error" };
  } finally {
    isSyncing = false;
    console.log("Sync finished.");
  }
}
function setupIPC() {
  ipcMain.handle("show-notification", async (_event, title, body) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  });
  ipcMain.handle("get-app-version", async () => {
    return app.getVersion();
  });
  ipcMain.handle("get-announcements", async (_event, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const items = getAnnouncements(pageSize, offset);
    const total = countAnnouncements();
    console.log(`[IPC] get-announcements: page=${page}, offset=${offset}, items=${items.length}, total=${total}`);
    return {
      items,
      total
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
  performSync();
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
