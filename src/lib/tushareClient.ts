/**
 * Tushare Pro HTTP 客户端
 * 文档: https://tushare.pro/document/1?doc_id=130
 *
 * 直接请求 Tushare Pro API
 *
 * 优化功能：
 * 1. 请求节流：并发限制 2 个，每分钟控制频率
 * 2. 本地缓存：静态数据 24h+，动态数据短期缓存
 * 3. 批量合并：支持多只股票合并请求
 */

import { TUSHARE_TOKEN, TUSHARE_API_URL } from "../config/tushare";
import { tushareRateLimiter } from "./rateLimiter";
import { tushareCache } from "./tushareCache";

/**
 * Tushare API 请求参数接口
 */
interface TushareRequestParams {
	api_name: string;
	token: string;
	params?: Record<string, any>;
	fields?: string;
}

/**
 * Tushare API 响应接口
 */
interface TushareResponse<T = any> {
	code: number;
	msg: string | null;
	data: {
		fields: string[];
		items: T[][];
	};
}

/**
 * Tushare API 错误类
 */
class TushareError extends Error {
	code: number;

	constructor(code: number, message: string) {
		super(message);
		this.name = "TushareError";
		this.code = code;
	}
}

/**
 * 批量请求配置
 */
interface BatchConfig {
	batchSize: number; // 每批股票数量
	batchDelay: number; // 批次间延迟（毫秒）
}

const DEFAULT_BATCH_CONFIG: BatchConfig = {
	batchSize: 50, // 每批最多 50 只股票
	batchDelay: 200, // 批次间延迟 200ms
};

/**
 * Tushare HTTP 客户端类
 */
class TushareClient {
	private token: string;
	private apiUrl: string;
	private batchConfig: BatchConfig;

	constructor(token?: string, apiUrl?: string, batchConfig?: Partial<BatchConfig>) {
		this.token = token || TUSHARE_TOKEN;
		// 直接请求 Tushare Pro API
		this.apiUrl = apiUrl || TUSHARE_API_URL;
		this.batchConfig = { ...DEFAULT_BATCH_CONFIG, ...batchConfig };
	}

	/**
	 * 设置 Token
	 */
	setToken(token: string): void {
		this.token = token;
	}

	/**
	 * 获取当前 Token
	 */
	getToken(): string {
		return this.token;
	}

	/**
	 * 发起 HTTP API 请求（内部方法，不经过节流器）
	 */
	private async doRequest<T = any>(params: TushareRequestParams): Promise<TushareResponse<T>> {
		// 构建请求体
		const requestBody = {
			api_name: params.api_name,
			token: params.token,
			params: params.params || {},
			fields: params.fields || "",
		};

		try {
			let result: TushareResponse<T>;

			// 优先使用 Electron IPC 通信（解决跨域问题）
			if (window.electronAPI && window.electronAPI.tushareRequest) {
				const response = await window.electronAPI.tushareRequest(this.apiUrl, requestBody);

				if (!response.ok) {
					throw new TushareError(response.status, `HTTP 错误: ${response.statusText || response.status}`);
				}

				result = response.data;
			} else {
				// 降级使用浏览器 fetch（可能会遇到跨域问题）
				const response = await fetch(this.apiUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestBody),
				});

				if (!response.ok) {
					const errorText = response.statusText || `状态码 ${response.status}`;
					throw new TushareError(response.status, `HTTP 错误: ${errorText}`);
				}

				result = await response.json();
			}

			// 检查业务错误码
			if (result.code !== 0) {
				throw new TushareError(result.code, result.msg || "未知错误");
			}

			return result;
		} catch (error) {
			if (error instanceof TushareError) {
				throw error;
			}
			throw new TushareError(-1, `请求失败: ${error instanceof Error ? error.message : "未知错误"}`);
		}
	}

	/**
	 * 发起 HTTP API 请求（经过节流器）
	 */
	private async request<T = any>(params: TushareRequestParams): Promise<TushareResponse<T>> {
		return tushareRateLimiter.execute(() => this.doRequest<T>(params));
	}

	/**
	 * 查询数据并转换为对象数组
	 * 支持缓存
	 */
	async query<T = any>(apiName: string, params?: Record<string, any>, fields?: string[], options?: { skipCache?: boolean }): Promise<T[]> {
		// 1. 检查缓存
		if (!options?.skipCache) {
			const cached = tushareCache.get<T[]>(apiName, params);
			if (cached) {
				return cached;
			}
		}

		// 2. 发起请求
		const fieldsStr = fields ? fields.join(",") : "";

		const response = await this.request<any>({
			api_name: apiName,
			token: this.token,
			params,
			fields: fieldsStr,
		});

		// 3. 将数据转换为对象数组
		const { fields: fieldNames, items } = response.data;

		const result = items.map((item) => {
			const obj: any = {};
			fieldNames.forEach((field, index) => {
				obj[field] = item[index];
			});
			return obj as T;
		});

		// 4. 存入缓存
		tushareCache.set(apiName, params, result);

		return result;
	}

	/**
	 * 查询数据并返回原始响应
	 */
	async queryRaw<T = any>(apiName: string, params?: Record<string, any>, fields?: string[]): Promise<TushareResponse<T>> {
		const fieldsStr = fields ? fields.join(",") : "";

		return this.request<T>({
			api_name: apiName,
			token: this.token,
			params,
			fields: fieldsStr,
		});
	}

	/**
	 * 批量查询多只股票数据
	 * 自动分批处理，避免单次请求数据过大
	 *
	 * @param apiName - 接口名称
	 * @param tsCodes - 股票代码数组
	 * @param params - 其他参数（不包含 ts_code）
	 * @param fields - 返回字段
	 * @returns 合并后的数据数组
	 */
	async queryBatch<T = any>(apiName: string, tsCodes: string[], params?: Record<string, any>, fields?: string[]): Promise<T[]> {
		if (tsCodes.length === 0) {
			return [];
		}

		// 如果股票数量少，直接单次请求
		if (tsCodes.length <= this.batchConfig.batchSize) {
			return this.query<T>(
				apiName,
				{
					...params,
					ts_code: tsCodes.join(","),
				},
				fields
			);
		}

		// 分批处理
		const results: T[] = [];
		const batches: string[][] = [];

		for (let i = 0; i < tsCodes.length; i += this.batchConfig.batchSize) {
			batches.push(tsCodes.slice(i, i + this.batchConfig.batchSize));
		}

		console.log(`[TushareClient] 批量请求: ${tsCodes.length} 只股票，分 ${batches.length} 批处理`);

		for (let i = 0; i < batches.length; i++) {
			const batch = batches[i];

			try {
				const batchData = await this.query<T>(
					apiName,
					{
						...params,
						ts_code: batch.join(","),
					},
					fields
				);

				results.push(...batchData);
			} catch (error) {
				console.error(`[TushareClient] 批次 ${i + 1}/${batches.length} 请求失败:`, error);
				// 继续处理其他批次
			}

			// 批次间延迟（最后一批不需要延迟）
			if (i < batches.length - 1) {
				await this.delay(this.batchConfig.batchDelay);
			}
		}

		return results;
	}

	/**
	 * 批量查询多只股票的行情数据（优化版）
	 * 适用于 daily、daily_basic 等按日期查询的接口
	 *
	 * @param apiName - 接口名称
	 * @param tradeDate - 交易日期
	 * @param tsCodes - 股票代码数组（可选，不传则获取全市场）
	 * @param fields - 返回字段
	 */
	async queryDailyBatch<T = any>(apiName: string, tradeDate: string, tsCodes?: string[], fields?: string[]): Promise<Map<string, T>> {
		// 生成缓存 key
		const cacheParams = { trade_date: tradeDate };

		// 检查缓存
		const cached = tushareCache.get<T[]>(apiName, cacheParams);
		let allData: T[];

		if (cached) {
			allData = cached;
		} else {
			// 获取当日全市场数据（一次请求获取所有）
			allData = await this.query<T>(apiName, cacheParams, fields);
		}

		// 转换为 Map 方便查找
		const dataMap = new Map<string, T>();
		allData.forEach((item) => {
			const tsCode = (item as any).ts_code;
			if (tsCode) {
				dataMap.set(tsCode, item);
			}
		});

		// 如果指定了股票代码，只返回这些股票的数据
		if (tsCodes && tsCodes.length > 0) {
			const filteredMap = new Map<string, T>();
			tsCodes.forEach((code) => {
				const data = dataMap.get(code);
				if (data) {
					filteredMap.set(code, data);
				}
			});
			return filteredMap;
		}

		return dataMap;
	}

	/**
	 * 延迟函数
	 */
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * 清空缓存
	 */
	clearCache(): void {
		tushareCache.clear();
	}

	/**
	 * 获取缓存统计
	 */
	getCacheStats() {
		return tushareCache.getStats();
	}

	/**
	 * 获取节流器状态
	 */
	getRateLimiterStatus() {
		return tushareRateLimiter.getStatus();
	}
}

// 导出单例实例
export const tushareClient = new TushareClient();

// 导出类和类型
export { TushareClient, TushareError };
export type { TushareRequestParams, TushareResponse, BatchConfig };

/**
 * 使用示例:
 *
 * // 1. 查询股票基本信息（自动缓存 24 小时）
 * const stocks = await tushareClient.query('stock_basic', {
 *     list_status: 'L'
 * }, ['ts_code', 'name', 'area', 'industry', 'list_date'])
 *
 * // 2. 批量查询多只股票的日线行情
 * const quotes = await tushareClient.queryBatch('daily',
 *     ['000001.SZ', '600000.SH', '000002.SZ'],
 *     { trade_date: '20231229' },
 *     ['ts_code', 'open', 'high', 'low', 'close', 'vol']
 * )
 *
 * // 3. 获取当日全市场行情（优化版，自动缓存）
 * const dailyMap = await tushareClient.queryDailyBatch('daily', '20231229',
 *     ['000001.SZ', '600000.SH'],
 *     ['ts_code', 'open', 'high', 'low', 'close', 'vol']
 * )
 *
 * // 4. 查看缓存和节流器状态
 * console.log(tushareClient.getCacheStats())
 * console.log(tushareClient.getRateLimiterStatus())
 */
