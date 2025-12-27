/**
 * 依赖: 各IPC处理器模块（announcement, stock, favorite, holder等）
 * 输出: setupIPC() - 统一注册所有IPC处理器的主入口函数
 * 职责: IPC通信层聚合模块，提供统一的IPC处理器注册入口
 *
 * ⚠️ 更新提醒：新增IPC处理器时，请在此处添加注册调用并更新 electron/ipc/README.md
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
