import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tag, Typography, Card, Statistic, Row, Col, message } from "antd";
import { ReloadOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text: AntText } = Typography;
const { Search } = Input;

interface Stock {
	id: number;
	ts_code: string;
	symbol: string;
	name: string;
	area: string;
	industry: string;
	fullname: string;
	enname: string;
	cnspell: string;
	market: string;
	exchange: string;
	curr_type: string;
	list_status: string;
	list_date: string;
	delist_date: string;
	is_hs: string;
	updated_at: string;
}

export default function Stocks() {
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
	const [loading, setLoading] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [syncStatus, setSyncStatus] = useState<{
		lastSync: string | null;
		syncedToday: boolean;
		totalStocks: number;
	}>({
		lastSync: null,
		syncedToday: false,
		totalStocks: 0,
	});

	// 加载股票列表
	const loadStocks = async () => {
		setLoading(true);
		try {
			const data = await window.electronAPI.getAllStocks();
			setStocks(data);
			setFilteredStocks(data);
			console.log(`Loaded ${data.length} stocks`);
		} catch (error) {
			console.error("Failed to load stocks:", error);
			message.error("加载股票列表失败");
		} finally {
			setLoading(false);
		}
	};

	// 加载同步状态
	const loadSyncStatus = async () => {
		try {
			const status = await window.electronAPI.getStockSyncStatus();
			setSyncStatus(status);
		} catch (error) {
			console.error("Failed to load sync status:", error);
		}
	};

	// 同步股票列表
	const handleSync = async () => {
		setSyncing(true);
		try {
			const result = await window.electronAPI.syncStockList();

			if (result.status === "success") {
				message.success(`同步成功！共同步 ${result.totalSynced} 条股票数据，数据库共有 ${result.totalInDB} 条`);
				await loadStocks();
				await loadSyncStatus();
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

	// 搜索股票
	const handleSearch = (value: string) => {
		setSearchKeyword(value);

		if (!value.trim()) {
			setFilteredStocks(stocks);
			return;
		}

		const keyword = value.toLowerCase();
		const filtered = stocks.filter(
			(stock) =>
				stock.name?.toLowerCase().includes(keyword) ||
				stock.ts_code?.toLowerCase().includes(keyword) ||
				stock.symbol?.toLowerCase().includes(keyword) ||
				stock.cnspell?.toLowerCase().includes(keyword)
		);

		setFilteredStocks(filtered);
	};

	// 监听股票数据更新
	useEffect(() => {
		const unsubscribe = window.electronAPI.onStocksUpdated((data) => {
			console.log("Stocks updated:", data);
			message.success(`股票数据已更新：${data.totalSynced} 条新数据，共 ${data.totalInDB} 条`);
			loadStocks();
			loadSyncStatus();
		});

		return () => unsubscribe();
	}, []);

	// 初始化加载
	useEffect(() => {
		loadStocks();
		loadSyncStatus();
	}, []);

	// 表格列定义
	const columns: ColumnsType<Stock> = [
		{
			title: "股票代码",
			dataIndex: "ts_code",
			key: "ts_code",
			width: 120,
			fixed: "left",
			render: (text) => <span style={{ fontFamily: "monospace", fontWeight: 500 }}>{text}</span>,
		},
		{
			title: "股票名称",
			dataIndex: "name",
			key: "name",
			width: 120,
			fixed: "left",
		},
		{
			title: "行业",
			dataIndex: "industry",
			key: "industry",
			width: 120,
		},
		{
			title: "地域",
			dataIndex: "area",
			key: "area",
			width: 100,
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
			title: "上市日期",
			dataIndex: "list_date",
			key: "list_date",
			width: 120,
			render: (text) => (text ? text.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3") : "-"),
		},
	];

	// 格式化日期
	const formatSyncDate = (date: string | null) => {
		if (!date) return "未同步";
		return date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
	};

	return (
		<div style={{ padding: "24px" }}>
			{/* 统计信息 */}
			<Space size="middle" style={{ marginBottom: 16, width: "100%" }}>
				<Card size="small" style={{ minWidth: 180 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<AntText type="secondary">股票总数：</AntText>
						<AntText strong style={{ fontSize: 18, color: "#3f8600" }}>
							{syncStatus.totalStocks}
						</AntText>
						<AntText type="secondary">只</AntText>
					</div>
				</Card>
				<Card size="small" style={{ minWidth: 180 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<AntText type="secondary">上次同步：</AntText>
						<AntText strong style={{ fontSize: 16 }}>
							{formatSyncDate(syncStatus.lastSync)}
						</AntText>
					</div>
				</Card>
				<Card size="small" style={{ minWidth: 150 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<AntText type="secondary">今日状态：</AntText>
						<AntText strong style={{ fontSize: 16, color: syncStatus.syncedToday ? "#3f8600" : "#cf1322" }}>
							{syncStatus.syncedToday ? "已同步" : "未同步"}
						</AntText>
					</div>
				</Card>
				<Card size="small" style={{ minWidth: 150 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<AntText type="secondary">显示：</AntText>
						<AntText strong style={{ fontSize: 16 }}>
							{filteredStocks.length} / {stocks.length}
						</AntText>
					</div>
				</Card>
			</Space>

			{/* 操作栏 */}
			<Space style={{ marginBottom: 16, width: "100%" }}>
				<Search
					placeholder="搜索股票代码、名称或拼音"
					allowClear
					enterButton={<SearchOutlined />}
					onSearch={handleSearch}
					onChange={(e) => handleSearch(e.target.value)}
					style={{ width: 400 }}
					value={searchKeyword}
				/>

				<Button type="primary" icon={<SyncOutlined spin={syncing} />} onClick={handleSync} loading={syncing}>
					{syncStatus.syncedToday ? "重新同步" : "同步股票列表"}
				</Button>

				<Button icon={<ReloadOutlined />} onClick={loadStocks} loading={loading}>
					刷新
				</Button>
			</Space>

			{/* 股票表格 */}
			<Table
				columns={columns}
				dataSource={filteredStocks}
				rowKey="id"
				loading={loading}
				pagination={{
					pageSize: 20,
					showSizeChanger: true,
					showQuickJumper: true,
					pageSizeOptions: ["20", "50", "100"],
					showTotal: (total) => `共 ${total} 条`,
				}}
				scroll={{ x: 1000 }}
				size="small"
			/>
		</div>
	);
}

