import { useEffect, useState, useCallback } from "react";
import { RefreshCw, AlertCircle, Loader2, ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface Announcement {
	ts_code: string;
	ann_date: string;
	ann_type: string;
	title: string;
	content: string;
	pub_time: string;
}

const PAGE_SIZE = 200;

export function AnnouncementList() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [syncing, setSyncing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0); // 保留用于未来分页显示总数

	const fetchData = useCallback(async (pageNum: number) => {
		setLoading(true);
		setError(null);
		try {
			if (!window.electronAPI) {
				throw new Error("Electron API not available");
			}

			const result = await window.electronAPI.getAnnouncements(pageNum, PAGE_SIZE);
			console.log("Fetched data:", result);
			setAnnouncements(result.items as Announcement[]);
			setTotal(result.total);
		} catch (err: any) {
			console.error("Fetch error:", err);
			setError(err.message || "Failed to load announcements");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSyncAndRefresh = async () => {
		if (syncing) return;
		setSyncing(true);
		setError(null);

		let removeListener: (() => void) | undefined;

		// Set up progress listener
		if (window.electronAPI?.onSyncProgress) {
			removeListener = window.electronAPI.onSyncProgress((data) => {
				console.log("Sync progress:", data);
				// You can update a state here to show progress bar if needed
			});
		}

		try {
			if (!window.electronAPI) {
				throw new Error("Electron API not available");
			}

			const syncResult = await window.electronAPI.syncAnnouncements();

			if (syncResult.status === "failed") {
				throw new Error(syncResult.message);
			}

			console.log("Sync Result:", syncResult);
			setPage(1);
			await fetchData(1);
		} catch (err: any) {
			setError(err.message || "Sync failed");
		} finally {
			if (removeListener) {
				removeListener();
			}
			setSyncing(false);
		}
	};

	useEffect(() => {
		console.log("AnnouncementList mounted. Checking API:", !!window.electronAPI);
		fetchData(page);
	}, [page, fetchData]);

	const handlePrevPage = () => {
		if (page > 1) setPage((p) => p - 1);
	};

	const handleNextPage = () => {
		if (announcements.length === PAGE_SIZE) {
			setPage((p) => p + 1);
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<button
					onClick={handleSyncAndRefresh}
					disabled={syncing || loading}
					className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
					title="Sync & Refresh"
				>
					<RefreshCw size={20} className={syncing || loading ? "animate-spin" : ""} />
					{syncing ? <span className="text-sm">Syncing...</span> : null}
				</button>
			</div>

			{/* Content */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
							<tr>
								<th className="py-3 px-6 w-32 whitespace-nowrap">Date</th>
								<th className="py-3 px-6 w-32 whitespace-nowrap">Code</th>
								<th className="py-3 px-6">Title</th>
								<th className="py-3 px-6 w-48 whitespace-nowrap">Type</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{loading ? (
								<tr>
									<td colSpan={4} className="py-20">
										<div className="flex flex-col items-center justify-center gap-3 text-gray-400">
											<Loader2 size={32} className="animate-spin text-blue-500" />
											<span>Loading announcements...</span>
										</div>
									</td>
								</tr>
							) : error ? (
								<tr>
									<td colSpan={4} className="py-20">
										<div className="flex flex-col items-center justify-center gap-2 text-red-500">
											<AlertCircle size={32} />
											<span>{error}</span>
											<button
												onClick={() => {
													console.log("Retrying fetch...");
													fetchData(page);
												}}
												className="text-blue-600 hover:underline mt-2"
											>
												Try Again
											</button>
										</div>
									</td>
								</tr>
							) : announcements.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-20 text-center text-gray-500">
										No announcements found in this period.
									</td>
								</tr>
							) : (
								announcements.map((item, index) => (
									<tr key={`${item.ts_code}-${index}`} className="hover:bg-gray-50 transition-colors group">
										<td className="py-3 px-6 text-gray-500 font-mono whitespace-nowrap">{item.ann_date}</td>
										<td className="py-3 px-6">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium font-mono">
												{item.ts_code}
											</span>
										</td>
										<td className="py-3 px-6">
											<div className="flex items-start gap-3">
												<FileText
													size={16}
													className="mt-0.5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0"
												/>
												<span
													className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
													title={item.title}
												>
													{item.title}
												</span>
											</div>
										</td>
										<td className="py-3 px-6 text-gray-500 whitespace-nowrap">{item.ann_type || "-"}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{!loading && !error && announcements.length > 0 && (
					<div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
						<div className="text-sm text-gray-500">
							Showing page <span className="font-medium text-gray-900">{page}</span>
							{total > 0 && (
								<span className="ml-2">
									of <span className="font-medium text-gray-900">{Math.ceil(total / PAGE_SIZE)}</span> ({total} total)
								</span>
							)}
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={handlePrevPage}
								disabled={page === 1}
								className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
							>
								<ChevronLeft size={16} />
								Previous
							</button>
							<button
								onClick={handleNextPage}
								disabled={announcements.length < PAGE_SIZE}
								className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
							>
								Next
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
