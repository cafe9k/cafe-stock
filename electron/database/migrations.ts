/**
 * 数据库迁移模块
 * 负责数据库表结构创建和迁移
 */

import Database from "better-sqlite3";
import { AnnouncementCategory, getCategoryColor, getCategoryIcon, DEFAULT_CLASSIFICATION_RULES } from "../utils/announcementClassifier.js";
import { log } from "../utils/logger.js";

/**
 * 创建所有数据库表
 */
export function createTables(db: Database.Database): void {
	log.info("DB", "开始创建数据库表...");

	try {
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

		log.info("DB", "数据库表创建完成");
	} catch (error) {
		log.error("DB", "创建数据库表失败:", error);
		throw error;
	}
}

/**
 * 执行数据库迁移
 */
export function migrateDatabase(db: Database.Database): void {
	log.info("DB", "开始数据库迁移...");

	try {
		// 迁移 announcements 表
		migrateAnnouncementsTable(db);

		// 迁移 stocks 表
		migrateStocksTable(db);

		// 初始化分类规则
		initializeDefaultClassificationRules(db);

		log.info("DB", "数据库迁移完成");
	} catch (error) {
		log.error("DB", "数据库迁移失败:", error);
		throw error;
	}
}

/**
 * 迁移 announcements 表
 */
function migrateAnnouncementsTable(db: Database.Database): void {
	const tableInfo = db.prepare("PRAGMA table_info(announcements)").all() as Array<{ name: string }>;
	const columns = new Set(tableInfo.map((col) => col.name));

	const requiredColumns = [
		{ name: "name", type: "TEXT" },
		{ name: "url", type: "TEXT" },
		{ name: "rec_time", type: "TEXT" },
		{ name: "category", type: "TEXT DEFAULT NULL" },
	];

	for (const column of requiredColumns) {
		if (!columns.has(column.name)) {
			log.info("DB", `添加 announcements.${column.name} 列`);
			try {
				db.exec(`ALTER TABLE announcements ADD COLUMN ${column.name} ${column.type}`);
				log.info("DB", `announcements.${column.name} 列添加成功`);

				// 为 category 字段添加索引
				if (column.name === "category") {
					db.exec("CREATE INDEX IF NOT EXISTS idx_ann_category ON announcements (category)");
					log.info("DB", "announcements.category 索引创建成功");
				}
			} catch (error) {
				log.error("DB", `添加 announcements.${column.name} 列失败:`, error);
			}
		}
	}
}

/**
 * 迁移 stocks 表
 */
function migrateStocksTable(db: Database.Database): void {
	const tableInfo = db.prepare("PRAGMA table_info(stocks)").all() as Array<{ name: string }>;
	const columns = new Set(tableInfo.map((col) => col.name));

	if (!columns.has("is_favorite")) {
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
}

/**
 * 初始化默认分类规则
 */
function initializeDefaultClassificationRules(db: Database.Database): void {
	try {
		// 检查是否已有分类数据
		const categoryCount = db.prepare("SELECT COUNT(*) as count FROM classification_categories").get() as { count: number };

		if (categoryCount.count > 0) {
			log.debug("DB", "分类规则已存在，跳过初始化");
			return;
		}

		log.info("DB", "开始初始化默认分类规则");
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
		log.info("DB", "默认分类规则初始化完成");
	} catch (error) {
		log.error("DB", "初始化分类规则失败:", error);
	}
}

