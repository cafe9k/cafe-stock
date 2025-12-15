/**
 * 关注股票服务
 * 提供股票关注状态标记功能
 */

import type { Stock, StockGroup } from "../types/stock";

/**
 * 为股票列表标记关注状态
 */
export async function markFavoriteStatus<T extends Stock | StockGroup>(items: T[]): Promise<T[]> {
	if (!window.electronAPI || items.length === 0) {
		return items;
	}

	try {
		const favoriteCodes = await window.electronAPI.getAllFavoriteStocks();
		const favoriteSet = new Set(favoriteCodes);

		return items.map((item) => ({
			...item,
			isFavorite: favoriteSet.has(item.ts_code),
		}));
	} catch (error) {
		console.error("Failed to mark favorite status:", error);
		return items;
	}
}

