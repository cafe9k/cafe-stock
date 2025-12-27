/**
 * 依赖: Database(better-sqlite3), IStockRepository(接口), BaseRepository(基类)
 * 输出: StockRepository 类 - 提供股票数据的CRUD操作（upsertStocks, findById, findAll等）
 * 职责: 股票数据访问层实现，封装股票表的数据库操作，隔离业务逻辑与数据持久化
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/repositories/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import Database from "better-sqlite3";
import { Stock } from "../../types/index.js";
import { IStockRepository } from "../interfaces/IStockRepository.js";
import { BaseRepository } from "../base/BaseRepository.js";

/**
 * 股票仓储实现类
 */
export class StockRepository extends BaseRepository implements IStockRepository {
	constructor(db: Database.Database) {
		super(db);
	}

	/**
	 * 批量插入或更新股票数据
	 */
	upsertStocks(stocks: Stock[]): void {
		const now = this.getCurrentTimestamp();
		const upsert = this.db.prepare(`
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

		this.transaction(() => {
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
	}

	/**
	 * 获取所有股票列表
	 */
	getAllStocks(): Stock[] {
		return this.db.prepare("SELECT * FROM stocks ORDER BY ts_code").all() as Stock[];
	}

	/**
	 * 统计股票数量
	 */
	countStocks(): number {
		const row = this.db.prepare("SELECT COUNT(*) as count FROM stocks").get() as { count: number };
		return row.count;
	}

	/**
	 * 根据关键词搜索股票（名称、代码、拼音）
	 */
	searchStocks(keyword: string, limit: number = 50): Stock[] {
		const likePattern = `%${keyword}%`;
		return this.db
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
			.all(likePattern, likePattern, likePattern, likePattern, keyword, keyword, keyword, limit) as Stock[];
	}

	/**
	 * 获取股票列表同步信息
	 */
	getStockListSyncInfo(): { stockCount: number; lastSyncTime: string | null } {
		const stockCount = this.countStocks();
		const row = this.db.prepare("SELECT MAX(updated_at) as last_sync_time FROM stocks").get() as {
			last_sync_time: string | null;
		};
		return {
			stockCount,
			lastSyncTime: row?.last_sync_time || null,
		};
	}
}
