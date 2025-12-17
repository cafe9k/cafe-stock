/**
 * 股票仓储接口
 * 定义股票数据访问操作
 */

import { Stock } from "../../types/index.js";
import { IRepository } from "./IRepository.js";

/**
 * 股票仓储接口
 */
export interface IStockRepository extends IRepository<Stock> {
	/**
	 * 批量插入或更新股票数据
	 */
	upsertStocks(stocks: Stock[]): void;

	/**
	 * 获取所有股票列表
	 */
	getAllStocks(): Stock[];

	/**
	 * 统计股票数量
	 */
	countStocks(): number;

	/**
	 * 根据关键词搜索股票（名称、代码、拼音）
	 */
	searchStocks(keyword: string, limit?: number): Stock[];

	/**
	 * 获取股票列表同步信息
	 */
	getStockListSyncInfo(): {
		stockCount: number;
		lastSyncTime: string | null;
	};
}

