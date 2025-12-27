/**
 * 依赖: window.electronAPI(IPC), Ant Design App(消息提示)
 * 输出: useFavoriteStocks Hook - 提供收藏股票的状态管理和操作方法
 * 职责: 渲染进程业务逻辑Hook，封装股票收藏的状态管理和IPC调用
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/hooks/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
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
