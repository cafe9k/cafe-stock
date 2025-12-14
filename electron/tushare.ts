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
			return items.map((item) => {
				const obj: any = {};
				columns.forEach((col, index) => {
					obj[col] = item[index];
				});
				return obj as T;
			});
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
}
