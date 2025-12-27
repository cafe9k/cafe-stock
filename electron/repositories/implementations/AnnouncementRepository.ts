/**
 * 依赖: Database(better-sqlite3), IAnnouncementRepository(接口), BaseRepository(基类), ClassificationRepository(分类), announcementClassifier(分类器)
 * 输出: AnnouncementRepository 类 - 提供公告数据的CRUD和查询操作（upsertAnnouncements, getAnnouncementsByStock等）
 * 职责: 公告数据访问层实现，封装公告表的数据库操作和智能分类逻辑
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/repositories/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import Database from "better-sqlite3";
import { IAnnouncementRepository } from "../interfaces/IAnnouncementRepository.js";
import { BaseRepository } from "../base/BaseRepository.js";
import { ClassificationRepository } from "./ClassificationRepository.js";
import { classifyAnnouncement, classifyAnnouncementWithRules, ClassificationRule } from "../../utils/announcementClassifier.js";

/**
 * 公告仓储实现类
 */
export class AnnouncementRepository extends BaseRepository implements IAnnouncementRepository {
	private classificationRepository: ClassificationRepository;

	constructor(db: Database.Database) {
		super(db);
		this.classificationRepository = new ClassificationRepository(db);
	}

	/**
	 * 批量插入或更新公告数据
	 */
	upsertAnnouncements(announcements: any[]): void {
		const upsert = this.db.prepare(`
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

		this.transaction(() => {
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
	}

	/**
	 * 获取指定股票的公告列表
	 */
	getAnnouncementsByStock(tsCode: string, categories?: string[], limit: number = 100): any[] {
		let query = "SELECT * FROM announcements WHERE ts_code = ?";
		const params: any[] = [tsCode];

		if (categories && categories.length > 0) {
			const placeholders = categories.map(() => "?").join(",");
			query += ` AND category IN (${placeholders})`;
			params.push(...categories);
		}

		query += " ORDER BY ann_date DESC, rec_time DESC LIMIT ?";
		params.push(limit);

		return this.db.prepare(query).all(...params);
	}

	/**
	 * 根据日期范围获取公告
	 */
	getAnnouncementsByDateRange(startDate: string, endDate: string, tsCode?: string, categories?: string[], limit: number = 200): any[] {
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

		return this.db.prepare(query).all(...params);
	}

	/**
	 * 搜索公告标题
	 */
	searchAnnouncements(keyword: string, limit: number = 100): any[] {
		const likePattern = `%${keyword}%`;
		return this.db
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
	}

	/**
	 * 检查时间范围是否已同步
	 * 如果结束日期是今天或未来，自动扩展为今天+2天，避免提前发布的公告遗漏
	 */
	isAnnouncementRangeSynced(tsCode: string | null, startDate: string, endDate: string): boolean {
		// 获取今天的日期（YYYYMMDD格式）
		const today = this.formatDateToYYYYMMDD(new Date());

		// 如果结束日期是今天或未来，扩展为今天+2天
		let adjustedEndDate = endDate;
		if (endDate >= today) {
			// 计算今天+2天的日期
			const todayDate = new Date();
			todayDate.setDate(todayDate.getDate() + 2);
			adjustedEndDate = this.formatDateToYYYYMMDD(todayDate);
		}

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
			params = [tsCode, adjustedEndDate, startDate];
		} else {
			query = `
				SELECT start_date, end_date 
				FROM announcement_sync_ranges 
				WHERE ts_code IS NULL
					AND start_date <= ?
					AND end_date >= ?
				ORDER BY start_date
			`;
			params = [adjustedEndDate, startDate];
		}

		const ranges = this.db.prepare(query).all(...params) as Array<{ start_date: string; end_date: string }>;

		if (ranges.length === 0) {
			return false;
		}

		// 检查是否有完全覆盖的范围（使用调整后的结束日期）
		for (const range of ranges) {
			if (range.start_date <= startDate && range.end_date >= adjustedEndDate) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 记录已同步的时间范围
	 * 如果结束日期是今天或未来，自动扩展为今天+2天，避免提前发布的公告遗漏
	 */
	recordAnnouncementSyncRange(tsCode: string | null, startDate: string, endDate: string): void {
		const now = this.getCurrentTimestamp();

		// 获取今天的日期（YYYYMMDD格式）
		const today = this.formatDateToYYYYMMDD(new Date());

		// 如果结束日期是今天或未来，扩展为今天+2天
		let adjustedEndDate = endDate;
		if (endDate >= today) {
			// 计算今天+2天的日期
			const todayDate = new Date();
			todayDate.setDate(todayDate.getDate() + 2);
			adjustedEndDate = this.formatDateToYYYYMMDD(todayDate);
		}

		// 插入新范围
		if (tsCode) {
			this.db
				.prepare(
					`
				INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
				VALUES (?, ?, ?, ?)
			`
				)
				.run(tsCode, startDate, adjustedEndDate, now);
		} else {
			this.db
				.prepare(
					`
				INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
				VALUES (NULL, ?, ?, ?)
			`
				)
				.run(startDate, adjustedEndDate, now);
		}

		// 合并连续或重叠的范围
		this.mergeAnnouncementSyncRanges(tsCode);
	}

	/**
	 * 获取需要同步的时间段（排除已同步的部分）
	 */
	getUnsyncedAnnouncementRanges(tsCode: string | null, startDate: string, endDate: string): Array<{ start_date: string; end_date: string }> {
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

		const syncedRanges = this.db.prepare(query).all(...params) as Array<{ start_date: string; end_date: string }>;

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
				const gapEnd = this.getPreviousDay(range.start_date);
				unsyncedRanges.push({
					start_date: currentStart,
					end_date: gapEnd,
				});
			}
			// 更新当前起点到已同步范围的后一天
			currentStart = this.getNextDay(range.end_date);
		}

		// 检查最后一个已同步范围之后是否还有未同步的部分
		if (currentStart <= endDate) {
			unsyncedRanges.push({
				start_date: currentStart,
				end_date: endDate,
			});
		}

		return unsyncedRanges;
	}

	/**
	 * 统计公告数量
	 */
	countAnnouncements(): number {
		const row = this.db.prepare("SELECT COUNT(*) as count FROM announcements").get() as { count: number };
		return row.count;
	}

	/**
	 * 获取未打标的公告数量
	 */
	getUntaggedAnnouncementsCount(): number {
		const row = this.db.prepare("SELECT COUNT(*) as count FROM announcements WHERE category IS NULL").get() as {
			count: number;
		};
		return row.count;
	}

	/**
	 * 批量打标公告
	 */
	tagAnnouncementsBatch(
		batchSize: number = 1000,
		onProgress?: (processed: number, total: number) => void,
		reprocessAll: boolean = false,
		useDbRules: boolean = true
	): { success: boolean; processed: number; total: number } {
		const total = reprocessAll ? this.countAnnouncements() : this.getUntaggedAnnouncementsCount();

		let processed = 0;

		if (total === 0) {
			return { success: true, processed: 0, total: 0 };
		}

		console.log(`[Tagging] 开始批量打标，共 ${total} 条公告，重新处理所有: ${reprocessAll}`);

		// 加载规则
		let rules: ClassificationRule[] | undefined;
		if (useDbRules) {
			const dbRules = this.classificationRepository.loadClassificationRulesFromDb();
			rules = dbRules.map((r) => ({
				category: r.category as any,
				keywords: r.keywords,
				priority: r.priority,
			}));
			console.log(`[Tagging] 使用数据库规则，共 ${rules.length} 个分类`);
		} else {
			console.log(`[Tagging] 使用默认规则`);
		}

		const updateStmt = this.db.prepare("UPDATE announcements SET category = ? WHERE id = ?");

		try {
			this.transaction(() => {
				while (processed < total) {
					const query = reprocessAll
						? `SELECT id, title FROM announcements LIMIT ? OFFSET ?`
						: `SELECT id, title FROM announcements WHERE category IS NULL LIMIT ?`;

					const announcements = reprocessAll
						? (this.db.prepare(query).all(batchSize, processed) as Array<{ id: number; title: string }>)
						: (this.db.prepare(query).all(batchSize) as Array<{ id: number; title: string }>);

					if (announcements.length === 0) break;

					// 批量分类并更新
					for (const ann of announcements) {
						const category = useDbRules ? classifyAnnouncementWithRules(ann.title || "", rules) : classifyAnnouncement(ann.title || "");
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

			console.log(`[Tagging] 批量打标完成，共处理 ${processed} 条`);
			return { success: true, processed, total };
		} catch (error) {
			console.error("[Tagging Error]", error);
			return { success: false, processed, total };
		}
	}

	/**
	 * 按分类查询公告
	 */
	getAnnouncementsByCategory(category: string, limit: number = 100): any[] {
		return this.db
			.prepare(
				`
				SELECT * FROM announcements 
				WHERE category = ? 
				ORDER BY ann_date DESC, pub_time DESC 
				LIMIT ?
			`
			)
			.all(category, limit);
	}

	/**
	 * 合并连续或重叠的同步范围（私有方法）
	 */
	private mergeAnnouncementSyncRanges(tsCode: string | null): void {
		let query: string;
		let params: any[];

		if (tsCode) {
			query = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code = ? ORDER BY start_date";
			params = [tsCode];
		} else {
			query = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code IS NULL ORDER BY start_date";
			params = [];
		}

		const ranges = this.db.prepare(query).all(...params) as Array<{ id: number; start_date: string; end_date: string }>;

		if (ranges.length <= 1) {
			return;
		}

		const toDelete: number[] = [];
		const toUpdate: Array<{ id: number; start_date: string; end_date: string }> = [];

		let current = ranges[0];

		for (let i = 1; i < ranges.length; i++) {
			const next = ranges[i];

			// 检查是否连续或重叠（包括相邻日期）
			if (this.getNextDay(current.end_date) >= next.start_date) {
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
		const updateStmt = this.db.prepare("UPDATE announcement_sync_ranges SET end_date = ? WHERE id = ?");
		const deleteStmt = this.db.prepare("DELETE FROM announcement_sync_ranges WHERE id = ?");

		this.transaction(() => {
			for (const range of toUpdate) {
				updateStmt.run(range.end_date, range.id);
			}
			for (const id of toDelete) {
				deleteStmt.run(id);
			}
		});
	}
}
