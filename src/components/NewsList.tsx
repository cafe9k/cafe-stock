import { useEffect, useState, useCallback } from "react";
import { Table, Card, Tag, Typography, Space, Button, Select, DatePicker, Radio, App, Spin } from "antd";
import { ReloadOutlined, CalendarOutlined, ReadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

const { Text: AntText, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface NewsItem {
	datetime: string;
	title: string;
	content: string;
	channels: string;
}

const PAGE_SIZE = 20;

// 新闻源配置
const NEWS_SOURCES = [
	{ value: "sina", label: "新浪财经" },
	{ value: "wallstreetcn", label: "华尔街见闻" },
	{ value: "10jqka", label: "同花顺" },
	{ value: "eastmoney", label: "东方财富" },
	{ value: "yuncaijing", label: "云财经" },
];

export function NewsList() {
	const { message } = App.useApp();
	const [newsList, setNewsList] = useState<NewsItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [selectedSource, setSelectedSource] = useState<string>("sina");

	// 日期范围筛选相关状态
	const [dateRange, setDateRange] = useState<[string, string] | null>(null);
	const [dateRangeDisplay, setDateRangeDisplay] = useState<[Dayjs, Dayjs] | null>(null);
	const [quickSelectValue, setQuickSelectValue] = useState<string>("today");

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

	// 加载资讯数据
	const fetchNews = useCallback(async () => {
		setLoading(true);
		try {
			if (!window.electronAPI) {
				throw new Error("Electron API not available");
			}

			const startDate = dateRange?.[0];
			const endDate = dateRange?.[1];

			console.log(`Fetching news: source=${selectedSource}, startDate=${startDate}, endDate=${endDate}`);

			const result = await window.electronAPI.getNews(selectedSource, startDate, endDate);

			// 按发布时间降序排序
			const sortedNews = result.sort((a: NewsItem, b: NewsItem) => {
				return b.datetime.localeCompare(a.datetime);
			});

			setNewsList(sortedNews);
		} catch (err: any) {
			console.error("Fetch news error:", err);
			message.error(err.message || "加载资讯失败");
			setNewsList([]);
		} finally {
			setLoading(false);
		}
	}, [selectedSource, dateRange, message]);

	// 快速日期范围选择处理
	const handleQuickSelect = async (value: string) => {
		setQuickSelectValue(value);
		setPage(1);

		let newDateRange: [string, string] | null = null;
		let newDateRangeDisplay: [Dayjs, Dayjs] | null = null;

		const today = dayjs().format("YYYYMMDD");
		const yesterday = getDaysAgo(1);

		switch (value) {
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
			// 如果清空日期，默认设置为今天
			const today = dayjs().format("YYYYMMDD");
			setDateRange([today, today]);
			setDateRangeDisplay([parseDateString(today), parseDateString(today)]);
			setQuickSelectValue("today");
		}
	};

	// 新闻源选择变化处理
	const handleSourceChange = (value: string) => {
		setSelectedSource(value);
		setPage(1);
	};

	// 刷新当前页
	const handleRefresh = () => {
		fetchNews();
	};

	// 初始化：设置默认日期为今天
	useEffect(() => {
		const today = dayjs().format("YYYYMMDD");
		setDateRange([today, today]);
		setDateRangeDisplay([parseDateString(today), parseDateString(today)]);
	}, []);

	// 监听数据加载
	useEffect(() => {
		if (dateRange) {
			fetchNews();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSource, dateRange]);

	// 分页数据
	const startIndex = (page - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;
	const paginatedNews = newsList.slice(startIndex, endIndex);
	const totalPages = Math.ceil(newsList.length / PAGE_SIZE);

	const handlePrevPage = () => {
		if (page > 1) {
			setPage((p) => p - 1);
		}
	};

	const handleNextPage = () => {
		if (page < totalPages) {
			setPage((p) => p + 1);
		}
	};

	// 表格列定义
	const columns: ColumnsType<NewsItem> = [
		{
			title: "发布时间",
			dataIndex: "datetime",
			key: "datetime",
			width: 180,
			render: (datetime: string) => {
				// 格式化时间显示：YYYY-MM-DD HH:mm:ss
				if (datetime && datetime.length >= 14) {
					const formatted = `${datetime.slice(0, 4)}-${datetime.slice(4, 6)}-${datetime.slice(6, 8)} ${datetime.slice(
						8,
						10
					)}:${datetime.slice(10, 12)}:${datetime.slice(12, 14)}`;
					return <AntText style={{ fontFamily: "monospace", fontSize: 12 }}>{formatted}</AntText>;
				}
				return <AntText style={{ fontFamily: "monospace", fontSize: 12 }}>{datetime}</AntText>;
			},
		},
		{
			title: "频道",
			dataIndex: "channels",
			key: "channels",
			width: 120,
			render: (channels: string) => {
				if (!channels) return "-";
				// 可能包含多个频道，用逗号分隔
				const channelList = channels.split(",").slice(0, 2); // 最多显示2个
				return (
					<Space size={4}>
						{channelList.map((channel, idx) => (
							<Tag key={idx} color="blue" style={{ fontSize: 11 }}>
								{channel}
							</Tag>
						))}
					</Space>
				);
			},
		},
		{
			title: "标题",
			dataIndex: "title",
			key: "title",
			ellipsis: true,
			render: (title: string) => (
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<ReadOutlined style={{ color: "#1890ff", fontSize: 14, flexShrink: 0 }} />
					<AntText strong ellipsis={{ tooltip: title }} style={{ fontSize: 13 }}>
						{title}
					</AntText>
				</div>
			),
		},
		{
			title: "内容",
			dataIndex: "content",
			key: "content",
			width: 400,
			render: (content: string) => (
				<Paragraph
					ellipsis={{
						rows: 2,
						expandable: true,
						symbol: "展开",
					}}
					style={{ margin: 0, fontSize: 12, color: "#666" }}
				>
					{content || "暂无内容"}
				</Paragraph>
			),
		},
	];

	return (
		<div style={{ padding: "24px" }}>
			{/* 操作栏 */}
			<div style={{ marginBottom: 16 }}>
			{/* 第一行：新闻源选择和刷新 */}
			<Space style={{ marginBottom: 12 }} align="start" wrap size={[8, 8]}>
				<Select
					value={selectedSource}
					onChange={handleSourceChange}
					style={{ width: 150 }}
					options={NEWS_SOURCES}
					placeholder="选择新闻源"
				/>

				<Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
					刷新
				</Button>
			</Space>

			{/* 第二行：时间范围选择 */}
			<Space style={{ width: "100%" }} align="start" wrap size={[8, 8]}>
				<Radio.Group value={quickSelectValue} onChange={(e) => handleQuickSelect(e.target.value)} buttonStyle="solid" size="middle">
					<Radio.Button value="today">今天</Radio.Button>
					<Radio.Button value="yesterday">昨天</Radio.Button>
					<Radio.Button value="week">最近一周</Radio.Button>
					<Radio.Button value="month">最近一个月</Radio.Button>
					<Radio.Button value="custom">自定义</Radio.Button>
				</Radio.Group>

				<RangePicker
					value={dateRangeDisplay}
					onChange={handleDateRangeChange}
					format="YYYY-MM-DD"
					placeholder={["开始日期", "结束日期"]}
					style={{ width: 240, minWidth: 240 }}
					allowClear={false}
					suffixIcon={<CalendarOutlined />}
				/>
			</Space>
			</div>

			{/* 资讯表格 */}
			<Card>
				<Spin spinning={loading} tip="加载中...">
					<Table
						columns={columns}
						dataSource={paginatedNews}
						rowKey={(record) => `${record.datetime}-${record.title}`}
						pagination={false}
						size="small"
						locale={{
							emptyText: loading ? "加载中..." : "暂无资讯",
						}}
						scroll={{ x: 1000 }}
					/>

					{/* 自定义分页 */}
					{!loading && paginatedNews.length > 0 && (
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
								{newsList.length > 0 && (
									<>
										{" "}
										共 <AntText strong>{totalPages}</AntText> 页 (总计 <AntText strong>{newsList.length}</AntText> 条资讯)
									</>
								)}
							</AntText>
							<div style={{ display: "flex", gap: 8 }}>
								<Button onClick={handlePrevPage} disabled={page === 1}>
									上一页
								</Button>
								<Button onClick={handleNextPage} disabled={page >= totalPages}>
									下一页
								</Button>
							</div>
						</div>
					)}
				</Spin>
			</Card>
		</div>
	);
}


