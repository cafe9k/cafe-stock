/**
 * 关注股票服务
 * 封装所有关注股票相关的 API 调用
 */

import type { FavoriteStockResult, Stock } from "../types/stock";

/**
 * 获取所有关注的股票代码列表
 */
export async function getAllFavoriteStocks(): Promise<string[]> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	return await window.electronAPI.getAllFavoriteStocks();
}

/**
 * 检查股票是否已关注
 */
export async function isFavoriteStock(tsCode: string): Promise<boolean> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	return await window.electronAPI.isFavoriteStock(tsCode);
}

/**
 * 添加关注股票
 */
export async function addFavoriteStock(tsCode: string): Promise<FavoriteStockResult> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	return await window.electronAPI.addFavoriteStock(tsCode);
}

/**
 * 取消关注股票
 */
export async function removeFavoriteStock(tsCode: string): Promise<FavoriteStockResult> {
	if (!window.electronAPI) {
		throw new Error("Electron API not available");
	}
	return await window.electronAPI.removeFavoriteStock(tsCode);
}

/**
 * 切换关注状态
 */
export async function toggleFavoriteStock(tsCode: string, currentStatus: boolean): Promise<FavoriteStockResult> {
	if (currentStatus) {
		return await removeFavoriteStock(tsCode);
	} else {
		return await addFavoriteStock(tsCode);
	}
}

/**
 * 批量标记股票的关注状态
 */
export async function markFavoriteStatus<T extends { ts_code: string; isFavorite?: boolean }>(
	stocks: T[]
): Promise<T[]> {
	try {
		const favoriteCodes = await getAllFavoriteStocks();
		const favoriteSet = new Set(favoriteCodes);
		return stocks.map((stock) => ({
			...stock,
			isFavorite: favoriteSet.has(stock.ts_code),
		}));
	} catch (error) {
		console.error("Failed to mark favorite status:", error);
		return stocks;
	}
}

