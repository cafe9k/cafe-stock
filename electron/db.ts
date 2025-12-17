/**
 * 数据库操作模块
 *
 * 此文件负责：
 * - 数据库连接和初始化
 * - 数据库表结构创建
 * - 数据库迁移
 * - 同步标志位管理（系统级操作）
 *
 * 注意：所有数据访问操作已迁移到仓储层（repositories/），
 * 新代码应使用仓储层进行数据访问。
 *
 * 已迁移的模块：
 * - 股票相关操作 -> StockRepository
 * - 收藏相关操作 -> FavoriteRepository
 * - 公告相关操作 -> AnnouncementRepository
 * - 股东相关操作 -> HolderRepository
 * - 分类相关操作 -> ClassificationRepository
 */

import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import { AnnouncementCategory, getCategoryColor, getCategoryIcon, DEFAULT_CLASSIFICATION_RULES } from "../src/utils/announcementClassifier.js";
import { log } from "./utils/logger.js";

const dbPath = path.join(app.getPath("userData"), "cafe_stock.db");
const db = new Database(dbPath);

// 导出数据库实例和路径，供仓储层使用
export const getDb = () => db;
export const getDbPath = () => dbPath;

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL UNIQUE,
    symbol TEXT,
    name TEXT,
    area TEXT,
    industry TEXT,
    fullname TEXT,
    enname TEXT,
    cnspell TEXT,
    market TEXT,
    exchange TEXT,
    curr_type TEXT,
    list_status TEXT,
    list_date TEXT,
    delist_date TEXT,
    is_hs TEXT,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_stock_name ON stocks (name);
  CREATE INDEX IF NOT EXISTS idx_stock_industry ON stocks (industry);
  CREATE INDEX IF NOT EXISTS idx_stock_list_status ON stocks (list_status);

  CREATE TABLE IF NOT EXISTS favorite_stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_favorite_ts_code ON favorite_stocks (ts_code);

  CREATE TABLE IF NOT EXISTS sync_flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_type TEXT NOT NULL UNIQUE,
    last_sync_date TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );


  CREATE TABLE IF NOT EXISTS top10_holders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL,
    ann_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    hold_amount REAL,
    hold_ratio REAL,
    updated_at TEXT NOT NULL,
    UNIQUE(ts_code, end_date, holder_name)
  );

  CREATE INDEX IF NOT EXISTS idx_top10_ts_code ON top10_holders (ts_code);
  CREATE INDEX IF NOT EXISTS idx_top10_end_date ON top10_holders (end_date DESC);
  CREATE INDEX IF NOT EXISTS idx_top10_holder_name ON top10_holders (holder_name);
  CREATE INDEX IF NOT EXISTS idx_top10_ts_end_date ON top10_holders (ts_code, end_date DESC);

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL,
    ann_date TEXT NOT NULL,
    ann_type TEXT,
    title TEXT,
    content TEXT,
    pub_time TEXT,
    file_path TEXT,
    name TEXT,
    UNIQUE(ts_code, ann_date, title)
  );

  CREATE INDEX IF NOT EXISTS idx_ann_date ON announcements (ann_date DESC);
  CREATE INDEX IF NOT EXISTS idx_ann_ts_code ON announcements (ts_code);
  CREATE INDEX IF NOT EXISTS idx_ann_ts_code_date ON announcements (ts_code, ann_date DESC, pub_time DESC);

  CREATE TABLE IF NOT EXISTS announcement_sync_ranges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    synced_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sync_range_ts_code ON announcement_sync_ranges (ts_code);
  CREATE INDEX IF NOT EXISTS idx_sync_range_dates ON announcement_sync_ranges (start_date, end_date);

  CREATE TABLE IF NOT EXISTS classification_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_key TEXT NOT NULL UNIQUE,
    category_name TEXT NOT NULL,
    color TEXT,
    icon TEXT,
    priority INTEGER NOT NULL,
    enabled INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_category_priority ON classification_categories (priority);
  CREATE INDEX IF NOT EXISTS idx_category_enabled ON classification_categories (enabled);

  CREATE TABLE IF NOT EXISTS classification_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_key TEXT NOT NULL,
    keyword TEXT NOT NULL,
    enabled INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (category_key) REFERENCES classification_categories(category_key)
  );

  CREATE INDEX IF NOT EXISTS idx_rules_category ON classification_rules(category_key);
  CREATE INDEX IF NOT EXISTS idx_rules_enabled ON classification_rules(enabled);
`);

// ============= 数据库迁移 =============

/**
 * 检查并添加缺失的列（数据库迁移）
 */
function migrateDatabase() {
	// 迁移 announcements 表
	const announcementsTableInfo = db.prepare("PRAGMA table_info(announcements)").all() as Array<{ name: string }>;
	const announcementsColumns = new Set(announcementsTableInfo.map((col) => col.name));

	const announcementsRequiredColumns = [
		{ name: "name", type: "TEXT" },
		{ name: "url", type: "TEXT" },
		{ name: "rec_time", type: "TEXT" },
	];

	for (const column of announcementsRequiredColumns) {
		if (!announcementsColumns.has(column.name)) {
			log.info("DB", `添加 announcements.${column.name} 列`);
			try {
				db.exec(`ALTER TABLE announcements ADD COLUMN ${column.name} ${column.type}`);
				log.info("DB", `announcements.${column.name} 列添加成功`);
			} catch (error) {
				log.error("DB", `添加 announcements.${column.name} 列失败:`, error);
			}
		}
	}

	// 迁移 stocks 表，添加 is_favorite 字段
	const stocksTableInfo = db.prepare("PRAGMA table_info(stocks)").all() as Array<{ name: string }>;
	const stocksColumns = new Set(stocksTableInfo.map((col) => col.name));

	if (!stocksColumns.has("is_favorite")) {
		log.info("DB", "添加 stocks.is_favorite 列");
		try {
			db.exec("ALTER TABLE stocks ADD COLUMN is_favorite INTEGER DEFAULT 0");
			log.info("DB", "stocks.is_favorite 列添加成功");

			// 创建索引
			db.exec("CREATE INDEX IF NOT EXISTS idx_stock_is_favorite ON stocks (is_favorite)");
			log.info("DB", "stocks.is_favorite 索引创建成功");
		} catch (error) {
			log.error("DB", "添加 stocks.is_favorite 列失败:", error);
		}
	}

	// 迁移 announcements 表，添加 category 字段
	if (!announcementsColumns.has("category")) {
		log.info("DB", "添加 announcements.category 列");
		try {
			db.exec("ALTER TABLE announcements ADD COLUMN category TEXT DEFAULT NULL");
			log.info("DB", "announcements.category 列添加成功");

			// 添加索引以提升查询性能
			db.exec("CREATE INDEX IF NOT EXISTS idx_ann_category ON announcements (category)");
			log.info("DB", "announcements.category 索引创建成功");
		} catch (error) {
			log.error("DB", "添加 announcements.category 列失败:", error);
		}
	}

	// 初始化分类规则（如果数据库中没有规则）
	initializeDefaultClassificationRules();
}

/**
 * 初始化默认分类规则
 */
function initializeDefaultClassificationRules() {
	try {
		// 检查是否已有分类数据
		const categoryCount = db.prepare("SELECT COUNT(*) as count FROM classification_categories").get() as { count: number };

		if (categoryCount.count > 0) {
			console.log("[DB Migration] 分类规则已存在，跳过初始化");
			return;
		}

		console.log("[DB Migration] 开始初始化默认分类规则");
		const now = new Date().toISOString();

		// 插入分类定义
		const insertCategory = db.prepare(`
			INSERT INTO classification_categories (category_key, category_name, color, icon, priority, enabled, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, 1, ?, ?)
		`);

		// 插入规则
		const insertRule = db.prepare(`
			INSERT INTO classification_rules (category_key, keyword, enabled, created_at, updated_at)
			VALUES (?, ?, 1, ?, ?)
		`);

		const insertAll = db.transaction(() => {
			// 遍历所有默认规则
			for (const rule of DEFAULT_CLASSIFICATION_RULES) {
				const categoryKey = rule.category;
				const categoryName = rule.category;
				const color = getCategoryColor(rule.category as AnnouncementCategory);
				const icon = getCategoryIcon(rule.category as AnnouncementCategory);
				const priority = rule.priority;

				// 插入分类
				insertCategory.run(categoryKey, categoryName, color, icon, priority, now, now);

				// 插入该分类的所有关键词
				for (const keyword of rule.keywords) {
					insertRule.run(categoryKey, keyword, now, now);
				}
			}
		});

		insertAll();
		console.log("[DB Migration] 默认分类规则初始化完成");
	} catch (error) {
		console.error("[DB Migration Error] 初始化分类规则失败:", error);
	}
}

// 执行数据库迁移
migrateDatabase();

// ============= 同步标志位相关操作 =============

/**
 * 获取上次同步日期
 */
export const getLastSyncDate = (syncType: string): string | null => {
	const row = db.prepare("SELECT last_sync_date FROM sync_flags WHERE sync_type = ?").get(syncType) as
		| {
				last_sync_date: string;
		  }
		| undefined;
	return row?.last_sync_date || null;
};

/**
 * 更新同步标志位
 */
export const updateSyncFlag = (syncType: string, syncDate: string) => {
	const now = new Date().toISOString();
	db.prepare(
		`
    INSERT INTO sync_flags (sync_type, last_sync_date, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(sync_type) DO UPDATE SET
      last_sync_date = excluded.last_sync_date,
      updated_at = excluded.updated_at
  `
	).run(syncType, syncDate, now);
};

/**
 * 检查今天是否已同步
 */
export const isSyncedToday = (syncType: string): boolean => {
	const lastSync = getLastSyncDate(syncType);
	if (!lastSync) return false;

	const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	return lastSync === today;
};

// ============= 数据库配置和工具 =============

// 开启 WAL 模式以提高并发性能
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("cache_size = -64000"); // 64MB cache
db.pragma("temp_store = MEMORY");

// 性能分析工具（开发环境使用）
export const analyzeQuery = (sql: string, params: any[] = []) => {
	const plan = db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(...params);
	console.log("Query Plan:", JSON.stringify(plan, null, 2));
	return plan;
};

// ============= 数据库重置相关操作 =============

/**
 * 关闭数据库连接
 */
export const closeDatabase = () => {
	try {
		db.close();
		console.log("[DB] 数据库连接已关闭");
		return true;
	} catch (error) {
		console.error("[DB Error] 关闭数据库连接失败:", error);
		return false;
	}
};

export default db;
