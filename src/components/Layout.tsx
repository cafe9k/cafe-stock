import { Outlet } from "react-router-dom";

export function Layout() {
	return (
		<div className="min-h-screen bg-gray-50">
			<main className="p-8 h-screen overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}
