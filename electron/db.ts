import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import { classifyAnnouncement } from "../src/utils/announcementClassifier.js";

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
			console.log(`[DB Migration] 添加 announcements.${column.name} 列`);
			try {
				db.exec(`ALTER TABLE announcements ADD COLUMN ${column.name} ${column.type}`);
				console.log(`[DB Migration] announcements.${column.name} 列添加成功`);
			} catch (error) {
				console.error(`[DB Migration Error] 添加 announcements.${column.name} 列失败:`, error);
			}
		}
	}

	// 迁移 stocks 表，添加 is_favorite 字段
	const stocksTableInfo = db.prepare("PRAGMA table_info(stocks)").all() as Array<{ name: string }>;
	const stocksColumns = new Set(stocksTableInfo.map((col) => col.name));

	if (!stocksColumns.has("is_favorite")) {
		console.log("[DB Migration] 添加 stocks.is_favorite 列");
		try {
			db.exec("ALTER TABLE stocks ADD COLUMN is_favorite INTEGER DEFAULT 0");
			console.log("[DB Migration] stocks.is_favorite 列添加成功");
			
			// 创建索引
			db.exec("CREATE INDEX IF NOT EXISTS idx_stock_is_favorite ON stocks (is_favorite)");
			console.log("[DB Migration] stocks.is_favorite 索引创建成功");
		} catch (error) {
			console.error("[DB Migration Error] 添加 stocks.is_favorite 列失败:", error);
		}
	}

	// 迁移 announcements 表，添加 category 字段
	if (!announcementsColumns.has("category")) {
		console.log("[DB Migration] 添加 announcements.category 列");
		try {
			db.exec("ALTER TABLE announcements ADD COLUMN category TEXT DEFAULT NULL");
			console.log("[DB Migration] announcements.category 列添加成功");
			
			// 添加索引以提升查询性能
			db.exec("CREATE INDEX IF NOT EXISTS idx_ann_category ON announcements (category)");
			console.log("[DB Migration] announcements.category 索引创建成功");
		} catch (error) {
			console.error("[DB Migration Error] 添加 announcements.category 列失败:", error);
		}
	}
}

// 执行数据库迁移
migrateDatabase();

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

// ============= 关注股票相关操作 =============

/**
 * 添加关注股票
 */
export const addFavoriteStock = (tsCode: string): boolean => {
	try {
		// 使用 stocks 表的 is_favorite 字段
		const stmt = db.prepare("UPDATE stocks SET is_favorite = 1 WHERE ts_code = ?");
		const result = stmt.run(tsCode);
		return result.changes > 0;
	} catch (error) {
		console.error("Failed to add favorite stock:", error);
		return false;
	}
};

/**
 * 取消关注股票
 */
export const removeFavoriteStock = (tsCode: string): boolean => {
	try {
		const stmt = db.prepare("UPDATE stocks SET is_favorite = 0 WHERE ts_code = ?");
		const result = stmt.run(tsCode);
		return result.changes > 0;
	} catch (error) {
		console.error("Failed to remove favorite stock:", error);
		return false;
	}
};

/**
 * 检查股票是否已关注
 */
export const isFavoriteStock = (tsCode: string): boolean => {
	try {
		const stmt = db.prepare("SELECT is_favorite FROM stocks WHERE ts_code = ?");
		const result: any = stmt.get(tsCode);
		return result?.is_favorite === 1;
	} catch (error) {
		console.error("Failed to check favorite stock:", error);
		return false;
	}
};

/**
 * 获取所有关注的股票代码
 */
export const getAllFavoriteStocks = (): string[] => {
	try {
		const stmt = db.prepare("SELECT ts_code FROM stocks WHERE is_favorite = 1 ORDER BY ts_code");
		const results: any[] = stmt.all();
		return results.map((r) => r.ts_code);
	} catch (error) {
		console.error("Failed to get all favorite stocks:", error);
		return [];
	}
};

/**
 * 统计关注的股票数量
 */
export const countFavoriteStocks = (): number => {
	try {
		const stmt = db.prepare("SELECT COUNT(*) as count FROM stocks WHERE is_favorite = 1");
		const result: any = stmt.get();
		return result?.count || 0;
	} catch (error) {
		console.error("Failed to count favorite stocks:", error);
		return 0;
	}
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

// ============= 公告数据相关操作 =============

/**
 * 批量插入或更新公告数据
 */
export const upsertAnnouncements = (items: any[]) => {
	const upsert = db.prepare(`
    INSERT INTO announcements (
      ts_code, ann_date, ann_type, title, content, pub_time, file_path, name, category
    )
    VALUES (
      @ts_code, @ann_date, @ann_type, @title, @content, @pub_time, @file_path, @name, @category
    )
    ON CONFLICT(ts_code, ann_date, title) DO UPDATE SET
      ann_type = excluded.ann_type,
      content = excluded.content,
      pub_time = excluded.pub_time,
      file_path = excluded.file_path,
      name = excluded.name,
      category = COALESCE(announcements.category, excluded.category)
  `);

	const upsertMany = db.transaction((announcements) => {
		for (const ann of announcements) {
			// 自动分类新公告
			const category = ann.category || classifyAnnouncement(ann.title || "");

			upsert.run({
				ts_code: ann.ts_code || null,
				ann_date: ann.ann_date || null,
				ann_type: ann.ann_type || null,
				title: ann.title || null,
				content: ann.content || null,
				pub_time: ann.pub_time || null,
				file_path: ann.file_path || null,
				name: ann.name || null,
				category: category,
			});
		}
	});

	upsertMany(items);
};

/**
 * 检查时间范围是否已同步
 * @param tsCode 股票代码（可选，null 表示全市场）
 * @param startDate 开始日期 YYYYMMDD
 * @param endDate 结束日期 YYYYMMDD
 * @returns 是否完全覆盖
 */
export const isAnnouncementRangeSynced = (tsCode: string | null, startDate: string, endDate: string): boolean => {
	// 查找所有可能覆盖该范围的同步记录
	let query: string;
	let params: any[];

	if (tsCode) {
		query = `
      SELECT start_date, end_date 
      FROM announcement_sync_ranges 
      WHERE ts_code = ?
        AND start_date <= ?
        AND end_date >= ?
      ORDER BY start_date
    `;
		params = [tsCode, endDate, startDate];
	} else {
		query = `
      SELECT start_date, end_date 
      FROM announcement_sync_ranges 
      WHERE ts_code IS NULL
        AND start_date <= ?
        AND end_date >= ?
      ORDER BY start_date
    `;
		params = [endDate, startDate];
	}

	const ranges = db.prepare(query).all(...params) as Array<{ start_date: string; end_date: string }>;

	if (ranges.length === 0) {
		return false;
	}

	// 检查是否有完全覆盖的范围
	for (const range of ranges) {
		if (range.start_date <= startDate && range.end_date >= endDate) {
			return true;
		}
	}

	return false;
};

/**
 * 获取需要同步的时间段（排除已同步的部分）
 * @param tsCode 股票代码（可选）
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 需要同步的时间段数组
 */
export const getUnsyncedAnnouncementRanges = (
	tsCode: string | null,
	startDate: string,
	endDate: string
): Array<{ start_date: string; end_date: string }> => {
	// 获取所有相关的已同步范围
	let query: string;
	let params: any[];

	if (tsCode) {
		query = `
      SELECT start_date, end_date 
      FROM announcement_sync_ranges 
      WHERE ts_code = ?
        AND NOT (end_date < ? OR start_date > ?)
      ORDER BY start_date
    `;
		params = [tsCode, startDate, endDate];
	} else {
		query = `
      SELECT start_date, end_date 
      FROM announcement_sync_ranges 
      WHERE ts_code IS NULL
        AND NOT (end_date < ? OR start_date > ?)
      ORDER BY start_date
    `;
		params = [startDate, endDate];
	}

	const syncedRanges = db.prepare(query).all(...params) as Array<{ start_date: string; end_date: string }>;

	// 如果没有已同步的范围，返回整个请求范围
	if (syncedRanges.length === 0) {
		return [{ start_date: startDate, end_date: endDate }];
	}

	// 计算未同步的时间段
	const unsyncedRanges: Array<{ start_date: string; end_date: string }> = [];
	let currentStart = startDate;

	for (const range of syncedRanges) {
		// 如果当前起点在已同步范围之前，添加这段空白
		if (currentStart < range.start_date) {
			// 计算前一天的日期
			const gapEnd = getPreviousDay(range.start_date);
			unsyncedRanges.push({
				start_date: currentStart,
				end_date: gapEnd,
			});
		}
		// 更新当前起点到已同步范围的后一天
		currentStart = getNextDay(range.end_date);
	}

	// 检查最后一个已同步范围之后是否还有未同步的部分
	if (currentStart <= endDate) {
		unsyncedRanges.push({
			start_date: currentStart,
			end_date: endDate,
		});
	}

	return unsyncedRanges;
};

/**
 * 记录已同步的时间范围，并自动合并连续范围
 */
export const recordAnnouncementSyncRange = (tsCode: string | null, startDate: string, endDate: string) => {
	const now = new Date().toISOString();

	// 插入新范围
	if (tsCode) {
		db.prepare(`
      INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
      VALUES (?, ?, ?, ?)
    `).run(tsCode, startDate, endDate, now);
	} else {
		db.prepare(`
      INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
      VALUES (NULL, ?, ?, ?)
    `).run(startDate, endDate, now);
	}

	// 合并连续或重叠的范围
	mergeAnnouncementSyncRanges(tsCode);
};

/**
 * 合并连续或重叠的同步范围
 */
const mergeAnnouncementSyncRanges = (tsCode: string | null) => {
	let query: string;
	let params: any[];

	if (tsCode) {
		query = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code = ? ORDER BY start_date";
		params = [tsCode];
	} else {
		query = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code IS NULL ORDER BY start_date";
		params = [];
	}

	const ranges = db.prepare(query).all(...params) as Array<{ id: number; start_date: string; end_date: string }>;

	if (ranges.length <= 1) {
		return;
	}

	const toDelete: number[] = [];
	const toUpdate: Array<{ id: number; start_date: string; end_date: string }> = [];

	let current = ranges[0];

	for (let i = 1; i < ranges.length; i++) {
		const next = ranges[i];

		// 检查是否连续或重叠（包括相邻日期）
		if (getNextDay(current.end_date) >= next.start_date) {
			// 合并范围
			current = {
				id: current.id,
				start_date: current.start_date,
				end_date: next.end_date > current.end_date ? next.end_date : current.end_date,
			};
			toDelete.push(next.id);
		} else {
			// 保存当前合并结果
			if (current.end_date !== ranges.find((r) => r.id === current.id)?.end_date) {
				toUpdate.push(current);
			}
			current = next;
		}
	}

	// 保存最后一个范围的更新
	if (current.end_date !== ranges.find((r) => r.id === current.id)?.end_date) {
		toUpdate.push(current);
	}

	// 执行更新和删除
	const updateStmt = db.prepare("UPDATE announcement_sync_ranges SET end_date = ? WHERE id = ?");
	const deleteStmt = db.prepare("DELETE FROM announcement_sync_ranges WHERE id = ?");

	db.transaction(() => {
		for (const range of toUpdate) {
			updateStmt.run(range.end_date, range.id);
		}
		for (const id of toDelete) {
			deleteStmt.run(id);
		}
	})();
};

/**
 * 获取指定股票的公告列表
 */
export const getAnnouncementsByStock = (tsCode: string, categories?: string[], limit: number = 100) => {
	let query = "SELECT * FROM announcements WHERE ts_code = ?";
	const params: any[] = [tsCode];

	if (categories && categories.length > 0) {
		const placeholders = categories.map(() => "?").join(",");
		query += ` AND category IN (${placeholders})`;
		params.push(...categories);
	}

	query += " ORDER BY ann_date DESC, rec_time DESC LIMIT ?";
	params.push(limit);

	return db.prepare(query).all(...params);
};

/**
 * 根据日期范围获取公告
 */
export const getAnnouncementsByDateRange = (
	startDate: string,
	endDate: string,
	tsCode?: string,
	categories?: string[],
	limit: number = 200
) => {
	let query = "SELECT * FROM announcements WHERE ann_date >= ? AND ann_date <= ?";
	const params: any[] = [startDate, endDate];

	if (tsCode) {
		query += " AND ts_code = ?";
		params.push(tsCode);
	}

	if (categories && categories.length > 0) {
		const placeholders = categories.map(() => "?").join(",");
		query += ` AND category IN (${placeholders})`;
		params.push(...categories);
	}

	query += " ORDER BY ann_date DESC, rec_time DESC LIMIT ?";
	params.push(limit);

	return db.prepare(query).all(...params);
};

/**
 * 搜索公告标题
 */
export const searchAnnouncements = (keyword: string, limit: number = 100) => {
	const likePattern = `%${keyword}%`;
	return db
		.prepare(
			`
    SELECT a.*, s.name as stock_name 
    FROM announcements a
    LEFT JOIN stocks s ON a.ts_code = s.ts_code
    WHERE a.title LIKE ? OR a.ts_code LIKE ? OR s.name LIKE ?
    ORDER BY a.ann_date DESC, a.rec_time DESC
    LIMIT ?
  `
		)
		.all(likePattern, likePattern, likePattern, limit);
};

/**
 * 统计公告数量
 */
export const countAnnouncements = (): number => {
	const row = db.prepare("SELECT COUNT(*) as count FROM announcements").get() as { count: number };
	return row.count;
};

/**
 * 获取未打标的公告数量
 */
export const getUntaggedAnnouncementsCount = (): number => {
	const row = db.prepare("SELECT COUNT(*) as count FROM announcements WHERE category IS NULL").get() as { count: number };
	return row.count;
};

/**
 * 批量打标公告（分批处理）
 * @param batchSize 每批处理的数量
 * @param onProgress 进度回调
 */
export const tagAnnouncementsBatch = (
	batchSize: number = 1000,
	onProgress?: (processed: number, total: number) => void
): { success: boolean; processed: number; total: number } => {
	const total = getUntaggedAnnouncementsCount();
	let processed = 0;

	if (total === 0) {
		return { success: true, processed: 0, total: 0 };
	}

	console.log(`[Tagging] 开始批量打标，共 ${total} 条未打标公告`);

	const updateStmt = db.prepare("UPDATE announcements SET category = ? WHERE id = ?");

	const processBatch = db.transaction(() => {
		while (processed < total) {
			// 查询一批未打标的公告
			const announcements = db
				.prepare(
					`
                SELECT id, title 
                FROM announcements 
                WHERE category IS NULL 
                LIMIT ?
            `
				)
				.all(batchSize) as Array<{ id: number; title: string }>;

			if (announcements.length === 0) break;

			// 批量分类并更新
			for (const ann of announcements) {
				const category = classifyAnnouncement(ann.title || "");
				updateStmt.run(category, ann.id);
			}

			processed += announcements.length;

			// 调用进度回调
			if (onProgress) {
				onProgress(processed, total);
			}

			console.log(`[Tagging] 已处理 ${processed}/${total} (${((processed / total) * 100).toFixed(2)}%)`);
		}
	});

	try {
		processBatch();
		console.log(`[Tagging] 批量打标完成，共处理 ${processed} 条`);
		return { success: true, processed, total };
	} catch (error) {
		console.error("[Tagging Error]", error);
		return { success: false, processed, total };
	}
};

/**
 * 按分类查询公告
 */
export const getAnnouncementsByCategory = (category: string, limit: number = 100): any[] => {
	return db
		.prepare(
			`
        SELECT * FROM announcements 
        WHERE category = ? 
        ORDER BY ann_date DESC, pub_time DESC 
        LIMIT ?
    `
		)
		.all(category, limit);
};

/**
 * 获取日期的前一天（YYYYMMDD格式）
 */
const getPreviousDay = (dateStr: string): string => {
	const year = parseInt(dateStr.substring(0, 4));
	const month = parseInt(dateStr.substring(4, 6)) - 1; // JS月份从0开始
	const day = parseInt(dateStr.substring(6, 8));
	const date = new Date(year, month, day);
	date.setDate(date.getDate() - 1);
	return formatDateToYYYYMMDD(date);
};

/**
 * 获取日期的后一天（YYYYMMDD格式）
 */
const getNextDay = (dateStr: string): string => {
	const year = parseInt(dateStr.substring(0, 4));
	const month = parseInt(dateStr.substring(4, 6)) - 1;
	const day = parseInt(dateStr.substring(6, 8));
	const date = new Date(year, month, day);
	date.setDate(date.getDate() + 1);
	return formatDateToYYYYMMDD(date);
};

/**
 * 格式化日期为 YYYYMMDD
 */
const formatDateToYYYYMMDD = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}${month}${day}`;
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

	// 统计公告缓存数量
	const announcementsCount = countAnnouncements();

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
		announcements: {
			count: announcementsCount,
		},
		syncFlags: syncFlags.map((flag) => ({
			type: flag.sync_type,
			lastSyncDate: flag.last_sync_date,
			updatedAt: flag.updated_at,
		})),
	};
};

export default db;
