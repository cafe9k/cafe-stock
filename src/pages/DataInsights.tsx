import { useState, useEffect } from "react";
import { Button, Select, Table, Card, Space, Spin, Typography, Tag, Progress, Statistic, Row, Col, Divider, App, Tabs } from "antd";
import { SearchOutlined, SyncOutlined, StarOutlined, StarFilled } from "@ant-design/icons";
import type { TableColumnsType } from "antd";

const { Title, Text } = Typography;

interface Stock {
	ts_code: string;
	symbol: string;
	name: string;
	area: string;
	industry: string;
	market: string;
	list_date: string;
}

interface Top10Holder {
	ts_code: string;
	ann_date: string;
	end_date: string;
	holder_name: string;
	hold_amount: number;
	hold_ratio: number;
}

interface SyncProgress {
	current: number;
	total: number;
	tsCode: string;
	name: string;
	status: "success" | "skipped" | "failed";
	error?: string;
	successCount: number;
	skipCount: number;
	failCount: number;
}

interface SyncStats {
	totalStocks: number;
	syncedStocks: number;
	syncedStockCodes: string[];
	syncRate: string;
}

export function DataInsights() {
	const { message, modal } = App.useApp();
	const [searchKeyword, setSearchKeyword] = useState("");
	const [stockOptions, setStockOptions] = useState<Stock[]>([]);
	const [searching, setSearching] = useState(false);
	const [selectedStock, setSelectedStock] = useState<string | null>(null);
	const [holders, setHolders] = useState<Top10Holder[]>([]);
	const [loading, setLoading] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
	const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
	const [hasData, setHasData] = useState(false);
	const [favoriteStocks, setFavoriteStocks] = useState<Stock[]>([]);
	const [loadingFavorites, setLoadingFavorites] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);
	const [searchMode, setSearchMode] = useState<"search" | "favorite">("search");
	const [endDates, setEndDates] = useState<string[]>([]);
	const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
	const [isPaused, setIsPaused] = useState(false);

	// 加载同步统计信息
	const loadSyncStats = async () => {
		try {
			const stats = await window.electronAPI.getTop10HoldersSyncStats();
			setSyncStats(stats);
		} catch (error: any) {
			console.error("获取同步统计失败:", error);
		}
	};

	// 检查当前股票是否有数据
	const checkHasData = async (tsCode: string) => {
		try {
			const result = await window.electronAPI.hasTop10HoldersData(tsCode);
			setHasData(result);
		} catch (error: any) {
			console.error("检查数据失败:", error);
			setHasData(false);
		}
	};

	// 加载关注的股票列表
	const loadFavoriteStocks = async () => {
		try {
			setLoadingFavorites(true);
			const favoriteCodes = await window.electronAPI.getAllFavoriteStocks();
			if (favoriteCodes.length > 0) {
				// 获取股票详细信息
				const stocksData: Stock[] = [];
				for (const code of favoriteCodes) {
					const results = await window.electronAPI.searchStocks(code, 1);
					if (results.length > 0) {
						stocksData.push(results[0]);
					}
				}
				setFavoriteStocks(stocksData);
			} else {
				setFavoriteStocks([]);
			}
		} catch (error: any) {
			console.error("加载关注股票失败:", error);
			message.error(`加载关注股票失败: ${error.message || "未知错误"}`);
		} finally {
			setLoadingFavorites(false);
		}
	};

	// 检查当前股票是否已关注
	const checkIsFavorite = async (tsCode: string) => {
		try {
			const result = await window.electronAPI.isFavoriteStock(tsCode);
			setIsFavorite(result);
		} catch (error: any) {
			console.error("检查关注状态失败:", error);
			setIsFavorite(false);
		}
	};

	// 组件加载时获取统计信息和关注列表
	useEffect(() => {
		loadSyncStats();
		loadFavoriteStocks();
	}, []);

	// 监听同步进度
	useEffect(() => {
		const unsubscribe = window.electronAPI.onTop10HoldersSyncProgress((progress: SyncProgress) => {
			setSyncProgress(progress);
			// 实时更新统计信息
			loadSyncStats();
		});

		return () => {
			unsubscribe();
		};
	}, []);

	// 搜索股票
	const handleSearch = async (value: string) => {
		if (!value || value.trim().length === 0) {
			setStockOptions([]);
			return;
		}

		setSearching(true);
		try {
			const results = await window.electronAPI.searchStocks(value.trim(), 20);
			setStockOptions(results);
		} catch (error: any) {
			console.error("搜索股票失败:", error);
			message.error(`搜索股票失败: ${error.message || "未知错误"}`);
		} finally {
			setSearching(false);
		}
	};

	// 选择股票后获取十大股东（优先从数据库）
	const handleStockSelect = async (value: string) => {
		setSelectedStock(value);
		setLoading(true);

		try {
			// 先检查是否有数据
			await checkHasData(value);

			// 检查是否已关注
			await checkIsFavorite(value);

			// 获取所有报告期
			const dates = await window.electronAPI.getTop10HoldersEndDates(value);
			setEndDates(dates);

			// 优先从数据库获取
			const dbResult = await window.electronAPI.getTop10HoldersFromDb(value);

			if (dbResult && dbResult.length > 0) {
				setHolders(dbResult);
				// 设置默认选中最新的报告期
				if (dates.length > 0) {
					setSelectedEndDate(dates[0]);
				}
			} else {
				// 数据库没有数据，从 API 获取
				const apiResult = await window.electronAPI.getTop10Holders(value);
				setHolders(apiResult);
				setSelectedEndDate(null);

				if (apiResult.length === 0) {
					message.info("暂无十大股东数据");
				}
			}
		} catch (error: any) {
			console.error("获取十大股东失败:", error);
			message.error(`获取十大股东失败: ${error.message || "未知错误"}`);
			setHolders([]);
			setEndDates([]);
			setSelectedEndDate(null);
		} finally {
			setLoading(false);
		}
	};

	// 根据报告期加载十大股东
	const handleEndDateChange = async (endDate: string) => {
		if (!selectedStock) return;

		setSelectedEndDate(endDate);
		setLoading(true);

		try {
			const result = await window.electronAPI.getTop10HoldersByEndDate(selectedStock, endDate);
			setHolders(result);

			if (result.length === 0) {
				message.info("该报告期暂无十大股东数据");
			}
		} catch (error: any) {
			console.error("获取十大股东失败:", error);
			message.error(`获取十大股东失败: ${error.message || "未知错误"}`);
			setHolders([]);
		} finally {
			setLoading(false);
		}
	};

	// 同步所有股票的十大股东
	const handleSyncAll = async () => {
		setSyncing(true);
		setSyncProgress(null);

		try {
			const result = await window.electronAPI.syncAllTop10Holders();

			if (result.status === "success") {
				message.success(result.message || "同步完成");
			} else if (result.status === "stopped") {
				message.warning(result.message || "同步已停止");
			} else if (result.status === "skipped") {
				message.warning(result.message || "同步被跳过");
			} else {
				message.error(result.message || "同步失败");
			}
		} catch (error: any) {
			console.error("同步失败:", error);
			message.error(`同步失败: ${error.message || "未知错误"}`);
		} finally {
			setSyncing(false);
			setIsPaused(false);
			// 同步完成后自动隐藏进度条
			setTimeout(() => {
				setSyncProgress(null);
			}, 2000);
		}
	};

	// 手动同步单个股票
	const handleSyncSingle = async () => {
		if (!selectedStock) {
			message.warning("请先选择股票");
			return;
		}

		setLoading(true);
		try {
			const result = await window.electronAPI.syncStockTop10Holders(selectedStock);

			if (result.status === "success") {
				message.success(result.message || "同步成功");

				// 刷新数据
				await handleStockSelect(selectedStock);
			} else {
				message.error(result.message || "同步失败");
			}
		} catch (error: any) {
			console.error("同步失败:", error);
			message.error(`同步失败: ${error.message || "未知错误"}`);
		} finally {
			setLoading(false);
		}
	};

	// 添加/取消关注
	const handleToggleFavorite = async () => {
		if (!selectedStock) {
			message.warning("请先选择股票");
			return;
		}

		try {
			if (isFavorite) {
				// 取消关注
				const result = await window.electronAPI.removeFavoriteStock(selectedStock);
				if (result.success) {
					message.success("已取消关注");
					setIsFavorite(false);
					await loadFavoriteStocks();
				} else {
					message.error(result.message || "取消关注失败");
				}
			} else {
				// 添加关注
				const result = await window.electronAPI.addFavoriteStock(selectedStock);
				if (result.success) {
					message.success("已添加关注");
					setIsFavorite(true);
					await loadFavoriteStocks();
				} else {
					message.error(result.message || "添加关注失败");
				}
			}
		} catch (error: any) {
			console.error("操作失败:", error);
			message.error(`操作失败: ${error.message || "未知错误"}`);
		}
	};

	// 暂停/恢复同步
	const handleTogglePause = async () => {
		try {
			const result = await window.electronAPI.togglePauseTop10HoldersSync();
			if (result.status === "paused") {
				message.info("同步已暂停");
				setIsPaused(true);
			} else if (result.status === "resumed") {
				message.info("同步已恢复");
				setIsPaused(false);
			} else {
				message.error(result.message);
			}
		} catch (error: any) {
			console.error("操作失败:", error);
			message.error(`操作失败: ${error.message || "未知错误"}`);
		}
	};

	// 停止同步
	const handleStopSync = async () => {
		modal.confirm({
			title: "确认停止",
			content: "确定要停止当前的同步任务吗？",
			okText: "停止",
			okType: "danger",
			cancelText: "取消",
			onOk: async () => {
				try {
					const result = await window.electronAPI.stopTop10HoldersSync();
					if (result.status === "success") {
						message.success("同步已停止");
						setSyncing(false);
						setIsPaused(false);
					} else {
						message.error(result.message);
					}
				} catch (error: any) {
					console.error("停止失败:", error);
					message.error(`停止失败: ${error.message || "未知错误"}`);
				}
			},
		});
	};

	// 表格列定义
	const columns: TableColumnsType<Top10Holder> = [
		{
			title: "序号",
			key: "index",
			width: 60,
			align: "center",
			render: (_text, _record, index) => index + 1,
		},
		{
			title: "股东名称",
			dataIndex: "holder_name",
			key: "holder_name",
			ellipsis: true,
		},
		{
			title: "持股数量（股）",
			dataIndex: "hold_amount",
			key: "hold_amount",
			width: 150,
			align: "right",
			render: (value: number) => value?.toLocaleString() || "-",
		},
		{
			title: "持股比例（%）",
			dataIndex: "hold_ratio",
			key: "hold_ratio",
			width: 120,
			align: "right",
			render: (value: number) => (value ? value.toFixed(2) + "%" : "-"),
		},
		{
			title: "报告期",
			dataIndex: "end_date",
			key: "end_date",
			width: 120,
			align: "center",
			render: (value: string) => {
				if (!value) return "-";
				// 格式化日期 YYYYMMDD -> YYYY-MM-DD
				return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
			},
		},
		{
			title: "公告日期",
			dataIndex: "ann_date",
			key: "ann_date",
			width: 120,
			align: "center",
			render: (value: string) => {
				if (!value) return "-";
				// 格式化日期 YYYYMMDD -> YYYY-MM-DD
				return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
			},
		},
	];

	// 获取选中股票的信息
	const selectedStockInfo =
		searchMode === "search"
			? stockOptions.find((stock) => stock.ts_code === selectedStock)
			: favoriteStocks.find((stock) => stock.ts_code === selectedStock);

	return (
		<div style={{ padding: 24 }}>
			<Space direction="vertical" size="large" style={{ width: "100%" }}>
				{/* 同步进度提示 - 显示在页面顶部 */}
				{syncProgress && (
					<Card
						style={{
							position: "sticky",
							top: 0,
							zIndex: 1000,
							boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						}}
					>
						<Space direction="vertical" size="middle" style={{ width: "100%" }}>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<Space>
									<Text strong style={{ fontSize: 16 }}>
										同步十大股东数据
									</Text>
									{isPaused && <Tag color="orange">已暂停</Tag>}
								</Space>
								<Space>
									<Text>
										{syncProgress.current} / {syncProgress.total}
									</Text>
									<Button size="small" onClick={handleTogglePause}>
										{isPaused ? "恢复" : "暂停"}
									</Button>
									<Button size="small" danger onClick={handleStopSync}>
										停止
									</Button>
								</Space>
							</div>
							<Progress
								percent={Math.round((syncProgress.current / syncProgress.total) * 100)}
								status={isPaused ? "normal" : syncing ? "active" : "success"}
							/>
							<Row gutter={16}>
								<Col span={8}>
									<Statistic title="成功" value={syncProgress.successCount} valueStyle={{ color: "#52c41a", fontSize: 14 }} />
								</Col>
								<Col span={8}>
									<Statistic title="跳过" value={syncProgress.skipCount} valueStyle={{ color: "#1890ff", fontSize: 14 }} />
								</Col>
								<Col span={8}>
									<Statistic title="失败" value={syncProgress.failCount} valueStyle={{ color: "#ff4d4f", fontSize: 14 }} />
								</Col>
							</Row>
							<div>
								<Text type="secondary">当前股票：</Text>
								<Space style={{ marginLeft: 8 }}>
									<Text>{syncProgress.name}</Text>
									<Text type="secondary">({syncProgress.tsCode})</Text>
									{syncProgress.status === "success" && <Tag color="success">成功</Tag>}
									{syncProgress.status === "skipped" && <Tag color="blue">跳过</Tag>}
									{syncProgress.status === "failed" && <Tag color="error">失败</Tag>}
								</Space>
								{syncProgress.error && (
									<div style={{ marginTop: 4 }}>
										<Text type="danger" style={{ fontSize: 12 }}>
											{syncProgress.error}
										</Text>
									</div>
								)}
							</div>
						</Space>
					</Card>
				)}

				{/* 股票查询卡片 */}
				<Card>
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						{/* 同步统计信息 */}
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Text type="secondary" style={{ fontSize: 12 }}>
								股票总数: {syncStats?.totalStocks || 0} | 已同步: {syncStats?.syncedStocks || 0} | 同步进度:{" "}
								{syncStats?.syncRate || "0"}%
							</Text>
							<Button type="primary" size="small" icon={<SyncOutlined />} onClick={handleSyncAll} loading={syncing} disabled={syncing}>
								{syncing ? "同步中..." : "同步所有股票"}
							</Button>
						</div>

						<Divider style={{ margin: "8px 0" }} />

						{/* 模式切换 */}
						<Tabs
							activeKey={searchMode}
							onChange={(key) => {
								setSearchMode(key as "search" | "favorite");
								// 切换模式时清空选择
								if (key === "favorite") {
									setStockOptions([]);
								}
								setSelectedStock(null);
								setHolders([]);
							}}
							items={[
								{
									key: "search",
									label: (
										<span>
											<SearchOutlined /> 搜索股票
										</span>
									),
								},
								{
									key: "favorite",
									label: (
										<span>
											<StarFilled /> 我的关注 ({favoriteStocks.length})
										</span>
									),
								},
							]}
						/>

						{/* 搜索模式 */}
						{searchMode === "search" && (
							<Space size="middle" style={{ width: "100%" }} wrap>
								<Select
									showSearch
									value={selectedStock}
									placeholder="请输入股票代码或名称"
									style={{ width: 400 }}
									defaultActiveFirstOption={false}
									suffixIcon={<SearchOutlined />}
									filterOption={false}
									onSearch={handleSearch}
									onChange={handleStockSelect}
									notFoundContent={searching ? <Spin size="small" /> : null}
									options={stockOptions.map((stock) => ({
										value: stock.ts_code,
										label: `${stock.name} (${stock.ts_code})`,
									}))}
								/>
								{selectedStockInfo && (
									<Space>
										<Tag color="blue">{selectedStockInfo.industry}</Tag>
										<Tag color="green">{selectedStockInfo.market}</Tag>
										<Tag>{selectedStockInfo.area}</Tag>
									</Space>
								)}
								{selectedStock && (
									<>
										<Button
											type="default"
											icon={<SyncOutlined />}
											onClick={handleSyncSingle}
											loading={loading}
											title={hasData ? "更新最新数据" : "首次同步数据"}
										>
											{hasData ? "更新数据" : "同步数据"}
										</Button>
										<Button
											type={isFavorite ? "default" : "primary"}
											icon={isFavorite ? <StarFilled /> : <StarOutlined />}
											onClick={handleToggleFavorite}
											danger={isFavorite}
										>
											{isFavorite ? "取消关注" : "添加关注"}
										</Button>
									</>
								)}
							</Space>
						)}

						{/* 我的关注模式 */}
						{searchMode === "favorite" && (
							<div style={{ width: "100%" }}>
								<Table
									loading={loadingFavorites}
									columns={[
										{
											title: "股票代码",
											dataIndex: "ts_code",
											key: "ts_code",
											width: 120,
											sorter: (a, b) => a.ts_code.localeCompare(b.ts_code),
										},
										{
											title: "股票名称",
											dataIndex: "name",
											key: "name",
											width: 150,
										},
										{
											title: "行业",
											dataIndex: "industry",
											key: "industry",
											width: 120,
											render: (value: string) => <Tag color="blue">{value}</Tag>,
										},
										{
											title: "市场",
											dataIndex: "market",
											key: "market",
											width: 100,
											render: (value: string) => <Tag color="green">{value}</Tag>,
										},
										{
											title: "地区",
											dataIndex: "area",
											key: "area",
											width: 100,
										},
										{
											title: "操作",
											key: "action",
											width: 200,
											render: (_: any, record: Stock) => (
												<Space size="small">
													<Button
														type="link"
														size="small"
														icon={<SearchOutlined />}
														onClick={() => handleStockSelect(record.ts_code)}
													>
														查看股东
													</Button>
													<Button
														type="link"
														size="small"
														danger
														icon={<StarFilled />}
														onClick={async () => {
															try {
																const result = await window.electronAPI.removeFavoriteStock(record.ts_code);
																if (result.success) {
																	message.success("已取消关注");
																	await loadFavoriteStocks();
																	if (selectedStock === record.ts_code) {
																		setSelectedStock(null);
																		setHolders([]);
																	}
																} else {
																	message.error(result.message || "取消关注失败");
																}
															} catch (error: any) {
																console.error("取消关注失败:", error);
																message.error(`取消关注失败: ${error.message || "未知错误"}`);
															}
														}}
													>
														取消关注
													</Button>
												</Space>
											),
										},
									]}
									dataSource={favoriteStocks}
									rowKey="ts_code"
									pagination={{
										defaultPageSize: 10,
										showSizeChanger: true,
										showTotal: (total) => `共 ${total} 只关注股票`,
										pageSizeOptions: ["10", "20", "50"],
									}}
									locale={{
										emptyText: "暂无关注的股票",
									}}
									size="small"
								/>
							</div>
						)}
					</Space>
				</Card>

				{/* 十大股东列表 */}
				{selectedStock && (
					<Card
						title={
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
								<Space>
									<span>{`${selectedStockInfo?.name || ""} (${selectedStock}) - 十大股东`}</span>
									{hasData && <Tag color="success">已同步</Tag>}
								</Space>
								{endDates.length > 0 && (
									<Space>
										<Text type="secondary" style={{ fontSize: 14 }}>
											报告期：
										</Text>
										<Select
											value={selectedEndDate}
											onChange={handleEndDateChange}
											style={{ width: 150 }}
											size="small"
											options={endDates.map((date) => ({
												value: date,
												label: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
											}))}
										/>
									</Space>
								)}
							</div>
						}
						loading={loading}
					>
						<Table
							columns={columns}
							dataSource={holders}
							rowKey={(record) => `${record.ts_code}-${record.end_date}-${record.holder_name}`}
							pagination={{
								defaultPageSize: 10,
								showSizeChanger: true,
								showTotal: (total) => `共 ${total} 条记录`,
							}}
							locale={{
								emptyText: "暂无数据",
							}}
						/>
					</Card>
				)}
			</Space>
		</div>
	);
}

export default DataInsights;
