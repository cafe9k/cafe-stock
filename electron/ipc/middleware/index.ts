/**
 * INPUT: errorHandler(错误处理中间件)
 * OUTPUT: 统一导出所有IPC中间件
 * POS: IPC中间件聚合模块，提供统一的导出入口
 * 
 * ⚠️ 更新提醒：新增中间件时，请在此处添加导出并更新 electron/ipc/README.md
 */

export * from "./errorHandler.js";

