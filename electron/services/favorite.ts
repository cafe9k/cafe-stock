/**
 * 收藏服务模块
 * 负责股票收藏功能
 */

import { getDb } from "../db.js";
import { FavoriteRepository } from "../repositories/implementations/FavoriteRepository.js";

// 创建仓储实例
const favoriteRepository = new FavoriteRepository(getDb());

/**
 * 添加收藏股票
 */
export function addFavoriteStock(tsCode: string): boolean {
	return favoriteRepository.addFavoriteStock(tsCode);
}

/**
 * 移除收藏股票
 */
export function removeFavoriteStock(tsCode: string): boolean {
	return favoriteRepository.removeFavoriteStock(tsCode);
}

/**
 * 检查是否已收藏
 */
export function isFavoriteStock(tsCode: string): boolean {
	return favoriteRepository.isFavoriteStock(tsCode);
}

/**
 * 获取所有收藏的股票代码
 */
export function getAllFavoriteStocks(): string[] {
	return favoriteRepository.getAllFavoriteStocks();
}

/**
 * 获取收藏股票数量
 */
export function countFavoriteStocks(): number {
	return favoriteRepository.countFavoriteStocks();
}

