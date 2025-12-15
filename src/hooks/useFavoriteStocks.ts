/**
 * 关注股票 Hook
 * 管理股票关注状态和操作
 */

import { useState, useEffect, useCallback } from "react";
import { App } from "antd";

/**
 * 关注股票 Hook
 */
export function useFavoriteStocks() {
	const { message } = App.useApp();
	const [favoriteCodes, setFavoriteCodes] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	// 加载关注列表
	const loadFavorites = useCallback(async () => {
		try {
			if (!window.electronAPI) {
				return;
			}
			const codes = await window.electronAPI.getAllFavoriteStocks();
			setFavoriteCodes(codes);
		} catch (error) {
			console.error("Failed to load favorite stocks:", error);
		}
	}, []);

	// 初始加载
	useEffect(() => {
		loadFavorites();
	}, [loadFavorites]);

	// 切换关注状态
	const toggleFavorite = useCallback(
		async (tsCode: string, stockName?: string) => {
			if (!window.electronAPI) {
				throw new Error("Electron API not available");
			}

			setLoading(true);
			try {
				const isFavorite = favoriteCodes.includes(tsCode);

				if (isFavorite) {
					// 取消关注
					const result = await window.electronAPI.removeFavoriteStock(tsCode);
					if (result.success) {
						setFavoriteCodes((prev) => prev.filter((code) => code !== tsCode));
						message.success(`已取消关注 ${stockName || tsCode}`);
					} else {
						message.error(result.message || "取消关注失败");
					}
				} else {
					// 添加关注
					const result = await window.electronAPI.addFavoriteStock(tsCode);
					if (result.success) {
						setFavoriteCodes((prev) => [...prev, tsCode]);
						message.success(`已关注 ${stockName || tsCode}`);
					} else {
						message.error(result.message || "关注失败");
					}
				}
			} catch (error: any) {
				console.error("Toggle favorite error:", error);
				message.error(error.message || "操作失败");
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[favoriteCodes, message]
	);

	// 检查是否已关注
	const isFavorite = useCallback(
		(tsCode: string) => {
			return favoriteCodes.includes(tsCode);
		},
		[favoriteCodes]
	);

	return {
		favoriteCodes,
		loading,
		toggleFavorite,
		isFavorite,
		refresh: loadFavorites,
	};
}

