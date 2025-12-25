/**
 * 公告服务模块
 * 负责公告数据的获取、聚合和搜索
 */

import { TushareClient } from "../tushare.js";
import { getDb } from "../db.js";
import { StockRepository } from "../repositories/implementations/StockRepository.js";
import { FavoriteRepository } from "../repositories/implementations/FavoriteRepository.js";
import { AnnouncementRepository } from "../repositories/implementations/AnnouncementRepository.js";
import { StockDetailRepository } from "../repositories/implementations/StockDetailRepository.js";
import { classifyAnnouncement } from "../utils/announcementClassifier.js";
import { AnnouncementListResponse, GroupedAnnouncement } from "../types/index.js";
import { log } from "../utils/logger.js";

// 创建仓储实例
const stockRepository = new StockRepository(getDb());
const favoriteRepository = new FavoriteRepository(getDb());
const announcementRepository = new AnnouncementRepository(getDb());
const stockDetailRepository = new StockDetailRepository(getDb());

/**
 * 调整结束日期：如果结束日期是今天或未来，扩展为今天+2天
 * 避免提前发布的公告遗漏
 */
function adjustEndDateForFutureAnnouncements(endDate: string): string {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	const todayStr = `${year}${month}${day}`;
	
	// 如果结束日期是今天或未来，扩展为今天+2天
	if (endDate >= todayStr) {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 2);
		const futureYear = futureDate.getFullYear();
		const futureMonth = String(futureDate.getMonth() + 1).padStart(2, "0");
		const futureDay = String(futureDate.getDate()).padStart(2, "0");
		return `${futureYear}${futureMonth}${futureDay}`;
	}
	
	return endDate;
}

/**
 * 从 Tushare API 获取公告数据并按股票聚合
 * 支持搜索关键字和分类筛选
 */
export async function getAnnouncementsGroupedFromAPI(
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string,
	market?: string,
	forceRefresh?: boolean,
	searchKeyword?: string,
	categories?: string[]
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
			// 调整结束日期：如果结束日期是今天或未来，扩展为今天+2天
			const adjustedEndDate = adjustEndDateForFutureAnnouncements(endDate);
			
			// 如果有日期范围，使用完整获取方式确保覆盖整个日期范围
			log.debug("Announcement", `使用完整获取方式获取公告: ${startDate} - ${adjustedEndDate} (原始: ${endDate})`);
			announcements = await TushareClient.getAnnouncementsComplete(
				undefined, // 全市场
				startDate,
				adjustedEndDate,
				(message, current, total) => {
					log.debug("Announcement", message);
				}
			);
		} else {
			// 没有日期范围，使用单次请求（限制2000条）
			// 如果有结束日期，也进行调整
			const adjustedEndDate = endDate ? adjustEndDateForFutureAnnouncements(endDate) : endDate;
			announcements = await TushareClient.getAnnouncements(undefined, undefined, startDate, adjustedEndDate, 2000, 0);
		}

		// 保存到数据库
		if (announcements.length > 0) {
			log.info("Announcement", `保存 ${announcements.length} 条公告到数据库`);
			announcementRepository.upsertAnnouncements(announcements);

			// 记录已同步的时间范围（使用原始日期，recordAnnouncementSyncRange 内部会调整）
			if (startDate && endDate) {
				announcementRepository.recordAnnouncementSyncRange(null, startDate, endDate);
				log.debug("Announcement", `记录同步范围: ${startDate} - ${endDate}`);
			}
		}
	}

	// 按股票聚合公告数据
	let groupedData = aggregateAnnouncementsByStock(filteredStocks, announcements);

	// 应用搜索关键字筛选
	if (searchKeyword && searchKeyword.trim()) {
		const keyword = searchKeyword.trim().toLowerCase();
		groupedData = groupedData.filter((stock) => {
			// 搜索股票名称
			if (stock.name && stock.name.toLowerCase().includes(keyword)) {
				return true;
			}
			// 搜索股票代码
			if (stock.ts_code && stock.ts_code.toLowerCase().includes(keyword)) {
				return true;
			}
			// 搜索公告标题
			if (stock.announcements && Array.isArray(stock.announcements)) {
				return stock.announcements.some((ann: any) => 
					ann.title && ann.title.toLowerCase().includes(keyword)
				);
			}
			return false;
		});
	}

	// 应用分类筛选
	if (categories && categories.length > 0) {
		groupedData = groupedData.filter((stock) => {
			// 检查该股票是否有选中分类的公告
			if (!stock.category_stats) return false;
			return categories.some((category) => {
				const count = stock.category_stats?.[category];
				return count && count > 0;
			});
		});
	}

	const total = groupedData.length;
	const offset = (page - 1) * pageSize;
	const items = groupedData.slice(offset, offset + pageSize);

	return { items, total, page, pageSize };
}

/**
 * 从数据库搜索股票和公告并按股票聚合
 * 支持同时匹配股票名称/代码和公告标题/内容
 */
export async function searchStocksAndAnnouncementsFromDB(
	keyword: string,
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string,
	market?: string,
	categories?: string[]
): Promise<AnnouncementListResponse> {
	if (!keyword || !keyword.trim()) {
		// 如果没有关键字，返回空结果
		return { items: [], total: 0, page, pageSize };
	}

	// 1. 搜索匹配的股票（按名称或代码）
	const matchedStocks = stockRepository.searchStocks(keyword, 1000);

	// 2. 搜索匹配的公告（按标题或内容）
	const matchedAnnouncements = announcementRepository.searchAnnouncements(keyword, 5000);

	// 3. 合并匹配的股票代码（去重）
	const stockCodesSet = new Set<string>();
	matchedStocks.forEach((stock: any) => stockCodesSet.add(stock.ts_code));
	matchedAnnouncements.forEach((ann: any) => {
		if (ann.ts_code) {
			stockCodesSet.add(ann.ts_code);
		}
	});

	// 4. 获取所有相关股票的完整信息
	const allStocks = stockRepository.getAllStocks();
	let relevantStocks = allStocks.filter((s: any) => stockCodesSet.has(s.ts_code));

	// 5. 应用市场筛选
	if (market && market !== "all") {
		relevantStocks = relevantStocks.filter((s: any) => s.market === market);
	}

	if (relevantStocks.length === 0) {
		return { items: [], total: 0, page, pageSize };
	}

	// 6. 获取这些股票在指定时间范围内的公告
	let announcements: any[] = [];
	if (startDate && endDate) {
		announcements = announcementRepository.getAnnouncementsByDateRange(
			startDate,
			endDate,
			undefined,
			categories,
			10000
		);
		// 只保留相关股票的公告
		announcements = announcements.filter((ann: any) => stockCodesSet.has(ann.ts_code));
	}

	// 7. 按股票聚合公告数据
	const groupedData = aggregateAnnouncementsByStock(relevantStocks, announcements);

	// 8. 分页
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
		// 调整结束日期：如果结束日期是今天或未来，扩展为今天+2天
		const adjustedEndDate = startDate && endDate ? adjustEndDateForFutureAnnouncements(endDate) : endDate;
		log.info("Announcement", `从 API 获取关注股票公告: ${startDate || "无"} - ${adjustedEndDate || "无"} (原始: ${endDate || "无"})`);

		for (const tsCode of favoriteStocks) {
			try {
				const stockAnnouncements = await TushareClient.getAnnouncements(tsCode, undefined, startDate, adjustedEndDate, 2000, 0);
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
			
			// 记录已同步的时间范围（使用原始日期，recordAnnouncementSyncRange 内部会调整）
			if (startDate && endDate) {
				announcementRepository.recordAnnouncementSyncRange(null, startDate, endDate);
			}
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
	// 批量获取市值数据
	const tsCodes = stocks.map((s: any) => s.ts_code);
	const marketValues = stockDetailRepository.batchGetLatestMarketValues(tsCodes);
	
	// 按股票聚合公告数据
	const stockMap = new Map<
		string,
		{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcements: any[];
			total_mv: number | null;
		}
	>();

	// 初始化股票映射
	stocks.forEach((stock: any) => {
		const totalMv = marketValues.get(stock.ts_code) || null;
		stockMap.set(stock.ts_code, {
			ts_code: stock.ts_code,
			stock_name: stock.name,
			industry: stock.industry || "",
			market: stock.market || "",
			announcements: [],
			total_mv: totalMv ? totalMv / 10000 : null, // 转换为亿元
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
				// 添加市值信息（亿元）
				total_mv: stock.total_mv,
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

