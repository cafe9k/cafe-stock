/**
 * 依赖: 无（接口定义）
 * 输出: IClassificationRepository 接口 - 定义分类规则数据访问操作的契约
 * 职责: 分类Repository接口，规范分类规则数据访问层的标准操作
 *
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/repositories/README.md
 */

/**
 * 分类仓储接口
 */
export interface IClassificationRepository {
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
	}>;

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
	}>;

	/**
	 * 获取指定分类的规则
	 */
	getClassificationRulesByCategory(categoryKey: string): Array<{
		id: number;
		category_key: string;
		keyword: string;
		enabled: boolean;
	}>;

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
	): number;

	/**
	 * 添加分类规则
	 */
	addClassificationRule(categoryKey: string, keyword: string): number | bigint;

	/**
	 * 更新分类规则
	 */
	updateClassificationRule(id: number, keyword: string, enabled: boolean): number;

	/**
	 * 删除分类规则
	 */
	deleteClassificationRule(id: number): number;

	/**
	 * 重置为默认规则
	 */
	resetClassificationRules(): { success: boolean; error?: string };

	/**
	 * 从数据库加载规则并转换为分类引擎可用的格式
	 */
	loadClassificationRulesFromDb(): Array<{
		category: string;
		keywords: string[];
		priority: number;
	}>;
}
