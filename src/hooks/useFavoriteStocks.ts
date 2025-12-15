/**
 * 关注股票管理 Hook
 * 封装关注股票相关的逻辑和状态管理
 */

import { useState, useEffect, useCallback } from "react";
import { App } from "antd";
import * as favoriteStockService from "../services/favoriteStockService";

/**
 * 关注股票管理 Hook
 */
export function useFavoriteStocks() {
	const { message } = App.useApp();
	const [favoriteCodes, setFavoriteCodes] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(false);

	// 加载关注股票列表
	const loadFavoriteStocks = useCallback(async () => {
		try {
			setLoading(true);
			const codes = await favoriteStockService.getAllFavoriteStocks();
			setFavoriteCodes(new Set(codes));
		} catch (error: any) {
			console.error("加载关注股票失败:", error);
			message.error(`加载关注股票失败: ${error.message || "未知错误"}`);
		} finally {
			setLoading(false);
		}
	}, [message]);

	// 初始化加载
	useEffect(() => {
		loadFavoriteStocks();
	}, [loadFavoriteStocks]);

	// 切换关注状态
	const toggleFavorite = useCallback(
		async (tsCode: string, stockName?: string): Promise<boolean> => {
			try {
				const isFavorite = favoriteCodes.has(tsCode);
				const result = await favoriteStockService.toggleFavoriteStock(tsCode, isFavorite);

				if (result.success) {
					// 更新本地状态
					setFavoriteCodes((prev) => {
						const newSet = new Set(prev);
						if (isFavorite) {
							newSet.delete(tsCode);
							message.success(stockName ? `已取消关注 ${stockName}` : "已取消关注");
						} else {
							newSet.add(tsCode);
							message.success(stockName ? `已关注 ${stockName}` : "已关注");
						}
						return newSet;
					});
					return !isFavorite;
				} else {
					message.error(result.message || "操作失败");
					return isFavorite;
				}
			} catch (error: any) {
				console.error("切换关注状态失败:", error);
				message.error(`操作失败: ${error.message || "未知错误"}`);
				return favoriteCodes.has(tsCode);
			}
		},
		[favoriteCodes, message]
	);

	// 检查是否关注
	const isFavorite = useCallback(
		(tsCode: string): boolean => {
			return favoriteCodes.has(tsCode);
		},
		[favoriteCodes]
	);

	return {
		favoriteCodes,
		loading,
		loadFavoriteStocks,
		toggleFavorite,
		isFavorite,
	};
}

