import { useState, useEffect } from "react";
import { Input, Select, Table, Card, Space, message, Spin, Typography, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";

const { Title } = Typography;

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

export function DataInsights() {
	const [searchKeyword, setSearchKeyword] = useState("");
	const [stockOptions, setStockOptions] = useState<Stock[]>([]);
	const [searching, setSearching] = useState(false);
	const [selectedStock, setSelectedStock] = useState<string | null>(null);
	const [holders, setHolders] = useState<Top10Holder[]>([]);
	const [loading, setLoading] = useState(false);

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

	// 选择股票后获取十大股东
	const handleStockSelect = async (value: string) => {
		setSelectedStock(value);
		setLoading(true);
		try {
			const result = await window.electronAPI.getTop10Holders(value);
			setHolders(result);
			if (result.length === 0) {
				message.info("暂无十大股东数据");
			}
		} catch (error: any) {
			console.error("获取十大股东失败:", error);
			message.error(`获取十大股东失败: ${error.message || "未知错误"}`);
			setHolders([]);
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
				<Card>
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						<Title level={4}>股票查询</Title>
						<Space size="middle" style={{ width: "100%" }}>
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
						</Space>
					</Space>
				</Card>

				{selectedStock && (
					<Card title={`${selectedStockInfo?.name || ""} (${selectedStock}) - 十大股东`} loading={loading}>
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
