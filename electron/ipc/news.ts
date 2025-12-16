/**
 * 财经资讯相关 IPC 处理器
 */

import { ipcMain } from "electron";
import * as newsService from "../services/news.js";

/**
 * 注册财经资讯相关 IPC 处理器
 */
export function registerNewsHandlers(): void {
	// 获取财经资讯
	ipcMain.handle("get-news", async (_event, src?: string, startDate?: string, endDate?: string) => {
		try {
			console.log(`[IPC] get-news: src=${src}, dateRange=${startDate}-${endDate}`);
			const news = await newsService.getNews(src, startDate, endDate);
			return news;
		} catch (error: any) {
			console.error("Failed to get news:", error);
			throw error;
		}
	});
}

