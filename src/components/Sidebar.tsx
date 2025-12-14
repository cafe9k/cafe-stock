import { LayoutDashboard, FileText, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
	return twMerge(clsx(inputs));
}

export function Sidebar() {
	const navItems = [
		{ icon: LayoutDashboard, label: "Dashboard", path: "/" },
		{ icon: FileText, label: "Announcements", path: "/announcements" },
		{ icon: Settings, label: "Settings", path: "/settings" },
	];

	return (
		<aside className="w-64 h-screen bg-slate-900 text-white p-4 flex flex-col fixed left-0 top-0">
			<div className="mb-8 px-2 flex items-center gap-2">
				<div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
					<span className="font-bold text-lg">C</span>
				</div>
				<span className="font-bold text-xl tracking-tight">CafeStock</span>
			</div>

			<nav className="space-y-2">
				{navItems.map((item) => (
					<NavLink
						key={item.path}
						to={item.path}
						className={({ isActive }) =>
							cn(
								"flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
								"hover:bg-white/10",
								isActive
									? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-purple-900/20 font-medium"
									: "text-slate-400"
							)
						}
					>
						<item.icon size={20} />
						<span>{item.label}</span>
					</NavLink>
				))}
			</nav>

			<div className="mt-auto pt-4 border-t border-white/10">
				<div className="text-xs text-slate-500 px-2">v1.0.0</div>
			</div>
		</aside>
	);
}
