/**
 * 同步标志位管理模块
 * 负责同步标志位的 CRUD 操作
 */

import Database from "better-sqlite3";
import { log } from "../utils/logger.js";

/**
 * 同步标志位管理器
 */
export class SyncFlagManager {
	private db: Database.Database;

	constructor(db: Database.Database) {
		this.db = db;
	}

	/**
	 * 获取上次同步日期
	 */
	getLastSyncDate(syncType: string): string | null {
		try {
			const row = this.db.prepare("SELECT last_sync_date FROM sync_flags WHERE sync_type = ?").get(syncType) as
				| {
						last_sync_date: string;
				  }
				| undefined;
			return row?.last_sync_date || null;
		} catch (error) {
			log.error("SyncFlag", `获取同步日期失败 (${syncType}):`, error);
			return null;
		}
	}

	/**
	 * 更新同步标志位
	 */
	updateSyncFlag(syncType: string, syncDate: string): boolean {
		try {
			const now = new Date().toISOString();
			this.db
				.prepare(
					`
				INSERT INTO sync_flags (sync_type, last_sync_date, updated_at)
				VALUES (?, ?, ?)
				ON CONFLICT(sync_type) DO UPDATE SET
					last_sync_date = excluded.last_sync_date,
					updated_at = excluded.updated_at
			`
				)
				.run(syncType, syncDate, now);

			log.debug("SyncFlag", `更新同步标志位成功: ${syncType} = ${syncDate}`);
			return true;
		} catch (error) {
			log.error("SyncFlag", `更新同步标志位失败 (${syncType}):`, error);
			return false;
		}
	}

	/**
	 * 检查今天是否已同步
	 */
	isSyncedToday(syncType: string): boolean {
		const lastSync = this.getLastSyncDate(syncType);
		if (!lastSync) return false;

		const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
		return lastSync === today;
	}

	/**
	 * 获取所有同步标志位
	 */
	getAllSyncFlags(): Array<{ sync_type: string; last_sync_date: string; updated_at: string }> {
		try {
			return this.db.prepare("SELECT sync_type, last_sync_date, updated_at FROM sync_flags ORDER BY updated_at DESC").all() as Array<{
				sync_type: string;
				last_sync_date: string;
				updated_at: string;
			}>;
		} catch (error) {
			log.error("SyncFlag", "获取所有同步标志位失败:", error);
			return [];
		}
	}

	/**
	 * 删除同步标志位
	 */
	deleteSyncFlag(syncType: string): boolean {
		try {
			this.db.prepare("DELETE FROM sync_flags WHERE sync_type = ?").run(syncType);
			log.debug("SyncFlag", `删除同步标志位成功: ${syncType}`);
			return true;
		} catch (error) {
			log.error("SyncFlag", `删除同步标志位失败 (${syncType}):`, error);
			return false;
		}
	}

	/**
	 * 清空所有同步标志位
	 */
	clearAllSyncFlags(): boolean {
		try {
			this.db.prepare("DELETE FROM sync_flags").run();
			log.info("SyncFlag", "清空所有同步标志位成功");
			return true;
		} catch (error) {
			log.error("SyncFlag", "清空所有同步标志位失败:", error);
			return false;
		}
	}
}

