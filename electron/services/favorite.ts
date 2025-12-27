/**
 * 依赖: FavoriteRepository(数据访问)
 * 输出: addFavoriteStock(), removeFavoriteStock(), getAllFavoriteStocks() - 收藏管理CRUD接口
 * 职责: 用户收藏服务，提供股票收藏的业务逻辑封装
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/services/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
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
