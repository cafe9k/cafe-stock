/**
 * 财经资讯服务模块
 * 负责获取财经新闻
 */

import { TushareClient } from "../tushare.js";
import { News } from "../types/index.js";

/**
 * 获取财经资讯
 */
export async function getNews(src?: string, startDate?: string, endDate?: string): Promise<News[]> {
	return await TushareClient.getNews(src, startDate, endDate);
}

