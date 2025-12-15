import { useEffect, useState } from "react";
import { Card, Typography, Space, Tag, Tooltip, Button, Modal, Descriptions, Spin, App } from "antd";
import { DatabaseOutlined, StockOutlined, StarOutlined, TeamOutlined, SyncOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface CacheDataStats {
	stocks: {
		count: number;
		lastSyncTime: string | null;
	};
	favoriteStocks: {
		count: number;
	};
	top10Holders: {
		stockCount: number;
		recordCount: number;
	};
	syncFlags: Array<{
		type: string;
		lastSyncDate: string;
		updatedAt: string;
	}>;
}

export function CacheDataIndicator() {
	const { message } = App.useApp();
	const [stats, setStats] = useState<CacheDataStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [showStockSyncModal, setShowStockSyncModal] = useState(false);
	const [stockSyncInfo, setStockSyncInfo] = useState<{ stockCount: number; lastSyncTime: string | null } | null>(null);
	const [syncingStocks, setSyncingStocks] = useState(false);
	const [loadingSyncInfo, setLoadingSyncInfo] = useState(false);

	const loadStats = async () => {
		try {
			setLoading(true);
			const data = await window.electronAPI.getCacheDataStats();
			setStats(data);
		} catch (error) {
			console.error("Failed to load cache data stats:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadStats();

		// 每30秒刷新一次统计数据
		const interval = setInterval(loadStats, 30000);

		return () => clearInterval(interval);
	}, []);

	const formatTime = (timeStr: string | null) => {
		if (!timeStr) return "从未同步";
		try {
			const date = new Date(timeStr);
			return date.toLocaleString("zh-CN", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return timeStr;
		}
	};

	const formatSyncDate = (dateStr: string) => {
		if (!dateStr) return "从未同步";
		try {
			// YYYYMMDD 格式转换为可读格式
			if (dateStr.length === 8) {
				const year = dateStr.substring(0, 4);
				const month = dateStr.substring(4, 6);
				const day = dateStr.substring(6, 8);
				return `${year}-${month}-${day}`;
			}
			return dateStr;
		} catch {
			return dateStr;
		}
	};

	// 加载股票列表同步信息
	const loadStockSyncInfo = async () => {
		try {
			setLoadingSyncInfo(true);
			const info = await window.electronAPI.getStockListSyncInfo();
			setStockSyncInfo(info);
		} catch (error: any) {
			console.error("获取股票列表同步信息失败:", error);
			message.error(`获取同步信息失败: ${error.message || "未知错误"}`);
		} finally {
			setLoadingSyncInfo(false);
		}
	};

	// 打开股票列表同步弹窗
	const handleOpenStockSyncModal = async () => {
		setShowStockSyncModal(true);
		await loadStockSyncInfo();
	};

	// 重新同步全部股票列表
	const handleSyncAllStocks = async () => {
		try {
			setSyncingStocks(true);
			const result = await window.electronAPI.syncAllStocks();
			if (result.success) {
				message.success(result.message || `成功同步 ${result.stockCount} 只股票`);
				// 重新加载同步信息和缓存统计
				await loadStockSyncInfo();
				await loadStats();
			} else {
				message.error(result.message || "同步失败");
			}
		} catch (error: any) {
			console.error("同步股票列表失败:", error);
			message.error(`同步失败: ${error.message || "未知错误"}`);
		} finally {
			setSyncingStocks(false);
		}
	};

	// 格式化时间（用于同步对话框）
	const formatTimeForModal = (timeStr: string | null) => {
		if (!timeStr) return "从未同步";
		try {
			const date = new Date(timeStr);
			return date.toLocaleString("zh-CN", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});
		} catch {
			return timeStr;
		}
	};

	if (loading && !stats) {
		return null;
	}

	if (!stats) {
		return null;
	}

	return (
		<Card
			size="small"
			style={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				borderRadius: 0,
				borderLeft: "none",
				borderRight: "none",
				borderBottom: "none",
				boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
			}}
			bodyStyle={{ padding: "8px 16px" }}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
				<Space size="large" wrap>
					<Space size="small">
						<DatabaseOutlined style={{ color: "#1890ff" }} />
						<Text strong style={{ fontSize: 12 }}>
							缓存数据：
						</Text>
					</Space>

					<Tooltip title={`股票列表：${stats.stocks.count.toLocaleString()} 只股票`}>
						<Space size="small">
							<StockOutlined style={{ color: "#52c41a" }} />
							<Text style={{ fontSize: 12 }}>
								股票列表 <Tag color="green">{stats.stocks.count.toLocaleString()}</Tag>
							</Text>
							{stats.stocks.lastSyncTime && (
								<Text type="secondary" style={{ fontSize: 11 }}>
									{formatTime(stats.stocks.lastSyncTime)}
								</Text>
							)}
						</Space>
					</Tooltip>

					<Tooltip title={`关注股票：${stats.favoriteStocks.count} 只`}>
						<Space size="small">
							<StarOutlined style={{ color: "#faad14" }} />
							<Text style={{ fontSize: 12 }}>
								关注股票 <Tag color="orange">{stats.favoriteStocks.count}</Tag>
							</Text>
						</Space>
					</Tooltip>

					<Tooltip title={`十大股东：${stats.top10Holders.stockCount} 只股票，${stats.top10Holders.recordCount.toLocaleString()} 条记录`}>
						<Space size="small">
							<TeamOutlined style={{ color: "#722ed1" }} />
							<Text style={{ fontSize: 12 }}>
								十大股东 <Tag color="purple">{stats.top10Holders.stockCount}</Tag>
								<Text type="secondary" style={{ fontSize: 11 }}>
									({stats.top10Holders.recordCount.toLocaleString()} 条)
								</Text>
							</Text>
						</Space>
					</Tooltip>

					{stats.syncFlags.length > 0 && (
						<Tooltip
							title={
								<div>
									{stats.syncFlags.map((flag) => (
										<div key={flag.type}>
											{flag.type === "stock_list" ? "股票列表" : flag.type}：{formatSyncDate(flag.lastSyncDate)}
										</div>
									))}
								</div>
							}
						>
							<Space size="small">
								<SyncOutlined style={{ color: "#13c2c2" }} />
								<Text style={{ fontSize: 12 }}>
									同步状态 <Tag color="cyan">{stats.syncFlags.length}</Tag>
								</Text>
							</Space>
						</Tooltip>
					)}
				</Space>

				<Button
					size="small"
					type="primary"
					icon={<SyncOutlined />}
					onClick={handleOpenStockSyncModal}
					loading={syncingStocks}
				>
					同步股票列表
				</Button>
			</div>

			{/* 股票列表同步对话框 */}
			<Modal
				title="股票列表同步"
				open={showStockSyncModal}
				onCancel={() => {
					setShowStockSyncModal(false);
					setStockSyncInfo(null);
				}}
				footer={[
					<Button key="cancel" onClick={() => setShowStockSyncModal(false)}>
						关闭
					</Button>,
					<Button key="sync" type="primary" icon={<SyncOutlined />} onClick={handleSyncAllStocks} loading={syncingStocks}>
						重新同步全部股票列表
					</Button>,
				]}
				width={600}
			>
				<Spin spinning={loadingSyncInfo}>
					{stockSyncInfo && (
						<Descriptions column={1} bordered>
							<Descriptions.Item label="已同步股票数量">{stockSyncInfo.stockCount.toLocaleString()} 只</Descriptions.Item>
							<Descriptions.Item label="最近同步时间">{formatTimeForModal(stockSyncInfo.lastSyncTime)}</Descriptions.Item>
						</Descriptions>
					)}
					{!stockSyncInfo && !loadingSyncInfo && <div>暂无同步信息</div>}
				</Spin>
			</Modal>
		</Card>
	);
}

