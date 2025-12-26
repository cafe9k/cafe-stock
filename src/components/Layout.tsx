/**
 * INPUT: react-router-dom(路由), Ant Design Layout(布局组件), CacheDataIndicator(组件)
 * OUTPUT: Layout 组件 - 应用主布局组件，提供导航菜单和内容区域
 * POS: 渲染进程布局组件，定义应用的整体结构（导航栏、侧边栏、内容区）
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/components/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout as AntLayout, Menu } from "antd";
import {
	NotificationOutlined,
	FundOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { CacheDataIndicator } from "./CacheDataIndicator";

const { Header, Content } = AntLayout;

type MenuItem = Required<MenuProps>["items"][number];

const leftItems: MenuItem[] = [
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
];

const rightItems: MenuItem[] = [
	{
		key: "/settings",
		icon: <SettingOutlined />,
		label: "设置",
	},
];

export function Layout() {
	const navigate = useNavigate();
	const location = useLocation();

	const handleMenuClick: MenuProps["onClick"] = (e) => {
		navigate(e.key);
	};

	return (
		<AntLayout style={{ minHeight: "100vh" }}>
			<Header style={{ display: "flex", alignItems: "center", background: "#001529", paddingLeft: 0, paddingRight: 0 }}>
				<Menu
					theme="dark"
					mode="horizontal"
					selectedKeys={[location.pathname]}
					items={leftItems}
					onClick={handleMenuClick}
					style={{ flex: 1, minWidth: 0 }}
				/>
				<Menu
					theme="dark"
					mode="horizontal"
					selectedKeys={[location.pathname]}
					items={rightItems}
					onClick={handleMenuClick}
					style={{ minWidth: 100 }}
				/>
			</Header>
			<Content style={{ background: "#f0f2f5", paddingBottom: 60 }}>
				<Outlet />
			</Content>
			<CacheDataIndicator />
		</AntLayout>
	);
}
