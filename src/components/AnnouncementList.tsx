import { useEffect, useState } from "react";
import { Search, Filter, FileText, Calendar, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { TushareClient } from "../services/TushareClient";

interface Announcement {
	ts_code: string;
	ann_date: string;
	ann_type: string;
	title: string;
	content: string;
	pub_time: string;
}

export function AnnouncementList() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState("");

	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			// Fetch announcements for a popular stock (e.g., Kweichow Moutai 600519.SH) for demo
			// or try to fetch latest without ts_code if supported (often requires higher permissions or specific API)
			// We will stick to the App.tsx example but fetch more data and maybe recent dates.
			const endDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, "");

			const data = await TushareClient.getAnnouncements("600519.SH", undefined, startDate, endDate);
			setAnnouncements(data as Announcement[]);
		} catch (err: any) {
			setError(err.message || "Failed to load announcements");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const filteredData = announcements.filter(
		(item) => item.title.toLowerCase().includes(filter.toLowerCase()) || item.ts_code.toLowerCase().includes(filter.toLowerCase())
	);

	return (
		<div className="max-w-5xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-slate-800 tracking-tight">Announcements</h1>
					<p className="text-slate-500 mt-1">Latest updates and filings from the market</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
						<input
							type="text"
							placeholder="Search..."
							className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all w-64 shadow-sm"
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
						/>
					</div>
					<button className="p-2 bg-white border border-slate-200 rounded-full hover:bg-gray-50 text-slate-600 shadow-sm transition-colors">
						<Filter size={18} />
					</button>
					<button
						onClick={fetchData}
						className="p-2 bg-white border border-slate-200 rounded-full hover:bg-gray-50 text-slate-600 shadow-sm transition-colors"
						title="Refresh"
					>
						<RefreshCw size={18} className={loading ? "animate-spin" : ""} />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
				{loading ? (
					<div className="flex items-center justify-center h-64 text-slate-400">
						<div className="flex flex-col items-center gap-3">
							<div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
							<span>Loading data...</span>
						</div>
					</div>
				) : error ? (
					<div className="flex items-center justify-center h-64 text-red-500">
						<div className="flex flex-col items-center gap-2">
							<AlertCircle size={32} />
							<span>{error}</span>
							<button onClick={fetchData} className="mt-2 text-sm text-blue-600 hover:underline">
								Try Again
							</button>
						</div>
					</div>
				) : filteredData.length === 0 ? (
					<div className="flex items-center justify-center h-64 text-slate-400">No announcements found.</div>
				) : (
					<div className="divide-y divide-slate-50">
						{filteredData.map((item, index) => (
							<div
								key={`${item.ts_code}-${index}`}
								className="group flex items-center justify-between p-4 hover:bg-slate-50/80 transition-all cursor-pointer"
							>
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
										<FileText size={20} />
									</div>
									<div>
										<h3 className="font-semibold text-slate-800 text-sm md:text-base group-hover:text-purple-700 transition-colors line-clamp-1">
											{item.title}
										</h3>
										<div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
											<span className="font-medium text-slate-500">{item.ts_code}</span>
											<span className="w-1 h-1 rounded-full bg-slate-300"></span>
											<span className="flex items-center gap-1">
												<Calendar size={12} />
												{item.ann_date}
											</span>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3 pl-4">
									<div className="hidden md:block px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-500 font-medium">PDF</div>
									<ChevronRight
										size={18}
										className="text-slate-300 group-hover:text-purple-400 transition-colors transform group-hover:translate-x-0.5"
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
