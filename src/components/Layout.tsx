import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout as AntLayout, Menu, Dropdown, Button, App, Modal, Input, Form } from "antd";
import {
	NotificationOutlined,
	ReadOutlined,
	FundOutlined,
	SettingOutlined,
	CopyOutlined,
	PlayCircleOutlined,
	StopOutlined,
	LockOutlined,
	UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { CacheDataIndicator } from "./CacheDataIndicator";

const { Header, Content } = AntLayout;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
	{
		key: "/announcements",
		icon: <NotificationOutlined />,
		label: "公告列表",
	},
	{
		key: "/data-insights",
		icon: <FundOutlined />,
		label: "数据洞察",
	},
	{
		key: "/news",
		icon: <ReadOutlined />,
		label: "资讯",
	},
];

export function Layout() {
	const navigate = useNavigate();
	const location = useLocation();
	const { message } = App.useApp();
	const [isServerRunning, setIsServerRunning] = useState(false);
	const [serverPort, setServerPort] = useState(8080);
	const [_serverUrl, setServerUrl] = useState<string | null>(null);
	const [hasAuth, setHasAuth] = useState(false);
	const [username, setUsername] = useState<string | null>(null);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authForm] = Form.useForm();

	// 加载服务器状态
	useEffect(() => {
		const loadServerStatus = async () => {
			try {
				const status = await window.electronAPI.getSqliteHttpServerStatus();
				setIsServerRunning(status.isRunning);
				setServerPort(status.port);
				setServerUrl(status.url);
				setHasAuth(status.hasAuth);
				setUsername(status.username);
			} catch (error) {
				console.error("获取服务器状态失败:", error);
			}
		};

		loadServerStatus();

		// 监听服务器状态变化
		const unsubscribeStarted = window.electronAPI.onSqliteHttpServerStarted((data) => {
			setIsServerRunning(true);
			setServerPort(data.port);
			setServerUrl(`http://localhost:${data.port}`);
			setHasAuth(data.hasAuth);
			setUsername(data.username);
			const authInfo = data.hasAuth ? ` (认证: ${data.username})` : "";
			message.success(`SQLite HTTP 服务器已启动: http://localhost:${data.port}${authInfo}`);
		});

		const unsubscribeStopped = window.electronAPI.onSqliteHttpServerStopped(() => {
			setIsServerRunning(false);
			setServerUrl(null);
			message.info("SQLite HTTP 服务器已停止");
		});

		const unsubscribeError = window.electronAPI.onSqliteHttpServerError((error) => {
			message.error(`服务器错误: ${error.message}`);
		});

		return () => {
			unsubscribeStarted();
			unsubscribeStopped();
			unsubscribeError();
		};
	}, [message]);

	const handleMenuClick: MenuProps["onClick"] = (e) => {
		navigate(e.key);
	};

	// 复制数据库连接信息
	const handleCopyDbConnection = async () => {
		try {
			const info = await window.electronAPI.getDbConnectionInfo();
			if (info.success && info.dbPath) {
				// 格式化连接信息
				let connectionInfo = `数据库路径: ${info.dbPath}\n连接字符串: ${info.connectionString || `sqlite://${info.dbPath}`}\n密码: ${
					info.password || "无"
				}`;

				// 如果 HTTP 服务器正在运行，添加服务器信息
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

				// 复制到剪贴板
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
				// 重新加载状态以获取认证信息
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
				// 表单验证错误
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

	// 设置下拉菜单
	const settingsMenuItems: MenuProps["items"] = [
		{
			key: "copy-db-connection",
			icon: <CopyOutlined />,
			label: "复制SQL远程连接",
			onClick: handleCopyDbConnection,
		},
		{
			type: "divider",
		},
		{
			key: "start-server",
			icon: <PlayCircleOutlined />,
			label: isServerRunning ? `HTTP 服务器运行中 (${serverPort}${hasAuth ? `, ${username}` : ""})` : "启动 SQLite HTTP 服务",
			disabled: isServerRunning,
			onClick: handleStartServer,
		},
		{
			key: "stop-server",
			icon: <StopOutlined />,
			label: "停止 SQLite HTTP 服务",
			disabled: !isServerRunning,
			onClick: handleStopServer,
		},
		{
			type: "divider",
		},
		{
			key: "set-auth",
			icon: <LockOutlined />,
			label: hasAuth ? `修改认证 (${username})` : "设置用户名和密码",
			onClick: () => setShowAuthModal(true),
		},
		...(hasAuth
			? [
					{
						key: "clear-auth",
						icon: <UserOutlined />,
						label: "清除认证信息",
						onClick: handleClearAuth,
					},
			  ]
			: []),
	];

	return (
		<AntLayout style={{ minHeight: "100vh" }}>
			<Header style={{ display: "flex", alignItems: "center", background: "#001529", paddingLeft: 0, paddingRight: 16 }}>
				<Menu
					theme="dark"
					mode="horizontal"
					selectedKeys={[location.pathname]}
					items={items}
					onClick={handleMenuClick}
					style={{ flex: 1, minWidth: 0 }}
				/>
				<Dropdown menu={{ items: settingsMenuItems }} placement="bottomRight">
					<Button type="text" icon={<SettingOutlined />} style={{ color: "rgba(255, 255, 255, 0.85)" }}>
						设置
					</Button>
				</Dropdown>
			</Header>
			<Content style={{ background: "#f0f2f5", paddingBottom: 60 }}>
				<Outlet />
			</Content>
			<CacheDataIndicator />

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
		</AntLayout>
	);
}
