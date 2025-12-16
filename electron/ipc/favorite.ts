/**
 * 收藏相关 IPC 处理器
 */

import { ipcMain } from "electron";
import * as favoriteService from "../services/favorite.js";

/**
 * 注册收藏相关 IPC 处理器
 */
export function registerFavoriteHandlers(): void {
	// 添加收藏股票
	ipcMain.handle("add-favorite-stock", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] add-favorite-stock: ${tsCode}`);
			const success = favoriteService.addFavoriteStock(tsCode);
			return { success };
		} catch (error: any) {
			console.error("Failed to add favorite stock:", error);
			throw error;
		}
	});

	// 移除收藏股票
	ipcMain.handle("remove-favorite-stock", async (_event, tsCode: string) => {
		try {
			console.log(`[IPC] remove-favorite-stock: ${tsCode}`);
			const success = favoriteService.removeFavoriteStock(tsCode);
			return { success };
		} catch (error: any) {
			console.error("Failed to remove favorite stock:", error);
			throw error;
		}
	});

	// 检查是否已收藏
	ipcMain.handle("is-favorite-stock", async (_event, tsCode: string) => {
		try {
			const isFavorite = favoriteService.isFavoriteStock(tsCode);
			return { isFavorite };
		} catch (error: any) {
			console.error("Failed to check favorite stock:", error);
			throw error;
		}
	});

	// 获取所有收藏的股票
	ipcMain.handle("get-all-favorite-stocks", async () => {
		try {
			console.log("[IPC] get-all-favorite-stocks");
			const favoriteStocks = favoriteService.getAllFavoriteStocks();
			return favoriteStocks;
		} catch (error: any) {
			console.error("Failed to get all favorite stocks:", error);
			throw error;
		}
	});

	// 获取收藏股票数量
	ipcMain.handle("count-favorite-stocks", async () => {
		try {
			console.log("[IPC] count-favorite-stocks");
			const count = favoriteService.countFavoriteStocks();
			return { count };
		} catch (error: any) {
			console.error("Failed to count favorite stocks:", error);
			throw error;
		}
	});
}

