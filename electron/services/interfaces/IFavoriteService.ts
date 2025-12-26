/**
 * INPUT: 无（接口定义）
 * OUTPUT: IFavoriteService 接口规范 - 定义收藏服务的契约
 * POS: 服务层接口定义，规范收藏服务的对外API
 * 
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/services/README.md
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

