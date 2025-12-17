/**
 * 资讯服务接口
 */

import { News } from "../../types/index.js";

export interface INewsService {
	/**
	 * 获取财经资讯
	 */
	getNews(src?: string, startDate?: string, endDate?: string): Promise<News[]>;
}

