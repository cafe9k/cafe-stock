// Tushare API Client
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
	// Electron 环境禁用 webSecurity 后，可直接访问完整 URL
	private static readonly BASE_URL = "http://api.tushare.pro";

	/**
	 * 通用 Tushare API 请求方法
	 * @param apiName 接口名称，如 'stock_basic', 'daily'
	 * @param params 接口参数
	 * @param fields 返回字段，支持字符串数组或逗号分隔字符串
	 * @returns Promise<T[]> 返回对象数组
	 */
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

			const res: TushareResponse = await response.json();

			if (res.code !== 0) {
				throw new Error(`Tushare Error [${res.code}]: ${res.msg}`);
			}

			if (!res.data) {
				return [];
			}

			// Tushare 返回的是 fields 和 items 的分离格式，将其转换为对象数组
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
	 * 示例：获取股票列表
	 */
	static async getStockBasic(exchange: string = "", listStatus: string = "L") {
		return this.request("stock_basic", { exchange, list_status: listStatus });
	}

	/**
	 * 示例：获取日线行情
	 */
	static async getDaily(tsCode: string, startDate?: string, endDate?: string) {
		return this.request("daily", {
			ts_code: tsCode,
			start_date: startDate,
			end_date: endDate,
		});
	}

	/**
	 * 获取全量公告数据
	 * 文档: https://tushare.pro/document/2?doc_id=176
	 */
	static async getAnnouncements(tsCode?: string, annDate?: string, startDate?: string, endDate?: string) {
		return this.request("anns_d", {
			ts_code: tsCode,
			ann_date: annDate,
			start_date: startDate,
			end_date: endDate,
		});
	}
}
