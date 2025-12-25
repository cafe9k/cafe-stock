/**
 * 股票列表数据获取 Hook
 * 封装股票列表数据获取逻辑，统一的状态管理和错误处理
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { App } from "antd";
import * as stockService from "../services/stockService";
import type { StockGroup, StockFilter, StockListQueryResult } from "../types/stock";

/**
 * 股票列表 Hook 配置
 */
export interface UseStockListOptions {
	pageSize?: number;
	initialFilter?: StockFilter;
	enableFavoriteFilter?: boolean; // 是否启用关注筛选
}

/**
 * 比较两个筛选条件是否相同
 */
function isFilterEqual(filter1?: StockFilter, filter2?: StockFilter): boolean {
	if (!filter1 && !filter2) return true;
	if (!filter1 || !filter2) return false;

	// 比较 dateRange
	const dateRange1 = filter1.dateRange;
	const dateRange2 = filter2.dateRange;
	const dateRangeEqual =
		(!dateRange1 && !dateRange2) ||
		(dateRange1 &&
			dateRange2 &&
			dateRange1[0] === dateRange2[0] &&
			dateRange1[1] === dateRange2[1]);

	// 比较 marketCapRange
	const marketCapRange1 = filter1.marketCapRange;
	const marketCapRange2 = filter2.marketCapRange;
	const marketCapRangeEqual =
		(!marketCapRange1 && !marketCapRange2) ||
		(marketCapRange1 &&
			marketCapRange2 &&
			marketCapRange1.min === marketCapRange2.min &&
			marketCapRange1.max === marketCapRange2.max);

	// 比较 categories
	const categories1 = filter1.categories;
	const categories2 = filter2.categories;
	const categoriesEqual =
		(!categories1 && !categories2) ||
		(categories1 &&
			categories2 &&
			categories1.length === categories2.length &&
			categories1.every((cat, idx) => cat === categories2[idx]));

	return (
		filter1.market === filter2.market &&
		filter1.searchKeyword === filter2.searchKeyword &&
		filter1.showFavoriteOnly === filter2.showFavoriteOnly &&
		dateRangeEqual &&
		marketCapRangeEqual &&
		categoriesEqual
	);
}

/**
 * 股票列表 Hook（用于公告聚合场景）
 */
export function useStockList<T extends StockGroup = StockGroup>(options: UseStockListOptions = {}) {
	const { message } = App.useApp();
	const { pageSize = 20, initialFilter, enableFavoriteFilter = true } = options;

	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [filter, setFilter] = useState<StockFilter | undefined>(initialFilter);

	// 使用 ref 存储最新的 filter，避免闭包问题
	const filterRef = useRef<StockFilter | undefined>(filter);
	useEffect(() => {
		filterRef.current = filter;
	}, [filter]);

	// 加载数据（不依赖 filter，使用 ref 获取最新值）
	const loadData = useCallback(
		async (pageNum: number, currentFilter?: StockFilter, forceRefresh?: boolean) => {
			setLoading(true);
			try {
				// 优先使用传入的 filter，否则使用 ref 中的最新值
				const effectiveFilter = currentFilter || filterRef.current;
				let result: StockListQueryResult<T>;

				if (effectiveFilter?.searchKeyword) {
					// 搜索模式
					result = (await stockService.searchAnnouncementsGrouped(
						effectiveFilter.searchKeyword,
						pageNum,
						pageSize,
						effectiveFilter.dateRange?.[0],
						effectiveFilter.dateRange?.[1],
						effectiveFilter.market
					)) as StockListQueryResult<T>;
				} else if (effectiveFilter?.showFavoriteOnly && enableFavoriteFilter) {
					// 仅关注模式
					result = (await stockService.getFavoriteStocksAnnouncementsGrouped(
						pageNum,
						pageSize,
						effectiveFilter.dateRange?.[0],
						effectiveFilter.dateRange?.[1]
					)) as StockListQueryResult<T>;
				} else {
					// 普通模式
					result = (await stockService.getAnnouncementsGrouped(
						pageNum,
						pageSize,
						effectiveFilter?.dateRange?.[0],
						effectiveFilter?.dateRange?.[1],
						effectiveFilter?.market,
						forceRefresh,
						effectiveFilter?.searchKeyword,
						effectiveFilter?.categories
					)) as StockListQueryResult<T>;
				}

				setData(result.items);
				setTotal(result.total);
				setPage(pageNum); // 更新当前页码
			} catch (error: any) {
				console.error("加载股票列表失败:", error);
				message.error(error.message || "加载失败");
				setData([]);
				setTotal(0);
			} finally {
				setLoading(false);
			}
		},
		[pageSize, enableFavoriteFilter, message]
	);

	// 刷新当前页（支持强制刷新）
	const refresh = useCallback(
		(forceRefresh?: boolean) => {
			loadData(page, filterRef.current, forceRefresh);
		},
		[loadData, page]
	);

	// 更新筛选条件并重新加载（筛选条件变化时重置到第一页）
	const updateFilter = useCallback(
		(newFilter: StockFilter) => {
			// 检查筛选条件是否真的发生了变化
			if (isFilterEqual(filterRef.current, newFilter)) {
				return; // 筛选条件未变化，不重新加载
			}

			setFilter(newFilter);
			filterRef.current = newFilter;
			setPage(1); // 重置到第一页
			loadData(1, newFilter); // 使用新的筛选条件重新加载
		},
		[loadData]
	);

	// 切换页码
	const goToPage = useCallback(
		(pageNum: number) => {
			setPage(pageNum);
			loadData(pageNum, filterRef.current);
		},
		[loadData]
	);

	// 上一页
	const prevPage = useCallback(() => {
		if (page > 1) {
			goToPage(page - 1);
		}
	}, [page, goToPage]);

	// 下一页
	const nextPage = useCallback(() => {
		const totalPages = Math.ceil(total / pageSize);
		if (page < totalPages) {
			goToPage(page + 1);
		}
	}, [page, total, pageSize, goToPage]);

	// 初始加载
	useEffect(() => {
		if (initialFilter) {
			setFilter(initialFilter);
			filterRef.current = initialFilter;
		}
		loadData(1, initialFilter);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // 只在组件挂载时加载一次

	return {
		data,
		loading,
		page,
		total,
		pageSize,
		filter,
		loadData,
		refresh,
		updateFilter,
		goToPage,
		prevPage,
		nextPage,
	};
}

