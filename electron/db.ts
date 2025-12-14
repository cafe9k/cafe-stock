import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

const dbPath = path.join(app.getPath("userData"), "cafe_stock.db");
const db = new Database(dbPath);

// 运行数据库迁移
function runMigrations() {
	// 检查 announcements 表是否有 file_path 列
	const tableInfo = db.pragma("table_info(announcements)") as Array<{ name: string }>;
	const hasFilePath = tableInfo.some((col) => col.name === "file_path");

	if (!hasFilePath) {
		console.log("Running migration: Adding file_path column to announcements table");
		db.exec("ALTER TABLE announcements ADD COLUMN file_path TEXT");
		console.log("Migration completed: file_path column added");
	}
}

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL,
    ann_date TEXT NOT NULL,
    ann_type TEXT,
    title TEXT,
    content TEXT,
    pub_time TEXT,
    file_path TEXT,
    UNIQUE(ts_code, ann_date, title)
  );

  CREATE INDEX IF NOT EXISTS idx_ann_date_pub_time ON announcements (ann_date DESC, pub_time DESC);
  CREATE INDEX IF NOT EXISTS idx_ann_ts_code ON announcements (ts_code);

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

  CREATE TABLE IF NOT EXISTS sync_flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_type TEXT NOT NULL UNIQUE,
    last_sync_date TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS favorite_stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_favorite_ts_code ON favorite_stocks (ts_code);
`);

// 运行迁移
runMigrations();

export const insertAnnouncements = (items: any[]) => {
	const insert = db.prepare(`
    INSERT OR IGNORE INTO announcements (ts_code, ann_date, ann_type, title, content, pub_time, file_path)
    VALUES (@ts_code, @ann_date, @ann_type, @title, @content, @pub_time, @file_path)
  `);

	const insertMany = db.transaction((announcements) => {
		for (const ann of announcements) {
			insert.run({
				ts_code: ann.ts_code || null,
				ann_date: ann.ann_date || null,
				ann_type: ann.ann_type || null,
				title: ann.title || null,
				content: ann.content || null,
				pub_time: ann.pub_time || null,
				file_path: ann.file_path || null,
			});
		}
	});

	insertMany(items);
};

export const getLatestAnnDate = () => {
	const row = db.prepare("SELECT MAX(ann_date) as max_date FROM announcements").get() as { max_date: string };
	return row?.max_date || null;
};

export const getOldestAnnDate = () => {
	const row = db.prepare("SELECT MIN(ann_date) as min_date FROM announcements").get() as { min_date: string };
	return row?.min_date || null;
};

export const hasDataInDateRange = (startDate: string, endDate: string) => {
	const row = db
		.prepare(
			`
    SELECT COUNT(*) as count FROM announcements 
    WHERE ann_date >= ? AND ann_date <= ?
  `
		)
		.get(startDate, endDate) as { count: number };
	return row.count > 0;
};

export const getAnnouncements = (limit: number, offset: number) => {
	return db
		.prepare(
			`
    SELECT * FROM announcements 
    ORDER BY ann_date DESC, pub_time DESC 
    LIMIT ? OFFSET ?
  `
		)
		.all(limit, offset);
};

export const countAnnouncements = () => {
	const row = db.prepare("SELECT COUNT(*) as count FROM announcements").get() as { count: number };
	return row.count;
};

/**
 * 获取按股票聚合的公告数据（分页）
 */
export const getAnnouncementsGroupedByStock = (limit: number, offset: number, startDate?: string, endDate?: string, market?: string) => {
	let sql = `
    SELECT
      s.ts_code,
      s.name as stock_name,
      s.industry,
      s.market,
      COUNT(a.id) as announcement_count,
      MAX(a.ann_date) as latest_ann_date,
      (
        SELECT title
        FROM announcements a2
        WHERE a2.ts_code = s.ts_code
        ${startDate && endDate ? `AND a2.ann_date BETWEEN '${startDate}' AND '${endDate}'` : ""}
        ORDER BY a2.ann_date DESC, a2.pub_time DESC
        LIMIT 1
      ) as latest_ann_title
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
  `;

	const params: any[] = [];
	const conditions: string[] = [];

	// 添加日期范围条件
	if (startDate && endDate) {
		conditions.push(`a.ann_date BETWEEN ? AND ?`);
		params.push(startDate, endDate);
	}

	// 添加市场条件
	if (market && market !== "all") {
		conditions.push(`s.market = ?`);
		params.push(market);
	}

	// 组合 WHERE 条件
	if (conditions.length > 0) {
		sql += ` WHERE ` + conditions.join(" AND ");
	}

	sql += `
    GROUP BY s.ts_code, s.name, s.industry, s.market
    ORDER BY MAX(a.ann_date) DESC, s.name
    LIMIT ? OFFSET ?
  `;

	params.push(limit, offset);

	return db.prepare(sql).all(...params);
};

/**
 * 获取特定股票的公告列表
 */
export const getAnnouncementsByStock = (tsCode: string, limit: number = 100) => {
	return db
		.prepare(
			`
    SELECT * FROM announcements 
    WHERE ts_code = ?
    ORDER BY ann_date DESC, pub_time DESC
    LIMIT ?
  `
		)
		.all(tsCode, limit);
};

/**
 * 统计有公告的股票数量
 */
export const countStocksWithAnnouncements = (startDate?: string, endDate?: string, market?: string) => {
	let sql = `
    SELECT COUNT(DISTINCT s.ts_code) as count
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
  `;

	const params: any[] = [];
	const conditions: string[] = [];

	// 添加日期范围条件
	if (startDate && endDate) {
		conditions.push(`a.ann_date BETWEEN ? AND ?`);
		params.push(startDate, endDate);
	}

	// 添加市场条件
	if (market && market !== "all") {
		conditions.push(`s.market = ?`);
		params.push(market);
	}

	// 组合 WHERE 条件
	if (conditions.length > 0) {
		sql += ` WHERE ` + conditions.join(" AND ");
	}

	const row = db.prepare(sql).get(...params) as { count: number };
	return row.count;
};

/**
 * 搜索按股票聚合的公告数据（支持股票名称、代码搜索）
 */
export const searchAnnouncementsGroupedByStock = (
	keyword: string,
	limit: number,
	offset: number,
	startDate?: string,
	endDate?: string,
	market?: string
) => {
	const likePattern = `%${keyword}%`;
	let sql = `
    SELECT
      s.ts_code,
      s.name as stock_name,
      s.industry,
      s.market,
      COUNT(a.id) as announcement_count,
      MAX(a.ann_date) as latest_ann_date,
      (
        SELECT title
        FROM announcements a2
        WHERE a2.ts_code = s.ts_code
        ${startDate && endDate ? `AND a2.ann_date BETWEEN '${startDate}' AND '${endDate}'` : ""}
        ORDER BY a2.ann_date DESC, a2.pub_time DESC
        LIMIT 1
      ) as latest_ann_title
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
    WHERE (s.name LIKE ? OR s.ts_code LIKE ? OR s.symbol LIKE ?)
  `;

	const params: any[] = [likePattern, likePattern, likePattern];

	// 添加日期范围条件
	if (startDate && endDate) {
		sql += ` AND a.ann_date BETWEEN ? AND ?`;
		params.push(startDate, endDate);
	}

	// 添加市场条件
	if (market && market !== "all") {
		sql += ` AND s.market = ?`;
		params.push(market);
	}

	sql += `
    GROUP BY s.ts_code, s.name, s.industry, s.market
    ORDER BY MAX(a.ann_date) DESC, s.name
    LIMIT ? OFFSET ?
  `;

	params.push(limit, offset);

	return db.prepare(sql).all(...params);
};

/**
 * 统计符合搜索条件且有公告的股票数量
 */
export const countSearchedStocksWithAnnouncements = (keyword: string, startDate?: string, endDate?: string, market?: string) => {
	const likePattern = `%${keyword}%`;
	let sql = `
    SELECT COUNT(DISTINCT s.ts_code) as count
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
    WHERE (s.name LIKE ? OR s.ts_code LIKE ? OR s.symbol LIKE ?)
  `;

	const params: any[] = [likePattern, likePattern, likePattern];

	// 添加日期范围条件
	if (startDate && endDate) {
		sql += ` AND a.ann_date BETWEEN ? AND ?`;
		params.push(startDate, endDate);
	}

	// 添加市场条件
	if (market && market !== "all") {
		sql += ` AND s.market = ?`;
		params.push(market);
	}

	const row = db.prepare(sql).get(...params) as { count: number };
	return row.count;
};

// ============= 股票数据相关操作 =============

/**
 * 批量插入或更新股票数据
 */
export const upsertStocks = (items: any[]) => {
	const now = new Date().toISOString();
	const upsert = db.prepare(`
    INSERT INTO stocks (
      ts_code, symbol, name, area, industry, fullname, enname, cnspell,
      market, exchange, curr_type, list_status, list_date, delist_date, is_hs, updated_at
    )
    VALUES (
      @ts_code, @symbol, @name, @area, @industry, @fullname, @enname, @cnspell,
      @market, @exchange, @curr_type, @list_status, @list_date, @delist_date, @is_hs, @updated_at
    )
    ON CONFLICT(ts_code) DO UPDATE SET
      symbol = excluded.symbol,
      name = excluded.name,
      area = excluded.area,
      industry = excluded.industry,
      fullname = excluded.fullname,
      enname = excluded.enname,
      cnspell = excluded.cnspell,
      market = excluded.market,
      exchange = excluded.exchange,
      curr_type = excluded.curr_type,
      list_status = excluded.list_status,
      list_date = excluded.list_date,
      delist_date = excluded.delist_date,
      is_hs = excluded.is_hs,
      updated_at = excluded.updated_at
  `);

	const upsertMany = db.transaction((stocks) => {
		for (const stock of stocks) {
			upsert.run({
				ts_code: stock.ts_code || null,
				symbol: stock.symbol || null,
				name: stock.name || null,
				area: stock.area || null,
				industry: stock.industry || null,
				fullname: stock.fullname || null,
				enname: stock.enname || null,
				cnspell: stock.cnspell || null,
				market: stock.market || null,
				exchange: stock.exchange || null,
				curr_type: stock.curr_type || null,
				list_status: stock.list_status || null,
				list_date: stock.list_date || null,
				delist_date: stock.delist_date || null,
				is_hs: stock.is_hs || null,
				updated_at: now,
			});
		}
	});

	upsertMany(items);
};

/**
 * 获取所有股票列表
 */
export const getAllStocks = () => {
	return db.prepare("SELECT * FROM stocks ORDER BY ts_code").all();
};

/**
 * 统计股票数量
 */
export const countStocks = () => {
	const row = db.prepare("SELECT COUNT(*) as count FROM stocks").get() as { count: number };
	return row.count;
};

/**
 * 根据关键词搜索股票（名称、代码、拼音）
 */
export const searchStocks = (keyword: string, limit: number = 50) => {
	const likePattern = `%${keyword}%`;
	return db
		.prepare(
			`
    SELECT * FROM stocks 
    WHERE name LIKE ? OR ts_code LIKE ? OR symbol LIKE ? OR cnspell LIKE ?
    ORDER BY 
      CASE 
        WHEN ts_code = ? THEN 1
        WHEN symbol = ? THEN 2
        WHEN name = ? THEN 3
        ELSE 4
      END,
      ts_code
    LIMIT ?
  `
		)
		.all(likePattern, likePattern, likePattern, likePattern, keyword, keyword, keyword, limit);
};

// ============= 同步标志位相关操作 =============

/**
 * 获取上次同步日期
 */
export const getLastSyncDate = (syncType: string): string | null => {
	const row = db.prepare("SELECT last_sync_date FROM sync_flags WHERE sync_type = ?").get(syncType) as { last_sync_date: string } | undefined;
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

// ============= 关注股票相关操作 =============

/**
 * 添加关注股票
 */
export const addFavoriteStock = (tsCode: string) => {
	const now = new Date().toISOString();
	try {
		db.prepare(
			`
      INSERT INTO favorite_stocks (ts_code, created_at)
      VALUES (?, ?)
    `
		).run(tsCode, now);
		return true;
	} catch (error: any) {
		// 如果是重复插入，返回 false
		if (error.code === "SQLITE_CONSTRAINT") {
			return false;
		}
		throw error;
	}
};

/**
 * 删除关注股票
 */
export const removeFavoriteStock = (tsCode: string) => {
	const result = db.prepare("DELETE FROM favorite_stocks WHERE ts_code = ?").run(tsCode);
	return result.changes > 0;
};

/**
 * 检查股票是否已关注
 */
export const isFavoriteStock = (tsCode: string): boolean => {
	const row = db.prepare("SELECT COUNT(*) as count FROM favorite_stocks WHERE ts_code = ?").get(tsCode) as { count: number };
	return row.count > 0;
};

/**
 * 获取所有关注的股票代码
 */
export const getAllFavoriteStocks = (): string[] => {
	const rows = db.prepare("SELECT ts_code FROM favorite_stocks ORDER BY created_at DESC").all() as Array<{ ts_code: string }>;
	return rows.map((row) => row.ts_code);
};

/**
 * 统计关注股票数量
 */
export const countFavoriteStocks = (): number => {
	const row = db.prepare("SELECT COUNT(*) as count FROM favorite_stocks").get() as { count: number };
	return row.count;
};

/**
 * 获取关注股票的公告聚合数据（分页）
 */
export const getFavoriteStocksAnnouncementsGrouped = (limit: number, offset: number, startDate?: string, endDate?: string) => {
	let sql = `
    SELECT
      s.ts_code,
      s.name as stock_name,
      s.industry,
      s.market,
      COUNT(a.id) as announcement_count,
      MAX(a.ann_date) as latest_ann_date,
      (
        SELECT title
        FROM announcements a2
        WHERE a2.ts_code = s.ts_code
        ${startDate && endDate ? `AND a2.ann_date BETWEEN '${startDate}' AND '${endDate}'` : ""}
        ORDER BY a2.ann_date DESC, a2.pub_time DESC
        LIMIT 1
      ) as latest_ann_title
    FROM stocks s
    INNER JOIN favorite_stocks f ON s.ts_code = f.ts_code
    INNER JOIN announcements a ON s.ts_code = a.ts_code
  `;

	const params: any[] = [];

	// 添加日期范围条件
	if (startDate && endDate) {
		sql += ` WHERE a.ann_date BETWEEN ? AND ?`;
		params.push(startDate, endDate);
	}

	sql += `
    GROUP BY s.ts_code, s.name, s.industry, s.market
    ORDER BY MAX(a.ann_date) DESC, s.name
    LIMIT ? OFFSET ?
  `;

	params.push(limit, offset);

	return db.prepare(sql).all(...params);
};

/**
 * 统计关注股票中有公告的数量
 */
export const countFavoriteStocksWithAnnouncements = (startDate?: string, endDate?: string): number => {
	let sql = `
    SELECT COUNT(DISTINCT s.ts_code) as count
    FROM stocks s
    INNER JOIN favorite_stocks f ON s.ts_code = f.ts_code
    INNER JOIN announcements a ON s.ts_code = a.ts_code
  `;

	const params: any[] = [];

	// 添加日期范围条件
	if (startDate && endDate) {
		sql += ` WHERE a.ann_date BETWEEN ? AND ?`;
		params.push(startDate, endDate);
	}

	const row = db.prepare(sql).get(...params) as { count: number };
	return row.count;
};

export default db;
