/**
 * 股票服务
 * 封装所有股票相关的 API 调用
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
	categories?: string[]
): Promise<StockListQueryResult<StockGroup>> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	const result = await window.electronAPI.getAnnouncementsGrouped(page, pageSize, startDate, endDate, market, forceRefresh, searchKeyword, categories);
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

