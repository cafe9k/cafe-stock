/**
 * 股票基础信息
 */
export interface Stock {
	ts_code: string;
	symbol: string;
	name: string;
	area: string;
	industry: string;
	market: string;
	list_date: string;
	isFavorite?: boolean; // 是否已关注
}

/**
 * 股票聚合信息（用于公告列表等场景）
 */
export interface StockGroup {
	ts_code: string;
	stock_name: string;
	industry: string;
	market: string;
	announcement_count: number;
	latest_ann_date: string;
	latest_ann_title?: string;
	isFavorite?: boolean; // 是否已关注
}

/**
 * 股票筛选条件
 */
export interface StockFilter {
	market?: string; // 市场：主板、创业板、科创板、CDR
	searchKeyword?: string; // 搜索关键词
	dateRange?: [string, string]; // 日期范围 [startDate, endDate] YYYYMMDD格式
}

/**
 * 股票列表查询参数
 */
export interface StockListQueryParams {
	page: number;
	pageSize: number;
	filter?: StockFilter;
}

/**
 * 股票列表查询结果
 */
export interface StockListQueryResult<T = Stock> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
}
