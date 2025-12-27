/**
 * 依赖: window.electron(IPC分类接口), Ant Design(UI组件)
 * 输出: ClassificationRuleEditor 组件 - 分类规则编辑器，提供分类规则的CRUD管理界面
 * 职责: 渲染进程UI组件，负责公告分类规则的可视化编辑和管理
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/components/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useState, useEffect } from "react";
import { Collapse, Tag, Input, Button, Space, Switch, Popconfirm, message, Spin, Typography, Tooltip } from "antd";
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, SaveOutlined, ReloadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { ClassificationCategory, ClassificationRuleItem } from "../electron";

const { Panel } = Collapse;
const { Text } = Typography;

interface CategoryWithRules extends ClassificationCategory {
	rules: ClassificationRuleItem[];
}

interface ClassificationRuleEditorProps {
	onSave?: () => void;
}

export function ClassificationRuleEditor({}: ClassificationRuleEditorProps) {
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [categories, setCategories] = useState<CategoryWithRules[]>([]);
	const [newKeywords, setNewKeywords] = useState<Record<string, string>>({});
	const [reprocessing, setReprocessing] = useState(false);
	const [reprocessProgress, setReprocessProgress] = useState({ processed: 0, total: 0, percentage: "0" });

	useEffect(() => {
		loadRules();

		// 监听重新打标进度
		const unsubscribe = window.electronAPI.onReprocessProgress((data) => {
			setReprocessProgress(data);
		});

		return () => unsubscribe();
	}, []);

	const loadRules = async () => {
		setLoading(true);
		try {
			const [categoriesResult, rulesResult] = await Promise.all([
				window.electronAPI.getClassificationCategories(),
				window.electronAPI.getClassificationRules(),
			]);

			if (categoriesResult.success && rulesResult.success) {
				// 将规则按分类组织
				const categoriesWithRules: CategoryWithRules[] = categoriesResult.categories.map((cat) => ({
					...cat,
					rules: rulesResult.rules.filter((rule) => rule.category_key === cat.category_key),
				}));

				// 按优先级排序
				categoriesWithRules.sort((a, b) => a.priority - b.priority);

				setCategories(categoriesWithRules);
			} else {
				message.error("加载规则失败");
			}
		} catch (error: any) {
			message.error(`加载规则失败: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleAddKeyword = async (categoryKey: string) => {
		const keyword = newKeywords[categoryKey]?.trim();
		if (!keyword) {
			message.warning("请输入关键词");
			return;
		}

		try {
			const result = await window.electronAPI.addClassificationRule(categoryKey, keyword);
			if (result.success) {
				message.success("关键词添加成功");
				setNewKeywords({ ...newKeywords, [categoryKey]: "" });
				loadRules();
			} else {
				message.error(`添加失败: ${result.error}`);
			}
		} catch (error: any) {
			message.error(`添加失败: ${error.message}`);
		}
	};

	const handleDeleteKeyword = async (ruleId: number) => {
		try {
			const result = await window.electronAPI.deleteClassificationRule(ruleId);
			if (result.success) {
				message.success("关键词删除成功");
				loadRules();
			} else {
				message.error(`删除失败: ${result.error}`);
			}
		} catch (error: any) {
			message.error(`删除失败: ${error.message}`);
		}
	};

	const handleToggleCategory = async (categoryId: number, enabled: boolean) => {
		try {
			const result = await window.electronAPI.updateClassificationCategory(categoryId, { enabled });
			if (result.success) {
				message.success(enabled ? "分类已启用" : "分类已禁用");
				loadRules();
			} else {
				message.error(`更新失败: ${result.error}`);
			}
		} catch (error: any) {
			message.error(`更新失败: ${error.message}`);
		}
	};

	const handleUpdatePriority = async (categoryId: number, newPriority: number) => {
		try {
			const result = await window.electronAPI.updateClassificationCategory(categoryId, { priority: newPriority });
			if (result.success) {
				message.success("优先级更新成功");
				loadRules();
			} else {
				message.error(`更新失败: ${result.error}`);
			}
		} catch (error: any) {
			message.error(`更新失败: ${error.message}`);
		}
	};

	const handleMovePriority = async (category: CategoryWithRules, direction: "up" | "down") => {
		const currentIndex = categories.findIndex((c) => c.id === category.id);
		if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === categories.length - 1)) {
			return;
		}

		const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
		const targetCategory = categories[targetIndex];

		// 交换优先级
		await Promise.all([handleUpdatePriority(category.id, targetCategory.priority), handleUpdatePriority(targetCategory.id, category.priority)]);
	};

	const handleResetToDefault = async () => {
		setSaving(true);
		try {
			const result = await window.electronAPI.resetClassificationRules();
			if (result.success) {
				message.success("已重置为默认规则");
				loadRules();
			} else {
				message.error(`重置失败: ${result.error}`);
			}
		} catch (error: any) {
			message.error(`重置失败: ${error.message}`);
		} finally {
			setSaving(false);
		}
	};

	const handleReprocessAll = async () => {
		setReprocessing(true);
		setReprocessProgress({ processed: 0, total: 0, percentage: "0" });

		try {
			const result = await window.electronAPI.reprocessAllAnnouncements(1000);
			if (result.success) {
				message.success(`重新打标完成！共处理 ${result.processed} 条公告`);
			} else {
				message.error(`重新打标失败: ${result.error}`);
			}
		} catch (error: any) {
			message.error(`重新打标失败: ${error.message}`);
		} finally {
			setReprocessing(false);
		}
	};

	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: "50px 0" }}>
				<Spin size="large" tip="加载规则中..." />
			</div>
		);
	}

	return (
		<div>
			<Space orientation="vertical" size="large" style={{ width: "100%" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Text type="secondary">
						共 {categories.length} 个分类，{categories.reduce((sum, cat) => sum + cat.rules.length, 0)} 条规则
					</Text>
					<Space>
						<Button icon={<ReloadOutlined />} onClick={loadRules}>
							刷新
						</Button>
						<Popconfirm
							title="确定要重置为默认规则吗？"
							description="这将删除所有自定义规则，恢复到系统默认配置。"
							onConfirm={handleResetToDefault}
							okText="确定"
							cancelText="取消"
						>
							<Button icon={<SaveOutlined />} loading={saving}>
								重置为默认
							</Button>
						</Popconfirm>
						<Popconfirm
							title="确定要重新打标所有公告吗？"
							description="这将使用当前规则重新处理数据库中的所有公告，可能需要较长时间。"
							onConfirm={handleReprocessAll}
							okText="确定"
							cancelText="取消"
						>
							<Button type="primary" icon={<ThunderboltOutlined />} loading={reprocessing}>
								重新打标所有公告
							</Button>
						</Popconfirm>
					</Space>
				</div>

				{reprocessing && (
					<div style={{ padding: "12px", background: "#f0f2f5", borderRadius: "4px" }}>
						<Text>
							重新打标进度: {reprocessProgress.processed} / {reprocessProgress.total} ({reprocessProgress.percentage}%)
						</Text>
					</div>
				)}

				<Collapse defaultActiveKey={categories.length > 0 ? [categories[0].category_key] : []}>
					{categories.map((category, index) => (
						<Panel
							key={category.category_key}
							header={
								<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
									<Space>
										<Text strong style={{ color: category.enabled ? undefined : "#999" }}>
											{category.icon} {category.category_name}
										</Text>
										<Tag color={category.color}>{category.rules.length} 个关键词</Tag>
										<Text type="secondary" style={{ fontSize: "12px" }}>
											优先级: {category.priority}
										</Text>
									</Space>
									<Space onClick={(e) => e.stopPropagation()}>
										<Tooltip title="上移优先级">
											<Button
												type="text"
												size="small"
												icon={<ArrowUpOutlined />}
												disabled={index === 0}
												onClick={() => handleMovePriority(category, "up")}
											/>
										</Tooltip>
										<Tooltip title="下移优先级">
											<Button
												type="text"
												size="small"
												icon={<ArrowDownOutlined />}
												disabled={index === categories.length - 1}
												onClick={() => handleMovePriority(category, "down")}
											/>
										</Tooltip>
										<Switch
											checked={category.enabled}
											onChange={(checked) => handleToggleCategory(category.id, checked)}
											checkedChildren="启用"
											unCheckedChildren="禁用"
										/>
									</Space>
								</div>
							}
						>
							<Space orientation="vertical" size="middle" style={{ width: "100%" }}>
								<div>
									<Text type="secondary">关键词列表：</Text>
									<div style={{ marginTop: 8 }}>
										<Space size={[8, 8]} wrap>
											{category.rules.map((rule) => (
												<Tag
													key={rule.id}
													closable
													onClose={() => handleDeleteKeyword(rule.id)}
													color={rule.enabled ? "blue" : "default"}
												>
													{rule.keyword}
												</Tag>
											))}
										</Space>
									</div>
								</div>

								<div>
									<Text type="secondary">添加新关键词：</Text>
									<div style={{ marginTop: 8 }}>
										<Space.Compact style={{ width: "100%" }}>
											<Input
												placeholder="输入关键词"
												value={newKeywords[category.category_key] || ""}
												onChange={(e) => setNewKeywords({ ...newKeywords, [category.category_key]: e.target.value })}
												onPressEnter={() => handleAddKeyword(category.category_key)}
											/>
											<Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddKeyword(category.category_key)}>
												添加
											</Button>
										</Space.Compact>
									</div>
								</div>
							</Space>
						</Panel>
					))}
				</Collapse>
			</Space>
		</div>
	);
}
