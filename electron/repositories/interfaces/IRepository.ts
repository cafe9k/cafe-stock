/**
 * 基础仓储接口
 * 定义所有仓储的通用操作
 */

/**
 * 基础仓储接口
 * @template T 实体类型
 */
export interface IRepository<T> {
	/**
	 * 根据ID查找实体
	 */
	findById?(id: number | string): T | null;

	/**
	 * 查找所有实体
	 */
	findAll?(): T[];

	/**
	 * 插入实体
	 */
	insert?(entity: T): number | string;

	/**
	 * 批量插入实体
	 */
	insertMany?(entities: T[]): void;

	/**
	 * 更新实体
	 */
	update?(entity: T): boolean;

	/**
	 * 删除实体
	 */
	delete?(id: number | string): boolean;

	/**
	 * 统计数量
	 */
	count?(): number;
}

