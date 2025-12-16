import { useState, useEffect } from "react";
import { Card, Button, Progress, Statistic, Space, message, Typography, Form, Input, Modal, Descriptions, Badge, Row, Col, Checkbox } from "antd";
import { TagsOutlined, SyncOutlined, CopyOutlined, PlayCircleOutlined, StopOutlined, LockOutlined, UserOutlined, DatabaseOutlined, ExclamationCircleOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { ClassificationRuleEditor } from "../components/ClassificationRuleEditor";

const { Title, Text } = Typography;

export function Settings() {
	const [untaggedCount, setUntaggedCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [tagging, setTagging] = useState(false);
	const [progress, setProgress] = useState({ processed: 0, total: 0, percentage: "0" });
	
	// SQLite HTTP 服务器状态
	const [isServerRunning, setIsServerRunning] = useState(false);
	const [serverPort, setServerPort] = useState(8080);
	const [serverUrl, setServerUrl] = useState<string | null>(null);
	const [hasAuth, setHasAuth] = useState(false);
	const [username, setUsername] = useState<string | null>(null);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authForm] = Form.useForm();
	const [dbPath, setDbPath] = useState<string>("");

	// 数据库重置相关状态
	const [showResetModal, setShowResetModal] = useState(false);
	const [resetting, setResetting] = useState(false);
	const [backupBeforeReset, setBackupBeforeReset] = useState(true);

	useEffect(() => {
		loadUntaggedCount();
		loadServerStatus();

		// 监听打标进度
		const unsubscribe = window.electronAPI.onTaggingProgress((data) => {
			setProgress(data);
		});

		return () => unsubscribe();
	}, []);

	// 加载服务器状态
	const loadServerStatus = async () => {
		try {
			const [status, info] = await Promise.all([
				window.electronAPI.getSqliteHttpServerStatus(),
				window.electronAPI.getDbConnectionInfo()
			]);
			
			setIsServerRunning(status.isRunning);
			setServerPort(status.port || 8080);
			setServerUrl(status.url || null);
			setHasAuth(status.hasAuth);
			setUsername(status.username);
			
			if (info.success && info.dbPath) {
				setDbPath(info.dbPath);
			}
		} catch (error) {
			console.error("Failed to load server status:", error);
		}
	};

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

	// 复制数据库连接信息
	const handleCopyDbConnection = async () => {
		try {
			const info = await window.electronAPI.getDbConnectionInfo();
			if (info.success && info.dbPath) {
				let connectionInfo = `数据库路径: ${info.dbPath}\n连接字符串: ${info.connectionString || `sqlite://${info.dbPath}`}\n密码: ${
					info.password || "无"
				}`;

				if (info.isServerRunning && info.httpServerUrl) {
					connectionInfo += `\n\nHTTP 服务器: ${info.httpServerUrl}\n端口: ${info.port}`;
					if (info.hasAuth && info.username) {
						connectionInfo += `\n用户名: ${info.username}`;
						connectionInfo += `\n密码: ${info.password || "已设置"}`;
					}
					connectionInfo += `\n\nAPI 端点:\n- 健康检查: ${info.httpServerUrl}/health`;
					connectionInfo += `\n- 查询: POST ${info.httpServerUrl}/query`;
					connectionInfo += `\n- 表列表: GET ${info.httpServerUrl}/tables`;
					connectionInfo += `\n- 表结构: GET ${info.httpServerUrl}/table/{tableName}`;
					if (info.hasAuth) {
						connectionInfo += `\n\n认证方式: Basic Auth`;
						connectionInfo += `\n请求头: Authorization: Basic base64(username:password)`;
					}
				}

				await navigator.clipboard.writeText(connectionInfo);
				message.success("数据库连接信息已复制到剪贴板");
			} else {
				message.error(info.message || "获取数据库信息失败");
			}
		} catch (error: any) {
			console.error("复制数据库连接信息失败:", error);
			message.error(`复制失败: ${error.message || "未知错误"}`);
		}
	};

	// 启动 HTTP 服务器
	const handleStartServer = async () => {
		try {
			const result = await window.electronAPI.startSqliteHttpServer();
			if (result.success) {
				setIsServerRunning(true);
				setServerPort(result.port || 8080);
				setServerUrl(result.url || null);
				const status = await window.electronAPI.getSqliteHttpServerStatus();
				setHasAuth(status.hasAuth);
				setUsername(status.username);
				const authInfo = status.hasAuth ? ` (认证: ${status.username})` : "";
				message.success(`SQLite HTTP 服务器已启动: ${result.url}${authInfo}`);
			} else {
				message.error(result.message || "启动服务器失败");
			}
		} catch (error: any) {
			console.error("启动服务器失败:", error);
			message.error(`启动失败: ${error.message || "未知错误"}`);
		}
	};

	// 停止 HTTP 服务器
	const handleStopServer = async () => {
		try {
			const result = await window.electronAPI.stopSqliteHttpServer();
			if (result.success) {
				setIsServerRunning(false);
				setServerUrl(null);
				setHasAuth(false);
				setUsername(null);
				message.success("SQLite HTTP 服务器已停止");
			} else {
				message.error(result.message || "停止服务器失败");
			}
		} catch (error: any) {
			console.error("停止服务器失败:", error);
			message.error(`停止失败: ${error.message || "未知错误"}`);
		}
	};

	// 设置认证信息
	const handleSetAuth = async () => {
		try {
			const values = await authForm.validateFields();
			const result = await window.electronAPI.setSqliteHttpAuth(values.username, values.password);
			if (result.success) {
				setHasAuth(true);
				setUsername(values.username);
				setShowAuthModal(false);
				authForm.resetFields();
				message.success("认证信息已设置");
			} else {
				message.error(result.message || "设置认证信息失败");
			}
		} catch (error: any) {
			if (error.errorFields) {
				return;
			}
			console.error("设置认证信息失败:", error);
			message.error(`设置失败: ${error.message || "未知错误"}`);
		}
	};

	// 清除认证信息
	const handleClearAuth = async () => {
		try {
			const result = await window.electronAPI.clearSqliteHttpAuth();
			if (result.success) {
				setHasAuth(false);
				setUsername(null);
				message.success("认证信息已清除");
			} else {
				message.error(result.message || "清除认证信息失败");
			}
		} catch (error: any) {
			console.error("清除认证信息失败:", error);
			message.error(`清除失败: ${error.message || "未知错误"}`);
		}
	};

	// 重置数据库
	const handleResetDatabase = async () => {
		setResetting(true);
		try {
			const result = await window.electronAPI.resetDatabase({ backup: backupBeforeReset });
			
			if (result.success) {
				let successMessage = "数据库重置成功！";
				if (result.backupPath) {
					successMessage += `\n备份文件已保存至：${result.backupPath}`;
				}
				message.success(successMessage, 5);
				setShowResetModal(false);
				
				// 刷新页面数据
				setTimeout(() => {
					loadUntaggedCount();
					loadServerStatus();
				}, 500);
			} else {
				message.error(`重置失败: ${result.message}`);
			}
		} catch (error: any) {
			console.error("重置数据库失败:", error);
			message.error(`重置失败: ${error.message || "未知错误"}`);
		} finally {
			setResetting(false);
		}
	};

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>系统设置</Title>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={12}>
					<Card title="公告分类管理" style={{ height: '100%' }}>
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

							<Space wrap>
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
								说明：批量打标会对所有未分类的公告进行自动分类，根据公告标题智能识别分类标签。
								预计处理时间：约 {Math.ceil(untaggedCount / 10000)} 分钟
							</Text>
						</Space>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card 
						title={
							<Space>
								<DatabaseOutlined />
								<span>数据库远程访问</span>
							</Space>
						}
						style={{ height: '100%' }}
					>
						<Space direction="vertical" size="large" style={{ width: "100%" }}>
							<Descriptions column={1} size="small">
								<Descriptions.Item label="数据库路径">
									<Text copyable ellipsis style={{ maxWidth: 300 }}>
										{dbPath || "加载中..."}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label="HTTP 服务器">
									<Badge 
										status={isServerRunning ? "processing" : "default"} 
										text={isServerRunning ? `运行中 (端口 ${serverPort})` : "未启动"} 
									/>
								</Descriptions.Item>
								{isServerRunning && serverUrl && (
									<Descriptions.Item label="服务器地址">
										<Text copyable>{serverUrl}</Text>
									</Descriptions.Item>
								)}
								<Descriptions.Item label="认证状态">
									<Badge 
										status={hasAuth ? "success" : "default"} 
										text={hasAuth ? `已设置 (${username})` : "未设置"} 
									/>
								</Descriptions.Item>
							</Descriptions>

							<Space wrap>
								<Button
									type="primary"
									icon={<PlayCircleOutlined />}
									onClick={handleStartServer}
									disabled={isServerRunning}
								>
									启动服务器
								</Button>

								<Button
									danger
									icon={<StopOutlined />}
									onClick={handleStopServer}
									disabled={!isServerRunning}
								>
									停止服务器
								</Button>

								<Button
									icon={<LockOutlined />}
									onClick={() => setShowAuthModal(true)}
								>
									{hasAuth ? "修改认证" : "设置认证"}
								</Button>

								{hasAuth && (
									<Button
										icon={<UserOutlined />}
										onClick={handleClearAuth}
									>
										清除认证
									</Button>
								)}

								<Button
									icon={<CopyOutlined />}
									onClick={handleCopyDbConnection}
								>
									复制连接信息
								</Button>
							</Space>

							<Text type="secondary">
								说明：启动 HTTP 服务器后，可以通过 HTTP API 远程访问数据库。
								建议设置用户名和密码以保护数据安全。
							</Text>
						</Space>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card 
						title={
							<Space>
								<DatabaseOutlined />
								<span>数据库管理</span>
							</Space>
						}
						style={{ height: '100%' }}
					>
						<Space direction="vertical" size="large" style={{ width: "100%" }}>
							<Descriptions column={1} size="small">
								<Descriptions.Item label="数据库文件">
									<Text copyable ellipsis style={{ maxWidth: 300 }}>
										{dbPath || "加载中..."}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label="状态">
									<Badge status="success" text="正常运行" />
								</Descriptions.Item>
							</Descriptions>

							<Space direction="vertical" style={{ width: "100%" }}>
								<Button
									danger
									icon={<ReloadOutlined />}
									onClick={() => setShowResetModal(true)}
									block
								>
									重置数据库
								</Button>
								
								<Text type="warning" style={{ fontSize: 12 }}>
									<ExclamationCircleOutlined /> 警告：重置数据库将删除所有本地数据，包括股票列表、公告、十大股东等信息。
								</Text>
							</Space>

							<Text type="secondary">
								说明：当数据库损坏或出现异常时，可以使用此功能重置数据库。
								重置后需要重新同步数据。建议在重置前选择备份数据库。
							</Text>
						</Space>
					</Card>
				</Col>
			</Row>

			{/* 分类规则配置 */}
			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24}>
					<Card 
						title={
							<Space>
								<SettingOutlined />
								<span>公告分类规则配置</span>
							</Space>
						}
					>
						<ClassificationRuleEditor onSave={loadUntaggedCount} />
					</Card>
				</Col>
			</Row>

			{/* 设置认证信息对话框 */}
			<Modal
				title="设置 SQLite HTTP 服务器认证"
				open={showAuthModal}
				onOk={handleSetAuth}
				onCancel={() => {
					setShowAuthModal(false);
					authForm.resetFields();
				}}
				okText="设置"
				cancelText="取消"
			>
				<Form form={authForm} layout="vertical">
					<Form.Item name="username" label="用户名" rules={[{ required: true, message: "请输入用户名" }]}>
						<Input prefix={<UserOutlined />} placeholder="请输入用户名" />
					</Form.Item>
					<Form.Item name="password" label="密码" rules={[{ required: true, message: "请输入密码" }]}>
						<Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
					</Form.Item>
				</Form>
			</Modal>

			{/* 重置数据库确认对话框 */}
			<Modal
				title={
					<Space>
						<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
						<span>确认重置数据库</span>
					</Space>
				}
				open={showResetModal}
				onOk={handleResetDatabase}
				onCancel={() => {
					if (!resetting) {
						setShowResetModal(false);
						setBackupBeforeReset(true);
					}
				}}
				okText="确认重置"
				cancelText="取消"
				okButtonProps={{ danger: true, loading: resetting }}
				cancelButtonProps={{ disabled: resetting }}
				closable={!resetting}
				maskClosable={!resetting}
			>
				<Space direction="vertical" size="large" style={{ width: "100%" }}>
					<Text type="danger" strong>
						警告：此操作将删除所有本地数据！
					</Text>
					
					<div>
						<Text>重置数据库将清空以下数据：</Text>
						<ul style={{ marginTop: 8, marginBottom: 0 }}>
							<li>所有股票列表数据</li>
							<li>关注的股票</li>
							<li>公告数据</li>
							<li>十大股东数据</li>
							<li>同步记录</li>
						</ul>
					</div>

					<Checkbox
						checked={backupBeforeReset}
						onChange={(e) => setBackupBeforeReset(e.target.checked)}
						disabled={resetting}
					>
						在重置前备份数据库（推荐）
					</Checkbox>

					{resetting && (
						<div>
							<Text>正在重置数据库，请稍候...</Text>
							<Progress percent={100} status="active" showInfo={false} />
						</div>
					)}

					<Text type="secondary" style={{ fontSize: 12 }}>
						提示：重置完成后，您需要重新同步股票列表和其他数据。
					</Text>
				</Space>
			</Modal>
		</div>
	);
}

