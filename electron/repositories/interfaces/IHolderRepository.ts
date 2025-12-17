/**
 * 股东仓储接口
 * 定义十大股东数据访问操作
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

