import { Outlet } from "react-router-dom";
import { Layout as AntLayout } from "antd";

const { Content } = AntLayout;

export function Layout() {
	return (
		<AntLayout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
			<Content style={{ padding: "32px" }}>
				<Outlet />
			</Content>
		</AntLayout>
	);
}
