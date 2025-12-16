/**
 * 公告分类相关 IPC 处理器
 */

import { ipcMain } from "electron";
import {
	getClassificationCategories,
	getClassificationRules,
	getClassificationRulesByCategory,
	updateClassificationCategory,
	addClassificationRule,
	updateClassificationRule,
	deleteClassificationRule,
	resetClassificationRules,
} from "../db.js";

/**
 * 注册公告分类相关 IPC 处理器
 */
export function registerClassificationHandlers(): void {
	// 获取所有分类
	ipcMain.handle("get-classification-categories", async () => {
		try {
			const categories = getClassificationCategories();
			return { success: true, categories };
		} catch (error: any) {
			console.error("Failed to get classification categories:", error);
			return { success: false, categories: [], error: error.message };
		}
	});

	// 获取所有规则
	ipcMain.handle("get-classification-rules", async () => {
		try {
			const rules = getClassificationRules();
			return { success: true, rules };
		} catch (error: any) {
			console.error("Failed to get classification rules:", error);
			return { success: false, rules: [], error: error.message };
		}
	});

	// 获取指定分类的规则
	ipcMain.handle("get-classification-rules-by-category", async (_event, categoryKey: string) => {
		try {
			const rules = getClassificationRulesByCategory(categoryKey);
			return { success: true, rules };
		} catch (error: any) {
			console.error("Failed to get classification rules by category:", error);
			return { success: false, rules: [], error: error.message };
		}
	});

	// 更新分类信息
	ipcMain.handle("update-classification-category", async (_event, id: number, updates: any) => {
		try {
			const changes = updateClassificationCategory(id, updates);
			return { success: true, changes };
		} catch (error: any) {
			console.error("Failed to update classification category:", error);
			return { success: false, changes: 0, error: error.message };
		}
	});

	// 添加分类规则
	ipcMain.handle("add-classification-rule", async (_event, categoryKey: string, keyword: string) => {
		try {
			const id = addClassificationRule(categoryKey, keyword);
			return { success: true, id: Number(id) };
		} catch (error: any) {
			console.error("Failed to add classification rule:", error);
			return { success: false, id: 0, error: error.message };
		}
	});

	// 更新分类规则
	ipcMain.handle("update-classification-rule", async (_event, id: number, keyword: string, enabled: boolean) => {
		try {
			const changes = updateClassificationRule(id, keyword, enabled);
			return { success: true, changes };
		} catch (error: any) {
			console.error("Failed to update classification rule:", error);
			return { success: false, changes: 0, error: error.message };
		}
	});

	// 删除分类规则
	ipcMain.handle("delete-classification-rule", async (_event, id: number) => {
		try {
			const changes = deleteClassificationRule(id);
			return { success: true, changes };
		} catch (error: any) {
			console.error("Failed to delete classification rule:", error);
			return { success: false, changes: 0, error: error.message };
		}
	});

	// 重置为默认规则
	ipcMain.handle("reset-classification-rules", async () => {
		try {
			const result = resetClassificationRules();
			return result;
		} catch (error: any) {
			console.error("Failed to reset classification rules:", error);
			return { success: false, error: error.message };
		}
	});
}

