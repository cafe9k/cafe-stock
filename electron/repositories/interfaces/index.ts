/**
 * INPUT: 各Repository接口文件
 * OUTPUT: 统一导出所有Repository接口
 * POS: Repository接口聚合模块，提供统一的导出入口
 * 
 * ⚠️ 更新提醒：新增接口文件时，请在此处添加导出并更新 electron/repositories/README.md
 */

export * from "./IRepository.js";
export * from "./IStockRepository.js";
export * from "./IFavoriteRepository.js";
export * from "./IAnnouncementRepository.js";
export * from "./IHolderRepository.js";
export * from "./IClassificationRepository.js";

