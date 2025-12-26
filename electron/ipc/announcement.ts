/**
 * 公告相关 IPC 处理器
 */

import { ipcMain } from "electron";
import { log } from "../utils/logger.js";
import { TushareClient } from "../tushare.js";
import * as announcementService from "../services/announcement.js";
import * as classificationService from "../services/classification.js";
import { getDb } from "../db.js";
import { AnnouncementRepository } from "../repositories/implementations/AnnouncementRepository.js";

// 创建仓储实例
const announcementRepository = new AnnouncementRepository(getDb());

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
 * 注册公告相关 IPC 处理器
 */
export function registerAnnouncementHandlers(): void {
	// 获取按股票聚合的公告列表
	ipcMain.handle(
		"get-announcements-grouped",
		async (_event, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string, forceRefresh?: boolean, searchKeyword?: string, categories?: string[], marketCapRange?: { min?: number; max?: number }) => {
			try {
				log.debug(
					"IPC",
					`get-announcements-grouped: page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}, market=${market}, forceRefresh=${forceRefresh}, searchKeyword=${searchKeyword}, categories=${categories?.join(",")}, marketCapRange=${JSON.stringify(marketCapRange)}`
				);

				const result = await announcementService.getAnnouncementsGroupedFromAPI(page, pageSize, startDate, endDate, market, forceRefresh, searchKeyword, categories, marketCapRange);

				log.debug("IPC", `get-announcements-grouped: page=${page}, items=${result.items.length}, total=${result.total}`);

				return result;
			} catch (error: any) {
				log.error("IPC", "Failed to get grouped announcements:", error);
				throw error;
			}
		}
	);

	// 获取特定股票的公告列表
	ipcMain.handle("get-stock-announcements", async (_event, tsCode: string, limit: number = 100, startDate?: string, endDate?: string) => {
		try {
			log.debug("IPC", `get-stock-announcements: tsCode=${tsCode}, limit=${limit}, dateRange=${startDate}-${endDate}`);

			const announcements = await TushareClient.getAnnouncements(tsCode, undefined, startDate, endDate, limit, 0);

			// 按日期和时间排序
			announcements.sort((a: any, b: any) => {
				const dateCompare = (b.ann_date || "").localeCompare(a.ann_date || "");
				if (dateCompare !== 0) return dateCompare;
				return (b.pub_time || "").localeCompare(a.pub_time || "");
			});

			// 转换为前端期望的格式，并添加分类信息
			return announcements.map((ann: any) => ({
				ts_code: ann.ts_code,
				ann_date: ann.ann_date,
				ann_type: ann.ann_type,
				title: ann.title,
				content: ann.content,
				pub_time: ann.pub_time,
				category: classificationService.classifyAnnouncementTitle(ann.title),
			}));
		} catch (error: any) {
			log.error("IPC", "Failed to get stock announcements:", error);
			throw error;
		}
	});

	// 搜索按股票聚合的公告数据（同时支持股票和公告搜索）
	ipcMain.handle(
		"search-announcements-grouped",
		async (_event, keyword: string, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string) => {
			try {
				log.debug(
					"IPC",
					`search-announcements-grouped: keyword=${keyword}, page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}, market=${market}`
				);

				// 使用新的搜索方法，同时匹配股票和公告
				const result = await announcementService.searchStocksAndAnnouncementsFromDB(
					keyword,
					page,
					pageSize,
					startDate,
					endDate,
					market
				);

				log.debug("IPC", `search-announcements-grouped: page=${page}, items=${result.items.length}, total=${result.total}`);

				return result;
			} catch (error: any) {
				log.error("IPC", "Failed to search grouped announcements:", error);
				throw error;
			}
		}
	);

	// 获取关注股票的公告列表
	ipcMain.handle(
		"get-favorite-stocks-announcements-grouped",
		async (_event, page: number, pageSize: number, startDate?: string, endDate?: string) => {
			try {
				log.debug("IPC", `get-favorite-stocks-announcements-grouped: page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}`);

				const result = await announcementService.getFavoriteStocksAnnouncementsGroupedFromAPI(page, pageSize, startDate, endDate);

				log.debug("IPC", `get-favorite-stocks-announcements-grouped: page=${page}, items=${result.items.length}, total=${result.total}`);

				return result;
			} catch (error: any) {
				log.error("IPC", "Failed to get favorite stocks announcements:", error);
				throw error;
			}
		}
	);

	// 获取公告 PDF 文件信息
	ipcMain.handle("get-announcement-pdf", async (_event, tsCode: string, annDate: string, title: string) => {
		try {
			log.debug("IPC", `get-announcement-pdf: tsCode=${tsCode}, annDate=${annDate}, title=${title}`);

			// 从 Tushare 获取公告原文信息
			const files = await TushareClient.getAnnouncementFiles(tsCode, annDate);

			log.debug("IPC", `Found ${files.length} announcements for ${tsCode} on ${annDate}`);

			// 查找匹配的公告
			let matchedFile = files.find((file: any) => file.title === title);

			// 如果精确匹配失败，尝试模糊匹配
			if (!matchedFile) {
				matchedFile = files.find((file: any) => {
					const fileTitle = file.title || "";
					const searchTitle = title || "";
					return fileTitle.includes(searchTitle) || searchTitle.includes(fileTitle);
				});
			}

			if (matchedFile && matchedFile.url) {
				log.debug("IPC", `Found PDF URL: ${matchedFile.url}`);
				return {
					success: true,
					url: matchedFile.url,
				};
			}

			log.debug("IPC", `No PDF found for announcement: ${title}`);
			return {
				success: false,
				message: "该公告暂无 PDF 文件",
			};
		} catch (error: any) {
			log.error("IPC", "Failed to get announcement PDF:", error);
			return {
				success: false,
				message: error.message || "获取 PDF 失败",
			};
		}
	});

	// 从缓存获取公告
	ipcMain.handle("get-announcements-from-cache", async (_event, tsCode: string | null, startDate: string, endDate: string) => {
		try {
			log.debug("IPC", `get-announcements-from-cache: tsCode=${tsCode}, dateRange=${startDate}-${endDate}`);

			const announcements = announcementRepository.getAnnouncementsByDateRange(startDate, endDate, tsCode || undefined);

			// 添加分类信息
			const result = announcements.map((ann: any) => ({
				...ann,
				category: classificationService.classifyAnnouncementTitle(ann.title),
			}));

			log.debug("IPC", `get-announcements-from-cache: found ${result.length} announcements`);
			return result;
		} catch (error: any) {
			log.error("IPC", "Failed to get announcements from cache:", error);
			throw error;
		}
	});

	// 检查公告范围是否已同步
	ipcMain.handle("check-announcement-range-synced", async (_event, tsCode: string | null, startDate: string, endDate: string) => {
		try {
			log.debug("IPC", `check-announcement-range-synced: tsCode=${tsCode}, dateRange=${startDate}-${endDate}`);

			const isSynced = announcementRepository.isAnnouncementRangeSynced(tsCode, startDate, endDate);

			log.debug("IPC", `check-announcement-range-synced: isSynced=${isSynced}`);
			return { isSynced };
		} catch (error: any) {
			log.error("IPC", "Failed to check announcement range synced:", error);
			throw error;
		}
	});

	// 从缓存搜索公告
	ipcMain.handle("search-announcements-from-cache", async (_event, keyword: string, limit: number = 100) => {
		try {
			log.debug("IPC", `search-announcements-from-cache: keyword=${keyword}, limit=${limit}`);

			const announcements = announcementRepository.searchAnnouncements(keyword, limit);

			// 添加分类信息
			const result = announcements.map((ann: any) => ({
				...ann,
				category: classificationService.classifyAnnouncementTitle(ann.title),
			}));

			log.debug("IPC", `search-announcements-from-cache: found ${result.length} announcements`);
			return result;
		} catch (error: any) {
			log.error("IPC", "Failed to search announcements from cache:", error);
			throw error;
		}
	});

	// 获取公告缓存统计
	ipcMain.handle("get-announcements-cache-stats", async () => {
		try {
			log.debug("IPC", "get-announcements-cache-stats");

			const totalCount = announcementRepository.countAnnouncements();

			return {
				totalCount,
			};
		} catch (error: any) {
			log.error("IPC", "Failed to get announcements cache stats:", error);
			throw error;
		}
	});

	// 标记所有公告
	ipcMain.handle("tag-all-announcements", async (_event, batchSize: number = 1000, reprocessAll: boolean = false) => {
		try {
			log.info("IPC", `tag-all-announcements: batchSize=${batchSize}, reprocessAll=${reprocessAll}`);

			const result = announcementRepository.tagAnnouncementsBatch(batchSize, undefined, reprocessAll);

			log.info("IPC", `tag-all-announcements: processed ${result.processed} announcements`);
			return result;
		} catch (error: any) {
			log.error("IPC", "Failed to tag all announcements:", error);
			throw error;
		}
	});

	// 重新处理所有公告
	ipcMain.handle("reprocess-all-announcements", async (_event, batchSize: number = 1000) => {
		try {
			log.info("IPC", `reprocess-all-announcements: batchSize=${batchSize}`);

			const result = announcementRepository.tagAnnouncementsBatch(batchSize, undefined, true);

			log.info("IPC", `reprocess-all-announcements: processed ${result.processed} announcements`);
			return result;
		} catch (error: any) {
			log.error("IPC", "Failed to reprocess all announcements:", error);
			throw error;
		}
	});

	// 同步公告范围
	ipcMain.handle("sync-announcements-range", async (_event, tsCode: string | null, startDate: string, endDate: string) => {
		try {
			// 调整结束日期：如果结束日期是今天或未来，扩展为今天+2天
			const adjustedEndDate = adjustEndDateForFutureAnnouncements(endDate);
			log.info("IPC", `sync-announcements-range: tsCode=${tsCode}, dateRange=${startDate}-${adjustedEndDate} (原始: ${endDate})`);

			// 从 API 获取公告
			const announcements = await TushareClient.getAnnouncementsComplete(tsCode || undefined, startDate, adjustedEndDate, (message, current, total) => {
				log.debug("IPC", message);
			});

			// 保存到数据库
			if (announcements.length > 0) {
				announcementRepository.upsertAnnouncements(announcements);
				// 记录同步范围（使用原始日期，recordAnnouncementSyncRange 内部会调整）
				announcementRepository.recordAnnouncementSyncRange(tsCode, startDate, endDate);
			}

			log.info("IPC", `sync-announcements-range: synced ${announcements.length} announcements`);
			return {
				success: true,
				count: announcements.length,
			};
		} catch (error: any) {
			log.error("IPC", "Failed to sync announcements range:", error);
			throw error;
		}
	});
}

