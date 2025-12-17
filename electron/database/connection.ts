/**
 * 数据库连接管理模块
 * 负责数据库连接的创建、配置和关闭
 */

import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import { log } from "../utils/logger.js";

// 数据库实例（单例）
let dbInstance: Database.Database | null = null;
let dbPath: string | null = null;

/**
 * 获取数据库路径
 */
export function getDatabasePath(): string {
	if (!dbPath) {
		dbPath = path.join(app.getPath("userData"), "cafe_stock.db");
	}
	return dbPath;
}

/**
 * 初始化数据库连接
 */
export function initializeDatabase(): Database.Database {
	if (dbInstance) {
		return dbInstance;
	}

	const path = getDatabasePath();
	log.info("DB", `初始化数据库连接: ${path}`);

	try {
		dbInstance = new Database(path);

		// 配置数据库性能参数
		configureDatabasePerformance(dbInstance);

		log.info("DB", "数据库连接初始化成功");
		return dbInstance;
	} catch (error) {
		log.error("DB", "数据库连接初始化失败:", error);
		throw error;
	}
}

/**
 * 配置数据库性能参数
 */
function configureDatabasePerformance(db: Database.Database): void {
	try {
		// 开启 WAL 模式以提高并发性能
		db.pragma("journal_mode = WAL");
		db.pragma("synchronous = NORMAL");
		db.pragma("cache_size = -64000"); // 64MB cache
		db.pragma("temp_store = MEMORY");

		log.debug("DB", "数据库性能参数配置完成");
	} catch (error) {
		log.error("DB", "配置数据库性能参数失败:", error);
		throw error;
	}
}

/**
 * 获取数据库实例
 */
export function getDatabase(): Database.Database {
	if (!dbInstance) {
		return initializeDatabase();
	}
	return dbInstance;
}

/**
 * 关闭数据库连接
 */
export function closeDatabase(): boolean {
	if (!dbInstance) {
		log.warn("DB", "数据库连接未初始化，无需关闭");
		return true;
	}

	try {
		dbInstance.close();
		dbInstance = null;
		log.info("DB", "数据库连接已关闭");
		return true;
	} catch (error) {
		log.error("DB", "关闭数据库连接失败:", error);
		return false;
	}
}

/**
 * 性能分析工具（开发环境使用）
 */
export function analyzeQuery(sql: string, params: any[] = []): any[] {
	const db = getDatabase();
	const plan = db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(...params);
	log.debug("DB", "Query Plan:", JSON.stringify(plan, null, 2));
	return plan;
}

