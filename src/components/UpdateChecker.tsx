import { useEffect, useState } from "react";
import { Download, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface UpdateInfo {
	version: string;
	releaseDate?: string;
	releaseNotes?: string;
}

interface DownloadProgress {
	percent: number;
	transferred: number;
	total: number;
}

export function UpdateChecker() {
	const [checking, setChecking] = useState(false);
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
	const [downloading, setDownloading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
	const [downloaded, setDownloaded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// 监听更新事件
		const unsubChecking = window.electronAPI.onUpdateChecking(() => {
			setChecking(true);
			setError(null);
		});

		const unsubAvailable = window.electronAPI.onUpdateAvailable((info) => {
			setChecking(false);
			setUpdateAvailable(true);
			setUpdateInfo(info);
		});

		const unsubNotAvailable = window.electronAPI.onUpdateNotAvailable(() => {
			setChecking(false);
			setUpdateAvailable(false);
		});

		const unsubProgress = window.electronAPI.onUpdateDownloadProgress((progress) => {
			setDownloadProgress(progress);
		});

		const unsubDownloaded = window.electronAPI.onUpdateDownloaded((info) => {
			setDownloading(false);
			setDownloaded(true);
			setUpdateInfo(info);
		});

		const unsubError = window.electronAPI.onUpdateError((err) => {
			setChecking(false);
			setDownloading(false);
			setError(err);
		});

		return () => {
			unsubChecking();
			unsubAvailable();
			unsubNotAvailable();
			unsubProgress();
			unsubDownloaded();
			unsubError();
		};
	}, []);

	const handleCheckUpdate = async () => {
		setChecking(true);
		setError(null);
		const result = await window.electronAPI.checkForUpdates();
		if (result.error) {
			setError(result.error);
		}
		if (result.message) {
			setError(result.message);
		}
		setChecking(false);
	};

	const handleDownload = async () => {
		setDownloading(true);
		setError(null);
		const result = await window.electronAPI.downloadUpdate();
		if (!result.success) {
			setDownloading(false);
			setError(result.error || "下载失败");
		}
	};

	const handleInstall = async () => {
		await window.electronAPI.installUpdate();
	};

	return (
		<div className="p-4 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">软件更新</h3>
				<button
					onClick={handleCheckUpdate}
					disabled={checking || downloading}
					className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
					{checking ? "检查中..." : "检查更新"}
				</button>
			</div>

			{error && (
				<div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
					<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
					<div className="flex-1">
						<p className="text-sm text-red-800">{error}</p>
					</div>
				</div>
			)}

			{updateAvailable && !downloaded && (
				<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
					<div className="flex items-start gap-2">
						<Download className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
						<div className="flex-1">
							<p className="font-medium text-blue-900">发现新版本 {updateInfo?.version}</p>
							{updateInfo?.releaseDate && (
								<p className="text-sm text-blue-700 mt-1">发布日期: {new Date(updateInfo.releaseDate).toLocaleDateString("zh-CN")}</p>
							)}
							{updateInfo?.releaseNotes && (
								<div className="mt-2 text-sm text-blue-800">
									<p className="font-medium">更新内容:</p>
									<div className="mt-1 whitespace-pre-wrap">{updateInfo.releaseNotes}</div>
								</div>
							)}
						</div>
					</div>

					{downloading ? (
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm text-blue-700">
								<span>下载中...</span>
								<span>{downloadProgress?.percent.toFixed(1)}%</span>
							</div>
							<div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-blue-500 transition-all duration-300"
									style={{ width: `${downloadProgress?.percent || 0}%` }}
								/>
							</div>
							{downloadProgress && (
								<p className="text-xs text-blue-600">
									{(downloadProgress.transferred / 1024 / 1024).toFixed(2)} MB / {(downloadProgress.total / 1024 / 1024).toFixed(2)}{" "}
									MB
								</p>
							)}
						</div>
					) : (
						<button
							onClick={handleDownload}
							className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
						>
							立即下载
						</button>
					)}
				</div>
			)}

			{downloaded && (
				<div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
					<div className="flex items-start gap-2">
						<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
						<div className="flex-1">
							<p className="font-medium text-green-900">更新已下载完成</p>
							<p className="text-sm text-green-700 mt-1">版本 {updateInfo?.version} 已准备就绪</p>
						</div>
					</div>
					<button
						onClick={handleInstall}
						className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
					>
						立即安装并重启
					</button>
				</div>
			)}

			{!checking && !updateAvailable && !error && (
				<div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
					<p className="text-sm text-gray-600">当前已是最新版本</p>
				</div>
			)}
		</div>
	);
}
