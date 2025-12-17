/**
 * 分类仓储实现
 * 负责公告分类数据访问
 */

import Database from "better-sqlite3";
import { IClassificationRepository } from "../interfaces/IClassificationRepository.js";
import { BaseRepository } from "../base/BaseRepository.js";
import {
	getCategoryColor,
	getCategoryIcon,
	DEFAULT_CLASSIFICATION_RULES,
	AnnouncementCategory,
} from "../../utils/announcementClassifier.js";

/**
 * 分类仓储实现类
 */
export class ClassificationRepository extends BaseRepository implements IClassificationRepository {
	constructor(db: Database.Database) {
		super(db);
	}

	/**
	 * 获取所有分类
	 */
	getClassificationCategories(): Array<{
		id: number;
		category_key: string;
		category_name: string;
		color: string;
		icon: string;
		priority: number;
		enabled: boolean;
		created_at: string;
		updated_at: string;
	}> {
		return this.db
			.prepare(
				`
			SELECT * FROM classification_categories 
			ORDER BY priority ASC
		`
			)
			.all() as any[];
	}

	/**
	 * 获取所有规则
	 */
	getClassificationRules(): Array<{
		id: number;
		category_key: string;
		keyword: string;
		enabled: boolean;
		created_at: string;
		updated_at: string;
	}> {
		return this.db
			.prepare(
				`
			SELECT * FROM classification_rules 
			ORDER BY category_key, id
		`
			)
			.all() as any[];
	}

	/**
	 * 获取指定分类的规则
	 */
	getClassificationRulesByCategory(categoryKey: string): Array<{
		id: number;
		category_key: string;
		keyword: string;
		enabled: boolean;
	}> {
		return this.db
			.prepare(
				`
			SELECT id, category_key, keyword, enabled 
			FROM classification_rules 
			WHERE category_key = ?
			ORDER BY id
		`
			)
			.all(categoryKey) as any[];
	}

	/**
	 * 更新分类信息
	 */
	updateClassificationCategory(
		id: number,
		updates: {
			category_name?: string;
			color?: string;
			icon?: string;
			priority?: number;
			enabled?: boolean;
		}
	): number {
		const now = this.getCurrentTimestamp();
		const fields: string[] = [];
		const values: any[] = [];

		if (updates.category_name !== undefined) {
			fields.push("category_name = ?");
			values.push(updates.category_name);
		}
		if (updates.color !== undefined) {
			fields.push("color = ?");
			values.push(updates.color);
		}
		if (updates.icon !== undefined) {
			fields.push("icon = ?");
			values.push(updates.icon);
		}
		if (updates.priority !== undefined) {
			fields.push("priority = ?");
			values.push(updates.priority);
		}
		if (updates.enabled !== undefined) {
			fields.push("enabled = ?");
			values.push(updates.enabled ? 1 : 0);
		}

		fields.push("updated_at = ?");
		values.push(now);
		values.push(id);

		const sql = `UPDATE classification_categories SET ${fields.join(", ")} WHERE id = ?`;
		const result = this.db.prepare(sql).run(...values);
		return result.changes;
	}

	/**
	 * 添加分类规则
	 */
	addClassificationRule(categoryKey: string, keyword: string): number | bigint {
		const now = this.getCurrentTimestamp();
		const result = this.db
			.prepare(`
			INSERT INTO classification_rules (category_key, keyword, enabled, created_at, updated_at)
			VALUES (?, ?, 1, ?, ?)
		`)
			.run(categoryKey, keyword, now, now);
		return result.lastInsertRowid;
	}

	/**
	 * 更新分类规则
	 */
	updateClassificationRule(id: number, keyword: string, enabled: boolean): number {
		const now = this.getCurrentTimestamp();
		const result = this.db
			.prepare(`
			UPDATE classification_rules 
			SET keyword = ?, enabled = ?, updated_at = ?
			WHERE id = ?
		`)
			.run(keyword, enabled ? 1 : 0, now, id);
		return result.changes;
	}

	/**
	 * 删除分类规则
	 */
	deleteClassificationRule(id: number): number {
		const result = this.db.prepare("DELETE FROM classification_rules WHERE id = ?").run(id);
		return result.changes;
	}

	/**
	 * 重置为默认规则
	 */
	resetClassificationRules(): { success: boolean; error?: string } {
		try {
			this.transaction(() => {
				// 清空现有规则
				this.db.prepare("DELETE FROM classification_rules").run();
				this.db.prepare("DELETE FROM classification_categories").run();

				// 重新初始化
				const now = this.getCurrentTimestamp();
				const insertCategory = this.db.prepare(`
					INSERT INTO classification_categories (category_key, category_name, color, icon, priority, enabled, created_at, updated_at)
					VALUES (?, ?, ?, ?, ?, 1, ?, ?)
				`);
				const insertRule = this.db.prepare(`
					INSERT INTO classification_rules (category_key, keyword, enabled, created_at, updated_at)
					VALUES (?, ?, 1, ?, ?)
				`);

				for (const rule of DEFAULT_CLASSIFICATION_RULES) {
					const categoryKey = rule.category;
					const categoryName = rule.category;
					const color = getCategoryColor(rule.category as AnnouncementCategory);
					const icon = getCategoryIcon(rule.category as AnnouncementCategory);
					const priority = rule.priority;

					insertCategory.run(categoryKey, categoryName, color, icon, priority, now, now);

					for (const keyword of rule.keywords) {
						insertRule.run(categoryKey, keyword, now, now);
					}
				}
			});

			console.log("[DB] 分类规则已重置为默认");
			return { success: true };
		} catch (error) {
			console.error("[DB Error] 重置分类规则失败:", error);
			return { success: false, error: String(error) };
		}
	}

	/**
	 * 从数据库加载规则并转换为分类引擎可用的格式
	 */
	loadClassificationRulesFromDb(): Array<{
		category: string;
		keywords: string[];
		priority: number;
	}> {
		const categories = this.getClassificationCategories().filter((c) => c.enabled);
		const rules = this.getClassificationRules().filter((r) => r.enabled);

		// 按分类组织关键词
		const rulesByCategory = new Map<string, string[]>();
		for (const rule of rules) {
			if (!rulesByCategory.has(rule.category_key)) {
				rulesByCategory.set(rule.category_key, []);
			}
			rulesByCategory.get(rule.category_key)!.push(rule.keyword);
		}

		// 构建规则数组
		return categories.map((cat) => ({
			category: cat.category_key,
			keywords: rulesByCategory.get(cat.category_key) || [],
			priority: cat.priority,
		}));
	}
}

