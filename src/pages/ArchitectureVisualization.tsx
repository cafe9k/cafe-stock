/**
 * 依赖: cytoscape(图形库), cytoscapeData(生成的数据), Ant Design(UI组件)
 * 输出: ArchitectureVisualization 页面组件 - 架构可视化页面
 * 职责: 使用Cytoscape.js可视化项目的文件和文件夹依赖关系
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/pages/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useEffect, useRef, useState } from "react";
import cytoscape, { Core, NodeSingular } from "cytoscape";
import { Card, Input, Descriptions, Drawer, Space, Button, Select, Typography, Tag } from "antd";
import { SearchOutlined, ZoomInOutlined, ZoomOutOutlined, FullscreenOutlined } from "@ant-design/icons";
import cytoscapeData from "../assets/cytoscape-data.json";

const { Title, Text } = Typography;
const { Option } = Select;

export default function ArchitectureVisualization() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cyRef = useRef<Core | null>(null);
	const [selectedNode, setSelectedNode] = useState<any>(null);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [layoutType, setLayoutType] = useState("breadthfirst");

	useEffect(() => {
		if (!containerRef.current) return;

		try {
			// 验证数据
			if (!cytoscapeData || !cytoscapeData.nodes || !cytoscapeData.edges) {
				console.error("Invalid cytoscape data");
				return;
			}

			// 初始化 Cytoscape
			const cy = cytoscape({
				container: containerRef.current,
				elements: cytoscapeData,
				style: [
				{
					selector: "node",
					style: {
						label: "data(label)",
						"text-valign": "center",
						"text-halign": "center",
						"font-size": "14px",
						color: "#374151",
						"text-wrap": "wrap",
						"text-max-width": "140px",
						"border-width": 2,
						"border-color": "#d1d5db",
						"background-color": "#ffffff",
					},
				},
			{
				selector: 'node[type="root"]',
				style: {
					"background-color": "#fef3c7",
					shape: "roundrectangle",
					width: 180,
					height: 60,
					"font-size": "16px",
					"font-weight": "bold",
					"border-color": "#f59e0b",
					"border-width": 3,
					"text-max-width": "160px",
					color: "#92400e",
				},
			},
			{
				selector: 'node[type="directory"]',
				style: {
					"background-color": "#d1fae5",
					shape: "roundrectangle",
					width: 140,
					height: 50,
					"font-size": "13px",
					"border-color": "#10b981",
					"text-max-width": "130px",
					color: "#065f46",
				},
			},
			{
				selector: 'node[type="file"]',
				style: {
					"background-color": "#dbeafe",
					shape: "roundrectangle",
					width: 120,
					height: 40,
					"font-size": "12px",
					"border-color": "#3b82f6",
					"text-max-width": "110px",
					color: "#1e40af",
				},
			},
				{
					selector: "edge",
					style: {
						width: 1,
						"line-color": "#d1d5db",
						"target-arrow-color": "#d1d5db",
						"target-arrow-shape": "triangle",
						"curve-style": "bezier",
						opacity: 0.5,
					},
				},
				{
					selector: "node:selected",
					style: {
						"border-width": 4,
						"border-color": "#ef4444",
					},
				},
				{
					selector: ".highlighted",
					style: {
						"background-color": "#fef3c7",
						"line-color": "#f59e0b",
						"target-arrow-color": "#f59e0b",
						"border-color": "#f59e0b",
						"border-width": 3,
						opacity: 1,
					},
				},
			],
			layout: {
				name: "grid",
				padding: 60,
			},
		});

		// 保存引用
		cyRef.current = cy;

		// 节点点击事件
		cy.on("tap", "node", (evt) => {
			const node = evt.target;
			setSelectedNode(node.data());
			setDrawerVisible(true);
		});

		// 清理
		return () => {
			if (cy && !cy.destroyed()) {
				cy.destroy();
			}
		};
		} catch (error) {
			console.error("Error initializing Cytoscape:", error);
		}
	}, []);

	// 当布局类型改变时应用布局
	useEffect(() => {
		if (cyRef.current && !cyRef.current.destroyed()) {
			// 延迟执行，确保状态更新完成
			const timer = setTimeout(() => {
				if (cyRef.current && !cyRef.current.destroyed()) {
					applyLayout(cyRef.current, layoutType);
				}
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [layoutType]);

	// 应用布局
	const applyLayout = (cy: Core, type: string) => {
		// 检查 Cytoscape 实例是否有效
		if (!cy || cy.destroyed()) {
			console.warn("Cytoscape instance is not ready or destroyed");
			return;
		}

		try {
			let layoutOptions: any = {
				name: type,
				padding: 60,
				animate: true,
				animationDuration: 500,
				fit: true,
			};

			// 简化布局选项，避免复杂配置
			if (type === "breadthfirst") {
				layoutOptions.directed = true;
				layoutOptions.spacingFactor = 1.5;
			} else if (type === "cose") {
				layoutOptions.nodeRepulsion = 6000;
				layoutOptions.idealEdgeLength = 80;
			} else if (type === "concentric") {
				layoutOptions.spacingFactor = 1.5;
			}

			const layout = cy.layout(layoutOptions);
			layout.run();
		} catch (error) {
			console.error("Error applying layout:", error);
			// 如果出错，回退到简单的网格布局
			try {
				if (cy && !cy.destroyed()) {
					const fallbackLayout = cy.layout({ name: "grid", padding: 60, fit: true });
					fallbackLayout.run();
				}
			} catch (fallbackError) {
				console.error("Fallback layout also failed:", fallbackError);
			}
		}
	};

	// 搜索功能
	const handleSearch = (value: string) => {
		setSearchText(value);
		if (!cyRef.current) return;

		// 清除高亮
		cyRef.current.elements().removeClass("highlighted");

		if (value.trim()) {
			// 搜索匹配的节点
			const matchedNodes = cyRef.current.nodes().filter((node) => {
				const data = node.data();
				return (
					data.label?.toLowerCase().includes(value.toLowerCase()) ||
					data.dependencies?.toLowerCase().includes(value.toLowerCase()) ||
					data.outputs?.toLowerCase().includes(value.toLowerCase()) ||
					data.responsibilities?.toLowerCase().includes(value.toLowerCase())
				);
			});

			// 高亮匹配节点
			matchedNodes.addClass("highlighted");

			// 聚焦到第一个匹配节点
			if (matchedNodes.length > 0) {
				cyRef.current.animate({
					fit: {
						eles: matchedNodes.first(),
						padding: 50,
					},
					duration: 500,
				});
			}
		}
	};

	// 缩放功能
	const handleZoomIn = () => {
		if (cyRef.current) {
			cyRef.current.zoom(cyRef.current.zoom() * 1.2);
		}
	};

	const handleZoomOut = () => {
		if (cyRef.current) {
			cyRef.current.zoom(cyRef.current.zoom() * 0.8);
		}
	};

	const handleFit = () => {
		if (cyRef.current) {
			cyRef.current.fit(undefined, 50);
		}
	};

	// 切换布局
	const handleLayoutChange = (value: string) => {
		setLayoutType(value);
		if (cyRef.current && !cyRef.current.destroyed()) {
			applyLayout(cyRef.current, value);
		}
	};

	return (
		<div style={{ padding: "24px", height: "100vh", display: "flex", flexDirection: "column" }}>
			<Card
				title={
					<Space>
						<Text strong style={{ fontSize: 16 }}>项目架构可视化</Text>
						<Text type="secondary" style={{ fontSize: 12 }}>
							({cytoscapeData.nodes.length} 个节点, {cytoscapeData.edges.length} 条边)
						</Text>
					</Space>
				}
				extra={
					<Space>
						<Input
							placeholder="搜索节点..."
							prefix={<SearchOutlined />}
							style={{ width: 250 }}
							value={searchText}
							onChange={(e) => handleSearch(e.target.value)}
							allowClear
						/>
						<Select value={layoutType} onChange={handleLayoutChange} style={{ width: 150 }}>
							<Option value="breadthfirst">层级布局</Option>
							<Option value="cose">力导向布局</Option>
							<Option value="concentric">同心圆布局</Option>
							<Option value="circle">圆形布局</Option>
							<Option value="grid">网格布局</Option>
						</Select>
						<Button icon={<ZoomInOutlined />} onClick={handleZoomIn}>
							放大
						</Button>
						<Button icon={<ZoomOutOutlined />} onClick={handleZoomOut}>
							缩小
						</Button>
						<Button icon={<FullscreenOutlined />} onClick={handleFit}>
							适应
						</Button>
					</Space>
				}
				style={{ flex: 1, display: "flex", flexDirection: "column" }}
				styles={{ body: { flex: 1, padding: 0, position: "relative" } }}
			>
				{/* 图例 */}
				<div
					style={{
						position: "absolute",
						top: 16,
						left: 16,
						zIndex: 1000,
						backgroundColor: "rgba(255, 255, 255, 0.95)",
						padding: "12px 16px",
						borderRadius: 8,
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
						border: "1px solid #e5e7eb",
					}}
				>
				<Space vertical size="small">
					<Text strong style={{ fontSize: 12 }}>图例</Text>
					<Space size="small">
						<div
							style={{
								width: 16,
								height: 16,
								backgroundColor: "#fef3c7",
								border: "2px solid #f59e0b",
								borderRadius: 4,
							}}
						/>
						<Text style={{ fontSize: 11 }}>根节点</Text>
					</Space>
					<Space size="small">
						<div
							style={{
								width: 16,
								height: 16,
								backgroundColor: "#d1fae5",
								border: "2px solid #10b981",
								borderRadius: 4,
							}}
						/>
						<Text style={{ fontSize: 11 }}>目录</Text>
					</Space>
					<Space size="small">
						<div
							style={{
								width: 16,
								height: 16,
								backgroundColor: "#dbeafe",
								border: "2px solid #3b82f6",
								borderRadius: 4,
							}}
						/>
						<Text style={{ fontSize: 11 }}>文件</Text>
					</Space>
				</Space>
				</div>

				{/* 操作提示 */}
				<div
					style={{
						position: "absolute",
						bottom: 16,
						right: 16,
						zIndex: 1000,
						backgroundColor: "rgba(255, 255, 255, 0.95)",
						padding: "8px 12px",
						borderRadius: 8,
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
						border: "1px solid #e5e7eb",
					}}
				>
					<Space size="small">
						<Text type="secondary" style={{ fontSize: 11 }}>
							💡 提示: 点击节点查看详情 | 拖动画布移动 | 滚轮缩放
						</Text>
					</Space>
				</div>

				<div
					ref={containerRef}
					style={{
						width: "100%",
						height: "100%",
						backgroundColor: "#ffffff",
					}}
				/>
			</Card>

		<Drawer
			title={
				<Space vertical size={4} style={{ width: "100%" }}>
					<Text strong style={{ fontSize: 18, lineHeight: 1.4 }}>节点详情</Text>
					{selectedNode && (
						<Space size="small" wrap style={{ marginTop: 2 }}>
							<Tag
								color={
									selectedNode.type === "root"
										? "orange"
										: selectedNode.type === "directory"
											? "green"
											: "blue"
								}
								style={{ margin: 0, fontSize: 12, padding: "2px 8px", borderRadius: 4 }}
							>
								{selectedNode.type === "root"
									? "🔷 根节点"
									: selectedNode.type === "directory"
										? "📁 目录"
										: "📄 文件"}
							</Tag>
							<Tag
								color="default"
								style={{
									margin: 0,
									fontSize: 11,
									padding: "2px 8px",
									borderRadius: 4,
									fontFamily: "monospace",
									backgroundColor: "#f5f5f5",
									borderColor: "#d9d9d9",
								}}
							>
								ID: {selectedNode.id}
							</Tag>
						</Space>
					)}
				</Space>
			}
			placement="right"
			open={drawerVisible}
			onClose={() => setDrawerVisible(false)}
			closable={false}
			styles={{ 
				body: { padding: "16px" },
				wrapper: { width: "428px" },
				header: { 
					padding: "16px 24px",
					borderBottom: "1px solid #f0f0f0",
					backgroundColor: "#fafafa"
				}
			}}
		>
			{selectedNode && (
				<Space vertical size="large" style={{ width: "100%" }}>
					{/* 节点名称和路径 */}
					<Card size="small" style={{ backgroundColor: "#f9fafb" }}>
						<Space vertical size="small" style={{ width: "100%" }}>
							<div>
								<Text strong style={{ fontSize: 16, color: "#1f2937" }}>
									{selectedNode.label}
								</Text>
							</div>
							<div>
								<Text type="secondary" style={{ fontSize: 12, fontFamily: "monospace" }}>
									{selectedNode.path}
								</Text>
							</div>
						</Space>
					</Card>

					{/* 职责 */}
					{selectedNode.responsibilities && (
						<Card
							size="small"
							title={
								<Space>
									<span style={{ fontSize: 16 }}>💼</span>
									<Text strong>职责</Text>
								</Space>
							}
							styles={{ header: { backgroundColor: "#eff6ff", borderBottom: "2px solid #3b82f6" } }}
						>
							<Text style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
								{selectedNode.responsibilities}
							</Text>
						</Card>
					)}

					{/* 依赖 */}
					{selectedNode.dependencies && (
						<Card
							size="small"
							title={
								<Space>
									<span style={{ fontSize: 16 }}>🔗</span>
									<Text strong>依赖</Text>
								</Space>
							}
							styles={{ header: { backgroundColor: "#f0fdf4", borderBottom: "2px solid #10b981" } }}
						>
							<Text style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
								{selectedNode.dependencies}
							</Text>
						</Card>
					)}

					{/* 输出 */}
					{selectedNode.outputs && (
						<Card
							size="small"
							title={
								<Space>
									<span style={{ fontSize: 16 }}>📤</span>
									<Text strong>输出</Text>
								</Space>
							}
							styles={{ header: { backgroundColor: "#fef3c7", borderBottom: "2px solid #f59e0b" } }}
						>
							<Text style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
								{selectedNode.outputs}
							</Text>
						</Card>
					)}
				</Space>
			)}
		</Drawer>
		</div>
	);
}

