/**
 * 依赖: 无（接口定义）
 * 输出: IAnnouncementRepository 接口 - 定义公告数据访问操作的契约
 * 职责: 公告Repository接口，规范公告数据访问层的标准操作
 *
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/repositories/README.md
 */

import { Announcement } from "../../types/index.js";
import { IRepository } from "./IRepository.js";

/**
 * 公告仓储接口
 */
export interface IAnnouncementRepository extends IRepository<Announcement> {
	/**
	 * 批量插入或更新公告数据
	 */
	upsertAnnouncements(announcements: any[]): void;

	/**
	 * 获取指定股票的公告列表
	 */
	getAnnouncementsByStock(tsCode: string, categories?: string[], limit?: number): any[];

	/**
	 * 根据日期范围获取公告
	 */
	getAnnouncementsByDateRange(startDate: string, endDate: string, tsCode?: string, categories?: string[], limit?: number): any[];

	/**
	 * 搜索公告标题
	 */
	searchAnnouncements(keyword: string, limit?: number): any[];

	/**
	 * 检查时间范围是否已同步
	 */
	isAnnouncementRangeSynced(tsCode: string | null, startDate: string, endDate: string): boolean;

	/**
	 * 记录已同步的时间范围
	 */
	recordAnnouncementSyncRange(tsCode: string | null, startDate: string, endDate: string): void;

	/**
	 * 获取需要同步的时间段（排除已同步的部分）
	 */
	getUnsyncedAnnouncementRanges(tsCode: string | null, startDate: string, endDate: string): Array<{ start_date: string; end_date: string }>;

	/**
	 * 统计公告数量
	 */
	countAnnouncements(): number;

	/**
	 * 获取未打标的公告数量
	 */
	getUntaggedAnnouncementsCount(): number;

	/**
	 * 批量打标公告
	 */
	tagAnnouncementsBatch(
		batchSize?: number,
		onProgress?: (processed: number, total: number) => void,
		reprocessAll?: boolean,
		useDbRules?: boolean
	): { success: boolean; processed: number; total: number };

	/**
	 * 按分类查询公告
	 */
	getAnnouncementsByCategory(category: string, limit?: number): any[];
}
