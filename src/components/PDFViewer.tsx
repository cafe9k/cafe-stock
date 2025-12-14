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
			setLoading(true);
			setPageNumber(1);
			setScale(1.0);
		}
	}, [open, pdfUrl]);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
		setLoading(false);
		setPageNumber(1);
	};

	const onDocumentLoadError = (error: Error) => {
		console.error("PDF 加载失败:", error);
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
			const response = await fetch(pdfUrl);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = title.replace(/[\/\\:*?"<>|]/g, "_") + ".pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			message.success("下载成功");
		} catch (error) {
			console.error("下载失败:", error);
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
