/**
 * 依赖: 无（接口定义）
 * 输出: IFavoriteRepository 接口 - 定义收藏数据访问操作的契约
 * 职责: 收藏Repository接口，规范收藏数据访问层的标准操作
 *
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/repositories/README.md
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
