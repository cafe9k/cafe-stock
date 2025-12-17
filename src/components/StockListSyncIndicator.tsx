import { Spin, Progress, Card, Typography, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface SyncProgress {
	status: "started" | "syncing" | "completed" | "failed";
	message?: string;
	total?: number;
	current?: number;
	stockCount?: number;
	error?: string;
}

interface StockListSyncIndicatorProps {
	visible: boolean;
	progress: SyncProgress | null;
}

export function StockListSyncIndicator({ visible, progress }: StockListSyncIndicatorProps) {
	if (!visible) return null;

	const getStatusText = () => {
		if (!progress) return "准备同步...";
		switch (progress.status) {
			case "started":
				return "开始同步股票列表...";
			case "syncing":
				return progress.message || "正在同步...";
			case "completed":
				return progress.message || "同步完成";
			case "failed":
				return progress.message || "同步失败";
			default:
				return "准备同步...";
		}
	};

	const getProgressPercent = () => {
		if (!progress || !progress.total || progress.total === 0) return 0;
		if (progress.current === undefined) return 0;
		return Math.round((progress.current / progress.total) * 100);
	};

	const isError = progress?.status === "failed";
	const isCompleted = progress?.status === "completed";
	const isSyncing = progress?.status === "syncing" || progress?.status === "started";

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.65)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 10000,
			}}
		>
			<Card
				style={{
					width: 480,
					textAlign: "center",
					boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
				}}
			>
				<Space orientation="vertical" size="large" style={{ width: "100%" }}>
					<Spin spinning={isSyncing} size="large" indicator={<SyncOutlined spin style={{ fontSize: 32 }} />} />

					<div>
						<Title level={4} style={{ margin: 0 }}>
							股票列表同步
						</Title>
						<Text type={isError ? "danger" : isCompleted ? "success" : "secondary"} style={{ fontSize: 14, marginTop: 8, display: "block" }}>
							{getStatusText()}
						</Text>
					</div>

					{progress && (progress.status === "syncing" || progress.status === "completed") && progress.total && (
						<div style={{ width: "100%" }}>
							<Progress
								percent={getProgressPercent()}
								status={isError ? "exception" : isCompleted ? "success" : "active"}
								strokeColor={isCompleted ? "#52c41a" : undefined}
							/>
							{progress.total > 0 && (
								<Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>
									{progress.current || 0} / {progress.total} 只股票
								</Text>
							)}
						</div>
					)}

					{progress?.stockCount && progress.stockCount > 0 && (
						<Text type="success" strong>
							已同步 {progress.stockCount.toLocaleString()} 只股票
						</Text>
					)}

					{isError && progress?.error && (
						<Text type="danger" style={{ fontSize: 12 }}>
							错误: {progress.error}
						</Text>
					)}
				</Space>
			</Card>
		</div>
	);
}

