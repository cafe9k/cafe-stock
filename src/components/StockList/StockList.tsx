/**
 * 依赖: FavoriteButton(组件), useStockList(hook), types(类型定义), announcementClassifier(分类工具)
 * 输出: StockList 组件 - 通用股票列表组件，提供搜索、筛选、分页、收藏等功能
 * 职责: 渲染进程UI组件，封装股票列表的通用展示逻辑，可复用于多个页面
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/components/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useMemo, memo, useState, useEffect, useCallback } from "react";
import { Table, Tag, Typography, Badge, Tooltip, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Stock, StockGroup } from "../../types/stock";
import { FavoriteButton } from "../FavoriteButton";
import { getCategoryColor } from "../../utils/announcementClassifier";

const { Text: AntText } = Typography;

// 可调整大小的列头组件
const ResizableTitle = (props: any) => {
	const { onResize, width, ...restProps } = props;

	if (!width || !onResize) {
		return <th {...restProps} />;
	}

	return (
		<th {...restProps} style={{ ...restProps.style, position: "relative" }}>
			{restProps.children}
			<div
				style={{
					position: "absolute",
					right: 0,
					top: 0,
					bottom: 0,
					width: "5px",
					cursor: "col-resize",
					userSelect: "none",
					touchAction: "none",
				}}
				onMouseDown={(e) => {
					e.preventDefault();
					const startX = e.pageX;
					const startWidth = width;

					const handleMouseMove = (moveEvent: MouseEvent) => {
						const newWidth = Math.max(50, startWidth + moveEvent.pageX - startX);
						onResize(newWidth);
					};

					const handleMouseUp = () => {
						document.removeEventListener("mousemove", handleMouseMove);
						document.removeEventListener("mouseup", handleMouseUp);
					};

					document.addEventListener("mousemove", handleMouseMove);
					document.addEventListener("mouseup", handleMouseUp);
				}}
			/>
		</th>
	);
};

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
	showMarketCap?: boolean; // 显示市值（仅 StockGroup）
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
	tableId?: string; // 表格唯一标识，用于保存列宽配置
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
	tableId = "default",
}: StockListProps<T>) {
	const {
		showFavoriteButton = false,
		showCode = true,
		showName = true,
		showMarket = true,
		showIndustry = true,
		showArea = false,
		showMarketCap = false,
		showAnnouncementCount = false,
		showAnnouncementCategories = false,
		showLatestAnnDate = false,
		showLatestAnnTitle = false,
		customColumns = [],
		actionColumn,
	} = columnConfig;

	// 列宽状态
	const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

	// 加载列宽配置
	useEffect(() => {
		const loadColumnWidths = async () => {
			try {
				const result = await window.electronAPI.getColumnWidths(tableId);
				if (result.success && result.columnWidths) {
					setColumnWidths(result.columnWidths);
				}
			} catch (error) {
				console.error("Failed to load column widths:", error);
			}
		};

		loadColumnWidths();
	}, [tableId]);

	// 保存列宽配置（防抖）
	const saveColumnWidths = useCallback(
		async (widths: Record<string, number>) => {
			try {
				await window.electronAPI.saveColumnWidths(tableId, widths);
			} catch (error) {
				console.error("Failed to save column widths:", error);
			}
		},
		[tableId]
	);

	// 处理列宽调整
	const handleResize = useCallback(
		(columnKey: string) => (width: number) => {
			const newWidths = { ...columnWidths, [columnKey]: width };
			setColumnWidths(newWidths);
			// 延迟保存，避免频繁写入
			setTimeout(() => saveColumnWidths(newWidths), 500);
		},
		[columnWidths, saveColumnWidths]
	);

	// 检测数据类型（Stock 还是 StockGroup）
	const hasNameField = data.length > 0 && "name" in data[0];
	const hasAreaField = data.length > 0 && "area" in data[0];
	const hasTotalMvField = data.length > 0 && "total_mv" in data[0];
	const hasAnnouncementCountField = data.length > 0 && "announcement_count" in data[0];
	const hasCategoryStatsField = data.length > 0 && "category_stats" in data[0];
	const hasLatestAnnTitleField = data.length > 0 && "latest_ann_title" in data[0];
	const hasLatestAnnDateField = data.length > 0 && "latest_ann_date" in data[0];

	// 构建表格列
	const columns: ColumnsType<T> = useMemo(() => {
		const cols: ColumnsType<T> = [];

		// 关注按钮列
		if (showFavoriteButton) {
			const colWidth = columnWidths["favorite"] || 50;
			cols.push({
				title: "",
				key: "favorite",
				width: colWidth,
				fixed: "left",
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("favorite"),
				}),
				render: (_: any, record: T) => (
					<FavoriteButton tsCode={record.ts_code} isFavorite={record.isFavorite} onChange={onFavoriteChange} size="small" />
				),
			});
		}

		// 股票名称列（悬浮显示股票代码）
		if (showName) {
			const nameKey = hasNameField ? "name" : "stock_name";
			const colWidth = columnWidths["name"] || 150;
			cols.push({
				title: "股票名称",
				dataIndex: nameKey,
				key: "name",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("name"),
				}),
				render: (text: string, record: T) => (
					<Tooltip title={`股票代码: ${record.ts_code}`}>
						<AntText strong style={{ cursor: "help" }}>
							{text}
						</AntText>
					</Tooltip>
				),
			});
		}

		// 市值列（仅 StockGroup）- 紧跟股票名称
		if (showMarketCap && hasTotalMvField) {
			const colWidth = columnWidths["total_mv"] || 120;
			cols.push({
				title: "市值",
				key: "total_mv",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("total_mv"),
				}),
				sorter: (a: any, b: any) => {
					const aMv = a.total_mv ?? 0;
					const bMv = b.total_mv ?? 0;
					return aMv - bMv;
				},
				render: (_: any, record: T) => {
					const stockGroup = record as any;
					const totalMv = stockGroup.total_mv;
					if (totalMv === undefined || totalMv === null) {
						return <AntText type="secondary">-</AntText>;
					}
					// 格式化市值：保留2位小数，单位：亿元
					const formattedMv = totalMv.toFixed(2);
					return <AntText style={{ fontFamily: "monospace" }}>{formattedMv} 亿</AntText>;
				},
			});
		}

		// 股票代码列（如果需要单独显示）
		if (showCode) {
			const colWidth = columnWidths["ts_code"] || 120;
			cols.push({
				title: "股票代码",
				dataIndex: "ts_code",
				key: "ts_code",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("ts_code"),
				}),
				sorter: (a: any, b: any) => a.ts_code.localeCompare(b.ts_code),
			});
		}

		// 市场列
		if (showMarket) {
			const colWidth = columnWidths["market"] || 80;
			cols.push({
				title: "市场",
				dataIndex: "market",
				key: "market",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("market"),
				}),
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
			const colWidth = columnWidths["industry"] || 100;
			cols.push({
				title: "行业",
				dataIndex: "industry",
				key: "industry",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("industry"),
				}),
				render: (value: string) => (value ? <Tag color="blue">{value}</Tag> : "-"),
			});
		}

		// 地区列
		if (showArea && hasAreaField) {
			const colWidth = columnWidths["area"] || 100;
			cols.push({
				title: "地区",
				dataIndex: "area",
				key: "area",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("area"),
				}),
			});
		}

		// 公告数量列（仅 StockGroup）
		if (showAnnouncementCount && hasAnnouncementCountField) {
			const colWidth = columnWidths["announcement_count"] || 80;
			cols.push({
				title: "公告数量",
				dataIndex: "announcement_count",
				key: "announcement_count",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("announcement_count"),
				}),
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
		if (showAnnouncementCategories && hasCategoryStatsField) {
			const colWidth = columnWidths["category_stats"] || 400;
			cols.push({
				title: "公告分类",
				key: "category_stats",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("category_stats"),
				}),
				render: (_: any, record: T) => {
					const stockGroup = record as any;
					const categoryStats = stockGroup.category_stats || {};
					const categories = Object.entries(categoryStats)
						.filter(([_, count]) => (count as number) > 0)
						.sort((a, b) => (b[1] as number) - (a[1] as number));

					if (categories.length === 0) {
						return <AntText type="secondary">-</AntText>;
					}

					// 显示前6个分类
					const visibleCategories = categories.slice(0, 6);
					const hiddenCategories = categories.slice(6);

					return (
						<Space size={[4, 4]} wrap>
							{visibleCategories.map(([category, count]) => (
								<Tag key={category} color={getCategoryColor(category as any)} style={{ margin: 2 }}>
									{category} ({String(count)})
								</Tag>
							))}
							{hiddenCategories.length > 0 && (
								<Tooltip
									title={
										<div>
											<div style={{ marginBottom: 8, fontWeight: "bold" }}>其他分类：</div>
											{hiddenCategories.map(([cat, cnt]) => (
												<div key={cat} style={{ padding: "2px 0" }}>
													{cat}: {String(cnt)} 条
												</div>
											))}
										</div>
									}
								>
									<Tag style={{ cursor: "help", margin: 2 }}>+{hiddenCategories.length}...</Tag>
								</Tooltip>
							)}
						</Space>
					);
				},
			});
		}

		// 最新公告标题列（仅 StockGroup）
		if (showLatestAnnTitle && hasLatestAnnTitleField) {
			const colWidth = columnWidths["latest_ann_title"] || 300;
			cols.push({
				title: "最新公告",
				dataIndex: "latest_ann_title",
				key: "latest_ann_title",
				width: colWidth,
				ellipsis: true,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("latest_ann_title"),
				}),
				render: (title: string) => (
					<AntText ellipsis={{ tooltip: title }} style={{ fontSize: 13, color: "#666" }}>
						{title || "-"}
					</AntText>
				),
			});
		}

		// 最新公告日期列（仅 StockGroup）
		if (showLatestAnnDate && hasLatestAnnDateField) {
			const colWidth = columnWidths["latest_ann_date"] || 160;
			cols.push({
				title: "最新公告时间",
				key: "latest_ann_date",
				width: colWidth,
				onHeaderCell: () => ({
					width: colWidth,
					onResize: handleResize("latest_ann_date"),
				}),
				defaultSortOrder: "descend" as const, // 默认倒序排序（后端已排序）
				// 注意：Ant Design Table 的 sorter 默认只对当前页排序
				// 如果需要全量排序，应该禁用 sorter，通过服务端排序实现
				// 这里保留 sorter 仅用于当前页的临时排序展示
				sorter: false, // 禁用客户端排序，因为后端已经对所有数据排序
				render: (_: any, record: T) => {
					const stockGroup = record as any;
					const date = stockGroup.latest_ann_date;
					const time = stockGroup.latest_ann_time;

					if (!date) return <AntText>-</AntText>;

					const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
					const formattedTime = time ? time.substring(0, 5) : "";

					return (
						<div style={{ fontFamily: "monospace" }}>
							<div style={{ fontSize: 13 }}>{formattedDate}</div>
							{formattedTime && <div style={{ fontSize: 12, color: "#999" }}>{formattedTime}</div>}
						</div>
					);
				},
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
		showMarketCap,
		showAnnouncementCount,
		showAnnouncementCategories,
		showLatestAnnDate,
		showLatestAnnTitle,
		customColumns,
		actionColumn,
		onFavoriteChange,
		hasNameField,
		hasAreaField,
		hasTotalMvField,
		hasAnnouncementCountField,
		hasCategoryStatsField,
		hasLatestAnnTitleField,
		hasLatestAnnDateField,
		columnWidths,
	]);

	return (
		<Table
			columns={columns}
			dataSource={data}
			rowKey={rowKey}
			loading={loading}
			components={{
				header: {
					cell: ResizableTitle,
				},
			}}
			pagination={
				showPagination
					? {
							current: page,
							total,
							pageSize,
							onChange: onPageChange,
							showSizeChanger: true,
							showTotal: (total) => {
								const totalPages = Math.ceil(total / pageSize);
								return `显示第 ${page} 页 共 ${totalPages} 页 (总计 ${total} 条记录)`;
							},
							pageSizeOptions: ["10", "20", "50", "100"],
							style: {
								marginTop: 16,
								marginBottom: 8,
								textAlign: "center",
							},
							showQuickJumper: true,
							position: ["bottomCenter"] as any,
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
