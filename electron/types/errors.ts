/**
 * 错误类型定义
 */

/**
 * 错误码枚举
 */
export enum ErrorCode {
	// 通用错误 (1000-1999)
	UNKNOWN_ERROR = "UNKNOWN_ERROR",
	INVALID_PARAMS = "INVALID_PARAMS",
	OPERATION_FAILED = "OPERATION_FAILED",

	// 数据库错误 (2000-2999)
	DATABASE_ERROR = "DATABASE_ERROR",
	DATABASE_CONNECTION_ERROR = "DATABASE_CONNECTION_ERROR",
	DATABASE_QUERY_ERROR = "DATABASE_QUERY_ERROR",

	// API 错误 (3000-3999)
	API_ERROR = "API_ERROR",
	API_REQUEST_FAILED = "API_REQUEST_FAILED",
	API_RESPONSE_ERROR = "API_RESPONSE_ERROR",
	API_RATE_LIMIT = "API_RATE_LIMIT",

	// 业务错误 (4000-4999)
	STOCK_NOT_FOUND = "STOCK_NOT_FOUND",
	ANNOUNCEMENT_NOT_FOUND = "ANNOUNCEMENT_NOT_FOUND",
	SYNC_IN_PROGRESS = "SYNC_IN_PROGRESS",
	SYNC_FAILED = "SYNC_FAILED",

	// 文件系统错误 (5000-5999)
	FILE_NOT_FOUND = "FILE_NOT_FOUND",
	FILE_READ_ERROR = "FILE_READ_ERROR",
	FILE_WRITE_ERROR = "FILE_WRITE_ERROR",
}

/**
 * 错误详情接口
 */
export interface ErrorDetails {
	code: ErrorCode | string;
	message: string;
	details?: unknown;
	stack?: string;
}

/**
 * IPC 响应接口
 */
export interface IPCResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: ErrorDetails;
}

/**
 * 自定义应用错误类
 */
export class AppError extends Error {
	public readonly code: ErrorCode | string;
	public readonly details?: unknown;

	constructor(code: ErrorCode | string, message: string, details?: unknown) {
		super(message);
		this.name = "AppError";
		this.code = code;
		this.details = details;

		// 维护正确的堆栈跟踪
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}
	}
}

/**
 * 获取错误码
 */
export function getErrorCode(error: unknown): ErrorCode | string {
	if (error instanceof AppError) {
		return error.code;
	}
	if (error instanceof Error) {
		// 尝试从错误消息中识别错误类型
		const message = error.message.toLowerCase();
		if (message.includes("database") || message.includes("sqlite")) {
			return ErrorCode.DATABASE_ERROR;
		}
		if (message.includes("api") || message.includes("fetch") || message.includes("network")) {
			return ErrorCode.API_ERROR;
		}
		if (message.includes("file") || message.includes("enoent")) {
			return ErrorCode.FILE_NOT_FOUND;
		}
	}
	return ErrorCode.UNKNOWN_ERROR;
}

/**
 * 获取错误消息
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "未知错误";
}

/**
 * 获取错误详情
 */
export function getErrorDetails(error: unknown): unknown {
	if (error instanceof AppError) {
		return error.details;
	}
	if (error instanceof Error) {
		return {
			name: error.name,
			stack: error.stack,
		};
	}
	return error;
}

/**
 * 创建成功响应
 */
export function createSuccessResponse<T>(data: T): IPCResponse<T> {
	return {
		success: true,
		data,
	};
}

/**
 * 创建错误响应
 */
export function createErrorResponse(error: unknown): IPCResponse {
	return {
		success: false,
		error: {
			code: getErrorCode(error),
			message: getErrorMessage(error),
			details: getErrorDetails(error),
		},
	};
}

