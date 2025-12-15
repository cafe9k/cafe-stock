/**
 * 股票列表数据获取 Hook
 * 封装股票列表数据获取逻辑，统一的状态管理和错误处理
 */

import { useState, useEffect, useCallback } from "react";
import { App } from "antd";
import * as stockService from "../services/stockService";
import type { Stock, StockGroup, StockFilter, StockListQueryResult } from "../types/stock";

/**
 * 股票列表 Hook 配置
 */
export interface UseStockListOptions {
	pageSize?: number;
	initialFilter?: StockFilter;
	enableFavoriteFilter?: boolean; // 是否启用关注筛选
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

	// 加载数据
	const loadData = useCallback(
		async (pageNum: number, currentFilter?: StockFilter) => {
			setLoading(true);
			try {
				const effectiveFilter = currentFilter || filter;
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
						effectiveFilter?.market
					)) as StockListQueryResult<T>;
				}

				// #region agent log
				fetch('http://127.0.0.1:7242/ingest/67286581-beef-43bb-8e6c-59afa2dd6840',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useStockList.ts:70',message:'Frontend hook received data from backend',data:{page:pageNum,count:result.items.length,first5:result.items.slice(0,5).map((s:any)=>({ts_code:s.ts_code,stock_name:s.stock_name||s.name,latest_ann_date:s.latest_ann_date,latest_ann_title:s.latest_ann_title?.substring(0,30)})),last5:result.items.slice(-5).map((s:any)=>({ts_code:s.ts_code,stock_name:s.stock_name||s.name,latest_ann_date:s.latest_ann_date,latest_ann_title:s.latest_ann_title?.substring(0,30)}))},timestamp:Date.now(),sessionId:'debug-session',runId:'new-run',hypothesisId:'I'})}).catch(()=>{});
				// #endregion

				setData(result.items);
				setTotal(result.total);
			} catch (error: any) {
				console.error("加载股票列表失败:", error);
				message.error(error.message || "加载失败");
				setData([]);
				setTotal(0);
			} finally {
				setLoading(false);
			}
		},
		[pageSize, filter, enableFavoriteFilter, message]
	);

	// 刷新当前页
	const refresh = useCallback(() => {
		loadData(page, filter);
	}, [loadData, page, filter]);

	// 更新筛选条件并重新加载
	const updateFilter = useCallback(
		(newFilter: StockFilter) => {
			setFilter(newFilter);
			setPage(1); // 重置到第一页
			loadData(1, newFilter);
		},
		[loadData]
	);

	// 切换页码
	const goToPage = useCallback(
		(pageNum: number) => {
			setPage(pageNum);
			loadData(pageNum, filter);
		},
		[loadData, filter]
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

