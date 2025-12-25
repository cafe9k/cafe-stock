/**
 * 股票详情仓储接口
 */

export interface IStockDetailRepository {
	/**
	 * 批量插入或更新每日指标数据
	 */
	upsertDailyBasic(data: any[]): void;

	/**
	 * 批量插入或更新公司信息
	 */
	upsertCompanyInfo(data: any[]): void;

	/**
	 * 根据股票代码获取最新市值数据
	 */
	getDailyBasicByCode(tsCode: string): any | null;

	/**
	 * 根据股票代码获取公司信息
	 */
	getCompanyInfoByCode(tsCode: string): any | null;

	/**
	 * 统计每日指标数据条数
	 */
	countDailyBasic(): number;

	/**
	 * 统计公司信息条数
	 */
	countCompanyInfo(): number;

	/**
	 * 获取指定股票的最新市值（用于列表展示）
	 */
	getLatestMarketValue(tsCode: string): { total_mv: number | null } | null;

	/**
	 * 批量获取多个股票的最新市值
	 */
	batchGetLatestMarketValues(tsCodes: string[]): Map<string, number | null>;
}

