/**
 * 通用股票列表组件
 * 集成关注功能，支持搜索、筛选、分页等通用功能
 */

import { useMemo, memo } from "react";
import { Table, Tag, Typography, Badge, Tooltip, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Stock, StockGroup } from "../../types/stock";
import { FavoriteButton } from "../FavoriteButton";
import { getCategoryColor } from "../../utils/announcementClassifier";

const { Text: AntText } = Typography;

/**
 * 股票列表列配置
 */
export interface StockListColumnConfig {
	showFavoriteButton?: boolean; // 显示关注按钮
	showCode?: boolean; // 显示股票代码
	showName?: boolean; // 显示股票名称
	showMarket?: boolean; // 显示市场
	showIndustry?: boolean; // 显示行业
	showArea?: boolean; // 显示地区
	showAnnouncementCount?: boolean; // 显示公告数量（仅 StockGroup）
	showAnnouncementCategories?: boolean; // 显示公告分类（仅 StockGroup）
	showLatestAnnDate?: boolean; // 显示最新公告日期（仅 StockGroup）
	showLatestAnnTitle?: boolean; // 显示最新公告标题（仅 StockGroup）
	customColumns?: ColumnsType<any>; // 自定义列
	actionColumn?: (record: Stock | StockGroup) => React.ReactNode; // 操作列渲染函数
}

/**
 * 股票列表组件 Props
 */
export interface StockListProps<T extends Stock | StockGroup = Stock | StockGroup> {
	data: T[];
	loading?: boolean;
	page?: number;
	total?: number;
	pageSize?: number;
	onPageChange?: (page: number) => void;
	onRowClick?: (record: T) => void;
	onFavoriteChange?: (tsCode: string, isFavorite: boolean) => void;
	columnConfig?: StockListColumnConfig;
	rowKey?: string | ((record: T) => string);
	showPagination?: boolean;
	size?: "small" | "middle" | "large";
	scroll?: { x?: number | string; y?: number | string };
	emptyText?: string;
	expandable?: {
		expandedRowRender?: (record: T) => React.ReactNode;
		expandedRowKeys?: string[];
		onExpandedRowsChange?: (keys: string[]) => void;
		showExpandColumn?: boolean;
	};
}

/**
 * 通用股票列表组件
 */
function StockListComponent<T extends Stock | StockGroup = Stock | StockGroup>({
	data,
	loading = false,
	page = 1,
	total = 0,
	pageSize = 20,
	onPageChange,
	onRowClick,
	onFavoriteChange,
	columnConfig = {},
	rowKey = "ts_code",
	showPagination = true,
	size = "small",
	scroll,
	emptyText,
	expandable,
}: StockListProps<T>) {
	const {
		showFavoriteButton = false,
		showCode = true,
		showName = true,
		showMarket = true,
		showIndustry = true,
		showArea = false,
		showAnnouncementCount = false,
		showAnnouncementCategories = false,
		showLatestAnnDate = false,
		showLatestAnnTitle = false,
		customColumns = [],
		actionColumn,
	} = columnConfig;

	// 检测数据类型（Stock 还是 StockGroup）
	const hasNameField = data.length > 0 && "name" in data[0];
	const hasAreaField = data.length > 0 && "area" in data[0];
	const hasAnnouncementCountField = data.length > 0 && "announcement_count" in data[0];
	const hasLatestAnnTitleField = data.length > 0 && "latest_ann_title" in data[0];
	const hasLatestAnnDateField = data.length > 0 && "latest_ann_date" in data[0];

	// 构建表格列
	const columns: ColumnsType<T> = useMemo(() => {
		const cols: ColumnsType<T> = [];

		// 关注按钮列
		if (showFavoriteButton) {
			cols.push({
				title: "",
				key: "favorite",
				width: 50,
				fixed: "left",
				render: (_: any, record: T) => (
					<FavoriteButton
						tsCode={record.ts_code}
						isFavorite={record.isFavorite}
						onChange={onFavoriteChange}
						size="small"
					/>
				),
			});
		}

		// 股票名称列（悬浮显示股票代码）
		if (showName) {
			const nameKey = hasNameField ? "name" : "stock_name";
			cols.push({
				title: "股票名称",
				dataIndex: nameKey,
				key: "name",
				width: 150,
				render: (text: string, record: T) => (
					<Tooltip title={`股票代码: ${record.ts_code}`}>
						<AntText strong style={{ cursor: "help" }}>
							{text}
						</AntText>
					</Tooltip>
				),
			});
		}

		// 股票代码列（如果需要单独显示）
		if (showCode) {
			cols.push({
				title: "股票代码",
				dataIndex: "ts_code",
				key: "ts_code",
				width: 120,
				sorter: (a: any, b: any) => a.ts_code.localeCompare(b.ts_code),
			});
		}

		// 市场列
		if (showMarket) {
			cols.push({
				title: "市场",
				dataIndex: "market",
				key: "market",
				width: 100,
				render: (text: string) => {
					const colorMap: { [key: string]: string } = {
						主板: "blue",
						创业板: "orange",
						科创板: "red",
						CDR: "purple",
					};
					return <Tag color={colorMap[text] || "default"}>{text || "-"}</Tag>;
				},
			});
		}

		// 行业列
		if (showIndustry) {
			cols.push({
				title: "行业",
				dataIndex: "industry",
				key: "industry",
				width: 120,
				render: (value: string) => (value ? <Tag color="blue">{value}</Tag> : "-"),
			});
		}

		// 地区列
		if (showArea && hasAreaField) {
			cols.push({
				title: "地区",
				dataIndex: "area",
				key: "area",
				width: 100,
			});
		}

		// 公告数量列（仅 StockGroup）
		if (showAnnouncementCount && hasAnnouncementCountField) {
			cols.push({
				title: "公告数量",
				dataIndex: "announcement_count",
				key: "announcement_count",
				width: 100,
				render: (count: number) => (
					<Badge
						count={count}
						showZero
						style={{
							backgroundColor: count > 10 ? "#f5222d" : count > 5 ? "#fa8c16" : "#52c41a",
						}}
					/>
				),
			});
		}

		// 公告分类列（仅 StockGroup）
		if (showAnnouncementCategories && hasAnnouncementCountField) {
			cols.push({
				title: "公告分类",
				key: "category_stats",
				width: 300,
				render: (_: any, record: T) => {
					const stockGroup = record as any;
					const categoryStats = stockGroup.category_stats || {};
					const categories = Object.entries(categoryStats)
						.filter(([_, count]) => (count as number) > 0)
						.sort((a, b) => (b[1] as number) - (a[1] as number))
						.slice(0, 5); // 只显示前5个分类

					if (categories.length === 0) {
						return <AntText type="secondary">-</AntText>;
					}

					return (
						<Space size={[4, 4]} wrap>
							{categories.map(([category, count]) => (
								<Tag key={category} color={getCategoryColor(category as any)}>
									{category} ({count})
								</Tag>
							))}
							{Object.keys(categoryStats).length > 5 && (
								<Tooltip
									title={
										<div>
											{Object.entries(categoryStats)
												.sort((a, b) => (b[1] as number) - (a[1] as number))
												.map(([cat, cnt]) => (
													<div key={cat}>
														{cat}: {cnt}
													</div>
												))}
										</div>
									}
								>
									<Tag>...</Tag>
								</Tooltip>
							)}
						</Space>
					);
				},
			});
		}

		// 最新公告标题列（仅 StockGroup）
		if (showLatestAnnTitle && hasLatestAnnTitleField) {
			cols.push({
				title: "最新公告",
				dataIndex: "latest_ann_title",
				key: "latest_ann_title",
				ellipsis: true,
				render: (title: string) => (
					<AntText ellipsis={{ tooltip: title }} style={{ fontSize: 13, color: "#666" }}>
						{title || "-"}
					</AntText>
				),
			});
		}

		// 最新公告日期列（仅 StockGroup）
		if (showLatestAnnDate && hasLatestAnnDateField) {
			cols.push({
				title: "最新公告日期",
				dataIndex: "latest_ann_date",
				key: "latest_ann_date",
				width: 130,
				defaultSortOrder: "descend" as const, // 默认倒序排序（后端已排序）
				// 注意：Ant Design Table 的 sorter 默认只对当前页排序
				// 如果需要全量排序，应该禁用 sorter，通过服务端排序实现
				// 这里保留 sorter 仅用于当前页的临时排序展示
				sorter: false, // 禁用客户端排序，因为后端已经对所有数据排序
				render: (date: string) => (
					<AntText style={{ fontFamily: "monospace" }}>
						{date ? date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3") : "-"}
					</AntText>
				),
			});
		}

		// 自定义列
		if (customColumns.length > 0) {
			cols.push(...customColumns);
		}

		// 操作列
		if (actionColumn) {
			cols.push({
				title: "操作",
				key: "action",
				width: 200,
				render: (_: any, record: T) => actionColumn(record),
			});
		}

		return cols;
	}, [
		showFavoriteButton,
		showCode,
		showName,
		showMarket,
		showIndustry,
		showArea,
		showAnnouncementCount,
		showAnnouncementCategories,
		showLatestAnnDate,
		showLatestAnnTitle,
		customColumns,
		actionColumn,
		onFavoriteChange,
		hasNameField,
		hasAreaField,
		hasAnnouncementCountField,
		hasLatestAnnTitleField,
		hasLatestAnnDateField,
	]);

	return (
		<Table
			columns={columns}
			dataSource={data}
			rowKey={rowKey}
			loading={loading}
			pagination={
				showPagination
					? {
							current: page,
							total,
							pageSize,
							onChange: onPageChange,
							showSizeChanger: true,
							showTotal: (total) => `共 ${total} 条记录`,
							pageSizeOptions: ["10", "20", "50", "100"],
					  }
					: false
			}
			expandable={
				expandable
					? {
							...expandable,
							onExpandedRowsChange: expandable.onExpandedRowsChange
								? (keys) => expandable.onExpandedRowsChange?.(keys as string[])
								: undefined,
					  }
					: undefined
			}
			onRow={(record) => ({
				onClick: () => {
					if (onRowClick) {
						onRowClick(record);
					}
				},
				style: {
					cursor: onRowClick ? "pointer" : "default",
				},
				className: record.isFavorite ? "favorite-stock-row" : "",
			})}
			scroll={scroll}
			size={size}
			locale={{
				emptyText: emptyText || (loading ? "加载中..." : "暂无数据"),
			}}
		/>
	);
}

// 使用 memo 优化性能
export const StockList = memo(StockListComponent) as typeof StockListComponent;

