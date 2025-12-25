/**
 * IPC 处理器统一注册入口
 */

import { BrowserWindow } from "electron";
import { registerSystemHandlers } from "./system.js";
import { registerUpdaterHandlers } from "./updater.js";
import { registerFavoriteHandlers } from "./favorite.js";
import { registerStockHandlers } from "./stock.js";
import { registerAnnouncementHandlers } from "./announcement.js";
import { registerHolderHandlers } from "./holder.js";
import { registerClassificationHandlers } from "./classification.js";
import { registerDatabaseHandlers } from "./database.js";
import { log } from "../utils/logger.js";

/**
 * 注册所有 IPC 处理器
 */
export function setupIPC(mainWindow: BrowserWindow | null): void {
	log.info("IPC", "Setting up IPC handlers...");

	// 系统相关（3个）
	registerSystemHandlers();

	// 自动更新相关（3个）
	registerUpdaterHandlers();

	// 收藏相关（5个）
	registerFavoriteHandlers();

	// 股票相关（7个）
	registerStockHandlers(mainWindow);

	// 公告相关（12个）
	registerAnnouncementHandlers();

	// 股东相关（10个）
	registerHolderHandlers(mainWindow);

	// 分类相关（8个）
	registerClassificationHandlers();

	// 数据库相关（9个）
	registerDatabaseHandlers(mainWindow);

	log.info("IPC", "All IPC handlers registered successfully");
}

/**
 * 导出数据库资源清理函数
 */
export { cleanupDatabaseResources } from "./database.js";
