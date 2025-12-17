/**
 * 收藏仓储接口
 * 定义收藏股票数据访问操作
 */

/**
 * 收藏仓储接口
 */
export interface IFavoriteRepository {
	/**
	 * 添加收藏股票
	 */
	addFavoriteStock(tsCode: string): boolean;

	/**
	 * 取消收藏股票
	 */
	removeFavoriteStock(tsCode: string): boolean;

	/**
	 * 检查股票是否已收藏
	 */
	isFavoriteStock(tsCode: string): boolean;

	/**
	 * 获取所有收藏的股票代码
	 */
	getAllFavoriteStocks(): string[];

	/**
	 * 统计收藏的股票数量
	 */
	countFavoriteStocks(): number;
}

