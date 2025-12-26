/**
 * INPUT: window.electronAPI(IPC), Ant Design(UI组件), ClassificationRuleEditor(组件)
 * OUTPUT: Settings 页面组件 - 设置页面，提供应用配置和分类规则管理
 * POS: 渲染进程页面组件，应用设置和配置管理的主界面
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/pages/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useState, useEffect } from "react";
import {
	Card,
	Button,
	Progress,
	Space,
	message,
	Typography,
	Form,
	Input,
	Modal,
	Descriptions,
	Badge,
	Row,
	Col,
	Checkbox,
	Tabs,
	Divider,
	Alert,
	Select,
	Table,
	Tag,
	Spin,
	Empty,
} from "antd";
import {
	TagsOutlined,
	SyncOutlined,
	CopyOutlined,
	PlayCircleOutlined,
	StopOutlined,
	LockOutlined,
	UserOutlined,
	DatabaseOutlined,
	ExclamationCircleOutlined,
	ReloadOutlined,
	SettingOutlined,
	CloudServerOutlined,
	AppstoreOutlined,
	InfoCircleOutlined,
	TableOutlined,
	EyeOutlined,
} from "@ant-design/icons";
import { ClassificationRuleEditor } from "../components/ClassificationRuleEditor";
import { UpdateChecker } from "../components/UpdateChecker";

const { Title, Text } = Typography;

export function Settings() {
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

	// 数据库 Schema 和样本数据相关状态
	const [tables, setTables] = useState<string[]>([]);
	const [selectedTable, setSelectedTable] = useState<string | null>(null);
	const [tableSchema, setTableSchema] = useState<any>(null);
	const [sampleData, setSampleData] = useState<any[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loadingSchema, setLoadingSchema] = useState(false);
	const [loadingSampleData, setLoadingSampleData] = useState(false);
	const [sampleLimit, setSampleLimit] = useState(10);

	// 股票详情同步相关状态
	const [stockDetailsStats, setStockDetailsStats] = useState<{
		dailyBasicCount: number;
		companyInfoCount: number;
	} | null>(null);
	const [syncingStockDetails, setSyncingStockDetails] = useState(false);
	const [stockDetailsSyncProgress, setStockDetailsSyncProgress] = useState<{
		status: string;
		message?: string;
		current?: number;
		total?: number;
		phase?: string;
	} | null>(null);

	// 断点续传状态
	const [stockDetailsSyncInfo, setStockDetailsSyncInfo] = useState<{
		hasProgress: boolean;
		progress: any;
		isSyncedThisMonth: boolean;
		lastSyncDate: string | null;
	} | null>(null);

	useEffect(() => {
		loadServerStatus();
		loadDatabaseTables();
		loadStockDetailsStats();
		loadStockDetailsSyncInfo(); // 加载断点续传进度

		// 监听股票详情同步进度
		const unsubscribeStockDetails = window.electronAPI.onStockDetailsSyncProgress((progress) => {
			setStockDetailsSyncProgress(progress);
			if (progress.status === "completed" || progress.status === "failed") {
				setSyncingStockDetails(false);
				loadStockDetailsStats();
				loadStockDetailsSyncInfo(); // 刷新断点续传状态
			}
		});

		return () => {
			unsubscribeStockDetails();
		};
	}, []);

	// 加载数据库表列表
	const loadDatabaseTables = async () => {
		try {
			const result = await window.electronAPI.getDatabaseTables();
			if (result.success) {
				setTables(result.tables);
			} else {
				message.error(`加载表列表失败: ${result.error}`);
			}
		} catch (error: any) {
			console.error("Failed to load database tables:", error);
			message.error(`加载表列表失败: ${error.message}`);
		}
	};

	// 加载股票详情统计
	const loadStockDetailsStats = async () => {
		try {
			const stats = await window.electronAPI.getStockDetailsStats();
			setStockDetailsStats(stats);
		} catch (error: any) {
			console.error("Failed to load stock details stats:", error);
		}
	};

	// 加载股票详情同步信息（断点续传）
	const loadStockDetailsSyncInfo = async () => {
		try {
			const info = await window.electronAPI.getStockDetailsSyncProgress();
			setStockDetailsSyncInfo(info);
		} catch (error: any) {
			console.error("Failed to load stock details sync info:", error);
		}
	};

	// 同步股票详情
	const handleSyncStockDetails = async () => {
		try {
			setSyncingStockDetails(true);
			setStockDetailsSyncProgress({ status: "started", message: "开始同步..." });
			await window.electronAPI.syncStockDetails();
		} catch (error: any) {
			message.error(`同步失败: ${error.message}`);
			setSyncingStockDetails(false);
		}
	};

	// 删除股票详情同步状态
	const handleDeleteStockDetailsSyncFlag = async () => {
		Modal.confirm({
			title: "确认删除同步状态？",
			content: "删除后将清除所有同步记录（包括断点进度），下次同步将重新开始。建议仅在需要重新同步时使用。",
			icon: <ExclamationCircleOutlined />,
			okText: "确认删除",
			okType: "danger",
			cancelText: "取消",
			onOk: async () => {
				try {
					const result = await window.electronAPI.deleteStockDetailsSyncFlag();
					if (result.success) {
						message.success("同步状态已删除");
						// 重新加载同步信息
						loadStockDetailsSyncInfo();
						loadStockDetailsStats();
					} else {
						message.error(`删除失败: ${result.message}`);
					}
				} catch (error: any) {
					message.error(`删除失败: ${error.message}`);
				}
			},
		});
	};

	// 加载表的 Schema 信息
	const loadTableSchema = async (tableName: string) => {
		setLoadingSchema(true);
		try {
			const result = await window.electronAPI.getTableSchema(tableName);
			if (result.success) {
				setTableSchema(result);
			} else {
				message.error(`加载表结构失败: ${result.error}`);
			}
		} catch (error: any) {
			console.error(`Failed to load table schema for ${tableName}:`, error);
			message.error(`加载表结构失败: ${error.message}`);
		} finally {
			setLoadingSchema(false);
		}
	};

	// 加载表的样本数据
	const loadSampleData = async (tableName: string, limit: number = 10) => {
		setLoadingSampleData(true);
		try {
			const result = await window.electronAPI.getTableSampleData(tableName, limit);
			if (result.success) {
				setSampleData(result.sampleData || []);
				setTotalCount(result.totalCount || 0);
			} else {
				message.error(`加载样本数据失败: ${result.error}`);
			}
		} catch (error: any) {
			console.error(`Failed to load sample data for ${tableName}:`, error);
			message.error(`加载样本数据失败: ${error.message}`);
		} finally {
			setLoadingSampleData(false);
		}
	};

	// 处理表选择变化
	const handleTableChange = async (tableName: string) => {
		setSelectedTable(tableName);
		setTableSchema(null);
		setSampleData([]);
		setTotalCount(0);

		if (tableName) {
			await Promise.all([loadTableSchema(tableName), loadSampleData(tableName, sampleLimit)]);
		}
	};

	// 刷新样本数据
	const handleRefreshSampleData = async () => {
		if (selectedTable) {
			await loadSampleData(selectedTable, sampleLimit);
		}
	};

	// 加载服务器状态
	const loadServerStatus = async () => {
		try {
			const [status, info] = await Promise.all([window.electronAPI.getSqliteHttpServerStatus(), window.electronAPI.getDbConnectionInfo()]);

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

	const tabItems = [
		{
			key: "classification",
			label: (
				<span>
					<TagsOutlined />
					公告分类
				</span>
			),
			children: (
				<Space orientation="vertical" size="large" style={{ width: "100%" }}>
					{/* 分类规则配置 */}
					<Card
						title={
							<Space>
								<SettingOutlined />
								<span>分类规则配置</span>
							</Space>
						}
					>
						<ClassificationRuleEditor />
					</Card>
				</Space>
			),
		},
		{
			key: "database",
			label: (
				<span>
					<DatabaseOutlined />
					数据库管理
				</span>
			),
			children: (
				<Space orientation="vertical" size="large" style={{ width: "100%" }}>
					<Row gutter={[16, 16]}>
						{/* 数据库信息 */}
						<Col xs={24} lg={12}>
							<Card
								title={
									<Space>
										<DatabaseOutlined />
										<span>数据库信息</span>
									</Space>
								}
								style={{ height: "100%" }}
							>
								<Space orientation="vertical" size="large" style={{ width: "100%" }}>
									<Descriptions column={1} size="middle" bordered>
										<Descriptions.Item label="数据库文件">
											<Text copyable ellipsis style={{ maxWidth: 400 }}>
												{dbPath || "加载中..."}
											</Text>
										</Descriptions.Item>
										<Descriptions.Item label="运行状态">
											<Badge status="success" text="正常运行" />
										</Descriptions.Item>
									</Descriptions>

									<Alert
										message="功能说明"
										description="数据库存储了所有股票数据、公告、十大股东等信息。当数据库损坏或出现异常时，可以使用重置功能。"
										type="info"
										showIcon
										icon={<InfoCircleOutlined />}
									/>

									<Space orientation="vertical" style={{ width: "100%" }}>
										<Button danger icon={<ReloadOutlined />} onClick={() => setShowResetModal(true)} block size="large">
											重置数据库
										</Button>

										<Alert
											message="警告：重置数据库将删除所有本地数据，包括股票列表、公告、十大股东等信息。"
											type="warning"
											showIcon
										/>
									</Space>
								</Space>
							</Card>
						</Col>

						{/* 股票详情同步 */}
						<Col xs={24} lg={12}>
							<Card
								title={
									<Space>
										<SyncOutlined />
										<span>股票详情同步</span>
									</Space>
								}
								style={{ height: "100%" }}
							>
								<Space orientation="vertical" size="large" style={{ width: "100%" }}>
									<Descriptions column={1} size="middle" bordered>
										<Descriptions.Item label="市值数据">
											{stockDetailsStats ? (
												<Text>{stockDetailsStats.dailyBasicCount.toLocaleString()} 条记录</Text>
											) : (
												<Text type="secondary">加载中...</Text>
											)}
										</Descriptions.Item>
										<Descriptions.Item label="公司信息">
											{stockDetailsStats ? (
												<Text>{stockDetailsStats.companyInfoCount.toLocaleString()} 条记录</Text>
											) : (
												<Text type="secondary">加载中...</Text>
											)}
										</Descriptions.Item>
										<Descriptions.Item label="同步状态">
											{syncingStockDetails ? (
												<Badge status="processing" text="同步中..." />
											) : stockDetailsSyncInfo?.isSyncedThisMonth ? (
												<Badge status="success" text={`本月已同步 (${stockDetailsSyncInfo.lastSyncDate})`} />
											) : stockDetailsSyncInfo?.hasProgress ? (
												<Badge status="warning" text="待续传" />
											) : (
												<Badge status="default" text="未同步" />
											)}
										</Descriptions.Item>
										{stockDetailsSyncInfo?.hasProgress && !syncingStockDetails && (
											<Descriptions.Item label="断点进度">
												<Text type="secondary">
													{stockDetailsSyncInfo.progress.dailyBasicCompleted ? "✓ 市值数据已完成" : "市值数据未完成"}
													{" | "}
													已同步 {stockDetailsSyncInfo.progress.syncedCompanies.length} 家公司信息
												</Text>
											</Descriptions.Item>
										)}
									</Descriptions>

									<Alert
										message="同步策略"
										description={
											<>
												<div>• 每月自动同步一次（随股票列表同步触发）</div>
												<div>• 支持断点续传，中断后可继续上次进度</div>
												<div>• 同步后可在公告列表中使用市值筛选功能</div>
												{stockDetailsSyncInfo?.hasProgress && (
													<div style={{ marginTop: 8 }}>
														<Text type="warning">⚠️ 检测到未完成的同步任务，点击同步按钮继续</Text>
													</div>
												)}
											</>
										}
										type="info"
										showIcon
										icon={<InfoCircleOutlined />}
									/>

									{stockDetailsSyncProgress && stockDetailsSyncProgress.status === "syncing" && (
										<div>
											<Space direction="vertical" style={{ width: "100%" }}>
												<Text type="secondary">
													{stockDetailsSyncProgress.message}
													{stockDetailsSyncProgress.phase && (
														<> ({stockDetailsSyncProgress.phase === "daily_basic" ? "获取市值数据" : "获取公司信息"})</>
													)}
												</Text>
												{stockDetailsSyncProgress.current !== undefined && stockDetailsSyncProgress.total !== undefined && (
													<Progress
														percent={Math.round(
															(stockDetailsSyncProgress.current / stockDetailsSyncProgress.total) * 100
														)}
														status="active"
													/>
												)}
											</Space>
										</div>
									)}

									<Button
										type="primary"
										icon={<SyncOutlined spin={syncingStockDetails} />}
										onClick={handleSyncStockDetails}
										disabled={syncingStockDetails}
										block
										size="large"
									>
										{syncingStockDetails ? "同步中..." : stockDetailsSyncInfo?.hasProgress ? "继续同步" : "同步股票详情"}
									</Button>

									{/* 删除同步状态按钮 */}
									{(stockDetailsSyncInfo?.isSyncedThisMonth || stockDetailsSyncInfo?.hasProgress) && !syncingStockDetails && (
										<Button danger icon={<ExclamationCircleOutlined />} onClick={handleDeleteStockDetailsSyncFlag} block>
											删除同步状态（重新同步）
										</Button>
									)}
								</Space>
							</Card>
						</Col>

						{/* 远程访问 */}
						<Col xs={24} lg={12}>
							<Card
								title={
									<Space>
										<CloudServerOutlined />
										<span>远程访问服务</span>
									</Space>
								}
								style={{ height: "100%" }}
							>
								<Space orientation="vertical" size="large" style={{ width: "100%" }}>
									<Descriptions column={1} size="middle" bordered>
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
											<Badge status={hasAuth ? "success" : "default"} text={hasAuth ? `已设置 (${username})` : "未设置"} />
										</Descriptions.Item>
									</Descriptions>

									<Alert
										message="功能说明"
										description="启动 HTTP 服务器后，可以通过 HTTP API 远程访问数据库。建议设置用户名和密码以保护数据安全。"
										type="info"
										showIcon
										icon={<InfoCircleOutlined />}
									/>

									<Space orientation="vertical" style={{ width: "100%" }} size="middle">
										<Space wrap style={{ width: "100%" }}>
											<Button
												type="primary"
												icon={<PlayCircleOutlined />}
												onClick={handleStartServer}
												disabled={isServerRunning}
												size="large"
											>
												启动服务器
											</Button>

											<Button
												danger
												icon={<StopOutlined />}
												onClick={handleStopServer}
												disabled={!isServerRunning}
												size="large"
											>
												停止服务器
											</Button>
										</Space>

										<Space wrap style={{ width: "100%" }}>
											<Button icon={<LockOutlined />} onClick={() => setShowAuthModal(true)}>
												{hasAuth ? "修改认证" : "设置认证"}
											</Button>

											{hasAuth && (
												<Button icon={<UserOutlined />} onClick={handleClearAuth}>
													清除认证
												</Button>
											)}

											<Button icon={<CopyOutlined />} onClick={handleCopyDbConnection}>
												复制连接信息
											</Button>
										</Space>
									</Space>
								</Space>
							</Card>
						</Col>
					</Row>

					{/* 数据库 Schema 和样本数据 */}
					<Card
						title={
							<Space>
								<TableOutlined />
								<span>数据库 Schema 和样本数据</span>
							</Space>
						}
					>
						<Space orientation="vertical" size="large" style={{ width: "100%" }}>
							<Space wrap style={{ width: "100%" }}>
								<Select
									placeholder="选择数据表"
									style={{ width: 300 }}
									value={selectedTable}
									onChange={handleTableChange}
									showSearch
									filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
									options={tables.map((table) => ({ label: table, value: table }))}
								/>
								<Button icon={<ReloadOutlined />} onClick={loadDatabaseTables}>
									刷新表列表
								</Button>
							</Space>

							{selectedTable && (
								<>
									<Divider />

									{/* 样本数据 */}
									<div>
										<Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
											<Space>
												<Text strong>样本数据：</Text>
												{totalCount > 0 && <Text type="secondary">共 {totalCount} 条记录</Text>}
											</Space>
											<Space>
												<Select
													value={sampleLimit}
													onChange={(value) => {
														setSampleLimit(value);
														loadSampleData(selectedTable, value);
													}}
													style={{ width: 100 }}
													options={[
														{ label: "10 条", value: 10 },
														{ label: "20 条", value: 20 },
														{ label: "50 条", value: 50 },
														{ label: "100 条", value: 100 },
													]}
												/>
												<Button icon={<EyeOutlined />} onClick={handleRefreshSampleData} loading={loadingSampleData}>
													刷新
												</Button>
											</Space>
										</Space>
										<Spin spinning={loadingSampleData}>
											{sampleData.length > 0 ? (
												<Table
													dataSource={sampleData}
													rowKey={(_record, index) => `row-${index}`}
													pagination={false}
													size="small"
													bordered
													scroll={{ x: "max-content" }}
													columns={Object.keys(sampleData[0] || {}).map((key) => ({
														title: key,
														dataIndex: key,
														key: key,
														width: 150,
														ellipsis: true,
														render: (value: any) => {
															if (value === null || value === undefined) {
																return <Text type="secondary">NULL</Text>;
															}
															if (typeof value === "string" && value.length > 50) {
																return <Text title={value}>{value.substring(0, 50)}...</Text>;
															}
															return String(value);
														},
													}))}
												/>
											) : (
												<Empty description="暂无样本数据" />
											)}
										</Spin>
									</div>

									<Divider />

									{/* Schema 信息 */}
									<div>
										<Space style={{ marginBottom: 16 }}>
											<Text strong>表结构信息：</Text>
											<Text code>{selectedTable}</Text>
										</Space>
										<Spin spinning={loadingSchema}>
											{tableSchema ? (
												<Space orientation="vertical" size="middle" style={{ width: "100%" }}>
													{/* 列信息 */}
													<Table
														dataSource={tableSchema.columns}
														rowKey="cid"
														pagination={false}
														size="small"
														bordered
														columns={[
															{
																title: "列名",
																dataIndex: "name",
																key: "name",
																width: 150,
															},
															{
																title: "类型",
																dataIndex: "type",
																key: "type",
																width: 100,
															},
															{
																title: "非空",
																dataIndex: "notNull",
																key: "notNull",
																width: 80,
																render: (notNull: boolean) => (notNull ? <Tag color="red">是</Tag> : <Tag>否</Tag>),
															},
															{
																title: "主键",
																dataIndex: "primaryKey",
																key: "primaryKey",
																width: 80,
																render: (primaryKey: boolean) => (primaryKey ? <Tag color="blue">是</Tag> : null),
															},
															{
																title: "默认值",
																dataIndex: "defaultValue",
																key: "defaultValue",
																render: (value: any) => value ?? <Text type="secondary">NULL</Text>,
															},
														]}
													/>

													{/* 索引信息 */}
													{tableSchema.indexes && tableSchema.indexes.length > 0 && (
														<div>
															<Text strong style={{ display: "block", marginBottom: 8 }}>
																索引信息：
															</Text>
															{tableSchema.indexes.map((idx: any, index: number) => (
																<div key={index} style={{ marginBottom: 8 }}>
																	<Text code>{idx.name}</Text>
																	{idx.sql && (
																		<Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
																			{idx.sql}
																		</Text>
																	)}
																</div>
															))}
														</div>
													)}

													{/* 创建 SQL */}
													{tableSchema.createSql && (
														<div>
															<Text strong style={{ display: "block", marginBottom: 8 }}>
																创建 SQL：
															</Text>
															<pre
																style={{
																	background: "#f5f5f5",
																	padding: 12,
																	borderRadius: 4,
																	overflow: "auto",
																	fontSize: 12,
																}}
															>
																<code>{tableSchema.createSql}</code>
															</pre>
														</div>
													)}
												</Space>
											) : (
												<Empty description="暂无表结构信息" />
											)}
										</Spin>
									</div>
								</>
							)}

							{!selectedTable && <Empty description="请选择一个数据表查看 Schema 和样本数据" />}
						</Space>
					</Card>
				</Space>
			),
		},
		{
			key: "update",
			label: (
				<span>
					<AppstoreOutlined />
					软件更新
				</span>
			),
			children: <UpdateChecker />,
		},
		{
			key: "about",
			label: (
				<span>
					<InfoCircleOutlined />
					关于
				</span>
			),
			children: (
				<Card>
					<Space orientation="vertical" size="large" style={{ width: "100%" }}>
						<div style={{ textAlign: "center", padding: "24px 0" }}>
							<Title level={2} style={{ marginBottom: 8 }}>
								酷咖啡
							</Title>
							<Text type="secondary" style={{ fontSize: 16 }}>
								股票数据管理工具
							</Text>
						</div>

						<Divider />

						<Descriptions column={1} size="middle" bordered>
							<Descriptions.Item label="版本号">1.0.0</Descriptions.Item>
							<Descriptions.Item label="开发者">酷咖啡团队</Descriptions.Item>
							<Descriptions.Item label="技术栈">Electron + React + TypeScript + Ant Design</Descriptions.Item>
						</Descriptions>

						<Alert
							message="功能特性"
							description={
								<ul style={{ marginBottom: 0, paddingLeft: 20 }}>
									<li>股票列表管理与同步</li>
									<li>公告智能分类与检索</li>
									<li>十大股东数据追踪</li>
									<li>数据库远程访问</li>
									<li>自动更新功能</li>
								</ul>
							}
							type="info"
							showIcon
						/>

						<div style={{ textAlign: "center", paddingTop: 16 }}>
							<Text type="secondary">© 2024 酷咖啡. All rights reserved.</Text>
						</div>
					</Space>
				</Card>
			),
		},
	];

	return (
		<div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
			<Tabs defaultActiveKey="classification" items={tabItems} size="large" tabBarStyle={{ marginBottom: 24 }} />

			{/* 设置认证信息对话框 */}
			<Modal
				title={
					<Space>
						<LockOutlined />
						<span>设置 SQLite HTTP 服务器认证</span>
					</Space>
				}
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
						<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
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
				<Space orientation="vertical" size="large" style={{ width: "100%" }}>
					<Alert message="警告：此操作将删除所有本地数据！" type="error" showIcon />

					<div>
						<Text strong style={{ marginBottom: 8, display: "block" }}>
							重置数据库将清空以下数据：
						</Text>
						<ul style={{ marginTop: 8, marginBottom: 0 }}>
							<li>所有股票列表数据</li>
							<li>关注的股票</li>
							<li>公告数据</li>
							<li>十大股东数据</li>
							<li>同步记录</li>
						</ul>
					</div>

					<Checkbox checked={backupBeforeReset} onChange={(e) => setBackupBeforeReset(e.target.checked)} disabled={resetting}>
						在重置前备份数据库（推荐）
					</Checkbox>

					{resetting && (
						<div>
							<Text>正在重置数据库，请稍候...</Text>
							<Progress percent={100} status="active" showInfo={false} />
						</div>
					)}

					<Alert message="提示：重置完成后，您需要重新同步股票列表和其他数据。" type="info" showIcon />
				</Space>
			</Modal>
		</div>
	);
}
