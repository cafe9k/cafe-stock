/**
 * 股票搜索 Hook
 * 封装股票搜索逻辑，包含防抖处理
 */

import { useState, useCallback, useRef } from "react";
import { App } from "antd";
import * as stockService from "../services/stockService";
import type { Stock } from "../types/stock";

/**
 * 股票搜索 Hook
 */
export function useStockSearch() {
	const { message } = App.useApp();
	const [searchResults, setSearchResults] = useState<Stock[]>([]);
	const [searching, setSearching] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// 执行搜索
	const performSearch = useCallback(
		async (keyword: string, limit: number = 20) => {
			if (!keyword || keyword.trim().length === 0) {
				setSearchResults([]);
				setSearchKeyword("");
				return;
			}

			setSearching(true);
			setSearchKeyword(keyword.trim());
			try {
				const results = await stockService.searchStocks(keyword.trim(), limit);
				setSearchResults(results);
			} catch (error: any) {
				console.error("搜索股票失败:", error);
				message.error(`搜索股票失败: ${error.message || "未知错误"}`);
				setSearchResults([]);
			} finally {
				setSearching(false);
			}
		},
		[message]
	);

	// 防抖搜索
	const searchWithDebounce = useCallback(
		(keyword: string, delay: number = 300) => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(() => {
				performSearch(keyword);
			}, delay);
		},
		[performSearch]
	);

	// 清除搜索
	const clearSearch = useCallback(() => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		setSearchResults([]);
		setSearchKeyword("");
		setSearching(false);
	}, []);

	// 清理定时器
	const cleanup = useCallback(() => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
	}, []);

	return {
		searchResults,
		searching,
		searchKeyword,
		search: performSearch,
		searchWithDebounce,
		clearSearch,
		cleanup,
	};
}

