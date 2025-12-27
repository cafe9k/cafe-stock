/**
 * 依赖: 各服务接口文件
 * 输出: 统一导出所有服务接口
 * 职责: 接口聚合模块，提供统一的导出入口
 *
 * ⚠️ 更新提醒：新增接口文件时，请在此处添加导出并更新 electron/services/README.md
 */

export * from "./IAnnouncementService.js";
export * from "./IStockService.js";
export * from "./IFavoriteService.js";
export * from "./IHolderService.js";
export * from "./IClassificationService.js";
