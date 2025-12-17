/**
 * 股票服务接口
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

