/**
 * 依赖: Database(better-sqlite3), IHolderRepository(接口), BaseRepository(基类)
 * 输出: HolderRepository 类 - 提供股东数据的CRUD和查询操作（upsertHolders, getHoldersByStock等）
 * 职责: 股东数据访问层实现，封装十大股东表的数据库操作
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/repositories/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import Database from "better-sqlite3";
import { IHolderRepository } from "../interfaces/IHolderRepository.js";
import { BaseRepository } from "../base/BaseRepository.js";

/**
 * 股东仓储实现类
 */
export class HolderRepository extends BaseRepository implements IHolderRepository {
	constructor(db: Database.Database) {
		super(db);
	}

	/**
	 * 批量插入或更新十大股东数据
	 */
	upsertTop10Holders(holders: any[]): void {
		const now = this.getCurrentTimestamp();
		const upsert = this.db.prepare(`
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

		this.transaction(() => {
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
	}

	/**
	 * 获取指定股票的十大股东数据
	 */
	getTop10HoldersByStock(tsCode: string, limit: number = 100): any[] {
		return this.db
			.prepare(
				`
				SELECT * FROM top10_holders 
				WHERE ts_code = ?
				ORDER BY end_date DESC, hold_ratio DESC
				LIMIT ?
			`
			)
			.all(tsCode, limit);
	}

	/**
	 * 获取股票的所有报告期列表
	 */
	getTop10HoldersEndDates(tsCode: string): string[] {
		const rows = this.db
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
	}

	/**
	 * 根据报告期获取十大股东
	 */
	getTop10HoldersByStockAndEndDate(tsCode: string, endDate: string): any[] {
		return this.db
			.prepare(
				`
				SELECT * FROM top10_holders 
				WHERE ts_code = ? AND end_date = ?
				ORDER BY hold_ratio DESC
			`
			)
			.all(tsCode, endDate);
	}

	/**
	 * 检查股票是否已有十大股东数据
	 */
	hasTop10HoldersData(tsCode: string): boolean {
		const row = this.db.prepare("SELECT COUNT(*) as count FROM top10_holders WHERE ts_code = ?").get(tsCode) as {
			count: number;
		};
		return row.count > 0;
	}

	/**
	 * 获取所有已同步十大股东的股票代码列表
	 */
	getStocksWithTop10Holders(): string[] {
		const rows = this.db.prepare("SELECT DISTINCT ts_code FROM top10_holders ORDER BY ts_code").all() as Array<{
			ts_code: string;
		}>;
		return rows.map((row) => row.ts_code);
	}

	/**
	 * 统计已同步十大股东的股票数量
	 */
	countStocksWithTop10Holders(): number {
		const row = this.db.prepare("SELECT COUNT(DISTINCT ts_code) as count FROM top10_holders").get() as {
			count: number;
		};
		return row.count;
	}

	/**
	 * 根据股东名称搜索股东持股信息
	 */
	searchHoldersByName(holderName: string, limit: number = 100): any[] {
		const likePattern = `%${holderName}%`;
		return this.db
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
	}

	/**
	 * 获取股东持有的所有股票
	 */
	getStocksByHolder(holderName: string): any[] {
		return this.db
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
	}

	/**
	 * 删除指定股票的十大股东数据（用于重新同步）
	 */
	deleteTop10HoldersByStock(tsCode: string): number {
		const result = this.db.prepare("DELETE FROM top10_holders WHERE ts_code = ?").run(tsCode);
		return result.changes;
	}
}
