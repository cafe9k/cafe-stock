import { useEffect, useState, useCallback } from "react";
import { Table, Card, Tag, Typography, message, Badge, Space, Button, Input, DatePicker, Radio } from "antd";
import { FileTextOutlined, SyncOutlined, ReloadOutlined, SearchOutlined, HistoryOutlined, CalendarOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

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
}

interface Announcement {
	id: number;
	ts_code: string;
	ann_date: string;
	ann_type: string;
	title: string;
	content: string;
	pub_time: string;
}

const PAGE_SIZE = 20;

export function AnnouncementList() {
	const [stockGroups, setStockGroups] = useState<StockGroup[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [syncing, setSyncing] = useState(false);
	const [loadingHistory, setLoadingHistory] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
	const [expandedData, setExpandedData] = useState<Record<string, Announcement[]>>({});
	const [loadingExpanded, setLoadingExpanded] = useState<Record<string, boolean>>({});

	// 日期范围筛选相关状态
	const [dateRange, setDateRange] = useState<[string, string] | null>(null);
	const [dateRangeDisplay, setDateRangeDisplay] = useState<[Dayjs, Dayjs] | null>(null);
	const [quickSelectValue, setQuickSelectValue] = useState<string>("all");

	// 加载股票聚合数据
	const fetchGroupedData = useCallback(
		async (pageNum: number) => {
			setLoading(true);
			try {
				if (!window.electronAPI) {
					throw new Error("Electron API not available");
				}

				const result = await window.electronAPI.getAnnouncementsGrouped(pageNum, PAGE_SIZE, dateRange?.[0], dateRange?.[1]);
				setStockGroups(result.items);
				setTotal(result.total);
			} catch (err: any) {
				console.error("Fetch error:", err);
				message.error(err.message || "加载失败");
			} finally {
				setLoading(false);
			}
		},
		[dateRange]
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

	// 手动触发增量同步
	const handleSync = async () => {
		setSyncing(true);
		try {
			const result = await window.electronAPI.triggerIncrementalSync();

			if (result.status === "success") {
				message.success(`同步成功！共同步 ${result.totalSynced || 0} 条公告`);
				// 如果在第一页，刷新数据
				if (page === 1) {
					await fetchGroupedData(1);
				}
			} else if (result.status === "skipped") {
				message.info(result.message);
			} else {
				message.error(`同步失败：${result.message}`);
			}
		} catch (error: any) {
			console.error("Sync failed:", error);
			message.error(`同步失败：${error.message || "未知错误"}`);
		} finally {
			setSyncing(false);
		}
	};

	// 手动加载历史数据
	const handleLoadHistory = async () => {
		setLoadingHistory(true);
		try {
			const result = await window.electronAPI.loadHistoricalData();
			if (result.status === "success" && result.totalLoaded && result.totalLoaded > 0) {
				message.success(`历史数据加载成功！加载了 ${result.totalLoaded} 条公告`);
				// 重新获取当前页数据
				await fetchGroupedData(page);
			}
		} catch (err: any) {
			console.error("History load error:", err);
		} finally {
			setLoadingHistory(false);
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

		setLoading(true);
		try {
			const result = await window.electronAPI.searchAnnouncementsGrouped(value, 1, PAGE_SIZE, dateRange?.[0], dateRange?.[1]);
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

		let newDateRange: [string, string] | null = null;
		let newDateRangeDisplay: [Dayjs, Dayjs] | null = null;

		const today = dayjs().format("YYYYMMDD");
		const yesterday = getDaysAgo(1);

		switch (value) {
			case "all":
				// 全部数据
				newDateRange = null;
				newDateRangeDisplay = null;
				break;
			case "today":
				// 今天
				newDateRange = [today, today];
				newDateRangeDisplay = [parseDateString(today), parseDateString(today)];
				break;
			case "yesterday":
				// 昨天
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
			case "custom":
				// 自定义，不做任何处理
				return;
		}

		setDateRange(newDateRange);
		setDateRangeDisplay(newDateRangeDisplay);
	};

	// 自定义日期范围选择
	const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
		setPage(1);

		if (dates && dates[0] && dates[1]) {
			const startDate = formatDateToString(dates[0]);
			const endDate = formatDateToString(dates[1]);
			setDateRange([startDate, endDate]);
			setDateRangeDisplay([dates[0], dates[1]]);
			setQuickSelectValue("custom");
		} else {
			setDateRange(null);
			setDateRangeDisplay(null);
			setQuickSelectValue("all");
		}
	};

	// 监听数据更新
	useEffect(() => {
		console.log("AnnouncementList mounted. Checking API:", !!window.electronAPI);

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
	}, [page, searchKeyword, fetchGroupedData]);

	// 初始加载数据
	useEffect(() => {
		if (searchKeyword) {
			handleSearch(searchKeyword);
		} else {
			fetchGroupedData(page);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, dateRange]);

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
			title: "股票代码",
			dataIndex: "ts_code",
			key: "ts_code",
			width: 120,
			fixed: "left",
			render: (text) => (
				<Tag color="blue" style={{ fontFamily: "monospace" }}>
					{text}
				</Tag>
			),
		},
		{
			title: "股票名称",
			dataIndex: "stock_name",
			key: "stock_name",
			width: 150,
			fixed: "left",
			render: (text) => <AntText strong>{text}</AntText>,
		},
		{
			title: "行业",
			dataIndex: "industry",
			key: "industry",
			width: 120,
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
			render: (title: string) => (
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<FileTextOutlined style={{ color: "#1890ff", fontSize: 12 }} />
					<AntText style={{ cursor: "pointer", fontSize: 12 }} title={title}>
						{title}
					</AntText>
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
				rowKey="id"
				locale={{
					emptyText: loading ? "加载中..." : "暂无公告",
				}}
				style={{ marginLeft: 48 }}
			/>
		);
	};

	return (
		<div style={{ padding: "24px" }}>
			{/* 操作栏 */}
			<div style={{ marginBottom: 16 }}>
				{/* 第一行：搜索和刷新 */}
				<Space style={{ marginBottom: 12 }} align="start">
					<Search
						placeholder="搜索股票名称或代码"
						allowClear
						enterButton={<SearchOutlined />}
						onSearch={handleSearch}
						onChange={(e) => {
							if (!e.target.value) {
								handleSearch("");
							}
						}}
						style={{ width: 300 }}
						value={searchKeyword}
					/>

					<Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
						刷新
					</Button>
				</Space>

				{/* 第二行：时间范围选择 */}
				<Space style={{ width: "100%" }} align="start">
					<Radio.Group value={quickSelectValue} onChange={(e) => handleQuickSelect(e.target.value)} buttonStyle="solid" size="middle">
						<Radio.Button value="all">全部</Radio.Button>
						<Radio.Button value="today">今天</Radio.Button>
						<Radio.Button value="yesterday">昨天</Radio.Button>
						<Radio.Button value="week">最近一周</Radio.Button>
						<Radio.Button value="month">最近一个月</Radio.Button>
						<Radio.Button value="quarter">最近三个月</Radio.Button>
						<Radio.Button value="custom">自定义</Radio.Button>
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

			{/* 同步状态提示 */}
			{(syncing || loadingHistory) && (
				<div style={{ marginBottom: 16 }}>
					{syncing && (
						<Badge
							status="processing"
							text={
								<AntText type="secondary">
									<SyncOutlined spin /> 正在同步最新公告...
								</AntText>
							}
						/>
					)}
					{loadingHistory && (
						<Badge
							status="processing"
							text={
								<AntText type="secondary">
									<HistoryOutlined spin /> 正在加载历史数据...
								</AntText>
							}
						/>
					)}
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
					}}
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
		</div>
	);
}
