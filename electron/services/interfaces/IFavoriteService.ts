/**
 * 收藏服务接口
 */

export interface IFavoriteService {
	/**
	 * 添加收藏股票
	 */
	addFavoriteStock(tsCode: string): boolean;

	/**
	 * 移除收藏股票
	 */
	removeFavoriteStock(tsCode: string): boolean;
}

