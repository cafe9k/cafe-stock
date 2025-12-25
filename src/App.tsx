import { Routes, Route, Navigate } from "react-router-dom";
import { App as AntApp } from "antd";
import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Announcements } from "./pages/Announcements";
import DataInsights from "./pages/DataInsights";
import { Settings } from "./pages/Settings";
import { StockListSyncIndicator } from "./components/StockListSyncIndicator";
import { stockListSyncService } from "./services/stockListSync";

interface SyncProgress {
	status: "started" | "syncing" | "completed" | "failed";
	message?: string;
	total?: number;
	current?: number;
	stockCount?: number;
	error?: string;
}

function App() {
	const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
	const [showSyncIndicator, setShowSyncIndicator] = useState(false);

	useEffect(() => {
		// 设置进度回调
		stockListSyncService.setProgressCallback((progress) => {
			setSyncProgress(progress);
			setShowSyncIndicator(progress !== null);
		});

		// 应用启动时检查并同步
		const checkAndSync = async () => {
			try {
				await stockListSyncService.checkAndSyncIfNeeded(() => {
					console.log("Stock list sync check completed");
				});
			} catch (error) {
				console.error("Failed to check and sync stock list:", error);
			}
		};

		// 延迟执行，确保窗口已渲染
		setTimeout(() => {
			checkAndSync();
		}, 500);
	}, []);

	return (
		<AntApp>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Navigate to="/announcements" replace />} />
					<Route path="announcements" element={<Announcements />} />
					<Route path="data-insights" element={<DataInsights />} />
					<Route path="settings" element={<Settings />} />
					<Route path="*" element={<Navigate to="/announcements" replace />} />
				</Route>
			</Routes>
			<StockListSyncIndicator visible={showSyncIndicator} progress={syncProgress} />
		</AntApp>
	);
}

export default App;
