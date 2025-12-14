import { useState, useEffect } from "react";
import { Button, Select, Table, Card, Space, message, Spin, Typography, Tag, Progress, Modal, Statistic, Row, Col, Divider } from "antd";
import { SearchOutlined, SyncOutlined, ReloadOutlined } from "@ant-design/icons";
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
	const [searchKeyword, setSearchKeyword] = useState("");
	const [stockOptions, setStockOptions] = useState<Stock[]>([]);
	const [searching, setSearching] = useState(false);
	const [selectedStock, setSelectedStock] = useState<string | null>(null);
	const [holders, setHolders] = useState<Top10Holder[]>([]);
	const [loading, setLoading] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
	const [showSyncModal, setShowSyncModal] = useState(false);
	const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
	const [hasData, setHasData] = useState(false);

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

	// 组件加载时获取统计信息
	useEffect(() => {
		loadSyncStats();
	}, []);

	// 监听同步进度
	useEffect(() => {
		const unsubscribe = window.electronAPI.onTop10HoldersSyncProgress((progress: SyncProgress) => {
			setSyncProgress(progress);
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

			// 优先从数据库获取
			const dbResult = await window.electronAPI.getTop10HoldersFromDb(value);

			if (dbResult && dbResult.length > 0) {
				setHolders(dbResult);
			} else {
				// 数据库没有数据，从 API 获取
				const apiResult = await window.electronAPI.getTop10Holders(value);
				setHolders(apiResult);

				if (apiResult.length === 0) {
					message.info("暂无十大股东数据");
				}
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
		Modal.confirm({
			title: "确认同步",
			content: "即将同步所有大A股票的十大股东数据，该过程可能需要较长时间。已同步的股票将跳过。是否继续？",
			okText: "开始同步",
			cancelText: "取消",
			onOk: async () => {
				setSyncing(true);
				setShowSyncModal(true);
				setSyncProgress(null);

				try {
					const result = await window.electronAPI.syncAllTop10Holders();

					if (result.status === "success") {
						message.success(result.message || "同步完成");
						await loadSyncStats();
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
				}
			},
		});
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
				await loadSyncStats();
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
	const selectedStockInfo = stockOptions.find((stock) => stock.ts_code === selectedStock);

	return (
		<div style={{ padding: 24 }}>
			<Space direction="vertical" size="large" style={{ width: "100%" }}>
				{/* 同步统计卡片 */}
				<Card>
					<Row gutter={16} align="middle">
						<Col span={5}>
							<Statistic title="股票总数" value={syncStats?.totalStocks || 0} />
						</Col>
						<Col span={5}>
							<Statistic title="已同步" value={syncStats?.syncedStocks || 0} suffix={`/ ${syncStats?.totalStocks || 0}`} />
						</Col>
						<Col span={5}>
							<Statistic title="同步进度" value={syncStats?.syncRate || "0"} suffix="%" />
						</Col>
						<Col span={9} style={{ textAlign: "right" }}>
							<Space>
								<Button type="primary" icon={<SyncOutlined />} onClick={handleSyncAll} loading={syncing} disabled={syncing}>
									{syncing ? "同步中..." : "同步所有股票十大股东"}
								</Button>
								<Button icon={<ReloadOutlined />} onClick={loadSyncStats}>
									刷新统计
								</Button>
							</Space>
						</Col>
					</Row>
				</Card>

				{/* 股票查询卡片 */}
				<Card>
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						<Title level={4}>股票查询</Title>
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
								<Button
									type="default"
									icon={<SyncOutlined />}
									onClick={handleSyncSingle}
									loading={loading}
									title={hasData ? "更新最新数据" : "首次同步数据"}
								>
									{hasData ? "更新数据" : "同步数据"}
								</Button>
							)}
						</Space>
					</Space>
				</Card>

				{/* 十大股东列表 */}
				{selectedStock && (
					<Card
						title={
							<Space>
								<span>{`${selectedStockInfo?.name || ""} (${selectedStock}) - 十大股东`}</span>
								{hasData && <Tag color="success">已同步</Tag>}
							</Space>
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

			{/* 同步进度弹窗 */}
			<Modal
				title="同步十大股东数据"
				open={showSyncModal}
				onCancel={() => !syncing && setShowSyncModal(false)}
				footer={[
					<Button key="close" onClick={() => setShowSyncModal(false)} disabled={syncing}>
						{syncing ? "同步中..." : "关闭"}
					</Button>,
				]}
				maskClosable={false}
				closable={!syncing}
			>
				{syncProgress && (
					<Space direction="vertical" size="large" style={{ width: "100%" }}>
						<div>
							<Text strong>进度：</Text>
							<Text>
								{syncProgress.current} / {syncProgress.total}
							</Text>
							<Progress
								percent={Math.round((syncProgress.current / syncProgress.total) * 100)}
								status={syncing ? "active" : "success"}
								style={{ marginTop: 8 }}
							/>
						</div>

						<Divider style={{ margin: "8px 0" }} />

						<Row gutter={16}>
							<Col span={8}>
								<Statistic title="成功" value={syncProgress.successCount} valueStyle={{ color: "#52c41a" }} />
							</Col>
							<Col span={8}>
								<Statistic title="跳过" value={syncProgress.skipCount} valueStyle={{ color: "#1890ff" }} />
							</Col>
							<Col span={8}>
								<Statistic title="失败" value={syncProgress.failCount} valueStyle={{ color: "#ff4d4f" }} />
							</Col>
						</Row>

						<Divider style={{ margin: "8px 0" }} />

						<div>
							<Text strong>当前股票：</Text>
							<div style={{ marginTop: 8 }}>
								<Space>
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
						</div>
					</Space>
				)}

				{!syncProgress && syncing && (
					<div style={{ textAlign: "center", padding: "24px 0" }}>
						<Spin size="large" />
						<div style={{ marginTop: 16 }}>
							<Text>正在准备同步...</Text>
						</div>
					</div>
				)}

				{!syncProgress && !syncing && (
					<div style={{ textAlign: "center", padding: "24px 0" }}>
						<Text type="secondary">等待开始同步</Text>
					</div>
				)}
			</Modal>
		</div>
	);
}

export default DataInsights;
