/**
 * 依赖: useStockFilter(hook), types(类型定义)
 * 输出: useAnnouncementFilter Hook - 统一管理公告列表的所有筛选条件（包括防抖搜索）
 * 职责: 渲染进程业务逻辑Hook，整合所有筛选条件，提供统一的筛选接口
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/hooks/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useStockFilter } from "./useStockFilter";
import type { StockFilter } from "../types/stock";

/**
 * 公告筛选 Hook 配置
 */
export interface UseAnnouncementFilterOptions {
	/**
	 * 搜索防抖延迟（毫秒），默认 500ms
	 */
	debounceDelay?: number;
	/**
	 * 初始筛选条件
	 */
	initialFilter?: Partial<StockFilter>;
}

/**
 * 公告筛选 Hook
 * 整合所有筛选条件，包括防抖搜索、市值筛选、分类筛选等
 */
export function useAnnouncementFilter(options: UseAnnouncementFilterOptions = {}) {
	const { debounceDelay = 500, initialFilter } = options;

	// 使用基础筛选 Hook
	const baseFilter = useStockFilter(initialFilter);

	// 搜索关键词（用户输入）
	const [searchKeyword, setSearchKeyword] = useState<string>(initialFilter?.searchKeyword || "");
	// 防抖后的搜索关键词（用于实际触发搜索）
	const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState<string>(
		initialFilter?.searchKeyword || ""
	);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// 防抖处理：输入停止 debounceDelay ms 后执行搜索
	useEffect(() => {
		// 清除之前的定时器
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// 设置新的定时器
		debounceTimerRef.current = setTimeout(() => {
			setDebouncedSearchKeyword(searchKeyword);
		}, debounceDelay);

		// 清理函数：组件卸载时清除定时器
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [searchKeyword, debounceDelay]);

	// 立即更新搜索关键词（跳过防抖，用于回车或点击搜索按钮）
	const setSearchKeywordImmediate = useCallback(
		(value: string) => {
			const trimmedValue = value.trim();
			setSearchKeyword(trimmedValue);
			// 立即更新防抖搜索关键词（跳过防抖）
			setDebouncedSearchKeyword(trimmedValue);

			// 清除防抖定时器，避免重复触发
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		},
		[]
	);

	// 清空搜索关键词（立即执行）
	const clearSearchKeyword = useCallback(() => {
		setSearchKeyword("");
		setDebouncedSearchKeyword("");
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
	}, []);

	// 构建完整的筛选条件
	const currentFilter = useMemo<StockFilter>(() => {
		const filter = baseFilter.getFilter();
		return {
			...filter,
			searchKeyword: debouncedSearchKeyword.trim() || undefined,
		};
	}, [baseFilter, debouncedSearchKeyword]);

	// 重置所有筛选条件
	const resetAllFilters = useCallback(() => {
		baseFilter.resetFilter();
		setSearchKeyword("");
		setDebouncedSearchKeyword("");
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
	}, [baseFilter]);

	return {
		// 基础筛选（来自 useStockFilter）
		...baseFilter,
		// 搜索关键词状态
		searchKeyword,
		debouncedSearchKeyword,
		// 搜索关键词设置方法
		setSearchKeyword,
		setSearchKeywordImmediate,
		clearSearchKeyword,
		// 完整筛选条件
		currentFilter,
		// 重置所有筛选
		resetAllFilters,
	};
}

