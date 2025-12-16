/**
 * 股东相关 IPC 处理器
 */

import { ipcMain, BrowserWindow } from "electron";
import { TushareClient } from "../tushare.js";
import * as holderService from "../services/holder.js";
import {
	getTop10HoldersByStock,
	hasTop10HoldersData,
	countStocks,
	countStocksWithTop10Holders,
	getStocksWithTop10Holders,
	getTop10HoldersEndDates,
	getTop10HoldersByStockAndEndDate,
	deleteTop10HoldersByStock,
	upsertTop10Holders,
} from "../db.js";

/**
 * 注册股东相关 IPC 处理器
 */
export function registerHolderHandlers(mainWindow: BrowserWindow | null): void {
	// 获取十大股东数据（从 API）
	ipcMain.handle("get-top10-holders", async (_event, tsCode: string, period?: string, annDate?: string, startDate?: string, endDate?: string) => {
		try {
			console.log(
				`[IPC] get-top10-holders: tsCode=${tsCode}, period=${period}, annDate=${annDate}, startDate=${startDate}, endDate=${endDate}`
			);
			const holders = await TushareClient.getTop10Holders(tsCode, period, annDate, startDate, endDate);
			return holders;
		} catch (error: any) {
			console.error("Failed to get top10 holders:", error);
			throw error;
		}
	});

	// 同步所有股票的十大股东数据
	ipcMain.handle("sync-all-top10-holders", async (_event) => {
		try {
			console.log("[IPC] sync-all-top10-holders");
			const result = await holderService.syncAllTop10Holders(mainWindow);
			return result;
		} catch (error: any) {
			console.error("Failed to sync all top10 holders:", error);
			throw error;
		}
	});

	// 暂停/恢复同步
	ipcMain.handle("toggle-pause-top10-holders-sync", async () => {
		try {
			console.log("[IPC] toggle-pause-top10-holders-sync");
			const result = holderService.togglePauseSync();
			return result;
		} catch (error: any) {
			console.error("Failed to toggle pause sync:", error);
			throw error;
		}
	});

	// 停止同步
	ipcMain.handle("stop-top10-holders-sync", async () => {
		try {
			console.log("[IPC] stop-top10-holders-sync");
			const result = holderService.stopSync();
			return result;
		} catch (error: any) {
			console.error("Failed to stop sync:", error);
			throw error;
		}
	});

	// 同步单个股票的十大股东数据
	ipcMain.handle("sync-stock-top10-holders", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] sync-stock-top10-holders: tsCode=${tsCode}`);

			// 删除旧数据
			deleteTop10HoldersByStock(tsCode);

			// 使用服务层同步
			const result = await holderService.syncStockTop10Holders(tsCode);
			return result;
		} catch (error: any) {
			console.error("Failed to sync stock top10 holders:", error);
			return {
				status: "failed",
				message: error.message || "同步失败",
			};
		}
	});

	// 获取数据库中的十大股东数据
	ipcMain.handle("get-top10-holders-from-db", async (_event, tsCode: string, limit: number = 100) => {
		try {
			console.log(`[IPC] get-top10-holders-from-db: tsCode=${tsCode}, limit=${limit}`);
			return getTop10HoldersByStock(tsCode, limit);
		} catch (error: any) {
			console.error("Failed to get top10 holders from db:", error);
			throw error;
		}
	});

	// 检查股票是否已有十大股东数据
	ipcMain.handle("has-top10-holders-data", async (_event, tsCode: string) => {
		try {
			return hasTop10HoldersData(tsCode);
		} catch (error: any) {
			console.error("Failed to check top10 holders data:", error);
			return false;
		}
	});

	// 获取同步统计信息
	ipcMain.handle("get-top10-holders-sync-stats", async () => {
		try {
			const totalStocks = countStocks();
			const syncedStocks = countStocksWithTop10Holders();
			const syncedStockCodes = getStocksWithTop10Holders();

			return {
				totalStocks,
				syncedStocks,
				syncedStockCodes,
				syncRate: totalStocks > 0 ? ((syncedStocks / totalStocks) * 100).toFixed(2) : "0",
			};
		} catch (error: any) {
			console.error("Failed to get top10 holders sync stats:", error);
			throw error;
		}
	});

	// 获取股票的所有报告期
	ipcMain.handle("get-top10-holders-end-dates", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] get-top10-holders-end-dates: tsCode=${tsCode}`);
			return getTop10HoldersEndDates(tsCode);
		} catch (error: any) {
			console.error("Failed to get top10 holders end dates:", error);
			return [];
		}
	});

	// 根据报告期获取十大股东
	ipcMain.handle("get-top10-holders-by-end-date", async (_event, tsCode: string, endDate: string) => {
		try {
			console.log(`[IPC] get-top10-holders-by-end-date: tsCode=${tsCode}, endDate=${endDate}`);
			return getTop10HoldersByStockAndEndDate(tsCode, endDate);
		} catch (error: any) {
			console.error("Failed to get top10 holders by end date:", error);
			throw error;
		}
	});
}

