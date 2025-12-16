/**
 * 公告相关 IPC 处理器
 */

import { ipcMain } from "electron";
import { TushareClient } from "../tushare.js";
import * as announcementService from "../services/announcement.js";
import * as classificationService from "../services/classification.js";
import {
	getAnnouncementsByDateRange,
	searchAnnouncements,
	isAnnouncementRangeSynced,
	upsertAnnouncements,
	recordAnnouncementSyncRange,
	countAnnouncements,
	tagAnnouncementsBatch,
} from "../db.js";

/**
 * 注册公告相关 IPC 处理器
 */
export function registerAnnouncementHandlers(): void {
	// 获取按股票聚合的公告列表
	ipcMain.handle(
		"get-announcements-grouped",
		async (_event, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string, forceRefresh?: boolean) => {
			try {
				console.log(
					`[IPC] get-announcements-grouped: page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}, market=${market}, forceRefresh=${forceRefresh}`
				);

				const result = await announcementService.getAnnouncementsGroupedFromAPI(page, pageSize, startDate, endDate, market, forceRefresh);

				console.log(`[IPC] get-announcements-grouped: page=${page}, items=${result.items.length}, total=${result.total}`);

				return result;
			} catch (error: any) {
				console.error("Failed to get grouped announcements:", error);
				throw error;
			}
		}
	);

	// 获取特定股票的公告列表
	ipcMain.handle("get-stock-announcements", async (_event, tsCode: string, limit: number = 100, startDate?: string, endDate?: string) => {
		try {
			console.log(`[IPC] get-stock-announcements: tsCode=${tsCode}, limit=${limit}, dateRange=${startDate}-${endDate}`);

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
			console.error("Failed to get stock announcements:", error);
			throw error;
		}
	});

	// 搜索按股票聚合的公告数据
	ipcMain.handle(
		"search-announcements-grouped",
		async (_event, keyword: string, page: number, pageSize: number, startDate?: string, endDate?: string, market?: string) => {
			try {
				console.log(
					`[IPC] search-announcements-grouped: keyword=${keyword}, page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}, market=${market}`
				);

				const result = await announcementService.searchAnnouncementsGroupedFromAPI(keyword, page, pageSize, startDate, endDate, market);

				console.log(`[IPC] search-announcements-grouped: page=${page}, items=${result.items.length}, total=${result.total}`);

				return result;
			} catch (error: any) {
				console.error("Failed to search grouped announcements:", error);
				throw error;
			}
		}
	);

	// 获取关注股票的公告列表
	ipcMain.handle(
		"get-favorite-stocks-announcements-grouped",
		async (_event, page: number, pageSize: number, startDate?: string, endDate?: string) => {
			try {
				console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${page}, pageSize=${pageSize}, dateRange=${startDate}-${endDate}`);

				const result = await announcementService.getFavoriteStocksAnnouncementsGroupedFromAPI(page, pageSize, startDate, endDate);

				console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${page}, items=${result.items.length}, total=${result.total}`);

				return result;
			} catch (error: any) {
				console.error("Failed to get favorite stocks announcements:", error);
				throw error;
			}
		}
	);

	// 获取公告 PDF 文件信息
	ipcMain.handle("get-announcement-pdf", async (_event, tsCode: string, annDate: string, title: string) => {
		try {
			console.log(`[IPC] get-announcement-pdf: tsCode=${tsCode}, annDate=${annDate}, title=${title}`);

			// 从 Tushare 获取公告原文信息
			const files = await TushareClient.getAnnouncementFiles(tsCode, annDate);

			console.log(`[IPC] Found ${files.length} announcements for ${tsCode} on ${annDate}`);

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
				console.log(`[IPC] Found PDF URL: ${matchedFile.url}`);
				return {
					success: true,
					url: matchedFile.url,
				};
			}

			console.log(`[IPC] No PDF found for announcement: ${title}`);
			return {
				success: false,
				message: "该公告暂无 PDF 文件",
			};
		} catch (error: any) {
			console.error("Failed to get announcement PDF:", error);
			return {
				success: false,
				message: error.message || "获取 PDF 失败",
			};
		}
	});

	// 从缓存获取公告
	ipcMain.handle("get-announcements-from-cache", async (_event, tsCode: string | null, startDate: string, endDate: string) => {
		try {
			console.log(`[IPC] get-announcements-from-cache: tsCode=${tsCode}, dateRange=${startDate}-${endDate}`);

			const announcements = getAnnouncementsByDateRange(startDate, endDate, tsCode || undefined);

			// 添加分类信息
			const result = announcements.map((ann: any) => ({
				...ann,
				category: classificationService.classifyAnnouncementTitle(ann.title),
			}));

			console.log(`[IPC] get-announcements-from-cache: found ${result.length} announcements`);
			return result;
		} catch (error: any) {
			console.error("Failed to get announcements from cache:", error);
			throw error;
		}
	});

	// 检查公告范围是否已同步
	ipcMain.handle("check-announcement-range-synced", async (_event, tsCode: string | null, startDate: string, endDate: string) => {
		try {
			console.log(`[IPC] check-announcement-range-synced: tsCode=${tsCode}, dateRange=${startDate}-${endDate}`);

			const isSynced = isAnnouncementRangeSynced(tsCode, startDate, endDate);

			console.log(`[IPC] check-announcement-range-synced: isSynced=${isSynced}`);
			return { isSynced };
		} catch (error: any) {
			console.error("Failed to check announcement range synced:", error);
			throw error;
		}
	});

	// 从缓存搜索公告
	ipcMain.handle("search-announcements-from-cache", async (_event, keyword: string, limit: number = 100) => {
		try {
			console.log(`[IPC] search-announcements-from-cache: keyword=${keyword}, limit=${limit}`);

			const announcements = searchAnnouncements(keyword, limit);

			// 添加分类信息
			const result = announcements.map((ann: any) => ({
				...ann,
				category: classificationService.classifyAnnouncementTitle(ann.title),
			}));

			console.log(`[IPC] search-announcements-from-cache: found ${result.length} announcements`);
			return result;
		} catch (error: any) {
			console.error("Failed to search announcements from cache:", error);
			throw error;
		}
	});

	// 获取公告缓存统计
	ipcMain.handle("get-announcements-cache-stats", async () => {
		try {
			console.log("[IPC] get-announcements-cache-stats");

			const totalCount = countAnnouncements();

			return {
				totalCount,
			};
		} catch (error: any) {
			console.error("Failed to get announcements cache stats:", error);
			throw error;
		}
	});

	// 标记所有公告
	ipcMain.handle("tag-all-announcements", async (_event, batchSize: number = 1000, reprocessAll: boolean = false) => {
		try {
			console.log(`[IPC] tag-all-announcements: batchSize=${batchSize}, reprocessAll=${reprocessAll}`);

			const result = tagAnnouncementsBatch(batchSize, undefined, reprocessAll);

			console.log(`[IPC] tag-all-announcements: processed ${result.processed} announcements`);
			return result;
		} catch (error: any) {
			console.error("Failed to tag all announcements:", error);
			throw error;
		}
	});

	// 重新处理所有公告
	ipcMain.handle("reprocess-all-announcements", async (_event, batchSize: number = 1000) => {
		try {
			console.log(`[IPC] reprocess-all-announcements: batchSize=${batchSize}`);

			const result = tagAnnouncementsBatch(batchSize, undefined, true);

			console.log(`[IPC] reprocess-all-announcements: processed ${result.processed} announcements`);
			return result;
		} catch (error: any) {
			console.error("Failed to reprocess all announcements:", error);
			throw error;
		}
	});

	// 同步公告范围
	ipcMain.handle("sync-announcements-range", async (_event, tsCode: string | null, startDate: string, endDate: string) => {
		try {
			console.log(`[IPC] sync-announcements-range: tsCode=${tsCode}, dateRange=${startDate}-${endDate}`);

			// 从 API 获取公告
			const announcements = await TushareClient.getAnnouncementsComplete(tsCode || undefined, startDate, endDate, (message, current, total) => {
				console.log(`[sync-announcements-range] ${message}`);
			});

			// 保存到数据库
			if (announcements.length > 0) {
				upsertAnnouncements(announcements);
				recordAnnouncementSyncRange(tsCode, startDate, endDate);
			}

			console.log(`[IPC] sync-announcements-range: synced ${announcements.length} announcements`);
			return {
				success: true,
				count: announcements.length,
			};
		} catch (error: any) {
			console.error("Failed to sync announcements range:", error);
			throw error;
		}
	});
}

