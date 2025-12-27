/**
 * 依赖: Database(better-sqlite3) - SQLite数据库连接
 * 输出: BaseRepository 抽象类 - 提供通用数据库操作方法（事务、日期格式化等）
 * 职责: 数据访问层基类，封装所有Repository的公共功能，实现代码复用
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/repositories/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import Database from "better-sqlite3";

/**
 * 基础仓储抽象类
 */
export abstract class BaseRepository {
	protected db: Database.Database;

	constructor(db: Database.Database) {
		this.db = db;
	}

	/**
	 * 执行事务
	 */
	protected transaction<T>(fn: () => T): T {
		const transactionFn = this.db.transaction(fn);
		return transactionFn();
	}

	/**
	 * 获取当前时间戳（ISO格式）
	 */
	protected getCurrentTimestamp(): string {
		return new Date().toISOString();
	}

	/**
	 * 格式化日期为 YYYYMMDD
	 */
	protected formatDateToYYYYMMDD(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}${month}${day}`;
	}

	/**
	 * 获取日期的前一天（YYYYMMDD格式）
	 */
	protected getPreviousDay(dateStr: string): string {
		const year = parseInt(dateStr.substring(0, 4));
		const month = parseInt(dateStr.substring(4, 6)) - 1;
		const day = parseInt(dateStr.substring(6, 8));
		const date = new Date(year, month, day);
		date.setDate(date.getDate() - 1);
		return this.formatDateToYYYYMMDD(date);
	}

	/**
	 * 获取日期的后一天（YYYYMMDD格式）
	 */
	protected getNextDay(dateStr: string): string {
		const year = parseInt(dateStr.substring(0, 4));
		const month = parseInt(dateStr.substring(4, 6)) - 1;
		const day = parseInt(dateStr.substring(6, 8));
		const date = new Date(year, month, day);
		date.setDate(date.getDate() + 1);
		return this.formatDateToYYYYMMDD(date);
	}
}
