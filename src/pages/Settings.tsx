import { useState, useEffect } from "react";
import { Card, Button, Progress, Statistic, Space, message, Typography } from "antd";
import { TagsOutlined, SyncOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export function Settings() {
	const [untaggedCount, setUntaggedCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [tagging, setTagging] = useState(false);
	const [progress, setProgress] = useState({ processed: 0, total: 0, percentage: "0" });

	useEffect(() => {
		loadUntaggedCount();

		// 监听打标进度
		const unsubscribe = window.electronAPI.onTaggingProgress((data) => {
			setProgress(data);
		});

		return () => unsubscribe();
	}, []);

	const loadUntaggedCount = async () => {
		setLoading(true);
		try {
			const result = await window.electronAPI.getUntaggedCount();
			if (result.success) {
				setUntaggedCount(result.count);
			}
		} catch (error) {
			console.error("Failed to load untagged count:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleTagAll = async () => {
		if (untaggedCount === 0) {
			message.info("所有公告已完成分类");
			return;
		}

		setTagging(true);
		setProgress({ processed: 0, total: untaggedCount, percentage: "0" });

		try {
			const result = await window.electronAPI.tagAllAnnouncements(1000);

			if (result.success) {
				message.success(`批量打标完成！共处理 ${result.processed} 条公告`);
				setUntaggedCount(0);
			} else {
				message.error(`打标失败: ${result.error}`);
			}
		} catch (error: any) {
			message.error(`打标失败: ${error.message}`);
		} finally {
			setTagging(false);
			loadUntaggedCount();
		}
	};

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>系统设置</Title>

			<Card title="公告分类管理" style={{ marginTop: 16 }}>
				<Space direction="vertical" size="large" style={{ width: "100%" }}>
					<Statistic
						title="未分类公告数量"
						value={untaggedCount}
						suffix="条"
						loading={loading}
						prefix={<TagsOutlined />}
					/>

					{tagging && (
						<div>
							<Text>正在批量打标...</Text>
							<Progress
								percent={parseFloat(progress.percentage)}
								status="active"
								format={() => `${progress.processed} / ${progress.total}`}
							/>
						</div>
					)}

					<Space>
						<Button
							type="primary"
							icon={<SyncOutlined />}
							onClick={handleTagAll}
							loading={tagging}
							disabled={untaggedCount === 0}
						>
							批量打标所有公告
						</Button>

						<Button icon={<SyncOutlined />} onClick={loadUntaggedCount} loading={loading}>
							刷新统计
						</Button>
					</Space>

					<Text type="secondary">
						说明：批量打标会对所有未分类的公告进行自动分类，根据公告标题智能识别分类标签。 预计处理时间：约{" "}
						{Math.ceil(untaggedCount / 10000)} 分钟
					</Text>
				</Space>
			</Card>
		</div>
	);
}

