import { useEffect, useState, useCallback, useRef } from "react";
import { Table, Card, Tag, Typography, message, Badge, Space, Button, Input, Row, Col, Statistic } from "antd";
import { FileTextOutlined, SyncOutlined, ReloadOutlined, SearchOutlined, HistoryOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Text, Title } = Typography;
const { Search } = Input;

interface Announcement {
	ts_code: string;
	ann_date: string;
	ann_type: string;
	title: string;
	content: string;
	pub_time: string;
}

const PAGE_SIZE = 200;

export function AnnouncementList() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [syncing, setSyncing] = useState(false);
	const [loadingHistory, setLoadingHistory] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const hasTriggeredHistoryLoad = useRef(false);

	// 为每条记录生成唯一 key
	const getRowKey = (record: Announcement) => {
		// 使用多个字段组合确保唯一性
		// 使用标题的哈希值来避免 key 过长
		const titleHash = record.title.split("").reduce((acc, char) => {
			return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
		}, 0);
		return `${record.ts_code}-${record.ann_date}-${record.pub_time || titleHash}`;
	};

	const fetchData = useCallback(
		async (pageNum: number) => {
			setLoading(true);
			try {
				if (!window.electronAPI) {
					throw new Error("Electron API not available");
				}

				const result = await window.electronAPI.getAnnouncements(pageNum, PAGE_SIZE);
				setAnnouncements(result.items as Announcement[]);
				setFilteredAnnouncements(result.items as Announcement[]);
				setTotal(result.total);

				// 如果建议加载历史数据且还没触发过
				if (result.shouldLoadHistory && !hasTriggeredHistoryLoad.current && !loadingHistory) {
					hasTriggeredHistoryLoad.current = true;
					triggerHistoryLoad();
				}
			} catch (err: any) {
				console.error("Fetch error:", err);
				message.error(err.message || "加载公告失败");
			} finally {
				setLoading(false);
			}
		},
		[loadingHistory]
	);

	const triggerHistoryLoad = async () => {
		setLoadingHistory(true);
		try {
			const result = await window.electronAPI.loadHistoricalData();
			if (result.status === "success" && result.totalLoaded && result.totalLoaded > 0) {
				message.success(`历史数据加载成功！加载了 ${result.totalLoaded} 条公告`);
				// 重新获取当前页数据
				await fetchData(page);
			}
		} catch (err: any) {
			console.error("History load error:", err);
		} finally {
			setLoadingHistory(false);
			hasTriggeredHistoryLoad.current = false; // 重置标记，允许下次触发
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
					await fetchData(1);
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
		await triggerHistoryLoad();
	};

	// 搜索功能
	const handleSearch = (value: string) => {
		setSearchKeyword(value);

		if (!value.trim()) {
			setFilteredAnnouncements(announcements);
			return;
		}

		const keyword = value.toLowerCase();
		const filtered = announcements.filter(
			(ann) =>
				ann.title?.toLowerCase().includes(keyword) ||
				ann.ts_code?.toLowerCase().includes(keyword) ||
				ann.ann_type?.toLowerCase().includes(keyword) ||
				ann.content?.toLowerCase().includes(keyword)
		);

		setFilteredAnnouncements(filtered);
	};

	// 刷新当前页
	const handleRefresh = () => {
		fetchData(page);
	};

	useEffect(() => {
		console.log("AnnouncementList mounted. Checking API:", !!window.electronAPI);

		// 监听数据更新
		const unsubscribe = window.electronAPI.onDataUpdated((data) => {
			console.log("Data updated:", data);
			if (data.type === "incremental") {
				setSyncing(true);
				// 增量同步完成后，如果在第一页，刷新数据
				if (page === 1) {
					fetchData(1);
				}
			} else if (data.type === "historical") {
				setLoadingHistory(true);
			}
		});

		// 初始加载数据
		fetchData(page);

		return () => {
			unsubscribe();
		};
	}, [page, fetchData]);

	// 当增量同步完成后，重置状态
	useEffect(() => {
		if (syncing) {
			const timer = setTimeout(() => setSyncing(false), 1000);
			return () => clearTimeout(timer);
		}
	}, [syncing]);

	// 当搜索关键词变化时重新过滤
	useEffect(() => {
		handleSearch(searchKeyword);
	}, [announcements]);

	const handlePrevPage = () => {
		if (page > 1) {
			setPage((p) => p - 1);
			setSearchKeyword(""); // 切页时清空搜索
		}
	};

	const handleNextPage = () => {
		if (announcements.length === PAGE_SIZE) {
			setPage((p) => p + 1);
			setSearchKeyword(""); // 切页时清空搜索
		}
	};

	const columns: ColumnsType<Announcement> = [
		{
			title: "日期",
			dataIndex: "ann_date",
			key: "ann_date",
			width: 120,
			fixed: "left",
			render: (date: string) => <Text style={{ fontFamily: "monospace" }}>{date}</Text>,
		},
		{
			title: "时间",
			dataIndex: "pub_time",
			key: "pub_time",
			width: 100,
			render: (time: string) => (
				<Text type="secondary" style={{ fontFamily: "monospace", fontSize: 12 }}>
					{time || "-"}
				</Text>
			),
		},
		{
			title: "代码",
			dataIndex: "ts_code",
			key: "ts_code",
			width: 120,
			render: (code: string) => (
				<Tag color="blue" style={{ fontFamily: "monospace" }}>
					{code}
				</Tag>
			),
		},
		{
			title: "标题",
			dataIndex: "title",
			key: "title",
			ellipsis: true,
			render: (title: string) => (
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<FileTextOutlined style={{ color: "#1890ff" }} />
					<Text strong style={{ cursor: "pointer" }} title={title}>
						{title}
					</Text>
				</div>
			),
		},
		{
			title: "类型",
			dataIndex: "ann_type",
			key: "ann_type",
			width: 180,
			render: (type: string) => <Text type="secondary">{type || "-"}</Text>,
		},
	];

	return (
		<div style={{ padding: "24px" }}>
			<Title level={2}>公告列表</Title>

			{/* 统计信息 */}
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic title="公告总数" value={total} suffix="条" valueStyle={{ color: "#3f8600" }} loading={loading} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="当前页数" value={page} suffix={`/ ${Math.ceil(total / PAGE_SIZE)}`} valueStyle={{ fontSize: 20 }} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="同步状态"
							value={syncing ? "同步中" : loadingHistory ? "加载历史" : "正常"}
							valueStyle={{
								color: syncing || loadingHistory ? "#1890ff" : "#3f8600",
								fontSize: 20,
							}}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="显示结果"
							value={filteredAnnouncements.length}
							suffix={`/ ${announcements.length}`}
							valueStyle={{ fontSize: 20 }}
						/>
					</Card>
				</Col>
			</Row>

			{/* 操作栏 */}
			<Space style={{ marginBottom: 16, width: "100%" }}>
				<Search
					placeholder="搜索标题、代码、类型或内容"
					allowClear
					enterButton={<SearchOutlined />}
					onSearch={handleSearch}
					onChange={(e) => handleSearch(e.target.value)}
					style={{ width: 400 }}
					value={searchKeyword}
				/>

				<Button type="primary" icon={<SyncOutlined spin={syncing} />} onClick={handleSync} loading={syncing} disabled={loadingHistory}>
					增量同步
				</Button>

				<Button icon={<HistoryOutlined spin={loadingHistory} />} onClick={handleLoadHistory} loading={loadingHistory} disabled={syncing}>
					加载历史
				</Button>

				<Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} disabled={syncing || loadingHistory}>
					刷新
				</Button>
			</Space>

			{/* 同步状态提示 */}
			{(syncing || loadingHistory) && (
				<div style={{ marginBottom: 16 }}>
					{syncing && (
						<Badge
							status="processing"
							text={
								<Text type="secondary">
									<SyncOutlined spin /> 正在同步最新公告...
								</Text>
							}
						/>
					)}
					{loadingHistory && (
						<Badge
							status="processing"
							text={
								<Text type="secondary">
									<HistoryOutlined spin /> 正在加载历史数据...
								</Text>
							}
						/>
					)}
				</div>
			)}

			{/* 公告表格 */}
			<Card>
				<Table
					columns={columns}
					dataSource={filteredAnnouncements}
					rowKey={getRowKey}
					loading={loading}
					pagination={false}
					scroll={{ x: 1000, y: "calc(100vh - 520px)" }}
					size="small"
					locale={{
						emptyText: loading ? "加载中..." : searchKeyword ? "没有找到匹配的公告" : "暂无公告数据",
					}}
				/>

				{/* Custom Pagination */}
				{!loading && announcements.length > 0 && (
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
						<Text type="secondary">
							显示第 <Text strong>{page}</Text> 页
							{total > 0 && (
								<>
									{" "}
									共 <Text strong>{Math.ceil(total / PAGE_SIZE)}</Text> 页 (总计 <Text strong>{total.toLocaleString()}</Text> 条)
								</>
							)}
						</Text>
						<div style={{ display: "flex", gap: 8 }}>
							<Button onClick={handlePrevPage} disabled={page === 1}>
								上一页
							</Button>
							<Button onClick={handleNextPage} disabled={announcements.length < PAGE_SIZE}>
								下一页
							</Button>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
