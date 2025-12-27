/**
 * 依赖: window.electron(IPC更新接口), Ant Design(UI组件)
 * 输出: UpdateChecker 组件 - 自动更新检查器，提供版本检查和更新下载功能
 * 职责: 渲染进程UI组件，负责应用自动更新的用户界面和交互
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/components/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useEffect, useState } from "react";
import { Button, Card, Progress, Alert, Space, Typography, Divider } from "antd";
import { DownloadOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface UpdateInfo {
	version: string;
	releaseDate?: string;
	releaseNotes?: string;
}

interface DownloadProgress {
	percent: number;
	transferred: number;
	total: number;
}

export function UpdateChecker() {
	const [checking, setChecking] = useState(false);
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
	const [downloading, setDownloading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
	const [downloaded, setDownloaded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// 监听更新事件
		const unsubChecking = window.electronAPI.onUpdateChecking(() => {
			setChecking(true);
			setError(null);
		});

		const unsubAvailable = window.electronAPI.onUpdateAvailable((info) => {
			setChecking(false);
			setUpdateAvailable(true);
			setUpdateInfo(info);
		});

		const unsubNotAvailable = window.electronAPI.onUpdateNotAvailable(() => {
			setChecking(false);
			setUpdateAvailable(false);
		});

		const unsubProgress = window.electronAPI.onUpdateDownloadProgress((progress) => {
			setDownloadProgress(progress);
		});

		const unsubDownloaded = window.electronAPI.onUpdateDownloaded((info) => {
			setDownloading(false);
			setDownloaded(true);
			setUpdateInfo(info);
		});

		const unsubError = window.electronAPI.onUpdateError((err) => {
			setChecking(false);
			setDownloading(false);
			setError(err);
		});

		return () => {
			unsubChecking();
			unsubAvailable();
			unsubNotAvailable();
			unsubProgress();
			unsubDownloaded();
			unsubError();
		};
	}, []);

	const handleCheckUpdate = async () => {
		setChecking(true);
		setError(null);
		const result = await window.electronAPI.checkForUpdates();
		if (result.error) {
			setError(result.error);
		}
		if (result.message) {
			setError(result.message);
		}
		setChecking(false);
	};

	const handleDownload = async () => {
		setDownloading(true);
		setError(null);
		const result = await window.electronAPI.downloadUpdate();
		if (!result.success) {
			setDownloading(false);
			setError(result.error || "下载失败");
		}
	};

	const handleInstall = async () => {
		await window.electronAPI.installUpdate();
	};

	return (
		<Card>
			<Space vertical size="large" style={{ width: "100%" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Title level={4} style={{ margin: 0 }}>
						软件更新
					</Title>
					<Button
						icon={<ReloadOutlined spin={checking} />}
						onClick={handleCheckUpdate}
						loading={checking}
						disabled={downloading}
						type="primary"
					>
						{checking ? "检查中..." : "检查更新"}
					</Button>
				</div>

				<Divider style={{ margin: 0 }} />

				{error && (
					<Alert
						message="错误"
						description={error}
						type="error"
						showIcon
						icon={<ExclamationCircleOutlined />}
						closable
						onClose={() => setError(null)}
					/>
				)}

				{updateAvailable && !downloaded && (
					<Alert
						message={`发现新版本 ${updateInfo?.version}`}
						description={
							<Space vertical size="small" style={{ width: "100%" }}>
								{updateInfo?.releaseDate && (
									<Text type="secondary">发布日期: {new Date(updateInfo.releaseDate).toLocaleDateString("zh-CN")}</Text>
								)}
								{updateInfo?.releaseNotes && (
									<div>
										<Text strong>更新内容:</Text>
										<Paragraph style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{updateInfo.releaseNotes}</Paragraph>
									</div>
								)}
								{downloading ? (
									<div style={{ marginTop: 16 }}>
										<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
											<Text>下载中...</Text>
											<Text strong>{downloadProgress?.percent.toFixed(1)}%</Text>
										</div>
										<Progress percent={downloadProgress?.percent || 0} status="active" />
										{downloadProgress && (
											<Text type="secondary" style={{ fontSize: 12 }}>
												{(downloadProgress.transferred / 1024 / 1024).toFixed(2)} MB /{" "}
												{(downloadProgress.total / 1024 / 1024).toFixed(2)} MB
											</Text>
										)}
									</div>
								) : (
									<Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} block style={{ marginTop: 16 }}>
										立即下载
									</Button>
								)}
							</Space>
						}
						type="info"
						showIcon
						icon={<DownloadOutlined />}
					/>
				)}

				{downloaded && (
					<Alert
						message="更新已下载完成"
						description={
							<Space vertical size="middle" style={{ width: "100%" }}>
								<Text>版本 {updateInfo?.version} 已准备就绪</Text>
								<Button type="primary" icon={<CheckCircleOutlined />} onClick={handleInstall} block>
									立即安装并重启
								</Button>
							</Space>
						}
						type="success"
						showIcon
						icon={<CheckCircleOutlined />}
					/>
				)}

				{!checking && !updateAvailable && !error && (
					<Alert message="当前已是最新版本" type="success" showIcon icon={<CheckCircleOutlined />} />
				)}
			</Space>
		</Card>
	);
}
