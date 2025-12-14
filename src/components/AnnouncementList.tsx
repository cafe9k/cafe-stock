import { useEffect, useState, useCallback, useRef } from "react";
import { Table, Card, Tag, Typography, message, Badge } from "antd";
import { FileTextOutlined, SyncOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

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
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [syncing, setSyncing] = useState(false);
	const [loadingHistory, setLoadingHistory] = useState(false);
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

	const handlePrevPage = () => {
		if (page > 1) setPage((p) => p - 1);
	};

	const handleNextPage = () => {
		if (announcements.length === PAGE_SIZE) {
			setPage((p) => p + 1);
		}
	};

	const columns: ColumnsType<Announcement> = [
		{
			title: "日期",
			dataIndex: "ann_date",
			key: "ann_date",
			width: 120,
			fixed: "left",
			render: (date: string) => (
				<Text type="secondary" style={{ fontFamily: "monospace" }}>
					{date}
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
			title: (
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span>标题</span>
					{syncing && (
						<Badge
							status="processing"
							text={
								<Text type="secondary" style={{ fontSize: 12 }}>
									同步中...
								</Text>
							}
						/>
					)}
					{loadingHistory && (
						<Badge
							status="processing"
							text={
								<Text type="secondary" style={{ fontSize: 12 }}>
									<SyncOutlined spin /> 加载历史数据...
								</Text>
							}
						/>
					)}
				</div>
			),
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
		<div style={{ maxWidth: 1400, margin: "0 auto" }}>
			<Card>
				<Table
					columns={columns}
					dataSource={announcements}
					rowKey={getRowKey}
					loading={loading}
					pagination={false}
					scroll={{ x: 1000 }}
					size="middle"
					locale={{
						emptyText: loading ? "加载中..." : "暂无公告数据",
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
							<button
								onClick={handlePrevPage}
								disabled={page === 1}
								style={{
									padding: "4px 15px",
									border: "1px solid #d9d9d9",
									borderRadius: 6,
									background: page === 1 ? "#f5f5f5" : "#fff",
									cursor: page === 1 ? "not-allowed" : "pointer",
									opacity: page === 1 ? 0.6 : 1,
								}}
							>
								上一页
							</button>
							<button
								onClick={handleNextPage}
								disabled={announcements.length < PAGE_SIZE}
								style={{
									padding: "4px 15px",
									border: "1px solid #d9d9d9",
									borderRadius: 6,
									background: announcements.length < PAGE_SIZE ? "#f5f5f5" : "#fff",
									cursor: announcements.length < PAGE_SIZE ? "not-allowed" : "pointer",
									opacity: announcements.length < PAGE_SIZE ? 0.6 : 1,
								}}
							>
								下一页
							</button>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
