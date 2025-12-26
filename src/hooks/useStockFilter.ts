/**
 * INPUT: dayjs(日期库), types(类型定义)
 * OUTPUT: useStockFilter Hook - 提供股票筛选条件的状态管理（市场、关键词、日期范围等）
 * POS: 渲染进程业务逻辑Hook，封装股票筛选的状态管理和逻辑处理
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/hooks/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useState, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import type { StockFilter } from "../types/stock";

/**
 * 日期范围类型
 */
export type DateRange = [Dayjs, Dayjs] | [Dayjs | null, Dayjs | null] | null;

/**
 * 快速日期选择选项
 */
export type QuickDateOption = "today" | "tomorrow" | "yesterday" | "week" | "month" | "quarter";

/**
 * 股票筛选 Hook
 */
export function useStockFilter(initialFilter?: Partial<StockFilter>) {
	// 市场筛选
	const [selectedMarket, setSelectedMarket] = useState<string>(initialFilter?.market || "all");

	// 搜索关键词
	const [searchKeyword, setSearchKeyword] = useState<string>(initialFilter?.searchKeyword || "");

	// 日期范围 - 默认最近一周
	const getDefaultDateRange = (): [string, string] => {
		const today = dayjs().format("YYYYMMDD");
		const weekAgo = dayjs().subtract(7, "day").format("YYYYMMDD");
		return [weekAgo, today];
	};

	const [dateRange, setDateRange] = useState<[string, string]>(initialFilter?.dateRange || getDefaultDateRange());
	const [dateRangeDisplay, setDateRangeDisplay] = useState<DateRange>([
		dayjs().subtract(7, "day"),
		dayjs(),
	]);

	// 快速日期选择
	const [quickSelectValue, setQuickSelectValue] = useState<QuickDateOption>("week");

	// 日期格式化辅助函数：Dayjs -> YYYYMMDD
	const formatDateToString = (date: Dayjs): string => {
		return date.format("YYYYMMDD");
	};

	// 日期格式化辅助函数：YYYYMMDD -> Dayjs
	const parseDateString = (dateStr: string): Dayjs => {
		return dayjs(dateStr, "YYYYMMDD");
	};

	// 计算 N 天前的日期
	const getDaysAgo = (days: number): string => {
		return dayjs().subtract(days, "day").format("YYYYMMDD");
	};

	// 快速日期范围选择处理
	const handleQuickSelect = useCallback((value: QuickDateOption) => {
		setQuickSelectValue(value);

		const today = dayjs().format("YYYYMMDD");
		let newDateRange: [string, string];
		let newDateRangeDisplay: DateRange;

		switch (value) {
			case "today":
				newDateRange = [today, today];
				newDateRangeDisplay = [parseDateString(today), parseDateString(today)];
				break;
			case "tomorrow":
				const tomorrow = dayjs().add(1, "day").format("YYYYMMDD");
				newDateRange = [tomorrow, tomorrow];
				newDateRangeDisplay = [parseDateString(tomorrow), parseDateString(tomorrow)];
				break;
			case "yesterday":
				const yesterday = getDaysAgo(1);
				newDateRange = [yesterday, yesterday];
				newDateRangeDisplay = [parseDateString(yesterday), parseDateString(yesterday)];
				break;
			case "week":
				const weekAgo = getDaysAgo(7);
				newDateRange = [weekAgo, today];
				newDateRangeDisplay = [parseDateString(weekAgo), parseDateString(today)];
				break;
			case "month":
				const monthAgo = getDaysAgo(30);
				newDateRange = [monthAgo, today];
				newDateRangeDisplay = [parseDateString(monthAgo), parseDateString(today)];
				break;
			case "quarter":
				const quarterAgo = getDaysAgo(90);
				newDateRange = [quarterAgo, today];
				newDateRangeDisplay = [parseDateString(quarterAgo), parseDateString(today)];
				break;
			default:
				const defaultWeekAgo = getDaysAgo(7);
				newDateRange = [defaultWeekAgo, today];
				newDateRangeDisplay = [parseDateString(defaultWeekAgo), parseDateString(today)];
		}

		setDateRange(newDateRange);
		setDateRangeDisplay(newDateRangeDisplay);
	}, []);

	// 日期范围选择 - 用户输入起始时间即认为自定义
	const handleDateRangeChange = useCallback((dates: DateRange) => {
		if (dates && dates[0] && dates[1]) {
			const startDate = formatDateToString(dates[0]);
			const endDate = formatDateToString(dates[1]);
			setDateRange([startDate, endDate]);
			setDateRangeDisplay([dates[0], dates[1]]);
		} else if (dates && dates[0]) {
			// 只选择了起始时间，等待用户选择结束时间
			const startDate = formatDateToString(dates[0]);
			const today = dayjs().format("YYYYMMDD");
			setDateRange([startDate, today]);
			setDateRangeDisplay([dates[0], dayjs()]);
		} else {
			// 清空时恢复默认最近一周
			const defaultRange = getDefaultDateRange();
			setDateRange(defaultRange);
			setDateRangeDisplay([dayjs().subtract(7, "day"), dayjs()]);
			setQuickSelectValue("week");
		}
	}, []);

	// 获取当前筛选条件
	const getFilter = useCallback((): StockFilter => {
		return {
			market: selectedMarket === "all" ? undefined : selectedMarket,
			searchKeyword: searchKeyword.trim() || undefined,
			dateRange,
		};
	}, [selectedMarket, searchKeyword, dateRange]);

	// 重置筛选条件
	const resetFilter = useCallback(() => {
		setSelectedMarket("all");
		setSearchKeyword("");
		const defaultRange = getDefaultDateRange();
		setDateRange(defaultRange);
		setDateRangeDisplay([dayjs().subtract(7, "day"), dayjs()]);
		setQuickSelectValue("week");
	}, []);

	return {
		// 状态
		selectedMarket,
		searchKeyword,
		dateRange,
		dateRangeDisplay,
		quickSelectValue,
		// 设置方法
		setSelectedMarket,
		setSearchKeyword,
		setDateRange,
		setDateRangeDisplay,
		// 操作方法
		handleQuickSelect,
		handleDateRangeChange,
		getFilter,
		resetFilter,
	};
}

