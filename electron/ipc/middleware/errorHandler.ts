/**
 * IPC 错误处理中间件
 * 统一处理 IPC 调用中的错误
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

