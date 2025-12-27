/**
 * 依赖: react-pdf(PDF库), Ant Design(UI组件), window.electron(IPC获取PDF)
 * 输出: PDFViewer 组件 - PDF查看器组件，提供PDF文件的预览和下载功能
 * 职责: 渲染进程UI组件，负责公告PDF文件的展示和交互
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/components/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useState, useEffect } from "react";
import { Modal, Button, Space, message, Spin } from "antd";
import { DownloadOutlined, ZoomInOutlined, ZoomOutOutlined, CloseOutlined } from "@ant-design/icons";
// @ts-ignore
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// 配置 PDF.js worker - 使用完整的 https URL
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
	open: boolean;
	onClose: () => void;
	pdfUrl: string;
	title?: string;
}

export function PDFViewer({ open, onClose, pdfUrl, title = "PDF 预览" }: PDFViewerProps) {
	const [numPages, setNumPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [scale, setScale] = useState(1.0);
	const [loading, setLoading] = useState(true);

	// 重置状态当 URL 改变时
	useEffect(() => {
		if (open && pdfUrl) {
			console.log(`[PDF Viewer] 开始加载 PDF: ${pdfUrl}`);
			setLoading(true);
			setPageNumber(1);
			setScale(1.0);
		}
	}, [open, pdfUrl]);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		console.log(`[PDF Viewer] PDF 加载成功, 总页数: ${numPages}`);
		setNumPages(numPages);
		setLoading(false);
		setPageNumber(1);
	};

	const onDocumentLoadError = (error: Error) => {
		console.error("[PDF Viewer Error] PDF 加载失败:", error);
		console.error("[PDF Viewer Error] URL:", pdfUrl);
		message.error("PDF 加载失败，请稍后重试");
		setLoading(false);
	};

	const handleZoomIn = () => {
		setScale((prev) => Math.min(prev + 0.2, 3.0));
	};

	const handleZoomOut = () => {
		setScale((prev) => Math.max(prev - 0.2, 0.5));
	};

	const handleDownload = async () => {
		try {
			// 记录下载开始
			const startTime = Date.now();
			console.log(`[PDF Download] 开始下载 PDF: ${pdfUrl}`);
			console.log(`[PDF Download] 文件名: ${title}`);

			const response = await fetch(pdfUrl);

			// 记录响应状态
			console.log(`[PDF Download] HTTP状态: ${response.status}, 内容类型: ${response.headers.get("content-type")}`);
			console.log(`[PDF Download] 响应耗时: ${Date.now() - startTime}ms`);

			const blob = await response.blob();
			console.log(`[PDF Download] Blob大小: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);

			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = title.replace(/[\/\\:*?"<>|]/g, "_") + ".pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			// 记录下载完成
			console.log(`[PDF Download] 下载完成, 总耗时: ${Date.now() - startTime}ms`);
			message.success("下载成功");
		} catch (error) {
			console.error("[PDF Download Error] 下载失败:", error);
			console.error("[PDF Download Error] URL:", pdfUrl);
			message.error("下载失败，请稍后重试");
		}
	};

	const handlePrevPage = () => {
		setPageNumber((prev) => Math.max(prev - 1, 1));
	};

	const handleNextPage = () => {
		setPageNumber((prev) => Math.min(prev + 1, numPages));
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
					<Space>
						<Button onClick={handlePrevPage} disabled={pageNumber <= 1 || loading}>
							上一页
						</Button>
						<span style={{ margin: "0 8px" }}>
							{pageNumber} / {numPages || "..."}
						</span>
						<Button onClick={handleNextPage} disabled={pageNumber >= numPages || loading}>
							下一页
						</Button>
					</Space>

					<Space>
						<Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} disabled={scale <= 0.5 || loading}>
							缩小
						</Button>
						<span style={{ margin: "0 8px" }}>{Math.round(scale * 100)}%</span>
						<Button icon={<ZoomInOutlined />} onClick={handleZoomIn} disabled={scale >= 3.0 || loading}>
							放大
						</Button>
						<Button icon={<DownloadOutlined />} onClick={handleDownload} type="primary">
							下载
						</Button>
					</Space>
				</div>

				{/* PDF 内容区域 */}
				<div
					style={{
						flex: 1,
						overflow: "auto",
						display: "flex",
						justifyContent: "center",
						alignItems: "flex-start",
						backgroundColor: "#f5f5f5",
						padding: 16,
					}}
				>
					{loading && (
						<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
							<Spin size="large" tip="加载中..." />
						</div>
					)}
					{pdfUrl && (
						<Document
							file={pdfUrl}
							onLoadSuccess={onDocumentLoadSuccess}
							onLoadError={onDocumentLoadError}
							loading=""
							options={{
								cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
								cMapPacked: true,
								standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
							}}
						>
							<Page pageNumber={pageNumber} scale={scale} loading="" renderTextLayer={true} renderAnnotationLayer={true} />
						</Document>
					)}
				</div>
			</div>
		</Modal>
	);
}
