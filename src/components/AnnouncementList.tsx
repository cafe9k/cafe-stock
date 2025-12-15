import { useEffect, useState, useCallback } from "react";
import { Table, Card, Tag, Typography, Badge, Space, Button, Input, DatePicker, Radio, Select, App } from "antd";
import {
	FileTextOutlined,
	ReloadOutlined,
	SearchOutlined,
	HistoryOutlined,
	CalendarOutlined,
	FilePdfOutlined,
	StarOutlined,
	StarFilled,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { PDFWebViewer } from "./PDFWebViewer";

const { Text: AntText } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface StockGroup {
	ts_code: string;
	stock_name: string;
	industry: string;
	market: string;
	announcement_count: number;
	latest_ann_date: string;
	latest_ann_title?: string;
}

interface Announcement {
	ts_code: string;
	ann_date: string;
	ann_type: string;
	title: string;
	content: string;
	pub_time: string;
	file_path?: string;
}

const PAGE_SIZE = 20;

export function AnnouncementList() {
	const { message } = App.useApp();
	const [stockGroups, setStockGroups] = useState<StockGroup[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [loadingHistory, setLoadingHistory] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
	const [expandedData, setExpandedData] = useState<Record<string, Announcement[]>>({});
	const [loadingExpanded, setLoadingExpanded] = useState<Record<string, boolean>>({});

	// 日期范围筛选相关状态 - 默认最近一周
	const getDefaultDateRange = (): [string, string] => {
		const today = dayjs().format("YYYYMMDD");
		const weekAgo = dayjs().subtract(7, "day").format("YYYYMMDD");
		return [weekAgo, today];
	};

	const [dateRange, setDateRange] = useState<[string, string]>(getDefaultDateRange());
	const [dateRangeDisplay, setDateRangeDisplay] = useState<[Dayjs, Dayjs]>([
		dayjs().subtract(7, "day"),
		dayjs(),
	]);
	const [quickSelectValue, setQuickSelectValue] = useState<string>("week");

	// 市场筛选状态
	const [selectedMarket, setSelectedMarket] = useState<string>("all");

	// 我的关注筛选状态
	const [showFavoriteOnly, setShowFavoriteOnly] = useState<boolean>(false);
	const [favoriteStocks, setFavoriteStocks] = useState<Set<string>>(new Set());

	// PDF 预览相关状态
	const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
	const [currentPdfUrl, setCurrentPdfUrl] = useState("");
	const [currentPdfTitle, setCurrentPdfTitle] = useState("");

	// 加载股票聚合数据
	const fetchGroupedData = useCallback(
		async (pageNum: number) => {
			setLoading(true);
			try {
				if (!window.electronAPI) {
					throw new Error("Electron API not available");
				}

				let result;
				if (showFavoriteOnly) {
					// 加载关注的股票
					result = await window.electronAPI.getFavoriteStocksAnnouncementsGrouped(pageNum, PAGE_SIZE, dateRange[0], dateRange[1]);
				} else {
					// 加载所有股票
					result = await window.electronAPI.getAnnouncementsGrouped(
						pageNum,
						PAGE_SIZE,
						dateRange[0],
						dateRange[1],
						selectedMarket === "all" ? undefined : selectedMarket
					);
				}

				setStockGroups(result.items);
				setTotal(result.total);
			} catch (err: any) {
				console.error("Fetch error:", err);
				message.error(err.message || "加载失败");
			} finally {
				setLoading(false);
			}
		},
		[dateRange, selectedMarket, showFavoriteOnly]
	);

	// 展开行时加载该股票的公告
	const onExpand = async (expanded: boolean, record: StockGroup) => {
		if (expanded && !expandedData[record.ts_code]) {
			setLoadingExpanded((prev) => ({ ...prev, [record.ts_code]: true }));
			try {
				const announcements = await window.electronAPI.getStockAnnouncements(record.ts_code);
				setExpandedData((prev) => ({ ...prev, [record.ts_code]: announcements }));
			} catch (err: any) {
				console.error("Load announcements error:", err);
				message.error("加载公告失败");
			} finally {
				setLoadingExpanded((prev) => ({ ...prev, [record.ts_code]: false }));
			}
		}
	};

	// 加载关注股票列表
	const loadFavoriteStocks = useCallback(async () => {
		try {
			const favorites = await window.electronAPI.getAllFavoriteStocks();
			setFavoriteStocks(new Set(favorites));
		} catch (err: any) {
			console.error("Load favorite stocks error:", err);
		}
	}, []);

	// 关注/取消关注股票
	const toggleFavorite = async (tsCode: string, stockName: string, event: React.MouseEvent) => {
		event.stopPropagation(); // 阻止事件冒泡，避免触发行展开

		const isFavorite = favoriteStocks.has(tsCode);
		try {
			if (isFavorite) {
				const result = await window.electronAPI.removeFavoriteStock(tsCode);
				if (result.success) {
					setFavoriteStocks((prev) => {
						const newSet = new Set(prev);
						newSet.delete(tsCode);
						return newSet;
					});
					message.success(`已取消关注 ${stockName}`);

					// 如果当前正在查看"我的关注"，刷新列表
					if (showFavoriteOnly) {
						fetchGroupedData(page);
					}
				} else {
					message.error(result.message || "取消关注失败");
				}
			} else {
				const result = await window.electronAPI.addFavoriteStock(tsCode);
				if (result.success) {
					setFavoriteStocks((prev) => new Set(prev).add(tsCode));
					message.success(`已关注 ${stockName}`);
				} else {
					message.error(result.message || "关注失败");
				}
			}
		} catch (err: any) {
			console.error("Toggle favorite error:", err);
			message.error("操作失败");
		}
	};

	// 搜索功能
	const handleSearch = async (value: string) => {
		setSearchKeyword(value);
		setPage(1); // 重置到第一页

		if (!value.trim()) {
			fetchGroupedData(1);
			return;
		}

		// 搜索时不支持"我的关注"过滤
		if (showFavoriteOnly) {
			message.info('搜索时暂不支持"我的关注"过滤，已切换到全部股票');
			setShowFavoriteOnly(false);
		}

		setLoading(true);
		try {
			const result = await window.electronAPI.searchAnnouncementsGrouped(
				value,
				1,
				PAGE_SIZE,
				dateRange[0],
				dateRange[1],
				selectedMarket === "all" ? undefined : selectedMarket
			);

			setStockGroups(result.items);
			setTotal(result.total);
		} catch (err: any) {
			console.error("Search error:", err);
			message.error("搜索失败");
		} finally {
			setLoading(false);
		}
	};

	// 刷新当前页
	const handleRefresh = () => {
		if (searchKeyword) {
			handleSearch(searchKeyword);
		} else {
			fetchGroupedData(page);
		}
	};

	// 市场选择变化处理
	const handleMarketChange = (value: string) => {
		setSelectedMarket(value);
		setPage(1); // 重置到第一页
	};

	// 我的关注过滤变化处理
	const handleFavoriteFilterChange = (checked: boolean) => {
		setShowFavoriteOnly(checked);
		setPage(1); // 重置到第一页
		if (searchKeyword && checked) {
			// 如果有搜索关键词，清空搜索
			setSearchKeyword("");
		}
	};

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
	const handleQuickSelect = async (value: string) => {
		setQuickSelectValue(value);
		setPage(1);

		const today = dayjs().format("YYYYMMDD");
		let newDateRange: [string, string];
		let newDateRangeDisplay: [Dayjs, Dayjs];

		switch (value) {
			case "today":
				// 今天
				newDateRange = [today, today];
				newDateRangeDisplay = [parseDateString(today), parseDateString(today)];
				break;
			case "yesterday":
				// 昨天
				const yesterday = getDaysAgo(1);
				newDateRange = [yesterday, yesterday];
				newDateRangeDisplay = [parseDateString(yesterday), parseDateString(yesterday)];
				break;
			case "week":
				// 最近一周
				const weekAgo = getDaysAgo(7);
				newDateRange = [weekAgo, today];
				newDateRangeDisplay = [parseDateString(weekAgo), parseDateString(today)];
				break;
			case "month":
				// 最近一个月
				const monthAgo = getDaysAgo(30);
				newDateRange = [monthAgo, today];
				newDateRangeDisplay = [parseDateString(monthAgo), parseDateString(today)];
				break;
			case "quarter":
				// 最近三个月
				const quarterAgo = getDaysAgo(90);
				newDateRange = [quarterAgo, today];
				newDateRangeDisplay = [parseDateString(quarterAgo), parseDateString(today)];
				break;
			default:
				// 默认最近一周
				const defaultWeekAgo = getDaysAgo(7);
				newDateRange = [defaultWeekAgo, today];
				newDateRangeDisplay = [parseDateString(defaultWeekAgo), parseDateString(today)];
		}

		setDateRange(newDateRange);
		setDateRangeDisplay(newDateRangeDisplay);
	};

	// 日期范围选择 - 用户输入起始时间即认为自定义
	const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
		setPage(1);

		if (dates && dates[0] && dates[1]) {
			const startDate = formatDateToString(dates[0]);
			const endDate = formatDateToString(dates[1]);
			setDateRange([startDate, endDate]);
			setDateRangeDisplay([dates[0], dates[1]]);
			// 用户输入了起始时间，即认为自定义，不设置 quickSelectValue
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
	};

	// 处理 PDF 预览
	const handlePdfPreview = async (announcement: Announcement) => {
		try {
			message.loading({ content: "正在加载 PDF...", key: "pdf-loading" });

			// 调用 Electron API 获取 PDF URL
			const result = await window.electronAPI.getAnnouncementPdf(announcement.ts_code, announcement.ann_date, announcement.title);

			message.destroy("pdf-loading");

			if (result.success && result.url) {
				// 在控制台打印 PDF URL
				console.log("PDF URL:", result.url);
				console.log("公告信息:", {
					股票代码: announcement.ts_code,
					公告日期: announcement.ann_date,
					公告标题: announcement.title,
					PDF链接: result.url,
				});

				setCurrentPdfUrl(result.url);
				setCurrentPdfTitle(announcement.title);
				setPdfViewerOpen(true);
			} else {
				message.warning(result.message || "该公告暂无 PDF 文件");
			}
		} catch (error: any) {
			message.destroy("pdf-loading");
			console.error("加载 PDF 失败:", error);
			message.error("加载 PDF 失败，请稍后重试");
		}
	};

	// 监听数据更新
	useEffect(() => {
		console.log("AnnouncementList mounted. Checking API:", !!window.electronAPI);

		// 加载关注股票列表
		loadFavoriteStocks();

		const unsubscribe = window.electronAPI.onDataUpdated((data) => {
			console.log("Data updated:", data);
			if (data.type === "incremental") {
				// 增量同步完成后，如果在第一页，刷新数据
				if (page === 1 && !searchKeyword) {
					fetchGroupedData(1);
				}
			} else if (data.type === "historical") {
				setLoadingHistory(true);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [page, searchKeyword, fetchGroupedData, loadFavoriteStocks]);

	// 初始加载数据
	useEffect(() => {
		const loadData = async () => {
			if (searchKeyword) {
				setLoading(true);
				try {
					const result = await window.electronAPI.searchAnnouncementsGrouped(
						searchKeyword,
						page,
						PAGE_SIZE,
						dateRange[0],
						dateRange[1],
						selectedMarket === "all" ? undefined : selectedMarket
					);

					setStockGroups(result.items);
					setTotal(result.total);
				} catch (err: any) {
					console.error("Search error:", err);
					message.error("搜索失败");
				} finally {
					setLoading(false);
				}
			} else {
				fetchGroupedData(page);
			}
		};
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, dateRange, searchKeyword, selectedMarket, showFavoriteOnly]);

	const handlePrevPage = () => {
		if (page > 1) {
			setPage((p) => p - 1);
		}
	};

	const handleNextPage = () => {
		const totalPages = Math.ceil(total / PAGE_SIZE);
		if (page < totalPages) {
			setPage((p) => p + 1);
		}
	};

	// 主表格列定义
	const columns: ColumnsType<StockGroup> = [
		{
			title: "",
			key: "favorite",
			width: 50,
			fixed: "left",
			render: (_, record) => {
				const isFavorite = favoriteStocks.has(record.ts_code);
				return (
					<Button
						type="text"
						icon={isFavorite ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />}
						onClick={(e) => toggleFavorite(record.ts_code, record.stock_name, e)}
						title={isFavorite ? "取消关注" : "关注"}
					/>
				);
			},
			onCell: (record) => ({
				className: favoriteStocks.has(record.ts_code) ? "favorite-stock-row-cell" : "",
			}),
		},
		{
			title: "股票名称",
			dataIndex: "stock_name",
			key: "stock_name",
			width: 150,
			fixed: "left",
			render: (text) => <AntText strong>{text}</AntText>,
			onCell: (record) => ({
				className: favoriteStocks.has(record.ts_code) ? "favorite-stock-row-cell" : "",
			}),
		},
		{
			title: "市场",
			dataIndex: "market",
			key: "market",
			width: 100,
			render: (text) => {
				const colorMap: { [key: string]: string } = {
					主板: "blue",
					创业板: "orange",
					科创板: "red",
					CDR: "purple",
				};
				return <Tag color={colorMap[text] || "default"}>{text || "-"}</Tag>;
			},
		},
		{
			title: "行业",
			dataIndex: "industry",
			key: "industry",
			width: 120,
		},
		{
			title: "公告数量",
			dataIndex: "announcement_count",
			key: "announcement_count",
			width: 100,
			render: (count) => (
				<Badge
					count={count}
					showZero
					style={{
						backgroundColor: count > 10 ? "#f5222d" : count > 5 ? "#fa8c16" : "#52c41a",
					}}
				/>
			),
		},
		{
			title: "最新公告",
			dataIndex: "latest_ann_title",
			key: "latest_ann_title",
			ellipsis: true,
			render: (title) => (
				<AntText ellipsis={{ tooltip: title }} style={{ fontSize: 13, color: "#666" }}>
					{title || "-"}
				</AntText>
			),
		},
		{
			title: "最新公告日期",
			dataIndex: "latest_ann_date",
			key: "latest_ann_date",
			width: 130,
			render: (date) => <AntText style={{ fontFamily: "monospace" }}>{date ? date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3") : "-"}</AntText>,
		},
	];

	// 嵌套表格列定义
	const nestedColumns: ColumnsType<Announcement> = [
		{
			title: "日期",
			dataIndex: "ann_date",
			key: "ann_date",
			width: 120,
			render: (date: string) => <AntText style={{ fontFamily: "monospace", fontSize: 12 }}>{date}</AntText>,
		},
		{
			title: "标题",
			dataIndex: "title",
			key: "title",
			ellipsis: true,
			render: (title: string, record: Announcement) => (
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<FileTextOutlined style={{ color: "#1890ff", fontSize: 12 }} />
					<AntText style={{ cursor: "pointer", fontSize: 12, flex: 1 }} title={title} onClick={() => handlePdfPreview(record)}>
						{title}
					</AntText>
					<Button type="link" size="small" icon={<FilePdfOutlined />} onClick={() => handlePdfPreview(record)} style={{ padding: 0 }}>
						预览
					</Button>
				</div>
			),
		},
	];

	// 展开行的内容
	const expandedRowRender = (record: StockGroup) => {
		const announcements = expandedData[record.ts_code] || [];
		const loading = loadingExpanded[record.ts_code] || false;

		return (
			<Table
				columns={nestedColumns}
				dataSource={announcements}
				pagination={false}
				loading={loading}
				size="small"
				rowKey={(record) => `${record.ts_code}-${record.ann_date}-${record.title}`}
				locale={{
					emptyText: loading ? "加载中..." : "暂无公告",
				}}
				style={{ marginLeft: 48 }}
			/>
		);
	};

	return (
		<div style={{ padding: "24px" }}>
			<style>
				{`
					.favorite-stock-row > td {
						background-color: #e6f7ff !important;
					}
					.ant-table-cell-fix-left.favorite-stock-row-cell {
						background-color: #e6f7ff !important;
					}
					.ant-table-tbody > tr:hover > td {
						background-color: #bae7ff !important;
					}
					.ant-table-tbody > tr:hover .ant-table-cell-fix-left {
						background-color: #bae7ff !important;
					}
				`}
			</style>
			{/* 操作栏 */}
			<div style={{ marginBottom: 16 }}>
				{/* 第一行：搜索、市场选择、我的关注和刷新 */}
				<Space style={{ marginBottom: 12 }} align="start">
					<Search
						placeholder="搜索股票名称或代码"
						allowClear
						enterButton={<SearchOutlined />}
						onSearch={handleSearch}
						onChange={(e) => {
							setSearchKeyword(e.target.value);
							if (!e.target.value) {
								handleSearch("");
							}
						}}
						style={{ width: 300 }}
						value={searchKeyword}
					/>

					<Select
						value={selectedMarket}
						onChange={handleMarketChange}
						style={{ width: 120 }}
						disabled={showFavoriteOnly}
						options={[
							{ value: "all", label: "全部市场" },
							{ value: "主板", label: "主板" },
							{ value: "创业板", label: "创业板" },
							{ value: "科创板", label: "科创板" },
							{ value: "CDR", label: "CDR" },
						]}
					/>

					<Button
						type={showFavoriteOnly ? "primary" : "default"}
						icon={<StarOutlined />}
						onClick={() => handleFavoriteFilterChange(!showFavoriteOnly)}
						disabled={!!searchKeyword}
					>
						我的关注
					</Button>

					<Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
						刷新
					</Button>
				</Space>

				{/* 第二行：时间范围选择 */}
				<Space style={{ width: "100%" }} align="start">
					<Radio.Group value={quickSelectValue} onChange={(e) => handleQuickSelect(e.target.value)} buttonStyle="solid" size="middle">
						<Radio.Button value="today">今天</Radio.Button>
						<Radio.Button value="yesterday">昨天</Radio.Button>
						<Radio.Button value="week">最近一周</Radio.Button>
						<Radio.Button value="month">最近一个月</Radio.Button>
						<Radio.Button value="quarter">最近三个月</Radio.Button>
					</Radio.Group>

					<RangePicker
						value={dateRangeDisplay}
						onChange={handleDateRangeChange}
						format="YYYY-MM-DD"
						placeholder={["开始日期", "结束日期"]}
						style={{ width: 240 }}
						allowClear
						suffixIcon={<CalendarOutlined />}
					/>
				</Space>
			</div>

			{/* 加载历史状态提示 */}
			{loadingHistory && (
				<div style={{ marginBottom: 16 }}>
					<Badge
						status="processing"
						text={
							<AntText type="secondary">
								<HistoryOutlined spin /> 正在加载历史数据...
							</AntText>
						}
					/>
				</div>
			)}

			{/* 股票聚合表格 */}
			<Card>
				<Table
					columns={columns}
					dataSource={stockGroups}
					rowKey="ts_code"
					loading={loading}
					pagination={false}
					expandable={{
						expandedRowRender,
						onExpand,
						expandedRowKeys,
						onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
						showExpandColumn: false,
					}}
					rowClassName={(record) => (favoriteStocks.has(record.ts_code) ? "favorite-stock-row" : "")}
					onRow={(record) => ({
						onClick: () => {
							const key = record.ts_code;
							const isExpanded = expandedRowKeys.includes(key);
							if (isExpanded) {
								setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
							} else {
								setExpandedRowKeys([...expandedRowKeys, key]);
								onExpand(true, record);
							}
						},
						style: {
							cursor: "pointer",
						},
					})}
					scroll={{ x: 800 }}
					size="small"
					locale={{
						emptyText: loading ? "加载中..." : searchKeyword ? "没有找到匹配的股票" : "暂无数据",
					}}
				/>

				{/* 自定义分页 */}
				{!loading && stockGroups.length > 0 && (
					<div
						style={{
							marginTop: 16,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: "16px 0",
							borderTop: "1px solid #f0f0f0",
						}}
					>
						<AntText type="secondary">
							显示第 <AntText strong>{page}</AntText> 页
							{total > 0 && (
								<>
									{" "}
									共 <AntText strong>{Math.ceil(total / PAGE_SIZE)}</AntText> 页 (总计{" "}
									<AntText strong>{total.toLocaleString()}</AntText> 只股票)
								</>
							)}
						</AntText>
						<div style={{ display: "flex", gap: 8 }}>
							<Button onClick={handlePrevPage} disabled={page === 1}>
								上一页
							</Button>
							<Button onClick={handleNextPage} disabled={page >= Math.ceil(total / PAGE_SIZE)}>
								下一页
							</Button>
						</div>
					</div>
				)}
			</Card>

			{/* PDF 预览弹窗 */}
			<PDFWebViewer open={pdfViewerOpen} onClose={() => setPdfViewerOpen(false)} pdfUrl={currentPdfUrl} title={currentPdfTitle} />
		</div>
	);
}
