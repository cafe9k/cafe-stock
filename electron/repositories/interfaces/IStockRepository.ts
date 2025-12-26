/**
 * INPUT: 无（接口定义）
 * OUTPUT: IStockRepository 接口 - 定义股票数据访问操作的契约
 * POS: 股票Repository接口，规范股票数据访问层的标准操作
 * 
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/repositories/README.md
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

