import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout as AntLayout, Menu } from "antd";
import { StockOutlined, NotificationOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header, Content } = AntLayout;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
	{
		key: "/announcements",
		icon: <NotificationOutlined />,
		label: "公告列表",
	},
	{
		key: "/stocks",
		icon: <StockOutlined />,
		label: "股票列表",
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
			<Header style={{ display: "flex", alignItems: "center", background: "#001529", paddingLeft: 0 }}>
				<Menu
					theme="dark"
					mode="horizontal"
					selectedKeys={[location.pathname]}
					items={items}
					onClick={handleMenuClick}
					style={{ flex: 1, minWidth: 0 }}
				/>
			</Header>
			<Content style={{ background: "#f0f2f5" }}>
				<Outlet />
			</Content>
		</AntLayout>
	);
}
