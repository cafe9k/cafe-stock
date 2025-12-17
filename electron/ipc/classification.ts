/**
 * 公告分类相关 IPC 处理器
 */

import { ipcMain } from "electron";
import { getDb } from "../db.js";
import { ClassificationRepository } from "../repositories/implementations/ClassificationRepository.js";

// 创建仓储实例
const classificationRepository = new ClassificationRepository(getDb());

/**
 * 注册公告分类相关 IPC 处理器
 */
export function registerClassificationHandlers(): void {
	// 获取所有分类
	ipcMain.handle("get-classification-categories", async () => {
		try {
			const categories = classificationRepository.getClassificationCategories();
			return { success: true, categories };
		} catch (error: any) {
			console.error("Failed to get classification categories:", error);
			return { success: false, categories: [], error: error.message };
		}
	});

	// 获取所有规则
	ipcMain.handle("get-classification-rules", async () => {
		try {
			const rules = classificationRepository.getClassificationRules();
			return { success: true, rules };
		} catch (error: any) {
			console.error("Failed to get classification rules:", error);
			return { success: false, rules: [], error: error.message };
		}
	});

	// 获取指定分类的规则
	ipcMain.handle("get-classification-rules-by-category", async (_event, categoryKey: string) => {
		try {
			const rules = classificationRepository.getClassificationRulesByCategory(categoryKey);
			return { success: true, rules };
		} catch (error: any) {
			console.error("Failed to get classification rules by category:", error);
			return { success: false, rules: [], error: error.message };
		}
	});

	// 更新分类信息
	ipcMain.handle("update-classification-category", async (_event, id: number, updates: any) => {
		try {
			const changes = classificationRepository.updateClassificationCategory(id, updates);
			return { success: true, changes };
		} catch (error: any) {
			console.error("Failed to update classification category:", error);
			return { success: false, changes: 0, error: error.message };
		}
	});

	// 添加分类规则
	ipcMain.handle("add-classification-rule", async (_event, categoryKey: string, keyword: string) => {
		try {
			const id = classificationRepository.addClassificationRule(categoryKey, keyword);
			return { success: true, id: Number(id) };
		} catch (error: any) {
			console.error("Failed to add classification rule:", error);
			return { success: false, id: 0, error: error.message };
		}
	});

	// 更新分类规则
	ipcMain.handle("update-classification-rule", async (_event, id: number, keyword: string, enabled: boolean) => {
		try {
			const changes = classificationRepository.updateClassificationRule(id, keyword, enabled);
			return { success: true, changes };
		} catch (error: any) {
			console.error("Failed to update classification rule:", error);
			return { success: false, changes: 0, error: error.message };
		}
	});

	// 删除分类规则
	ipcMain.handle("delete-classification-rule", async (_event, id: number) => {
		try {
			const changes = classificationRepository.deleteClassificationRule(id);
			return { success: true, changes };
		} catch (error: any) {
			console.error("Failed to delete classification rule:", error);
			return { success: false, changes: 0, error: error.message };
		}
	});

	// 重置为默认规则
	ipcMain.handle("reset-classification-rules", async () => {
		try {
			const result = classificationRepository.resetClassificationRules();
			return result;
		} catch (error: any) {
			console.error("Failed to reset classification rules:", error);
			return { success: false, error: error.message };
		}
	});
}

