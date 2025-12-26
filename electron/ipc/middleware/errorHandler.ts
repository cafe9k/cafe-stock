/**
 * INPUT: IpcMainInvokeEvent(Electron), IPCResponse(响应类型), log(日志工具)
 * OUTPUT: withErrorHandler() - 错误处理包装函数，统一处理IPC调用异常
 * POS: IPC通信层错误处理中间件，提供统一的错误捕获和响应格式
 * 
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/ipc/README.md
 */

import { IpcMainInvokeEvent } from "electron";
import { IPCResponse, createSuccessResponse, createErrorResponse } from "../../types/errors.js";
import { log } from "../../utils/logger.js";

/**
 * IPC 处理器函数类型
 */
export type IPCHandler<T extends any[] = any[], R = any> = (
	event: IpcMainInvokeEvent,
	...args: T
) => Promise<R> | R;

/**
 * 包装的 IPC 处理器函数类型
 */
export type WrappedIPCHandler<T extends any[] = any[]> = (
	event: IpcMainInvokeEvent,
	...args: T
) => Promise<IPCResponse>;

/**
 * 错误处理中间件
 * 捕获 IPC 处理器中的异常，统一返回格式
 * 
 * @param handler IPC 处理器函数
 * @param handlerName 处理器名称（用于日志）
 * @returns 包装后的处理器
 */
export function withErrorHandler<T extends any[] = any[], R = any>(
	handler: IPCHandler<T, R>,
	handlerName?: string
): WrappedIPCHandler<T> {
	return async (event: IpcMainInvokeEvent, ...args: T): Promise<IPCResponse> => {
		const name = handlerName || handler.name || "unknown";
		
		try {
			log.debug("IPC", `处理请求: ${name}`, args.length > 0 ? args : undefined);
			
			const result = await handler(event, ...args);
			
			log.debug("IPC", `请求成功: ${name}`);
			return createSuccessResponse(result);
		} catch (error) {
			log.error("IPC", `请求失败: ${name}`, error);
			return createErrorResponse(error);
		}
	};
}

/**
 * 批量包装 IPC 处理器
 * 
 * @param handlers 处理器映射对象
 * @returns 包装后的处理器映射对象
 */
export function wrapHandlers<T extends Record<string, IPCHandler>>(
	handlers: T
): { [K in keyof T]: WrappedIPCHandler } {
	const wrapped: any = {};
	
	for (const [name, handler] of Object.entries(handlers)) {
		wrapped[name] = withErrorHandler(handler, name);
	}
	
	return wrapped;
}

