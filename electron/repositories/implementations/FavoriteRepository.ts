/**
 * INPUT: Database(better-sqlite3), IFavoriteRepository(接口), BaseRepository(基类)
 * OUTPUT: FavoriteRepository 类 - 提供收藏数据的CRUD操作（addFavoriteStock, removeFavoriteStock等）
 * POS: 收藏数据访问层实现，封装用户收藏表的数据库操作
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/repositories/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import Database from "better-sqlite3";
import { IFavoriteRepository } from "../interfaces/IFavoriteRepository.js";
import { BaseRepository } from "../base/BaseRepository.js";

/**
 * 收藏仓储实现类
 */
export class FavoriteRepository extends BaseRepository implements IFavoriteRepository {
	constructor(db: Database.Database) {
		super(db);
	}

	/**
	 * 添加收藏股票
	 */
	addFavoriteStock(tsCode: string): boolean {
		try {
			const stmt = this.db.prepare("UPDATE stocks SET is_favorite = 1 WHERE ts_code = ?");
			const result = stmt.run(tsCode);
			return result.changes > 0;
		} catch (error) {
			console.error("Failed to add favorite stock:", error);
			return false;
		}
	}

	/**
	 * 取消收藏股票
	 */
	removeFavoriteStock(tsCode: string): boolean {
		try {
			const stmt = this.db.prepare("UPDATE stocks SET is_favorite = 0 WHERE ts_code = ?");
			const result = stmt.run(tsCode);
			return result.changes > 0;
		} catch (error) {
			console.error("Failed to remove favorite stock:", error);
			return false;
		}
	}

	/**
	 * 检查股票是否已收藏
	 */
	isFavoriteStock(tsCode: string): boolean {
		try {
			const stmt = this.db.prepare("SELECT is_favorite FROM stocks WHERE ts_code = ?");
			const result: any = stmt.get(tsCode);
			return result?.is_favorite === 1;
		} catch (error) {
			console.error("Failed to check favorite stock:", error);
			return false;
		}
	}

	/**
	 * 获取所有收藏的股票代码
	 */
	getAllFavoriteStocks(): string[] {
		try {
			const stmt = this.db.prepare("SELECT ts_code FROM stocks WHERE is_favorite = 1 ORDER BY ts_code");
			const results: any[] = stmt.all();
			return results.map((r) => r.ts_code);
		} catch (error) {
			console.error("Failed to get all favorite stocks:", error);
			return [];
		}
	}

	/**
	 * 统计收藏的股票数量
	 */
	countFavoriteStocks(): number {
		try {
			const stmt = this.db.prepare("SELECT COUNT(*) as count FROM stocks WHERE is_favorite = 1");
			const result: any = stmt.get();
			return result?.count || 0;
		} catch (error) {
			console.error("Failed to count favorite stocks:", error);
			return 0;
		}
	}
}

