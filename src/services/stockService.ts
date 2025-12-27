/**
 * 依赖: window.electronAPI(IPC), favoriteStockService(收藏服务), types(类型定义) [../types/stock.ts, ./favoriteStockService.ts]
 * 输出: getAnnouncementsGrouped(), getAllStocks() - 股票数据获取服务函数
 * 职责: 渲染进程服务层，封装股票相关的IPC调用，提供数据获取和处理的统一接口
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/services/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import type { Stock, StockGroup, StockListQueryResult } from "../types/stock";
import { markFavoriteStatus } from "./favoriteStockService";

/**
 * 获取股票聚合列表（用于公告列表等场景）
 */
export async function getAnnouncementsGrouped(
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string,
	market?: string,
	forceRefresh?: boolean,
	searchKeyword?: string,
	categories?: string[],
	marketCapRange?: { min?: number; max?: number }
): Promise<StockListQueryResult<StockGroup>> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	const result = await window.electronAPI.getAnnouncementsGrouped(
		page,
		pageSize,
		startDate,
		endDate,
		market,
		forceRefresh,
		searchKeyword,
		categories,
		marketCapRange
	);
	// 后端已经在分页前对所有数据进行了排序，这里不需要再次排序
	const items = await markFavoriteStatus(result.items);
	return {
		...result,
		items,
	};
}

/**
 * 获取关注的股票的公告聚合列表
 */
export async function getFavoriteStocksAnnouncementsGrouped(
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string
): Promise<StockListQueryResult<StockGroup>> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	const result = await window.electronAPI.getFavoriteStocksAnnouncementsGrouped(page, pageSize, startDate, endDate);
	// 后端已经在分页前对所有数据进行了排序，这里不需要再次排序
	const items = await markFavoriteStatus(result.items);
	return {
		...result,
		items,
	};
}

/**
 * 搜索公告聚合列表
 */
export async function searchAnnouncementsGrouped(
	keyword: string,
	page: number,
	pageSize: number,
	startDate?: string,
	endDate?: string,
	market?: string
): Promise<StockListQueryResult<StockGroup>> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	const result = await window.electronAPI.searchAnnouncementsGrouped(keyword, page, pageSize, startDate, endDate, market);
	// 后端已经在分页前对所有数据进行了排序，这里不需要再次排序
	const items = await markFavoriteStatus(result.items);
	return {
		...result,
		items,
	};
}

/**
 * 获取关注的股票详细信息列表
 */
export async function getFavoriteStocksDetail(): Promise<Stock[]> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	const favoriteCodes = await window.electronAPI.getAllFavoriteStocks();
	if (favoriteCodes.length === 0) {
		return [];
	}

	// 获取所有股票列表
	const allStocks = await window.electronAPI.getAllStocks();

	// 根据收藏的股票代码过滤
	const stocksData = allStocks.filter((stock) => favoriteCodes.includes(stock.ts_code));

	return await markFavoriteStatus(stocksData);
}
