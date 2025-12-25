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
