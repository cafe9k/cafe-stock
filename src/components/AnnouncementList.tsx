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
import { StockList } from "./StockList/index";
import { useStockList } from "../hooks/useStockList";
import { useStockFilter } from "../hooks/useStockFilter";
import { useFavoriteStocks } from "../hooks/useFavoriteStocks";
import type { StockGroup } from "../types/stock";

const { Text: AntText } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface Announcement {
	ts_code: string;
	ann_date: string;
	ann_type: string;
	title: string;
	content: string;
	pub_time: string;
	file_path?: string;
}

export function AnnouncementList() {
	const { message } = App.useApp();
	const [loadingHistory, setLoadingHistory] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
	const [expandedData, setExpandedData] = useState<Record<string, Announcement[]>>({});
	const [loadingExpanded, setLoadingExpanded] = useState<Record<string, boolean>>({});

	// 使用新的 hooks
	const filter = useStockFilter();
	const {
		data: stockGroups,
		loading,
		page,
		total,
		pageSize: PAGE_SIZE,
		updateFilter,
		goToPage,
		prevPage,
		nextPage,
		refresh,
	} = useStockList<StockGroup>({
		pageSize: 20,
		enableFavoriteFilter: true,
	});

	const { favoriteCodes, toggleFavorite } = useFavoriteStocks();

	// PDF 预览相关状态
	const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
	const [currentPdfUrl, setCurrentPdfUrl] = useState("");
	const [currentPdfTitle, setCurrentPdfTitle] = useState("");

	// 当筛选条件变化时更新数据
	useEffect(() => {
		const currentFilter = filter.getFilter();
		currentFilter.searchKeyword = searchKeyword || undefined;
		updateFilter(currentFilter);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter.dateRange, filter.selectedMarket, filter.showFavoriteOnly, searchKeyword]);

	// 分页状态（针对每个股票的展开详情）
	const [expandedPageMap, setExpandedPageMap] = useState<Record<string, number>>({});
	const EXPANDED_PAGE_SIZE = 10; // 展开列表每页10条

	// 展开行时加载该股票的公告
	const onExpand = async (expanded: boolean, record: StockGroup) => {
		if (expanded && !expandedData[record.ts_code]) {
			setLoadingExpanded((prev) => ({ ...prev, [record.ts_code]: true }));
			try {
				// 传入当前筛选的时间范围
				const currentFilter = filter.getFilter();
				const announcements = await window.electronAPI.getStockAnnouncements(
					record.ts_code,
					1000, // 获取足够多的数据
					currentFilter.dateRange?.[0],
					currentFilter.dateRange?.[1]
				);
				
				// #region agent log
				fetch('http://127.0.0.1:7242/ingest/67286581-beef-43bb-8e6c-59afa2dd6840',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnnouncementList.tsx:94',message:'Frontend received announcements',data:{tsCode:record.ts_code,count:announcements.length,first3:announcements.slice(0,3).map((a:any)=>({ann_date:a.ann_date,pub_time:a.pub_time,title:a.title?.substring(0,30)}))},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
				// #endregion
				
				setExpandedData((prev) => ({ ...prev, [record.ts_code]: announcements }));
				// 初始化分页为第1页
				setExpandedPageMap((prev) => ({ ...prev, [record.ts_code]: 1 }));
			} catch (err: any) {
				console.error("Load announcements error:", err);
				message.error("加载公告失败");
			} finally {
				setLoadingExpanded((prev) => ({ ...prev, [record.ts_code]: false }));
			}
		}
	};

	// 关注/取消关注股票
	const handleToggleFavorite = async (tsCode: string, stockName: string, event: React.MouseEvent) => {
		event.stopPropagation(); // 阻止事件冒泡，避免触发行展开

		try {
			await toggleFavorite(tsCode, stockName);
			// 如果当前正在查看"我的关注"，刷新列表
			if (filter.showFavoriteOnly) {
				refresh();
			}
		} catch (err: any) {
			console.error("Toggle favorite error:", err);
		}
	};

	// 搜索功能
	const handleSearch = async (value: string) => {
		setSearchKeyword(value);
		// 搜索时不支持"我的关注"过滤
		if (filter.showFavoriteOnly && value.trim()) {
			message.info('搜索时暂不支持"我的关注"过滤，已切换到全部股票');
			filter.setShowFavoriteOnly(false);
		}
		// 筛选条件变化会触发 useEffect 自动更新
	};

	// 刷新当前页
	const handleRefresh = () => {
		refresh();
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

		const unsubscribe = window.electronAPI.onDataUpdated((data) => {
			console.log("Data updated:", data);
			if (data.type === "incremental") {
				// 增量同步完成后，如果在第一页，刷新数据
				if (page === 1 && !searchKeyword) {
					refresh();
				}
			} else if (data.type === "historical") {
				setLoadingHistory(true);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [page, searchKeyword, refresh]);


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
		const currentPage = expandedPageMap[record.ts_code] || 1;

		// #region agent log
		if (announcements.length > 0) {
			const pageStart = (currentPage - 1) * EXPANDED_PAGE_SIZE;
			const pageEnd = pageStart + EXPANDED_PAGE_SIZE;
			const currentPageData = announcements.slice(pageStart, pageEnd);
			fetch('http://127.0.0.1:7242/ingest/67286581-beef-43bb-8e6c-59afa2dd6840',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnnouncementList.tsx:227',message:'Rendering expanded row - showing current page data',data:{tsCode:record.ts_code,totalCount:announcements.length,currentPage,pageSize:EXPANDED_PAGE_SIZE,currentPageCount:currentPageData.length,allFirst5:announcements.slice(0,5).map((a:any)=>({ann_date:a.ann_date,title:a.title?.substring(0,30)})),allLast5:announcements.slice(-5).map((a:any)=>({ann_date:a.ann_date,title:a.title?.substring(0,30)})),currentPageFirst3:currentPageData.slice(0,3).map((a:any)=>({ann_date:a.ann_date,title:a.title?.substring(0,30)}))},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
		}
		// #endregion

		return (
			<Table
				columns={nestedColumns}
				dataSource={announcements}
				pagination={
					announcements.length > EXPANDED_PAGE_SIZE
						? {
								current: currentPage,
								pageSize: EXPANDED_PAGE_SIZE,
								total: announcements.length,
								size: "small",
								showSizeChanger: false,
								showTotal: (total) => `共 ${total} 条公告`,
								onChange: (page) => {
									setExpandedPageMap((prev) => ({ ...prev, [record.ts_code]: page }));
								},
						  }
						: false
				}
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

	// #region agent log
	if (stockGroups.length > 0 && !loading) {
		fetch('http://127.0.0.1:7242/ingest/67286581-beef-43bb-8e6c-59afa2dd6840',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnnouncementList.tsx:270',message:'Component rendering with stock groups',data:{count:stockGroups.length,first5:stockGroups.slice(0,5).map((s:any)=>({ts_code:s.ts_code,stock_name:s.stock_name||s.name,latest_ann_date:s.latest_ann_date,latest_ann_title:s.latest_ann_title?.substring(0,30)})),last5:stockGroups.slice(-5).map((s:any)=>({ts_code:s.ts_code,stock_name:s.stock_name||s.name,latest_ann_date:s.latest_ann_date,latest_ann_title:s.latest_ann_title?.substring(0,30)}))},timestamp:Date.now(),sessionId:'debug-session',runId:'new-run',hypothesisId:'J'})}).catch(()=>{});
	}
	// #endregion

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
				{/* 第一行：市场选择、我的关注和刷新 */}
				<Space style={{ marginBottom: 12 }} align="start">
					<Select
						value={filter.selectedMarket}
						onChange={filter.setSelectedMarket}
						style={{ width: 120 }}
						disabled={filter.showFavoriteOnly}
						options={[
							{ value: "all", label: "全部市场" },
							{ value: "主板", label: "主板" },
							{ value: "创业板", label: "创业板" },
							{ value: "科创板", label: "科创板" },
							{ value: "CDR", label: "CDR" },
						]}
					/>

					<Button
						type={filter.showFavoriteOnly ? "primary" : "default"}
						icon={<StarOutlined />}
						onClick={() => {
							if (searchKeyword) {
								setSearchKeyword("");
							}
							filter.setShowFavoriteOnly(!filter.showFavoriteOnly);
						}}
						disabled={!!searchKeyword}
					>
						我的关注
					</Button>

					<Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
						刷新
					</Button>
				</Space>

				{/* 第二行：搜索、时间范围选择 */}
				<Space style={{ width: "100%" }} align="start">
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

					<Radio.Group value={filter.quickSelectValue} onChange={(e) => filter.handleQuickSelect(e.target.value)} buttonStyle="solid" size="middle">
						<Radio.Button value="today">今天</Radio.Button>
						<Radio.Button value="yesterday">昨天</Radio.Button>
						<Radio.Button value="week">最近一周</Radio.Button>
						<Radio.Button value="month">最近一个月</Radio.Button>
						<Radio.Button value="quarter">最近三个月</Radio.Button>
					</Radio.Group>

					<RangePicker
						value={filter.dateRangeDisplay}
						onChange={filter.handleDateRangeChange}
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
				<StockList
					data={stockGroups}
					loading={loading}
					page={page}
					total={total}
					pageSize={PAGE_SIZE}
					onPageChange={goToPage}
					columnConfig={{
						showFavorite: true,
						showName: true,
						showMarket: true,
						showIndustry: true,
						showAnnouncementCount: true,
						showLatestAnnTitle: true,
						showLatestAnnDate: true,
					}}
					onFavoriteToggle={async (record) => {
						await handleToggleFavorite(record.ts_code, record.stock_name, {} as React.MouseEvent);
					}}
					onRowClick={(record) => {
						const key = record.ts_code;
						const isExpanded = expandedRowKeys.includes(key);
						if (isExpanded) {
							setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
						} else {
							setExpandedRowKeys([...expandedRowKeys, key]);
							onExpand(true, record);
						}
					}}
					expandable={{
						expandedRowRender,
						expandedRowKeys,
						onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
						showExpandColumn: false,
					}}
					rowKey="ts_code"
					showPagination={false}
					scroll={{ x: 800 }}
					size="small"
					emptyText={loading ? "加载中..." : searchKeyword ? "没有找到匹配的股票" : "暂无数据"}
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
							<Button onClick={prevPage} disabled={page === 1}>
								上一页
							</Button>
							<Button onClick={nextPage} disabled={page >= Math.ceil(total / PAGE_SIZE)}>
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
