/**
 * 依赖: 无（接口定义）
 * 输出: IStockService 接口规范 - 定义股票服务的契约
 * 职责: 服务层接口定义，规范股票服务的对外API
 *
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/services/README.md
 */

import { SyncResult } from "../../types/index.js";

export interface IStockService {
	/**
	 * 同步股票列表（首次启动或数据为空时）
	 */
	syncStocksIfNeeded(): Promise<void>;

	/**
	 * 重新同步全部股票列表数据
	 */
	syncAllStocks(
		onProgress?: (progress: {
			status: "started" | "syncing" | "completed" | "failed";
			message?: string;
			stockCount?: number;
			error?: string;
		}) => void
	): Promise<SyncResult>;
}
