/**
 * 数据库操作模块（重构版）
 *
 * 此文件现在作为向后兼容层，内部使用新的模块化架构。
 * 新代码应使用：
 * - electron/database/connection.ts - 数据库连接管理
 * - electron/database/migrations.ts - 数据库迁移
 * - electron/database/syncFlags.ts - 同步标志位管理
 * - electron/repositories/ - 数据访问层
 *
 * 已迁移的模块：
 * - 股票相关操作 -> StockRepository
 * - 收藏相关操作 -> FavoriteRepository
 * - 公告相关操作 -> AnnouncementRepository
 * - 股东相关操作 -> HolderRepository
 * - 分类相关操作 -> ClassificationRepository
 */

import Database from "better-sqlite3";
import {
	initializeDatabase,
	getDatabase,
	getDatabasePath,
	closeDatabase as closeDatabaseConnection,
	analyzeQuery as analyzeQueryPlan,
} from "./database/connection.js";
import { createTables, migrateDatabase as runMigrations } from "./database/migrations.js";
import { SyncFlagManager } from "./database/syncFlags.js";
import { log } from "./utils/logger.js";

// 初始化数据库
const db = initializeDatabase();

// 创建表结构
createTables(db);

// 执行数据库迁移
runMigrations(db);

// 创建同步标志位管理器实例
const syncFlagManager = new SyncFlagManager(db);

// ============= 向后兼容的导出 =============

/**
 * 获取数据库实例
 * @deprecated 使用 getDatabase() 替代
 */
export const getDb = (): Database.Database => {
	return getDatabase();
};

/**
 * 获取数据库路径
 * @deprecated 使用 getDatabasePath() 替代
 */
export const getDbPath = (): string => {
	return getDatabasePath();
};

/**
 * 获取上次同步日期
 * @deprecated 使用 SyncFlagManager.getLastSyncDate() 替代
 */
export const getLastSyncDate = (syncType: string): string | null => {
	return syncFlagManager.getLastSyncDate(syncType);
};

/**
 * 更新同步标志位
 * @deprecated 使用 SyncFlagManager.updateSyncFlag() 替代
 */
export const updateSyncFlag = (syncType: string, syncDate: string): void => {
	syncFlagManager.updateSyncFlag(syncType, syncDate);
};

/**
 * 检查今天是否已同步
 * @deprecated 使用 SyncFlagManager.isSyncedToday() 替代
 */
export const isSyncedToday = (syncType: string): boolean => {
	return syncFlagManager.isSyncedToday(syncType);
};

/**
 * 性能分析工具
 * @deprecated 使用 analyzeQuery() from connection.ts 替代
 */
export const analyzeQuery = (sql: string, params: any[] = []): any[] => {
	return analyzeQueryPlan(sql, params);
};

/**
 * 关闭数据库连接
 * @deprecated 使用 closeDatabase() from connection.ts 替代
 */
export const closeDatabase = (): boolean => {
	return closeDatabaseConnection();
};

// 导出默认数据库实例（向后兼容）
export default db;

// ============= 新的导出（推荐使用） =============

// 导出新模块
export { getDatabase, getDatabasePath, closeDatabase as closeDatabaseConnection } from "./database/connection.js";
export { createTables, migrateDatabase } from "./database/migrations.js";
export { SyncFlagManager } from "./database/syncFlags.js";

// 导出同步标志位管理器实例
export { syncFlagManager };

log.info("DB", "数据库模块初始化完成");
