// Tushare API Client for Node.js (Main Process)
// 文档: https://tushare.pro/document/1?doc_id=130

interface TushareParams {
	[key: string]: string | number | undefined;
}

interface TushareRequest {
	api_name: string;
	token: string;
	params?: TushareParams;
	fields?: string | string[];
}

interface TushareResponse {
	code: number;
	msg: string | null;
	data: {
		fields: string[];
		items: any[][];
		has_more: boolean;
	} | null;
	request_id?: string;
}

export class TushareClient {
	private static readonly TOKEN = "834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d";
	private static readonly BASE_URL = "http://api.tushare.pro";

	static async request<T = any>(apiName: string, params: TushareParams = {}, fields: string[] | string = ""): Promise<T[]> {
		const requestBody: TushareRequest = {
			api_name: apiName,
			token: this.TOKEN,
			params,
			fields: Array.isArray(fields) ? fields.join(",") : fields,
		};

		try {
			const response = await fetch(this.BASE_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}

			const res = (await response.json()) as TushareResponse;

			if (res.code !== 0) {
				throw new Error(`Tushare Error [${res.code}]: ${res.msg}`);
			}

			if (!res.data) {
				return [];
			}

			const { fields: columns, items } = res.data;
			const result = items.map((item) => {
				const obj: any = {};
				columns.forEach((col, index) => {
					obj[col] = item[index];
				});
				return obj as T;
			});

			// #region agent log
			if (apiName === 'anns_d' && result.length > 0) {
				fetch('http://127.0.0.1:7242/ingest/67286581-beef-43bb-8e6c-59afa2dd6840',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tushare.ts:72',message:'Tushare API response for anns_d',data:{apiName,params,count:result.length,first3:result.slice(0,3).map((r:any)=>({ann_date:r.ann_date,pub_time:r.pub_time,title:r.title?.substring(0,30)})),last3:result.slice(-3).map((r:any)=>({ann_date:r.ann_date,pub_time:r.pub_time,title:r.title?.substring(0,30)}))},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
			}
			// #endregion

			return result;
		} catch (error) {
			console.error("Tushare Request Failed:", error);
			throw error;
		}
	}

	/**
	 * 获取全量公告数据
	 * 文档: https://tushare.pro/document/2?doc_id=176
	 * 接口：anns_d
	 * 描述：获取上市公司公告数据
	 * 限量：单次最大2000，总量不限制
	 * 权限：用户需要至少2000积分才可以调取，5000积分以上频次相对较高，具体请参阅积分获取办法
	 *
	 * 输入参数：
	 * ts_code: str, 股票代码（支持多个股票同时提取，逗号分隔）
	 * ann_date: str, 公告日期（YYYYMMDD格式，支持单日和多日）
	 * start_date: str, 公告开始日期
	 * end_date: str, 公告结束日期
	 *
	 * 输出参数：
	 * ts_code: str, 股票代码
	 * ann_date: str, 公告日期
	 * ann_type: str, 公告类型
	 * title: str, 公告标题
	 * content: str, 公告内容
	 * pub_time: str, 公告发布时间
	 */
	static async getAnnouncements(tsCode?: string, annDate?: string, startDate?: string, endDate?: string, limit: number = 2000, offset: number = 0) {
		return this.request("anns_d", {
			ts_code: tsCode,
			ann_date: annDate,
			start_date: startDate,
			end_date: endDate,
			limit, // Internal support for pagination if API allows, or wrapper logic
			offset,
		});
	}

	/**
	 * 获取A股股票列表
	 * 文档: https://tushare.pro/document/2?doc_id=25
	 * 接口：stock_basic
	 * 描述：获取基础信息数据，包括股票代码、名称、上市日期、退市日期等
	 * 限量：单次最大5000条
	 * 权限：用户需要至少120积分才可以调取
	 *
	 * 输入参数：
	 * ts_code: str, 股票代码
	 * name: str, 股票名称
	 * exchange: str, 交易所 SSE上交所 SZSE深交所 BSE北交所
	 * market: str, 市场类别 主板 创业板 科创板 CDR
	 * is_hs: str, 是否沪深港通标的，N否 H沪股通 S深股通
	 * list_status: str, 上市状态 L上市 D退市 P暂停上市，默认L
	 * limit: int, 单次返回数据长度
	 * offset: int, 开始行数
	 *
	 * 输出参数：
	 * ts_code: str, TS代码
	 * symbol: str, 股票代码
	 * name: str, 股票名称
	 * area: str, 地域
	 * industry: str, 所属行业
	 * fullname: str, 股票全称
	 * enname: str, 英文全称
	 * cnspell: str, 拼音缩写
	 * market: str, 市场类型（主板/创业板/科创板/CDR）
	 * exchange: str, 交易所代码
	 * curr_type: str, 交易货币
	 * list_status: str, 上市状态 L上市 D退市 P暂停上市
	 * list_date: str, 上市日期
	 * delist_date: str, 退市日期
	 * is_hs: str, 是否沪深港通标的，N否 H沪股通 S深股通
	 */
	static async getStockList(
		tsCode?: string,
		name?: string,
		exchange?: string,
		market?: string,
		isHs?: string,
		listStatus: string = "L",
		limit: number = 5000,
		offset: number = 0
	) {
		return this.request("stock_basic", {
			ts_code: tsCode,
			name,
			exchange,
			market,
			is_hs: isHs,
			list_status: listStatus,
			limit,
			offset,
		});
	}

	/**
	 * 获取交易日历
	 * 文档: https://tushare.pro/document/2?doc_id=26
	 * 接口：trade_cal
	 * 描述：获取各大交易所交易日历数据，默认提取的是上交所
	 * 限量：单次最大提取4000条
	 * 权限：用户需要至少120积分才可以调取
	 *
	 * 输入参数：
	 * exchange: str, 交易所 SSE上交所 SZSE深交所 BSE北交所
	 * start_date: str, 开始日期 (YYYYMMDD格式)
	 * end_date: str, 结束日期 (YYYYMMDD格式)
	 * is_open: str, 是否交易 '0'休市 '1'交易
	 *
	 * 输出参数：
	 * exchange: str, 交易所 SSE上交所 SZSE深交所
	 * cal_date: str, 日历日期
	 * is_open: str, 是否交易 0休市 1交易
	 * pretrade_date: str, 上一个交易日
	 */
	static async getTradeCalendar(exchange: string = "SSE", startDate?: string, endDate?: string, isOpen?: string) {
		return this.request("trade_cal", {
			exchange,
			start_date: startDate,
			end_date: endDate,
			is_open: isOpen,
		});
	}

	/**
	 * 获取公告原文 URL（单次请求）
	 * 文档: https://tushare.pro/document/2?doc_id=176
	 * 接口：anns_d
	 * 描述：获取全量公告数据，提供 PDF 下载 URL
	 * 限量：单次最大 2000 条
	 * 权限：本接口为单独权限
	 *
	 * 输入参数：
	 * ts_code: str, 股票代码
	 * ann_date: str, 公告日期（YYYYMMDD格式）
	 * start_date: str, 公告开始日期
	 * end_date: str, 公告结束日期
	 *
	 * 输出参数：
	 * ann_date: str, 公告日期
	 * ts_code: str, 股票代码
	 * name: str, 股票名称
	 * title: str, 标题
	 * url: str, URL，原文下载链接
	 * rec_time: datetime, 发布时间
	 */
	static async getAnnouncementFiles(tsCode?: string, annDate?: string, startDate?: string, endDate?: string) {
		return this.request("anns_d", {
			ts_code: tsCode,
			ann_date: annDate,
			start_date: startDate,
			end_date: endDate,
		});
	}

	/**
	 * 获取公告原文 URL（迭代获取完整数据）
	 * 处理单次 2000 条的限制，自动迭代直到获取完所有数据
	 * 
	 * @param tsCode 股票代码（可选）
	 * @param startDate 开始日期 YYYYMMDD
	 * @param endDate 结束日期 YYYYMMDD
	 * @param onProgress 进度回调 (currentCount, totalFetched)
	 * @returns 所有公告数据
	 */
	static async getAnnouncementsIterative(
		tsCode: string | undefined,
		startDate: string,
		endDate: string,
		onProgress?: (currentCount: number, totalFetched: number) => void
	): Promise<any[]> {
		const allAnnouncements: any[] = [];
		let currentEndDate = endDate;
		const BATCH_SIZE = 2000;
		let hasMore = true;

		while (hasMore) {
			console.log(`[Tushare] 获取公告: ts_code=${tsCode || "全市场"}, start=${startDate}, end=${currentEndDate}`);

			// 获取一批数据
			const batch = await this.getAnnouncementFiles(tsCode, undefined, startDate, currentEndDate);

			if (!batch || batch.length === 0) {
				console.log(`[Tushare] 没有更多公告数据`);
				hasMore = false;
				break;
			}

			allAnnouncements.push(...batch);

			// 触发进度回调
			if (onProgress) {
				onProgress(batch.length, allAnnouncements.length);
			}

			console.log(`[Tushare] 获取到 ${batch.length} 条公告，累计 ${allAnnouncements.length} 条`);

			// 如果返回的数据少于 2000 条，说明已经获取完毕
			if (batch.length < BATCH_SIZE) {
				hasMore = false;
				break;
			}

			// 如果返回了 2000 条，需要继续迭代
			// 获取最早的公告日期，作为下一次请求的结束日期
			const lastAnnDate = batch[batch.length - 1].ann_date;
			
			// 如果最后一条公告的日期已经到达或超过起始日期，停止迭代
			if (lastAnnDate <= startDate) {
				console.log(`[Tushare] 已到达起始日期，停止迭代`);
				hasMore = false;
				break;
			}

			// 计算前一天作为新的结束日期
			currentEndDate = this.getPreviousDay(lastAnnDate);

			// 如果新的结束日期早于起始日期，停止迭代
			if (currentEndDate < startDate) {
				hasMore = false;
				break;
			}

			// 添加延迟，避免请求过快
			await this.sleep(300); // 300ms 延迟
		}

		console.log(`[Tushare] 公告获取完成，共 ${allAnnouncements.length} 条`);
		return allAnnouncements;
	}

	/**
	 * 获取日期的前一天（YYYYMMDD格式）
	 */
	private static getPreviousDay(dateStr: string): string {
		const year = parseInt(dateStr.substring(0, 4));
		const month = parseInt(dateStr.substring(4, 6)) - 1; // JS月份从0开始
		const day = parseInt(dateStr.substring(6, 8));
		const date = new Date(year, month, day);
		date.setDate(date.getDate() - 1);
		return this.formatDateToYYYYMMDD(date);
	}

	/**
	 * 格式化日期为 YYYYMMDD
	 */
	private static formatDateToYYYYMMDD(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}${month}${day}`;
	}

	/**
	 * 延迟函数
	 */
	private static sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * 完整获取指定日期范围的公告（确保覆盖整个范围）
	 * 采用双向迭代策略：既向前获取更新数据，也向后获取历史数据
	 */
	static async getAnnouncementsComplete(
		tsCode: string | undefined,
		startDate: string,
		endDate: string,
		onProgress?: (message: string, current: number, total: number) => void
	): Promise<any[]> {
		const allAnnouncements: any[] = [];
		const BATCH_SIZE = 2000;

		console.log(`[Tushare] 开始获取完整公告数据: ${startDate} - ${endDate}`);

		// 第一次请求，获取初始数据
		let batch = await this.getAnnouncements(tsCode, undefined, startDate, endDate, BATCH_SIZE, 0);
		console.log(`[Tushare] 首次获取 ${batch.length} 条公告`);
		
		if (!batch || batch.length === 0) {
			console.log(`[Tushare] 该时间范围内没有公告数据`);
			return [];
		}

		allAnnouncements.push(...batch);

		if (onProgress) {
			onProgress(`已获取 ${allAnnouncements.length} 条`, allAnnouncements.length, allAnnouncements.length);
		}

		// 如果返回的数据少于批次大小，说明已经获取完整个范围
		if (batch.length < BATCH_SIZE) {
			console.log(`[Tushare] 数据量小于批次大小，获取完成`);
			return allAnnouncements;
		}

		// 检查返回数据的日期范围
		const dates = batch.map((a: any) => a.ann_date).sort();
		const oldestDate = dates[0];
		const newestDate = dates[dates.length - 1];

		console.log(`[Tushare] 首批数据日期范围: ${oldestDate} - ${newestDate}`);

		// 向后迭代：如果最旧的日期 > startDate，继续获取更早的数据
		if (oldestDate > startDate) {
			console.log(`[Tushare] 向后获取更早的数据...`);
			let currentEndDate = this.getPreviousDay(oldestDate);
			
			while (currentEndDate >= startDate) {
				console.log(`[Tushare] 获取历史数据: ${startDate} - ${currentEndDate}`);
				const historyBatch = await this.getAnnouncements(tsCode, undefined, startDate, currentEndDate, BATCH_SIZE, 0);
				
				if (!historyBatch || historyBatch.length === 0) {
					console.log(`[Tushare] 没有更早的数据`);
					break;
				}

				allAnnouncements.push(...historyBatch);
				console.log(`[Tushare] 获取到 ${historyBatch.length} 条历史公告，累计 ${allAnnouncements.length} 条`);

				if (onProgress) {
					onProgress(`已获取 ${allAnnouncements.length} 条`, allAnnouncements.length, allAnnouncements.length);
				}

				if (historyBatch.length < BATCH_SIZE) {
					break;
				}

				// 更新结束日期为最早的公告日期的前一天
				const oldestInBatch = historyBatch.map((a: any) => a.ann_date).sort()[0];
				if (oldestInBatch <= startDate) {
					break;
				}
				currentEndDate = this.getPreviousDay(oldestInBatch);
				await this.sleep(300);
			}
		}

		// 向前迭代：如果最新的日期 < endDate，继续获取更新的数据
		if (newestDate < endDate) {
			console.log(`[Tushare] 向前获取更新的数据...`);
			let currentStartDate = this.getNextDay(newestDate);
			
			while (currentStartDate <= endDate) {
				console.log(`[Tushare] 获取最新数据: ${currentStartDate} - ${endDate}`);
				const futureBatch = await this.getAnnouncements(tsCode, undefined, currentStartDate, endDate, BATCH_SIZE, 0);
				
				if (!futureBatch || futureBatch.length === 0) {
					console.log(`[Tushare] 没有更新的数据`);
					break;
				}

				allAnnouncements.push(...futureBatch);
				console.log(`[Tushare] 获取到 ${futureBatch.length} 条最新公告，累计 ${allAnnouncements.length} 条`);

				if (onProgress) {
					onProgress(`已获取 ${allAnnouncements.length} 条`, allAnnouncements.length, allAnnouncements.length);
				}

				if (futureBatch.length < BATCH_SIZE) {
					break;
				}

				// 更新起始日期为最新的公告日期的后一天
				const newestInBatch = futureBatch.map((a: any) => a.ann_date).sort()[futureBatch.length - 1];
				if (newestInBatch >= endDate) {
					break;
				}
				currentStartDate = this.getNextDay(newestInBatch);
				await this.sleep(300);
			}
		}

		console.log(`[Tushare] 公告获取完成，共 ${allAnnouncements.length} 条`);
		return allAnnouncements;
	}

	/**
	 * 获取日期的后一天（YYYYMMDD格式）
	 */
	private static getNextDay(dateStr: string): string {
		const year = parseInt(dateStr.substring(0, 4));
		const month = parseInt(dateStr.substring(4, 6)) - 1;
		const day = parseInt(dateStr.substring(6, 8));
		const date = new Date(year, month, day);
		date.setDate(date.getDate() + 1);
		return this.formatDateToYYYYMMDD(date);
	}

	/**
	 * 获取财经新闻
	 * 文档: https://tushare.pro/document/2?doc_id=143
	 * 接口：news
	 * 描述：获取主要新闻网站的财经新闻数据
	 * 限量：单次最大2000条
	 * 权限：用户需要至少120积分才可以调取
	 *
	 * 输入参数：
	 * src: str, 新闻来源 sina(新浪财经), wallstreetcn(华尔街见闻), 10jqka(同花顺), eastmoney(东方财富), yuncaijing(云财经)
	 * start_date: str, 开始日期 (YYYYMMDD格式)
	 * end_date: str, 结束日期 (YYYYMMDD格式)
	 *
	 * 输出参数：
	 * datetime: str, 发布时间
	 * content: str, 新闻内容
	 * title: str, 新闻标题
	 * channels: str, 频道
	 */
	static async getNews(src?: string, startDate?: string, endDate?: string) {
		return this.request("news", {
			src,
			start_date: startDate,
			end_date: endDate,
		});
	}

	/**
	 * 获取十大股东数据
	 * 文档: https://tushare.pro/document/2?doc_id=61
	 * 接口：top10_holders
	 * 描述：获取上市公司前十大股东数据，包括持股数量和比例等信息
	 * 限量：单次最大2000条，总量不限制
	 * 权限：用户需要至少2000积分才可以调取
	 *
	 * 输入参数：
	 * ts_code: str, 股票代码（支持单个或多个，多个用逗号分隔）
	 * period: str, 报告期（YYYYMMDD格式）
	 * ann_date: str, 公告日期（YYYYMMDD格式）
	 * start_date: str, 报告期开始日期
	 * end_date: str, 报告期结束日期
	 *
	 * 输出参数：
	 * ts_code: str, TS股票代码
	 * ann_date: str, 公告日期
	 * end_date: str, 报告期
	 * holder_name: str, 股东名称
	 * hold_amount: float, 持有数量（股）
	 * hold_ratio: float, 持有比例（%）
	 */
	static async getTop10Holders(tsCode: string, period?: string, annDate?: string, startDate?: string, endDate?: string) {
		return this.request("top10_holders", {
			ts_code: tsCode,
			period,
			ann_date: annDate,
			start_date: startDate,
			end_date: endDate,
		});
	}
}
