/**
 * 依赖: TushareClient(API), StockRepository(基础), StockDetailRepository(详情), stock-detail-sync(同步引擎)
 * 输出: syncStocksIfNeeded(), syncAllStocks() - 股票数据同步接口
 * 职责: 股票数据服务核心，管理股票列表与详情的增量同步协调
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/services/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { Notification } from "electron";
import { TushareClient } from "../tushare.js";
import { getDb, syncFlagManager } from "../db.js";
import { StockRepository } from "../repositories/implementations/StockRepository.js";
import { StockDetailRepository } from "../repositories/implementations/StockDetailRepository.js";
import { SyncResult } from "../types/index.js";
import { log } from "../utils/logger.js";
import { syncStockDetailsWithResume, getStockDetailsSyncProgress } from "./stock-detail-sync.js";

// 创建仓储实例
const stockRepository = new StockRepository(getDb());
const stockDetailRepository = new StockDetailRepository(getDb());

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

			// 更新同步标志位，标记今日已同步
			const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			syncFlagManager.updateSyncFlag("stock_list", today);

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
	onProgress?: (progress: { status: "started" | "syncing" | "completed" | "failed"; message?: string; stockCount?: number; error?: string }) => void
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

			// 更新同步标志位，标记今日已同步
			const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			syncFlagManager.updateSyncFlag("stock_list", today);

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

/**
 * 同步股票详情信息（市值 + 公司信息）
 * 支持断点续传和每月同步一次策略
 *
 * @param autoTrigger 是否自动触发（true: 列表同步后自动触发，false: 手动触发）
 * @param onProgress 进度回调
 * @returns 同步结果
 */
export async function syncStockDetails(
	autoTrigger: boolean = false,
	onProgress?: (progress: {
		status: "started" | "syncing" | "completed" | "failed";
		message?: string;
		current?: number;
		total?: number;
		error?: string;
	}) => void
): Promise<SyncResult> {
	// 调用新的实现（支持断点续传）
	// 手动触发时强制同步（forceSync=true），忽略月度检查
	return syncStockDetailsWithResume(!autoTrigger, autoTrigger, onProgress);
}

/**
 * 获取股票详情统计
 */
export function getStockDetailsStats() {
	return {
		dailyBasicCount: stockDetailRepository.countDailyBasic(),
		companyInfoCount: stockDetailRepository.countCompanyInfo(),
	};
}

/**
 * 获取股票详情同步进度（断点续传）
 */
export { getStockDetailsSyncProgress } from "./stock-detail-sync.js";
