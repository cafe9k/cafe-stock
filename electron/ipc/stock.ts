/**
 * 股票相关 IPC 处理器
 */

import { ipcMain, BrowserWindow } from "electron";
import { TushareClient } from "../tushare.js";
import { searchStocks, getStockListSyncInfo, isSyncedToday, getCacheDataStats, getUntaggedAnnouncementsCount } from "../db.js";
import * as stockService from "../services/stock.js";

/**
 * 注册股票相关 IPC 处理器
 */
export function registerStockHandlers(mainWindow: BrowserWindow | null): void {
	// 搜索股票
	ipcMain.handle("search-stocks", async (_event, keyword: string, limit: number = 50) => {
		try {
			console.log(`[IPC] search-stocks: keyword=${keyword}, limit=${limit}`);
			return searchStocks(keyword, limit);
		} catch (error: any) {
			console.error("Failed to search stocks:", error);
			throw error;
		}
	});

	// 获取股票列表同步信息
	ipcMain.handle("get-stock-list-sync-info", async () => {
		try {
			console.log("[IPC] get-stock-list-sync-info");
			return getStockListSyncInfo();
		} catch (error: any) {
			console.error("Failed to get stock list sync info:", error);
			throw error;
		}
	});

	// 同步所有股票
	ipcMain.handle("sync-all-stocks", async () => {
		try {
			console.log("[IPC] sync-all-stocks");
			const result = await stockService.syncAllStocks((progress) => {
				mainWindow?.webContents.send("stock-list-sync-progress", progress);
			});
			return result;
		} catch (error: any) {
			console.error("Failed to sync all stocks:", error);
			throw error;
		}
	});

	// 检查股票列表同步状态
	ipcMain.handle("check-stock-list-sync-status", async () => {
		try {
			console.log("[IPC] check-stock-list-sync-status");
			const syncInfo = getStockListSyncInfo();
			const isSynced = isSyncedToday("stock_list");

			return {
				...syncInfo,
				isSyncedToday: isSynced,
			};
		} catch (error: any) {
			console.error("Failed to check stock list sync status:", error);
			throw error;
		}
	});

	// 获取最近交易日
	ipcMain.handle("get-latest-trade-date", async () => {
		try {
			// 获取最近30天的交易日历
			const today = new Date();
			const endDate = today.toISOString().slice(0, 10).replace(/-/g, "");
			const startDateObj = new Date();
			startDateObj.setDate(startDateObj.getDate() - 30);
			const startDate = startDateObj.toISOString().slice(0, 10).replace(/-/g, "");

			console.log(`[IPC] get-latest-trade-date: fetching from ${startDate} to ${endDate}`);

			const calendar = await TushareClient.getTradeCalendar("SSE", startDate, endDate, "1");

			// 找到最近一个交易日
			if (calendar && calendar.length > 0) {
				// 按日期降序排序，取第一个
				const sortedDates = calendar
					.filter((item: any) => item.is_open === "1" || item.is_open === 1)
					.sort((a: any, b: any) => b.cal_date.localeCompare(a.cal_date));

				if (sortedDates.length > 0) {
					const latestTradeDate = sortedDates[0].cal_date;
					console.log(`[IPC] get-latest-trade-date: found ${latestTradeDate}`);
					return latestTradeDate;
				}
			}

			// 如果没有找到，返回今天
			console.log(`[IPC] get-latest-trade-date: no trade date found, returning today`);
			return endDate;
		} catch (error: any) {
			console.error("Failed to get latest trade date:", error);
			// 出错时返回今天
			return new Date().toISOString().slice(0, 10).replace(/-/g, "");
		}
	});

	// 获取缓存数据统计
	ipcMain.handle("get-cache-data-stats", async () => {
		try {
			console.log("[IPC] get-cache-data-stats");
			const stats = getCacheDataStats();
			return stats;
		} catch (error: any) {
			console.error("Failed to get cache data stats:", error);
			throw error;
		}
	});

	// 获取未标记公告数量
	ipcMain.handle("get-untagged-count", async () => {
		try {
			console.log("[IPC] get-untagged-count");
			const count = getUntaggedAnnouncementsCount();
			return { count };
		} catch (error: any) {
			console.error("Failed to get untagged count:", error);
			throw error;
		}
	});
}

