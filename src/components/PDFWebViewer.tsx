/**
 * 依赖: Electron webview API, Ant Design(UI组件), window.electron(IPC获取PDF)
 * 输出: PDFWebViewer 组件 - WebView版PDF查看器，使用Electron原生webview展示PDF
 * 职责: 渲染进程UI组件，提供基于webview的PDF查看方案（备选方案）
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/components/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

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
			let loadStartTime: number;

			const handleLoadStart = () => {
				loadStartTime = Date.now();
				console.log(`[PDF WebView] 开始加载: ${pdfUrl}`);
			};

			const handleLoadStop = () => {
				const duration = Date.now() - (loadStartTime || 0);
				console.log(`[PDF WebView] 加载完成, 耗时: ${duration}ms`);
			};

			const handleLoadAbort = (event: any) => {
				const duration = Date.now() - (loadStartTime || 0);
				console.error(`[PDF WebView Error] 加载失败, 耗时: ${duration}ms`);
				console.error(`[PDF WebView Error] 错误详情:`, event);
				console.error(`[PDF WebView Error] URL: ${pdfUrl}`);
				message.error("PDF 加载失败");
			};

			const handleNewWindow = (event: any) => {
				console.log(`[PDF WebView] 尝试打开新窗口: ${event.url}`);
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
			console.log(`[PDF WebView] 开始下载: ${pdfUrl}`);
			webviewRef.current.downloadURL(pdfUrl);
			message.success("开始下载");
		}
	};

	const handleReload = () => {
		if (webviewRef.current) {
			console.log(`[PDF WebView] 刷新页面: ${pdfUrl}`);
			webviewRef.current.reload();
		}
	};

	const handleOpenInBrowser = () => {
		console.log(`[PDF WebView] 在浏览器中打开: ${pdfUrl}`);
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
