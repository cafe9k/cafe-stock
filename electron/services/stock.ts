/**
 * 股票服务模块
 * 负责股票列表的同步和管理
 */

import { Notification } from "electron";
import { TushareClient } from "../tushare.js";
import { getDb } from "../db.js";
import { StockRepository } from "../repositories/implementations/StockRepository.js";
import { SyncResult } from "../types/index.js";

// 创建仓储实例
const stockRepository = new StockRepository(getDb());

/**
 * 同步股票列表（首次启动或数据为空时）
 */
export async function syncStocksIfNeeded(): Promise<void> {
	try {
		const stockCount = stockRepository.countStocks();

		if (stockCount > 0) {
			console.log(`Stock list already synced: ${stockCount} stocks`);
			return;
		}

		console.log("Stock list is empty, syncing...");

		// 获取所有上市股票
		const stocks = await TushareClient.getStockList(undefined, undefined, undefined, undefined, undefined, "L", 5000, 0);

		if (stocks && stocks.length > 0) {
			stockRepository.upsertStocks(stocks);
			console.log(`Synced ${stocks.length} stocks to database`);

			if (Notification.isSupported()) {
				new Notification({
					title: "股票列表同步完成",
					body: `已同步 ${stocks.length} 只股票`,
				}).show();
			}
		}
	} catch (error: any) {
		console.error("Failed to sync stocks:", error);
	}
}

/**
 * 重新同步全部股票列表数据
 */
export async function syncAllStocks(
	onProgress?: (progress: {
		status: "started" | "syncing" | "completed" | "failed";
		message?: string;
		stockCount?: number;
		error?: string;
	}) => void
): Promise<SyncResult> {
	try {
		console.log("Starting to sync all stocks...");

		// 发送开始事件
		onProgress?.({
			status: "started",
			message: "开始同步股票列表...",
		});

		// 获取所有上市股票
		const stocks = await TushareClient.getStockList(undefined, undefined, undefined, undefined, undefined, "L", 5000, 0);

		if (stocks && stocks.length > 0) {
			// 发送同步中事件
			onProgress?.({
				status: "syncing",
				message: `正在同步 ${stocks.length} 只股票...`,
				stockCount: stocks.length,
			});

			stockRepository.upsertStocks(stocks);
			console.log(`Synced ${stocks.length} stocks to database`);

			// 发送完成事件
			onProgress?.({
				status: "completed",
				message: `成功同步 ${stocks.length} 只股票`,
				stockCount: stocks.length,
			});

			return {
				success: true,
				stockCount: stocks.length,
				message: `成功同步 ${stocks.length} 只股票`,
			};
		} else {
			// 发送失败事件
			onProgress?.({
				status: "failed",
				message: "未获取到股票数据",
			});

			return {
				success: false,
				stockCount: 0,
				message: "未获取到股票数据",
			};
		}
	} catch (error: any) {
		console.error("Failed to sync stocks:", error);

		// 发送错误事件
		onProgress?.({
			status: "failed",
			message: error.message || "同步失败",
			error: error.message,
		});

		return {
			success: false,
			stockCount: 0,
			message: error.message || "同步失败",
		};
	}
}

/**
 * 获取所有股票列表
 */
export function getStockList(): any[] {
	return stockRepository.getAllStocks();
}

/**
 * 获取股票数量
 */
export function getStockCount(): number {
	return stockRepository.countStocks();
}

