/**
 * INPUT: Database(better-sqlite3), IStockDetailRepository(接口), BaseRepository(基类)
 * OUTPUT: StockDetailRepository 类 - 提供股票详情数据的CRUD操作（upsertDailyBasic, getDailyBasic等）
 * POS: 股票详情数据访问层实现，封装股票日线指标表的数据库操作
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/repositories/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { BaseRepository } from "../base/BaseRepository.js";
import { IStockDetailRepository } from "../interfaces/IStockDetailRepository.js";

export class StockDetailRepository extends BaseRepository implements IStockDetailRepository {
	/**
	 * 批量插入或更新每日指标数据
	 */
	upsertDailyBasic(data: any[]): void {
		if (!data || data.length === 0) return;

		const stmt = this.db.prepare(`
			INSERT INTO stock_daily_basic (
				ts_code, trade_date, total_mv, circ_mv, total_share, 
				float_share, free_share, pe, pb, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(ts_code, trade_date) DO UPDATE SET
				total_mv = excluded.total_mv,
				circ_mv = excluded.circ_mv,
				total_share = excluded.total_share,
				float_share = excluded.float_share,
				free_share = excluded.free_share,
				pe = excluded.pe,
				pb = excluded.pb,
				updated_at = excluded.updated_at
		`);

		const insertMany = this.db.transaction((records: any[]) => {
			const now = new Date().toISOString();
			for (const record of records) {
				stmt.run(
					record.ts_code,
					record.trade_date,
					record.total_mv,
					record.circ_mv,
					record.total_share,
					record.float_share,
					record.free_share,
					record.pe,
					record.pb,
					now
				);
			}
		});

		insertMany(data);
	}

	/**
	 * 批量插入或更新公司信息
	 */
	upsertCompanyInfo(data: any[]): void {
		if (!data || data.length === 0) return;

		const stmt = this.db.prepare(`
			INSERT INTO stock_company (
				ts_code, chairman, manager, secretary, reg_capital, setup_date,
				province, city, introduction, website, employees, main_business,
				business_scope, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(ts_code) DO UPDATE SET
				chairman = excluded.chairman,
				manager = excluded.manager,
				secretary = excluded.secretary,
				reg_capital = excluded.reg_capital,
				setup_date = excluded.setup_date,
				province = excluded.province,
				city = excluded.city,
				introduction = excluded.introduction,
				website = excluded.website,
				employees = excluded.employees,
				main_business = excluded.main_business,
				business_scope = excluded.business_scope,
				updated_at = excluded.updated_at
		`);

		const insertMany = this.db.transaction((records: any[]) => {
			const now = new Date().toISOString();
			for (const record of records) {
				stmt.run(
					record.ts_code,
					record.chairman,
					record.manager,
					record.secretary,
					record.reg_capital,
					record.setup_date,
					record.province,
					record.city,
					record.introduction,
					record.website,
					record.employees,
					record.main_business,
					record.business_scope,
					now
				);
			}
		});

		insertMany(data);
	}

	/**
	 * 根据股票代码获取最新市值数据
	 */
	getDailyBasicByCode(tsCode: string): any | null {
		const result = this.db
			.prepare(
				`
			SELECT * FROM stock_daily_basic 
			WHERE ts_code = ? 
			ORDER BY trade_date DESC 
			LIMIT 1
		`
			)
			.get(tsCode);

		return result || null;
	}

	/**
	 * 根据股票代码获取公司信息
	 */
	getCompanyInfoByCode(tsCode: string): any | null {
		const result = this.db
			.prepare(
				`
			SELECT * FROM stock_company 
			WHERE ts_code = ?
		`
			)
			.get(tsCode);

		return result || null;
	}

	/**
	 * 统计每日指标数据条数
	 */
	countDailyBasic(): number {
		const result = this.db.prepare("SELECT COUNT(*) as count FROM stock_daily_basic").get() as { count: number };
		return result.count;
	}

	/**
	 * 统计公司信息条数
	 */
	countCompanyInfo(): number {
		const result = this.db.prepare("SELECT COUNT(*) as count FROM stock_company").get() as { count: number };
		return result.count;
	}

	/**
	 * 获取指定股票的最新市值（用于列表展示）
	 */
	getLatestMarketValue(tsCode: string): { total_mv: number | null } | null {
		const result = this.db
			.prepare(
				`
			SELECT total_mv FROM stock_daily_basic 
			WHERE ts_code = ? 
			ORDER BY trade_date DESC 
			LIMIT 1
		`
			)
			.get(tsCode) as { total_mv: number | null } | undefined;

		return result || null;
	}

	/**
	 * 批量获取多个股票的最新市值
	 */
	batchGetLatestMarketValues(tsCodes: string[]): Map<string, number | null> {
		const result = new Map<string, number | null>();

		if (tsCodes.length === 0) return result;

		// 使用子查询获取每个股票的最新市值
		const placeholders = tsCodes.map(() => "?").join(",");
		const query = `
			SELECT sdb.ts_code, sdb.total_mv
			FROM stock_daily_basic sdb
			INNER JOIN (
				SELECT ts_code, MAX(trade_date) as max_date
				FROM stock_daily_basic
				WHERE ts_code IN (${placeholders})
				GROUP BY ts_code
			) latest ON sdb.ts_code = latest.ts_code AND sdb.trade_date = latest.max_date
		`;

		const rows = this.db.prepare(query).all(...tsCodes) as Array<{ ts_code: string; total_mv: number | null }>;

		for (const row of rows) {
			result.set(row.ts_code, row.total_mv);
		}

		return result;
	}
}

