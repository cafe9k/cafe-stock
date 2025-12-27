/**
 * 依赖: useStockList(hook), useStockFilter(hook), StockList(组件), announcementClassifier(分类工具), window.electron(IPC)
 * 输出: AnnouncementList 组件 - 公告列表展示组件，提供搜索、筛选、分页、PDF查看等功能
 * 职责: 渲染进程核心UI组件，负责公告数据的展示和交互，是用户与公告数据的主要界面
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/components/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useEffect, useState, useMemo, useRef } from "react";
import { Table, Card, Tag, Typography, Badge, Space, Button, Input, Select, App, InputNumber, Descriptions, Divider } from "antd";
import { FileTextOutlined, ReloadOutlined, SearchOutlined, HistoryOutlined, StarOutlined, StarFilled, ClockCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { StockList } from "./StockList/index";
import { useStockList } from "../hooks/useStockList";
import { useStockFilter } from "../hooks/useStockFilter";
import type { StockGroup, StockFilter } from "../types/stock";
import { AnnouncementCategory, getCategoryColor, getCategoryIcon } from "../utils/announcementClassifier";

const { Text: AntText } = Typography;
const { Search } = Input;

// 搜索历史存储键名
const SEARCH_HISTORY_STORAGE_KEY = "announcement_search_history";
const MAX_SEARCH_HISTORY = 20;

interface Announcement {
	ts_code: string;
	ann_date: string;
	ann_type: string;
	title: string;
	content: string;
	pub_time: string;
	file_path?: string;
	category?: string;
}

export function AnnouncementList() {
	const { message } = App.useApp();
	const [loadingHistory, setLoadingHistory] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	// 防抖后的搜索关键词，用于实际触发搜索
	const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
	const [expandedData, setExpandedData] = useState<Record<string, Announcement[]>>({});
	const [companyInfoData, setCompanyInfoData] = useState<Record<string, any>>({});
	const [loadingExpanded, setLoadingExpanded] = useState<Record<string, boolean>>({});
	const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	// 市值筛选状态
	const [marketCapFilter, setMarketCapFilter] = useState<string>("all"); // all | < 30 | < 50 | < 100 | custom
	const [customMarketCapMin, setCustomMarketCapMin] = useState<number | null>(null);
	const [customMarketCapMax, setCustomMarketCapMax] = useState<number | null>(null);

	// 搜索历史状态
	const [searchHistory, setSearchHistory] = useState<string[]>(() => {
		// 从 localStorage 加载搜索历史
		try {
			const saved = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});

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
	});

	// 构建完整的筛选条件
	const currentFilter = useMemo<StockFilter>(() => {
		const baseFilter = filter.getFilter();

		// 构建市值筛选范围
		let marketCapRange: { min?: number; max?: number } | undefined;
		if (marketCapFilter === "< 30") {
			marketCapRange = { max: 30 };
		} else if (marketCapFilter === "< 50") {
			marketCapRange = { max: 50 };
		} else if (marketCapFilter === "< 100") {
			marketCapRange = { max: 100 };
		} else if (marketCapFilter === "custom" && (customMarketCapMin !== null || customMarketCapMax !== null)) {
			marketCapRange = {
				min: customMarketCapMin ?? undefined,
				max: customMarketCapMax ?? undefined,
			};
		}

		return {
			...baseFilter,
			searchKeyword: debouncedSearchKeyword.trim() || undefined,
			showFavoriteOnly,
			marketCapRange,
			categories: selectedCategories.length > 0 ? selectedCategories : undefined,
		};
	}, [filter, debouncedSearchKeyword, showFavoriteOnly, marketCapFilter, customMarketCapMin, customMarketCapMax, selectedCategories]);

	// 当筛选条件变化时，重新从数据库获取数据并重置到第一页
	useEffect(() => {
		// 筛选条件变化时，清理展开的数据和状态
		setExpandedRowKeys([]);
		setExpandedData({});
		setCompanyInfoData({});
		setExpandedPageMap({});

		// 更新筛选条件并重新加载（会自动重置到第一页）
		updateFilter(currentFilter);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		currentFilter.market,
		currentFilter.searchKeyword,
		currentFilter.showFavoriteOnly,
		currentFilter.dateRange?.[0],
		currentFilter.dateRange?.[1],
		currentFilter.marketCapRange?.min,
		currentFilter.marketCapRange?.max,
		currentFilter.categories?.join(","), // 监听分类数组变化
	]);

	// 当分类筛选变化时，重置所有展开行的分页到第一页
	useEffect(() => {
		const resetPages: Record<string, number> = {};
		expandedRowKeys.forEach((key) => {
			resetPages[key] = 1;
		});
		if (Object.keys(resetPages).length > 0) {
			setExpandedPageMap((prev) => ({ ...prev, ...resetPages }));
		}
	}, [selectedCategories, expandedRowKeys]);

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

	// 搜索防抖：输入停止 500ms 后执行搜索
	useEffect(() => {
		// 清除之前的定时器
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// 设置新的定时器，500ms 后更新防抖搜索关键词
		debounceTimerRef.current = setTimeout(() => {
			setDebouncedSearchKeyword(searchKeyword);
		}, 500);

		// 清理函数：组件卸载时清除定时器
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [searchKeyword]);

	// 搜索功能（立即执行，用于回车或点击搜索按钮）
	const handleSearch = async (value: string) => {
		const trimmedValue = value.trim();
		setSearchKeyword(trimmedValue);
		// 立即更新防抖搜索关键词（跳过防抖）
		setDebouncedSearchKeyword(trimmedValue);

		// 清除防抖定时器，避免重复触发
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// 保存到搜索历史（非空且不重复）
		if (trimmedValue && !searchHistory.includes(trimmedValue)) {
			const newHistory = [trimmedValue, ...searchHistory].slice(0, MAX_SEARCH_HISTORY);
			setSearchHistory(newHistory);
			localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
		}

		// 筛选条件变化会触发 useEffect 自动更新
	};

	// 使用搜索历史
	const handleUseSearchHistory = (keyword: string) => {
		setSearchKeyword(keyword);
		// 立即更新防抖搜索关键词（跳过防抖）
		setDebouncedSearchKeyword(keyword);
		// 清除防抖定时器，避免重复触发
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		// 保存到搜索历史（非空且不重复）
		if (keyword && !searchHistory.includes(keyword)) {
			const newHistory = [keyword, ...searchHistory].slice(0, MAX_SEARCH_HISTORY);
			setSearchHistory(newHistory);
			localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
		}
	};

	// 删除搜索历史
	const handleRemoveSearchHistory = (keyword: string, event: React.MouseEvent) => {
		event.stopPropagation(); // 阻止事件冒泡，避免触发使用历史
		const newHistory = searchHistory.filter((k) => k !== keyword);
		setSearchHistory(newHistory);
		localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
		message.success("已删除搜索历史");
	};

	// 刷新当前页（强制从服务端获取）
	const handleRefresh = () => {
		refresh(true); // 传入 true 强制从服务端获取
	};

	// 切换关注过滤
	const handleToggleFavoriteFilter = () => {
		setShowFavoriteOnly(!showFavoriteOnly);
	};

	// 处理关注状态变化
	const handleFavoriteChange = (_tsCode: string, isFavorite: boolean) => {
		// 如果当前处于"仅关注"模式且取消了关注，刷新列表
		if (showFavoriteOnly && !isFavorite) {
			refresh();
		}
	};

	// 处理 PDF 预览 - 直接在系统默认浏览器中打开
	const handlePdfPreview = async (announcement: Announcement) => {
		try {
			message.loading({ content: "正在获取公告链接...", key: "pdf-loading" });

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

				// 直接在系统默认浏览器中打开
				const openResult = await window.electronAPI.openExternal(result.url);
				if (openResult.success) {
					message.success("已在浏览器中打开公告");
				} else {
					message.error((openResult as any).error || "打开浏览器失败");
				}
			} else {
				message.warning(result.message || "该公告暂无 PDF 文件");
			}
		} catch (error: any) {
			message.destroy("pdf-loading");
			console.error("打开公告失败:", error);
			message.error("打开公告失败，请稍后重试");
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
			title: "标题",
			dataIndex: "title",
			key: "title",
			ellipsis: true,
			render: (title: string, record: Announcement) => {
				const category = record.category;
				const color = category ? getCategoryColor(category as AnnouncementCategory) : "default";
				const icon = category ? getCategoryIcon(category as AnnouncementCategory) : "📄";

				return (
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<FileTextOutlined style={{ color: "#1890ff", fontSize: 12 }} />
						<AntText style={{ fontSize: 12, flex: 1 }} title={title}>
							{title}
						</AntText>
						<Tag color={color} style={{ marginLeft: 8 }}>
							{icon} {category || "未分类"}
						</Tag>
					</div>
				);
			},
		},
		{
			title: "日期",
			dataIndex: "ann_date",
			key: "ann_date",
			width: 120,
			render: (date: string) => <AntText style={{ fontFamily: "monospace", fontSize: 12 }}>{date}</AntText>,
		},
	];

	// 展开行的内容
	const expandedRowRender = (record: StockGroup) => {
		const allAnnouncements = expandedData[record.ts_code] || [];
		const companyInfo = companyInfoData[record.ts_code];
		const loading = loadingExpanded[record.ts_code] || false;
		const currentPage = expandedPageMap[record.ts_code] || 1;

		// 应用分类过滤
		const filteredAnnouncements =
			selectedCategories.length > 0
				? allAnnouncements.filter((ann) => ann.category && selectedCategories.includes(ann.category))
				: allAnnouncements;

		return (
			<div style={{ padding: "16px", backgroundColor: "#fafafa" }}>
				{/* 公司基本信息 */}
				{companyInfo && (
					<>
						<Card size="small" style={{ marginBottom: 16 }}>
							<Descriptions title="公司基本信息" bordered size="small" column={2}>
								{companyInfo.chairman && <Descriptions.Item label="法人代表">{companyInfo.chairman}</Descriptions.Item>}
								{companyInfo.manager && <Descriptions.Item label="总经理">{companyInfo.manager}</Descriptions.Item>}
								{companyInfo.secretary && <Descriptions.Item label="董秘">{companyInfo.secretary}</Descriptions.Item>}
								{companyInfo.reg_capital && <Descriptions.Item label="注册资本">{companyInfo.reg_capital}</Descriptions.Item>}
								{companyInfo.setup_date && (
									<Descriptions.Item label="成立日期">
										{companyInfo.setup_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}
									</Descriptions.Item>
								)}
								{(companyInfo.province || companyInfo.city) && (
									<Descriptions.Item label="所在地">
										{companyInfo.province || ""}
										{companyInfo.province && companyInfo.city ? " " : ""}
										{companyInfo.city || ""}
									</Descriptions.Item>
								)}
								{companyInfo.employees && (
									<Descriptions.Item label="员工人数">{companyInfo.employees.toLocaleString()} 人</Descriptions.Item>
								)}
								{companyInfo.website && (
									<Descriptions.Item label="公司网站" span={2}>
										<a href={companyInfo.website} target="_blank" rel="noopener noreferrer">
											{companyInfo.website}
										</a>
									</Descriptions.Item>
								)}
								{companyInfo.main_business && (
									<Descriptions.Item label="主营业务" span={2}>
										<AntText style={{ fontSize: 12 }}>{companyInfo.main_business}</AntText>
									</Descriptions.Item>
								)}
								{companyInfo.introduction && (
									<Descriptions.Item label="公司介绍" span={2}>
										<AntText style={{ fontSize: 12 }} ellipsis={{ tooltip: companyInfo.introduction }}>
											{companyInfo.introduction}
										</AntText>
									</Descriptions.Item>
								)}
							</Descriptions>
						</Card>
						<Divider style={{ margin: "12px 0" }} />
					</>
				)}

				{/* 公告列表 */}
				<div>
					<AntText strong style={{ fontSize: 14, marginBottom: 8, display: "block" }}>
						最新公告
					</AntText>
					<Table
						columns={nestedColumns}
						dataSource={filteredAnnouncements}
						pagination={
							filteredAnnouncements.length > EXPANDED_PAGE_SIZE
								? {
										current: currentPage,
										pageSize: EXPANDED_PAGE_SIZE,
										total: filteredAnnouncements.length,
										size: "small",
										showSizeChanger: false,
										showTotal: (total) => `共 ${total} 条公告`,
										onChange: (page) => {
											setExpandedPageMap((prev) => ({ ...prev, [record.ts_code]: page }));
										},
										style: {
											marginTop: 12,
											marginBottom: 0,
											paddingBottom: 8,
										},
										showQuickJumper: true,
										position: ["bottomCenter"] as any,
								  }
								: false
						}
						loading={loading}
						size="small"
						showHeader={false}
						rowKey={(record) => `${record.ts_code}-${record.ann_date}-${record.title}`}
						locale={{
							emptyText: loading ? "加载中..." : selectedCategories.length > 0 ? "没有符合所选分类的公告" : "暂无公告",
						}}
						onRow={(record) => ({
							onClick: () => handlePdfPreview(record),
							style: { cursor: "pointer" },
						})}
					/>
				</div>
			</div>
		);
	};

	// 根据分类筛选和市值筛选过滤股票列表（已在后端处理，这里直接使用）
	const filteredStockGroups = useMemo(() => {
		// 后端已经应用了所有筛选条件（搜索、分类、市值），前端直接使用返回的数据
		return stockGroups;
	}, [stockGroups]);

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
			{/* 操作栏 - 所有控件在同一行 */}
			<div style={{ marginBottom: 16 }}>
				<Space style={{ width: "100%" }} align="start" wrap size={[8, 8]}>
					{/* 关注筛选 - 最重要的筛选条件，放在最左边 */}
					<Button
						type={showFavoriteOnly ? "primary" : "default"}
						icon={showFavoriteOnly ? <StarFilled /> : <StarOutlined />}
						onClick={handleToggleFavoriteFilter}
					>
						{showFavoriteOnly ? "仅关注" : "关注"}
					</Button>

					{/* 市场选择 - 第二重要的筛选条件 */}
					<Select
						value={filter.selectedMarket}
						onChange={filter.setSelectedMarket}
						style={{ width: 110 }}
						options={[
							{ value: "all", label: "全部市场" },
							{ value: "主板", label: "主板" },
							{ value: "创业板", label: "创业板" },
							{ value: "科创板", label: "科创板" },
							{ value: "CDR", label: "CDR" },
						]}
					/>

					{/* 市值筛选 */}
					<Select
						value={marketCapFilter}
						onChange={setMarketCapFilter}
						style={{ width: 120 }}
						options={[
							{ value: "all", label: "全部市值" },
							{ value: "< 30", label: "< 30亿" },
							{ value: "< 50", label: "< 50亿" },
							{ value: "< 100", label: "< 100亿" },
							{ value: "custom", label: "自定义" },
						]}
					/>
					{marketCapFilter === "custom" && (
						<>
							<InputNumber
								placeholder="最小值（亿）"
								value={customMarketCapMin}
								onChange={(value) => setCustomMarketCapMin(value)}
								style={{ width: 110 }}
								min={0}
								precision={2}
							/>
							<span>-</span>
							<InputNumber
								placeholder="最大值（亿）"
								value={customMarketCapMax}
								onChange={(value) => setCustomMarketCapMax(value)}
								style={{ width: 110 }}
								min={0}
								precision={2}
							/>
						</>
					)}

					{/* 时间选择 */}
					<Select
						value={filter.quickSelectValue}
						onChange={filter.handleQuickSelect}
						style={{ width: 120 }}
						suffixIcon={<ClockCircleOutlined />}
						options={[
							{ value: "today", label: "今天" },
							{ value: "tomorrow", label: "明天" },
							{ value: "yesterday", label: "昨天" },
							{ value: "week", label: "最近一周" },
							{ value: "month", label: "最近一个月" },
							{ value: "quarter", label: "最近三个月" },
						]}
					/>

					{/* 刷新按钮 - 操作按钮放在最右边 */}
					<Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
						刷新
					</Button>
				</Space>
			</div>

			{/* 搜索（独立一行） */}
			<div style={{ marginBottom: 16 }}>
				<Space wrap size={[8, 8]} style={{ width: "100%" }} align="center">
					<AntText strong>快速搜索：</AntText>
					<Search
						placeholder="根据关键字搜索股票或公告"
						allowClear
						enterButton={<SearchOutlined />}
						onSearch={handleSearch}
						onChange={(e) => {
							setSearchKeyword(e.target.value);
							// 如果清空输入框，立即执行搜索（不使用防抖）
							if (!e.target.value) {
								setDebouncedSearchKeyword("");
								if (debounceTimerRef.current) {
									clearTimeout(debounceTimerRef.current);
								}
							}
						}}
						style={{ width: 340 }}
						value={searchKeyword}
					/>
					{/* 搜索历史列表 */}
					{searchHistory.length > 0 && (
						<>
							<AntText type="secondary" style={{ marginLeft: 8 }}>
								最近搜索：
							</AntText>
							<div
								style={{
									display: "flex",
									gap: 8,
									overflowX: "auto",
									overflowY: "hidden",
									maxWidth: "calc(100vw - 700px)",
									scrollbarWidth: "thin",
									WebkitOverflowScrolling: "touch",
								}}
							>
								{searchHistory.map((keyword) => (
									<Tag
										key={keyword}
										closable
										onClose={(e) => handleRemoveSearchHistory(keyword, e)}
										onClick={() => handleUseSearchHistory(keyword)}
										style={{ cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
										color={searchKeyword === keyword ? "blue" : "default"}
									>
										{keyword}
									</Tag>
								))}
							</div>
						</>
					)}
				</Space>
			</div>

			{/* 分类筛选器（独立一行，横向滚动） */}
			<div style={{ marginBottom: 16 }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						overflowX: "auto",
						overflowY: "hidden",
						scrollbarWidth: "none", // Firefox 隐藏滚动条
						msOverflowStyle: "none", // IE/Edge 隐藏滚动条
						WebkitOverflowScrolling: "touch",
					}}
				>
					<style>
						{`
							/* WebKit 浏览器（Chrome、Safari）隐藏滚动条 */
							div::-webkit-scrollbar {
								display: none;
							}
						`}
					</style>
					<AntText strong style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
						分类筛选：
					</AntText>
					<div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
						<Button
							size="small"
							type={selectedCategories.length === 0 ? "primary" : "default"}
							onClick={() => setSelectedCategories([])}
							style={{ whiteSpace: "nowrap" }}
						>
							全部
						</Button>
						{Object.values(AnnouncementCategory).map((category) => (
							<Button
								key={category}
								size="small"
								type={selectedCategories.includes(category) ? "primary" : "default"}
								icon={<span>{getCategoryIcon(category)}</span>}
								onClick={() => {
									setSelectedCategories((prev) =>
										prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
									);
								}}
								style={{ whiteSpace: "nowrap" }}
							>
								{category}
							</Button>
						))}
					</div>
				</div>
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
					data={filteredStockGroups}
					loading={loading}
					page={page}
					total={total}
					pageSize={PAGE_SIZE}
					onPageChange={goToPage}
					onFavoriteChange={handleFavoriteChange}
					tableId="announcement-list"
					columnConfig={{
						showFavoriteButton: true,
						showCode: false,
						showName: true,
						showMarket: true,
						showIndustry: true,
						showMarketCap: true,
						showAnnouncementCount: false,
						showAnnouncementCategories: true,
						showLatestAnnTitle: true,
						showLatestAnnDate: true,
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
					scroll={{ x: 850 }}
					size="small"
					emptyText={
						loading
							? "加载中..."
							: searchKeyword
							? "没有找到匹配的股票"
							: selectedCategories.length > 0
							? "没有符合所选分类的股票"
							: "暂无数据"
					}
				/>

				{/* 自定义分页 */}
				{!loading && filteredStockGroups.length > 0 && (
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
							显示第 <AntText strong>{page}</AntText> 页 共 <AntText strong>{Math.ceil(total / PAGE_SIZE)}</AntText> 页 (总计{" "}
							<AntText strong>{total.toLocaleString()}</AntText> 只股票)
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
		</div>
	);
}
