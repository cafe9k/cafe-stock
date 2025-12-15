import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

const dbPath = path.join(app.getPath("userData"), "cafe_stock.db");
const db = new Database(dbPath);

// 导出数据库路径，供外部访问
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
`);

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
 * 获取股票列表同步信息（股票数量和最近同步时间）
 */
export const getStockListSyncInfo = () => {
	const stockCount = countStocks();
	// 获取最近更新的时间
	const row = db.prepare("SELECT MAX(updated_at) as last_sync_time FROM stocks").get() as { last_sync_time: string | null };
	return {
		stockCount,
		lastSyncTime: row?.last_sync_time || null,
	};
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

// ============= 十大股东数据相关操作 =============

/**
 * 批量插入或更新十大股东数据
 */
export const upsertTop10Holders = (items: any[]) => {
	const now = new Date().toISOString();
	const upsert = db.prepare(`
    INSERT INTO top10_holders (
      ts_code, ann_date, end_date, holder_name, hold_amount, hold_ratio, updated_at
    )
    VALUES (
      @ts_code, @ann_date, @end_date, @holder_name, @hold_amount, @hold_ratio, @updated_at
    )
    ON CONFLICT(ts_code, end_date, holder_name) DO UPDATE SET
      ann_date = excluded.ann_date,
      hold_amount = excluded.hold_amount,
      hold_ratio = excluded.hold_ratio,
      updated_at = excluded.updated_at
  `);

	const upsertMany = db.transaction((holders) => {
		for (const holder of holders) {
			upsert.run({
				ts_code: holder.ts_code || null,
				ann_date: holder.ann_date || null,
				end_date: holder.end_date || null,
				holder_name: holder.holder_name || null,
				hold_amount: holder.hold_amount || null,
				hold_ratio: holder.hold_ratio || null,
				updated_at: now,
			});
		}
	});

	upsertMany(items);
};

/**
 * 获取指定股票的十大股东数据
 */
export const getTop10HoldersByStock = (tsCode: string, limit: number = 100) => {
	return db
		.prepare(
			`
    SELECT * FROM top10_holders 
    WHERE ts_code = ?
    ORDER BY end_date DESC, hold_ratio DESC
    LIMIT ?
  `
		)
		.all(tsCode, limit);
};

/**
 * 获取股票的所有报告期列表
 */
export const getTop10HoldersEndDates = (tsCode: string): string[] => {
	const rows = db
		.prepare(
			`
    SELECT DISTINCT end_date 
    FROM top10_holders 
    WHERE ts_code = ?
    ORDER BY end_date DESC
  `
		)
		.all(tsCode) as Array<{ end_date: string }>;
	return rows.map((row) => row.end_date);
};

/**
 * 根据报告期获取十大股东
 */
export const getTop10HoldersByStockAndEndDate = (tsCode: string, endDate: string) => {
	return db
		.prepare(
			`
    SELECT * FROM top10_holders 
    WHERE ts_code = ? AND end_date = ?
    ORDER BY hold_ratio DESC
  `
		)
		.all(tsCode, endDate);
};

/**
 * 检查股票是否已有十大股东数据
 */
export const hasTop10HoldersData = (tsCode: string): boolean => {
	const row = db.prepare("SELECT COUNT(*) as count FROM top10_holders WHERE ts_code = ?").get(tsCode) as { count: number };
	return row.count > 0;
};

/**
 * 获取所有已同步十大股东的股票代码列表
 */
export const getStocksWithTop10Holders = (): string[] => {
	const rows = db.prepare("SELECT DISTINCT ts_code FROM top10_holders ORDER BY ts_code").all() as Array<{ ts_code: string }>;
	return rows.map((row) => row.ts_code);
};

/**
 * 统计已同步十大股东的股票数量
 */
export const countStocksWithTop10Holders = (): number => {
	const row = db.prepare("SELECT COUNT(DISTINCT ts_code) as count FROM top10_holders").get() as { count: number };
	return row.count;
};

/**
 * 根据股东名称搜索股东持股信息
 */
export const searchHoldersByName = (holderName: string, limit: number = 100) => {
	const likePattern = `%${holderName}%`;
	return db
		.prepare(
			`
    SELECT h.*, s.name as stock_name, s.industry, s.market
    FROM top10_holders h
    INNER JOIN stocks s ON h.ts_code = s.ts_code
    WHERE h.holder_name LIKE ?
    ORDER BY h.end_date DESC, h.hold_ratio DESC
    LIMIT ?
  `
		)
		.all(likePattern, limit);
};

/**
 * 获取股东持有的所有股票
 */
export const getStocksByHolder = (holderName: string) => {
	return db
		.prepare(
			`
    SELECT DISTINCT h.ts_code, s.name as stock_name, s.industry, s.market,
           MAX(h.end_date) as latest_end_date,
           MAX(h.hold_ratio) as latest_hold_ratio
    FROM top10_holders h
    INNER JOIN stocks s ON h.ts_code = s.ts_code
    WHERE h.holder_name = ?
    GROUP BY h.ts_code, s.name, s.industry, s.market
    ORDER BY latest_end_date DESC, latest_hold_ratio DESC
  `
		)
		.all(holderName);
};

/**
 * 删除指定股票的十大股东数据（用于重新同步）
 */
export const deleteTop10HoldersByStock = (tsCode: string) => {
	const result = db.prepare("DELETE FROM top10_holders WHERE ts_code = ?").run(tsCode);
	return result.changes;
};

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

// ============= 缓存数据统计相关操作 =============

/**
 * 获取所有缓存数据的统计信息
 */
export const getCacheDataStats = () => {
	const stockCount = countStocks();
	const favoriteCount = countFavoriteStocks();
	const top10HoldersCount = countStocksWithTop10Holders();
	
	// 统计十大股东记录总数
	const top10HoldersRecordRow = db.prepare("SELECT COUNT(*) as count FROM top10_holders").get() as { count: number };
	const top10HoldersRecordCount = top10HoldersRecordRow.count;

	// 获取股票列表同步信息
	const stockSyncInfo = getStockListSyncInfo();

	// 获取同步标志位信息
	const syncFlags = db.prepare("SELECT sync_type, last_sync_date, updated_at FROM sync_flags ORDER BY sync_type").all() as Array<{
		sync_type: string;
		last_sync_date: string;
		updated_at: string;
	}>;

	return {
		stocks: {
			count: stockCount,
			lastSyncTime: stockSyncInfo.lastSyncTime,
		},
		favoriteStocks: {
			count: favoriteCount,
		},
		top10Holders: {
			stockCount: top10HoldersCount,
			recordCount: top10HoldersRecordCount,
		},
		syncFlags: syncFlags.map((flag) => ({
			type: flag.sync_type,
			lastSyncDate: flag.last_sync_date,
			updatedAt: flag.updated_at,
		})),
	};
};

export default db;
