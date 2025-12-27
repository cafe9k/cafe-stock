/**
 * 依赖: 无（接口定义）
 * 输出: IHolderRepository 接口 - 定义股东数据访问操作的契约
 * 职责: 股东Repository接口，规范股东数据访问层的标准操作
 *
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/repositories/README.md
 */

import { Top10Holder } from "../../types/index.js";
import { IRepository } from "./IRepository.js";

/**
 * 股东仓储接口
 */
export interface IHolderRepository extends IRepository<Top10Holder> {
	/**
	 * 批量插入或更新十大股东数据
	 */
	upsertTop10Holders(holders: any[]): void;

	/**
	 * 获取指定股票的十大股东数据
	 */
	getTop10HoldersByStock(tsCode: string, limit?: number): any[];

	/**
	 * 获取股票的所有报告期列表
	 */
	getTop10HoldersEndDates(tsCode: string): string[];

	/**
	 * 根据报告期获取十大股东
	 */
	getTop10HoldersByStockAndEndDate(tsCode: string, endDate: string): any[];

	/**
	 * 检查股票是否已有十大股东数据
	 */
	hasTop10HoldersData(tsCode: string): boolean;

	/**
	 * 获取所有已同步十大股东的股票代码列表
	 */
	getStocksWithTop10Holders(): string[];

	/**
	 * 统计已同步十大股东的股票数量
	 */
	countStocksWithTop10Holders(): number;

	/**
	 * 根据股东名称搜索股东持股信息
	 */
	searchHoldersByName(holderName: string, limit?: number): any[];

	/**
	 * 获取股东持有的所有股票
	 */
	getStocksByHolder(holderName: string): any[];

	/**
	 * 删除指定股票的十大股东数据（用于重新同步）
	 */
	deleteTop10HoldersByStock(tsCode: string): number;
}
