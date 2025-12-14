import { useEffect, useRef } from "react";
import { Modal, Button, Space, message } from "antd";
import { DownloadOutlined, CloseOutlined, ReloadOutlined } from "@ant-design/icons";

interface PDFWebViewerProps {
	open: boolean;
	onClose: () => void;
	pdfUrl: string;
	title?: string;
}

export function PDFWebViewer({ open, onClose, pdfUrl, title = "PDF 预览" }: PDFWebViewerProps) {
	const webviewRef = useRef<any>(null);

	useEffect(() => {
		if (open && pdfUrl && webviewRef.current) {
			// 在 webview 加载完成后设置 src
			const webview = webviewRef.current;
			webview.src = pdfUrl;

			// 监听 webview 事件
			const handleLoadStart = () => {
				console.log("WebView 开始加载:", pdfUrl);
			};

			const handleLoadStop = () => {
				console.log("WebView 加载完成");
			};

			const handleLoadAbort = (event: any) => {
				console.error("WebView 加载中止:", event);
				message.error("PDF 加载失败");
			};

			const handleNewWindow = (event: any) => {
				console.log("WebView 尝试打开新窗口:", event.url);
			};

			webview.addEventListener("did-start-loading", handleLoadStart);
			webview.addEventListener("did-stop-loading", handleLoadStop);
			webview.addEventListener("did-fail-load", handleLoadAbort);
			webview.addEventListener("new-window", handleNewWindow);

			return () => {
				webview.removeEventListener("did-start-loading", handleLoadStart);
				webview.removeEventListener("did-stop-loading", handleLoadStop);
				webview.removeEventListener("did-fail-load", handleLoadAbort);
				webview.removeEventListener("new-window", handleNewWindow);
			};
		}
	}, [open, pdfUrl]);

	const handleDownload = () => {
		if (webviewRef.current) {
			webviewRef.current.downloadURL(pdfUrl);
			message.success("开始下载");
		}
	};

	const handleReload = () => {
		if (webviewRef.current) {
			webviewRef.current.reload();
		}
	};

	const handleOpenInBrowser = () => {
		window.electronAPI?.openExternal?.(pdfUrl);
	};

	return (
		<Modal open={open} onCancel={onClose} title={title} width="90vw" style={{ top: 20 }} footer={null} closeIcon={<CloseOutlined />}>
			<div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
				{/* 工具栏 */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: "12px 0",
						borderBottom: "1px solid #f0f0f0",
						marginBottom: 12,
					}}
				>
					<div style={{ fontSize: 12, color: "#666" }}>URL: {pdfUrl}</div>

					<Space>
						<Button icon={<ReloadOutlined />} onClick={handleReload}>
							刷新
						</Button>
						<Button icon={<DownloadOutlined />} onClick={handleDownload} type="primary">
							下载
						</Button>
						{typeof window.electronAPI?.openExternal === "function" && <Button onClick={handleOpenInBrowser}>在浏览器中打开</Button>}
					</Space>
				</div>

				{/* WebView 容器 */}
				<div
					style={{
						flex: 1,
						overflow: "hidden",
						backgroundColor: "#f5f5f5",
						position: "relative",
					}}
				>
					<webview
						ref={webviewRef}
						style={{
							width: "100%",
							height: "100%",
							border: "none",
						}}
						allowpopups={true as any}
						plugins={true as any}
					/>
				</div>
			</div>
		</Modal>
	);
}
