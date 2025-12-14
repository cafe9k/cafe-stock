import { useEffect, useState, useCallback } from "react";
import { Table, Button, Card, Space, Alert, Tag, Typography, message } from "antd";
import { ReloadOutlined, FileTextOutlined, LeftOutlined, RightOutlined, LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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
	const [syncing, setSyncing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);

	const fetchData = useCallback(async (pageNum: number) => {
		setLoading(true);
		setError(null);
		try {
			if (!window.electronAPI) {
				throw new Error("Electron API not available");
			}

			const result = await window.electronAPI.getAnnouncements(pageNum, PAGE_SIZE);
			console.log("Fetched data:", result);
			setAnnouncements(result.items as Announcement[]);
			setTotal(result.total);
		} catch (err: any) {
			console.error("Fetch error:", err);
			setError(err.message || "加载公告失败");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSyncAndRefresh = async () => {
		if (syncing) return;
		setSyncing(true);
		setError(null);

		let removeListener: (() => void) | undefined;

		// Set up progress listener
		if (window.electronAPI?.onSyncProgress) {
			removeListener = window.electronAPI.onSyncProgress((data) => {
				console.log("Sync progress:", data);
			});
		}

		try {
			if (!window.electronAPI) {
				throw new Error("Electron API not available");
			}

			const syncResult = await window.electronAPI.syncAnnouncements();

			if (syncResult.status === "failed") {
				throw new Error(syncResult.message);
			}

			console.log("Sync Result:", syncResult);
			message.success(`同步成功！共同步 ${syncResult.totalSynced || 0} 条公告`);
			setPage(1);
			await fetchData(1);
		} catch (err: any) {
			setError(err.message || "同步失败");
			message.error(err.message || "同步失败");
		} finally {
			if (removeListener) {
				removeListener();
			}
			setSyncing(false);
		}
	};

	useEffect(() => {
		console.log("AnnouncementList mounted. Checking API:", !!window.electronAPI);
		fetchData(page);
	}, [page, fetchData]);

	const handlePrevPage = () => {
		if (page > 1) setPage((p) => p - 1);
	};

	const handleNextPage = () => {
		if (announcements.length === PAGE_SIZE) {
			setPage((p) => p + 1);
		}
	};

	// 为每条记录生成唯一 key
	const getRowKey = (record: Announcement) => {
		// 使用多个字段组合确保唯一性
		// 使用标题的哈希值来避免 key 过长
		const titleHash = record.title.split("").reduce((acc, char) => {
			return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
		}, 0);
		return `${record.ts_code}-${record.ann_date}-${record.pub_time || titleHash}`;
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
			title: "标题",
			dataIndex: "title",
			key: "title",
			ellipsis: true,
			render: (title: string) => (
				<Space>
					<FileTextOutlined style={{ color: "#1890ff" }} />
					<Text strong style={{ cursor: "pointer" }} title={title}>
						{title}
					</Text>
				</Space>
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
			<Space vertical size="large" style={{ width: "100%" }}>
				{/* Header with Sync Button */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Button
						icon={syncing || loading ? <LoadingOutlined spin /> : <ReloadOutlined />}
						onClick={handleSyncAndRefresh}
						loading={syncing || loading}
						type="default"
					>
						{syncing ? "同步中..." : "同步并刷新"}
					</Button>
				</div>

				{/* Error Alert */}
				{error && (
					<Alert
						message="错误"
						description={error}
						type="error"
						showIcon
						icon={<ExclamationCircleOutlined />}
						closable
						onClose={() => setError(null)}
						action={
							<Button size="small" danger onClick={() => fetchData(page)}>
								重试
							</Button>
						}
					/>
				)}

				{/* Table */}
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
					{!loading && !error && announcements.length > 0 && (
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
										共 <Text strong>{Math.ceil(total / PAGE_SIZE)}</Text> 页 (总计 <Text strong>{total.toLocaleString()}</Text>{" "}
										条)
									</>
								)}
							</Text>
							<Space>
								<Button icon={<LeftOutlined />} onClick={handlePrevPage} disabled={page === 1}>
									上一页
								</Button>
								<Button onClick={handleNextPage} disabled={announcements.length < PAGE_SIZE}>
									下一页 <RightOutlined />
								</Button>
							</Space>
						</div>
					)}
				</Card>
			</Space>
		</div>
	);
}
