/**
 * INPUT: 无（类型定义）
 * OUTPUT: Stock, StockGroup, StockFilter 等类型定义 - 股票相关的TypeScript类型
 * POS: 渲染进程类型定义层，定义股票、筛选条件等数据结构，提供类型安全
 * 
 * ⚠️ 更新提醒：修改此文件后，请更新 src/types/README.md
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
	latest_ann_time?: string; // 最新公告时间
	latest_ann_title?: string;
	isFavorite?: boolean; // 是否已关注
	category_stats?: Record<string, number>; // 公告分类统计
	total_mv?: number; // 总市值（亿元）
}

/**
 * 市值范围筛选条件
 */
export interface MarketCapRange {
	min?: number; // 最小市值（亿元）
	max?: number; // 最大市值（亿元）
}

/**
 * 股票筛选条件
 */
export interface StockFilter {
	market?: string; // 市场：主板、创业板、科创板、CDR
	searchKeyword?: string; // 搜索关键词
	dateRange?: [string, string]; // 日期范围 [startDate, endDate] YYYYMMDD格式
	showFavoriteOnly?: boolean; // 是否仅显示关注的股票
	marketCapRange?: MarketCapRange; // 市值范围筛选
	categories?: string[]; // 公告分类筛选
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
