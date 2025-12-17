/**
 * 股东服务模块
 * 负责十大股东数据的同步和管理
 */

import { BrowserWindow } from "electron";
import { TushareClient } from "../tushare.js";
import { getDb } from "../db.js";
import { StockRepository } from "../repositories/implementations/StockRepository.js";
import { HolderRepository } from "../repositories/implementations/HolderRepository.js";
import { SyncResult, SyncProgress } from "../types/index.js";

// 创建仓储实例
const stockRepository = new StockRepository(getDb());
const holderRepository = new HolderRepository(getDb());

// 同步状态
let isSyncingHolders = false;
let isPausedHolders = false;

/**
 * 同步所有股票的十大股东数据
 */
export async function syncAllTop10Holders(
	mainWindow: BrowserWindow | null,
	onProgress?: (progress: SyncProgress) => void
): Promise<SyncResult> {
	if (isSyncingHolders) {
		return { success: false, status: "skipped", message: "同步正在进行中" };
	}

	isSyncingHolders = true;
	isPausedHolders = false;
	console.log("[Holder Service] Starting sync all top10 holders...");

	try {
		// 获取所有股票
		const stocks = stockRepository.getAllStocks() as Array<{ ts_code: string; name: string; [key: string]: any }>;
		const totalStocks = stocks.length;

		if (totalStocks === 0) {
			return { success: false, status: "failed", message: "没有股票数据，请先同步股票列表" };
		}

		console.log(`[Holder Service] Total stocks to sync: ${totalStocks}`);

		let successCount = 0;
		let skipCount = 0;
		let failCount = 0;

		// 逐个股票同步
		for (let i = 0; i < stocks.length; i++) {
			// 检查是否被暂停
			while (isPausedHolders && isSyncingHolders) {
				await new Promise((resolve) => setTimeout(resolve, 500));
			}

			// 检查是否被停止
			if (!isSyncingHolders) {
				console.log("[Holder Service] Sync stopped by user");
				return {
					success: false,
					status: "stopped",
					message: `同步已停止。成功：${successCount}，跳过：${skipCount}，失败：${failCount}`,
					successCount,
					skipCount,
					failCount,
					totalStocks,
				};
			}

			const stock = stocks[i];

			// 检查是否已经有数据
			if (holderRepository.hasTop10HoldersData(stock.ts_code)) {
				skipCount++;
				console.log(`[${i + 1}/${totalStocks}] Skip ${stock.ts_code} ${stock.name} - already synced`);

				// 发送进度
				const progress: SyncProgress = {
					status: "skipped",
					current: i + 1,
					total: totalStocks,
					tsCode: stock.ts_code,
					name: stock.name,
					successCount,
					skipCount,
					failCount,
				};
				onProgress?.(progress);
				mainWindow?.webContents.send("top10-holders-sync-progress", progress);

				continue;
			}

			try {
				// 拉取该股票的十大股东数据
				const holders = await TushareClient.getTop10Holders(stock.ts_code);

				if (holders && holders.length > 0) {
					holderRepository.upsertTop10Holders(holders);
					successCount++;
					console.log(`[${i + 1}/${totalStocks}] Success ${stock.ts_code} ${stock.name} - ${holders.length} holders`);
				} else {
					skipCount++;
					console.log(`[${i + 1}/${totalStocks}] Skip ${stock.ts_code} ${stock.name} - no data`);
				}

				// 发送进度
				const progress: SyncProgress = {
					status: "syncing",
					current: i + 1,
					total: totalStocks,
					tsCode: stock.ts_code,
					name: stock.name,
					successCount,
					skipCount,
					failCount,
				};
				onProgress?.(progress);
				mainWindow?.webContents.send("top10-holders-sync-progress", progress);

				// 限速：每个请求间隔 200ms（Tushare API 限流）
				await new Promise((resolve) => setTimeout(resolve, 200));
			} catch (error: any) {
				failCount++;
				console.error(`[${i + 1}/${totalStocks}] Failed ${stock.ts_code} ${stock.name}:`, error.message);

				// 发送进度
				const progress: SyncProgress = {
					status: "failed",
					current: i + 1,
					total: totalStocks,
					tsCode: stock.ts_code,
					name: stock.name,
					error: error.message,
					successCount,
					skipCount,
					failCount,
				};
				onProgress?.(progress);
				mainWindow?.webContents.send("top10-holders-sync-progress", progress);

				// 如果是 API 限流错误，等待更长时间
				if (error.message?.includes("限流") || error.message?.includes("频繁")) {
					console.log("API 限流，等待 5 秒后继续...");
					await new Promise((resolve) => setTimeout(resolve, 5000));
				}
			}
		}

		console.log(`[Holder Service] Sync completed: success=${successCount}, skip=${skipCount}, fail=${failCount}`);

		return {
			success: true,
			status: "success",
			message: `同步完成：成功 ${successCount}，跳过 ${skipCount}，失败 ${failCount}`,
			successCount,
			skipCount,
			failCount,
			totalStocks,
		};
	} catch (error: any) {
		console.error("Failed to sync all top10 holders:", error);
		return { success: false, status: "failed", message: error.message || "同步失败" };
	} finally {
		isSyncingHolders = false;
		isPausedHolders = false;
	}
}

/**
 * 暂停/恢复同步
 */
export function togglePauseSync(): { status: string; message: string } {
	if (!isSyncingHolders) {
		return { status: "failed", message: "没有正在进行的同步任务" };
	}

	isPausedHolders = !isPausedHolders;
	const status = isPausedHolders ? "paused" : "resumed";
	const message = isPausedHolders ? "同步已暂停" : "同步已恢复";
	console.log(`[Holder Service] Sync ${status}`);

	return { status, message };
}

/**
 * 停止同步
 */
export function stopSync(): { status: string; message: string } {
	if (!isSyncingHolders) {
		return { status: "failed", message: "没有正在进行的同步任务" };
	}

	isSyncingHolders = false;
	isPausedHolders = false;
	console.log("[Holder Service] Sync stopped");

	return { status: "stopped", message: "同步已停止" };
}

/**
 * 获取同步状态
 */
export function getSyncStatus(): { isSyncing: boolean; isPaused: boolean } {
	return {
		isSyncing: isSyncingHolders,
		isPaused: isPausedHolders,
	};
}

/**
 * 同步单个股票的十大股东数据
 */
export async function syncStockTop10Holders(tsCode: string): Promise<{ status: string; message: string; count?: number }> {
	try {
		console.log(`[Holder Service] Syncing top10 holders for ${tsCode}...`);

		// 拉取该股票的十大股东数据
		const holders = await TushareClient.getTop10Holders(tsCode);

		if (holders && holders.length > 0) {
			holderRepository.upsertTop10Holders(holders);
			console.log(`[Holder Service] Synced ${holders.length} holders for ${tsCode}`);
			return {
				status: "success",
				message: `成功同步 ${holders.length} 条十大股东数据`,
				count: holders.length,
			};
		} else {
			return {
				status: "success",
				message: "该股票暂无十大股东数据",
				count: 0,
			};
		}
	} catch (error: any) {
		console.error(`[Holder Service] Failed to sync top10 holders for ${tsCode}:`, error);
		return {
			status: "failed",
			message: error.message || "同步失败",
		};
	}
}

