/**
 * INPUT: 无（接口定义）
 * OUTPUT: IAnnouncementService 接口规范 - 定义公告服务的契约
 * POS: 服务层接口定义，规范公告服务的对外API
 * 
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/services/README.md
 */

import { AnnouncementListResponse, GroupedAnnouncement } from "../../types/index.js";

export interface IAnnouncementService {
	/**
	 * 从 API 获取公告数据并按股票聚合
	 */
	getAnnouncementsGroupedFromAPI(
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string,
		market?: string,
		forceRefresh?: boolean
	): Promise<AnnouncementListResponse>;

	/**
	 * 从 API 搜索公告数据并按股票聚合
	 */
	searchAnnouncementsGroupedFromAPI(
		keyword: string,
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string,
		market?: string
	): Promise<AnnouncementListResponse>;

	/**
	 * 从数据库获取公告数据并按股票聚合
	 */
	getAnnouncementsGroupedFromDB(
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string,
		market?: string,
		categories?: string[]
	): Promise<AnnouncementListResponse>;

	/**
	 * 从数据库搜索公告数据并按股票聚合
	 */
	searchAnnouncementsGroupedFromDB(
		keyword: string,
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string,
		market?: string,
		categories?: string[]
	): Promise<AnnouncementListResponse>;
}

