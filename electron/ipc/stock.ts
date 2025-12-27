/**
 * 依赖: ipcMain(Electron), stockService(服务层), StockRepository(数据访问), StockDetailRepository(详情数据)
 * 输出: registerStockHandlers() - 注册股票相关的IPC处理器（get-all-stocks, sync-stocks等）
 * 职责: IPC通信层股票处理器，连接渲染进程与主进程的股票业务逻辑
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/ipc/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { ipcMain, BrowserWindow } from "electron";
import { TushareClient } from "../tushare.js";
import { getDb, isSyncedToday } from "../db.js";
import { StockRepository } from "../repositories/implementations/StockRepository.js";
import { FavoriteRepository } from "../repositories/implementations/FavoriteRepository.js";
import { HolderRepository } from "../repositories/implementations/HolderRepository.js";
import { AnnouncementRepository } from "../repositories/implementations/AnnouncementRepository.js";
import { StockDetailRepository } from "../repositories/implementations/StockDetailRepository.js";
import * as stockService from "../services/stock.js";

// 创建仓储实例
const stockRepository = new StockRepository(getDb());
const favoriteRepository = new FavoriteRepository(getDb());
const holderRepository = new HolderRepository(getDb());
const announcementRepository = new AnnouncementRepository(getDb());
const stockDetailRepository = new StockDetailRepository(getDb());

/**
 * 注册股票相关 IPC 处理器
 */
export function registerStockHandlers(mainWindow: BrowserWindow | null): void {
	// 获取所有股票列表
	ipcMain.handle("get-all-stocks", async () => {
		try {
			console.log("[IPC] get-all-stocks");
			return stockRepository.getAllStocks();
		} catch (error: any) {
			console.error("Failed to get all stocks:", error);
			throw error;
		}
	});

	// 获取股票列表同步信息
	ipcMain.handle("get-stock-list-sync-info", async () => {
		try {
			console.log("[IPC] get-stock-list-sync-info");
			return stockRepository.getStockListSyncInfo();
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

			// 自动触发详情同步
			if (result.success) {
				stockService
					.syncStockDetails(true, (progress) => {
						mainWindow?.webContents.send("stock-details-sync-progress", progress);
					})
					.catch((err) => {
						console.error("Auto sync stock details failed:", err);
					});
			}

			return result;
		} catch (error: any) {
			console.error("Failed to sync all stocks:", error);
			throw error;
		}
	});

	// 手动同步股票详情
	ipcMain.handle("sync-stock-details", async () => {
		try {
			console.log("[IPC] sync-stock-details");
			const result = await stockService.syncStockDetails(false, (progress) => {
				mainWindow?.webContents.send("stock-details-sync-progress", progress);
			});
			return result;
		} catch (error: any) {
			console.error("Failed to sync stock details:", error);
			throw error;
		}
	});

	// 获取股票详情统计
	ipcMain.handle("get-stock-details-stats", async () => {
		try {
			console.log("[IPC] get-stock-details-stats");
			return stockService.getStockDetailsStats();
		} catch (error: any) {
			console.error("Failed to get stock details stats:", error);
			throw error;
		}
	});

	// 获取股票详情同步进度（断点续传）
	ipcMain.handle("get-stock-details-sync-progress", async () => {
		try {
			console.log("[IPC] get-stock-details-sync-progress");
			return stockService.getStockDetailsSyncProgress();
		} catch (error: any) {
			console.error("Failed to get stock details sync progress:", error);
			throw error;
		}
	});

	// 检查股票列表同步状态
	ipcMain.handle("check-stock-list-sync-status", async () => {
		try {
			console.log("[IPC] check-stock-list-sync-status");
			const syncInfo = stockRepository.getStockListSyncInfo();
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
			const stockCount = stockRepository.countStocks();
			const favoriteCount = favoriteRepository.countFavoriteStocks();
			const top10HoldersCount = holderRepository.countStocksWithTop10Holders();
			const announcementsCount = announcementRepository.countAnnouncements();
			const stockSyncInfo = stockRepository.getStockListSyncInfo();

			// 获取同步标志位信息
			const syncFlags = getDb().prepare("SELECT sync_type, last_sync_date, updated_at FROM sync_flags ORDER BY sync_type").all() as Array<{
				sync_type: string;
				last_sync_date: string;
				updated_at: string;
			}>;

			// 统计十大股东记录总数
			const top10HoldersRecordRow = getDb().prepare("SELECT COUNT(*) as count FROM top10_holders").get() as { count: number };
			const top10HoldersRecordCount = top10HoldersRecordRow.count;

			return {
				stocks: {
					count: stockCount,
					lastSyncTime: stockSyncInfo.lastSyncTime,
				},
				favoriteStocks: {
					count: favoriteCount,
				},
				top10Holders: {
					stockCount: top10HoldersCount,
					recordCount: top10HoldersRecordCount,
				},
				announcements: {
					count: announcementsCount,
				},
				syncFlags: syncFlags.map((flag) => ({
					type: flag.sync_type,
					lastSyncDate: flag.last_sync_date,
					updatedAt: flag.updated_at,
				})),
			};
		} catch (error: any) {
			console.error("Failed to get cache data stats:", error);
			throw error;
		}
	});

	// 获取未标记公告数量
	ipcMain.handle("get-untagged-count", async () => {
		try {
			console.log("[IPC] get-untagged-count");
			const count = announcementRepository.getUntaggedAnnouncementsCount();
			return { count };
		} catch (error: any) {
			console.error("Failed to get untagged count:", error);
			throw error;
		}
	});

	// 获取股票公司信息
	ipcMain.handle("get-stock-company-info", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] get-stock-company-info: tsCode=${tsCode}`);
			const companyInfo = stockDetailRepository.getCompanyInfoByCode(tsCode);
			return companyInfo || null;
		} catch (error: any) {
			console.error("Failed to get stock company info:", error);
			throw error;
		}
	});

	// 删除股票详情同步状态
	ipcMain.handle("delete-stock-details-sync-flag", async () => {
		try {
			console.log("[IPC] delete-stock-details-sync-flag");
			const { syncFlagManager } = await import("../db.js");
			const result = syncFlagManager.deleteSyncFlag("stock_details");
			if (result) {
				console.log("[IPC] 股票详情同步状态已删除");
				return { success: true, message: "同步状态已删除" };
			} else {
				return { success: false, message: "删除失败" };
			}
		} catch (error: any) {
			console.error("Failed to delete stock details sync flag:", error);
			return { success: false, message: error.message || "删除失败" };
		}
	});
}
