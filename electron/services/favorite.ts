/**
 * 收藏服务模块
 * 负责股票收藏功能
 */

import {
	addFavoriteStock as dbAddFavoriteStock,
	removeFavoriteStock as dbRemoveFavoriteStock,
	isFavoriteStock as dbIsFavoriteStock,
	getAllFavoriteStocks as dbGetAllFavoriteStocks,
	countFavoriteStocks as dbCountFavoriteStocks,
} from "../db.js";

/**
 * 添加收藏股票
 */
export function addFavoriteStock(tsCode: string): boolean {
	return dbAddFavoriteStock(tsCode);
}

/**
 * 移除收藏股票
 */
export function removeFavoriteStock(tsCode: string): boolean {
	return dbRemoveFavoriteStock(tsCode);
}

/**
 * 检查是否已收藏
 */
export function isFavoriteStock(tsCode: string): boolean {
	return dbIsFavoriteStock(tsCode);
}

/**
 * 获取所有收藏的股票代码
 */
export function getAllFavoriteStocks(): string[] {
	return dbGetAllFavoriteStocks();
}

/**
 * 获取收藏股票数量
 */
export function countFavoriteStocks(): number {
	return dbCountFavoriteStocks();
}

