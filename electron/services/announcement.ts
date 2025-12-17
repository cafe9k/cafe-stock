/**
 * 公告服务模块
 * 负责公告数据的获取、聚合和搜索
 */

import { TushareClient } from "../tushare.js";
import { getDb } from "../db.js";
import { StockRepository } from "../repositories/implementations/StockRepository.js";
import { FavoriteRepository } from "../repositories/implementations/FavoriteRepository.js";
import { AnnouncementRepository } from "../repositories/implementations/AnnouncementRepository.js";
import { classifyAnnouncement } from "../../src/utils/announcementClassifier.js";
import { AnnouncementListResponse, GroupedAnnouncement } from "../types/index.js";
import { log } from "../utils/logger.js";

// 创建仓储实例
const stockRepository = new StockRepository(getDb());
const favoriteRepository = new FavoriteRepository(getDb());
const announcementRepository = new AnnouncementRepository(getDb());

/**
 * 从 Tushare API 获取公告数据并按股票聚合
 */
export async function getAnnouncementsGroupedFromAPI(
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string,
	market?: string,
	forceRefresh?: boolean
): Promise<AnnouncementListResponse> {
	// 获取所有股票列表
	const allStocks = stockRepository.getAllStocks();

	// 过滤市场
	let filteredStocks = allStocks;
	if (market && market !== "all") {
		filteredStocks = allStocks.filter((s: any) => s.market === market);
	}

	// 从数据库或 Tushare API 获取公告数据
	let announcements: any[] = [];

	// 检查数据库中是否已有该时间范围的数据（如果强制刷新，则跳过缓存）
	const isSynced = !forceRefresh && startDate && endDate ? announcementRepository.isAnnouncementRangeSynced(null, startDate, endDate) : false;

	if (isSynced && startDate && endDate) {
		// 从数据库读取
		log.debug("Announcement", `从数据库读取公告: ${startDate} - ${endDate}`);
		announcements = announcementRepository.getAnnouncementsByDateRange(startDate, endDate);
		log.info("Announcement", `从数据库读取到 ${announcements.length} 条公告`);
	} else {
		// 从 API 获取
		if (forceRefresh) {
			log.info("Announcement", `强制从 API 获取公告: ${startDate || "无"} - ${endDate || "无"}`);
		} else {
			log.info("Announcement", `从 API 获取公告: ${startDate || "无"} - ${endDate || "无"}`);
		}

		if (startDate && endDate) {
			// 如果有日期范围，使用完整获取方式确保覆盖整个日期范围
			log.debug("Announcement", `使用完整获取方式获取公告: ${startDate} - ${endDate}`);
			announcements = await TushareClient.getAnnouncementsComplete(
				undefined, // 全市场
				startDate,
				endDate,
				(message, current, total) => {
					log.debug("Announcement", message);
				}
			);
		} else {
			// 没有日期范围，使用单次请求（限制2000条）
			announcements = await TushareClient.getAnnouncements(undefined, undefined, startDate, endDate, 2000, 0);
		}

		// 保存到数据库
		if (announcements.length > 0) {
			log.info("Announcement", `保存 ${announcements.length} 条公告到数据库`);
			announcementRepository.upsertAnnouncements(announcements);

			// 记录已同步的时间范围
			if (startDate && endDate) {
				announcementRepository.recordAnnouncementSyncRange(null, startDate, endDate);
				log.debug("Announcement", `记录同步范围: ${startDate} - ${endDate}`);
			}
		}
	}

	// 按股票聚合公告数据
	const groupedData = aggregateAnnouncementsByStock(filteredStocks, announcements);

	const total = groupedData.length;
	const offset = (page - 1) * pageSize;
	const items = groupedData.slice(offset, offset + pageSize);

	return { items, total, page, pageSize };
}

/**
 * 从 Tushare API 搜索公告数据并按股票聚合
 */
export async function searchAnnouncementsGroupedFromAPI(
	keyword: string,
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string,
	market?: string
): Promise<AnnouncementListResponse> {
	// 搜索匹配的股票
	const matchedStocks = stockRepository.searchStocks(keyword, 1000);

	// 过滤市场
	let filteredStocks = matchedStocks;
	if (market && market !== "all") {
		filteredStocks = matchedStocks.filter((s: any) => s.market === market);
	}

	if (filteredStocks.length === 0) {
		return { items: [], total: 0, page, pageSize };
	}

	// 获取匹配股票的代码列表
	const tsCodes = filteredStocks.map((s: any) => s.ts_code).join(",");

	// 从 Tushare API 获取公告数据
	const announcements = await TushareClient.getAnnouncements(tsCodes, undefined, startDate, endDate, 2000, 0);

	// 按股票聚合公告数据
	const groupedData = aggregateAnnouncementsByStock(filteredStocks, announcements);

	const total = groupedData.length;
	const offset = (page - 1) * pageSize;
	const items = groupedData.slice(offset, offset + pageSize);

	return { items, total, page, pageSize };
}

/**
 * 从数据库或 Tushare API 获取关注股票的公告数据并按股票聚合
 */
export async function getFavoriteStocksAnnouncementsGroupedFromAPI(
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string
): Promise<AnnouncementListResponse> {
	// 获取所有关注的股票代码
	const favoriteStocks = favoriteRepository.getAllFavoriteStocks();

	if (favoriteStocks.length === 0) {
		return { items: [], total: 0, page, pageSize };
	}

	// 获取关注的股票信息
	const allStocks = stockRepository.getAllStocks();
	const favoriteStockInfos = allStocks.filter((s: any) => favoriteStocks.includes(s.ts_code));

	// 从数据库查询公告数据
	let announcements: any[] = [];

	// 检查是否已同步该时间范围
	const isSynced = startDate && endDate ? announcementRepository.isAnnouncementRangeSynced(null, startDate, endDate) : false;

	if (isSynced && startDate && endDate) {
		// 从数据库读取关注股票的公告
		log.debug("Announcement", `从数据库读取关注股票公告: ${startDate} - ${endDate}`);

		// 获取所有关注股票的公告
		const allAnnouncements = announcementRepository.getAnnouncementsByDateRange(startDate, endDate);
		// 过滤出关注股票的公告
		announcements = allAnnouncements.filter((ann: any) => favoriteStocks.includes(ann.ts_code));
		log.info("Announcement", `从数据库读取到 ${announcements.length} 条关注股票公告`);
	} else {
		// 从 API 获取（逐个股票查询以避免 API 限制）
		log.info("Announcement", `从 API 获取关注股票公告: ${startDate || "无"} - ${endDate || "无"}`);

		for (const tsCode of favoriteStocks) {
			try {
				const stockAnnouncements = await TushareClient.getAnnouncements(tsCode, undefined, startDate, endDate, 2000, 0);
				announcements.push(...stockAnnouncements);

				// 添加延迟以避免 API 限流
				if (favoriteStocks.length > 1) {
					await new Promise((resolve) => setTimeout(resolve, 200));
				}
			} catch (error) {
				log.error("Announcement", `Failed to get announcements for ${tsCode}:`, error);
			}
		}

		// 保存到数据库
		if (announcements.length > 0) {
			log.info("Announcement", `保存 ${announcements.length} 条关注股票公告到数据库`);
			announcementRepository.upsertAnnouncements(announcements);
		}
	}

	// 按股票聚合公告数据
	const groupedData = aggregateAnnouncementsByStock(favoriteStockInfos, announcements);

	const total = groupedData.length;
	const offset = (page - 1) * pageSize;
	const items = groupedData.slice(offset, offset + pageSize);

	return { items, total, page, pageSize };
}

/**
 * 按股票聚合公告数据（通用函数）
 */
function aggregateAnnouncementsByStock(stocks: any[], announcements: any[]): GroupedAnnouncement[] {
	// 按股票聚合公告数据
	const stockMap = new Map<
		string,
		{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcements: any[];
		}
	>();

	// 初始化股票映射
	stocks.forEach((stock: any) => {
		stockMap.set(stock.ts_code, {
			ts_code: stock.ts_code,
			stock_name: stock.name,
			industry: stock.industry || "",
			market: stock.market || "",
			announcements: [],
		});
	});

	// 将公告分配到对应的股票
	announcements.forEach((ann: any) => {
		const stock = stockMap.get(ann.ts_code);
		if (stock) {
			stock.announcements.push(ann);
		}
	});

	// 转换为数组并计算聚合信息
	const groupedData = Array.from(stockMap.values())
		.map((stock) => {
			if (stock.announcements.length === 0) {
				return null;
			}

			// 按日期和时间排序
			stock.announcements.sort((a, b) => {
				const dateCompare = (b.ann_date || "").localeCompare(a.ann_date || "");
				if (dateCompare !== 0) return dateCompare;
				return (b.pub_time || "").localeCompare(a.pub_time || "");
			});

			// 计算公告分类统计
			const categoryStats: Record<string, number> = {};
			stock.announcements.forEach((ann: any) => {
				const category = classifyAnnouncement(ann.title);
				categoryStats[category] = (categoryStats[category] || 0) + 1;
			});

			const latestAnn = stock.announcements[0];
			return {
				ts_code: stock.ts_code,
				name: stock.stock_name,
				industry: stock.industry,
				market: stock.market,
				announcements: stock.announcements.map((ann: any) => ({
					ts_code: ann.ts_code,
					ann_date: ann.ann_date,
					ann_type: ann.ann_type,
					title: ann.title,
					content: ann.content,
					pub_time: ann.pub_time,
					category: classifyAnnouncement(ann.title),
				})),
				totalCount: stock.announcements.length,
				// 添加分类统计
				category_stats: categoryStats,
				// 添加最新公告信息
				latest_ann_date: latestAnn.ann_date,
				latest_ann_time: latestAnn.pub_time,
				latest_ann_title: latestAnn.title,
			};
		})
		.filter((item) => item !== null) as GroupedAnnouncement[];

	// 按最新公告日期排序
	groupedData.sort((a, b) => {
		const dateA = a.announcements[0]?.ann_date || "";
		const dateB = b.announcements[0]?.ann_date || "";
		const dateCompare = dateB.localeCompare(dateA);
		if (dateCompare !== 0) return dateCompare;
		return (a.name || "").localeCompare(b.name || "");
	});

	return groupedData;
}

