/**
 * INPUT: window.electronAPI(IPC), types(类型定义)
 * OUTPUT: markFavoriteStatus() - 为股票列表标记收藏状态的服务函数
 * POS: 渲染进程服务层，封装收藏状态的标记逻辑，为股票数据添加isFavorite字段
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/services/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
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

