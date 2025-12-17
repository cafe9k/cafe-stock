import { useEffect, useState } from "react";
import { Card, Typography, Space, Tag, Tooltip, Button, App } from "antd";
import { StockOutlined, StarOutlined, TeamOutlined, SyncOutlined, NotificationOutlined } from "@ant-design/icons";

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
	announcements: {
		count: number;
	};
}

export function CacheDataIndicator() {
	const { message } = App.useApp();
	const [stats, setStats] = useState<CacheDataStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [syncingStocks, setSyncingStocks] = useState(false);

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

	// 直接同步股票列表（无需弹窗）
	const handleSyncAllStocks = async () => {
		try {
			setSyncingStocks(true);
			message.info("开始同步股票列表...");
			const result = await window.electronAPI.syncAllStocks();
			if (result.success) {
				message.success(result.message || `成功同步 ${result.stockCount} 只股票`);
				// 重新加载缓存统计
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
			styles={{ body: { padding: "8px 16px" } }}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
				<Space size="large" wrap>
					{/* 同步按钮 + 股票列表 */}
					<Space size="small">
						<Button size="small" type="primary" icon={<SyncOutlined />} onClick={handleSyncAllStocks} loading={syncingStocks}>
							同步
						</Button>
						<Tooltip title={`股票列表：${stats.stocks.count.toLocaleString()} 只股票`}>
							<Space size="small">
								<StockOutlined style={{ color: "#52c41a" }} />
								<Text style={{ fontSize: 12 }}>
									股票列表 <Tag color="green">{stats.stocks.count.toLocaleString()}</Tag>
									{stats.stocks.lastSyncTime && (
										<Text type="secondary" style={{ fontSize: 11 }}>
											({formatTime(stats.stocks.lastSyncTime)})
										</Text>
									)}
								</Text>
							</Space>
						</Tooltip>
					</Space>

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

					<Tooltip title={`公告缓存：${stats.announcements.count.toLocaleString()} 条公告`}>
						<Space size="small">
							<NotificationOutlined style={{ color: "#1890ff" }} />
							<Text style={{ fontSize: 12 }}>
								公告缓存 <Tag color="blue">{stats.announcements.count.toLocaleString()}</Tag>
							</Text>
						</Space>
					</Tooltip>
				</Space>
			</div>
		</Card>
	);
}
