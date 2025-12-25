/**
 * 统一日志系统
 * 提供日志级别管理、格式化输出和文件记录功能
 */

import { app } from "electron";
import path from "path";
import fs from "fs";

/**
 * 日志级别枚举
 */
export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
}

/**
 * 日志级别名称映射
 */
const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
	[LogLevel.DEBUG]: "DEBUG",
	[LogLevel.INFO]: "INFO",
	[LogLevel.WARN]: "WARN",
	[LogLevel.ERROR]: "ERROR",
};

/**
 * 日志配置接口
 */
interface LoggerConfig {
	/**
	 * 当前日志级别（低于此级别的日志不会输出）
	 * 开发环境: DEBUG，生产环境: INFO
	 */
	level: LogLevel;
	/**
	 * 是否启用文件日志
	 */
	enableFileLog: boolean;
	/**
	 * 日志文件路径
	 */
	logFilePath?: string;
	/**
	 * 是否启用控制台输出
	 */
	enableConsole: boolean;
}

/**
 * 获取当前环境配置
 */
function getConfig(): LoggerConfig {
	const isDev = process.env.NODE_ENV !== "production" || !app.isPackaged;

	return {
		level: isDev ? LogLevel.DEBUG : LogLevel.INFO,
		enableFileLog: !isDev, // 生产环境启用文件日志
		logFilePath: isDev ? undefined : path.join(app.getPath("logs"), "cafe-stock.log"),
		enableConsole: true,
	};
}

/**
 * 格式化时间戳
 */
function formatTimestamp(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");
	const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * 格式化日志消息
 */
function formatMessage(level: LogLevel, category: string, message: string, ...args: any[]): string {
	const timestamp = formatTimestamp();
	const levelName = LOG_LEVEL_NAMES[level];
	const categoryStr = category ? `[${category}]` : "";

	// 格式化参数
	let formattedArgs = "";
	if (args.length > 0) {
		try {
			formattedArgs = args
				.map((arg) => {
					if (typeof arg === "object") {
						return JSON.stringify(arg, null, 2);
					}
					return String(arg);
				})
				.join(" ");
		} catch (error) {
			formattedArgs = "[无法序列化的对象]";
		}
	}

	const fullMessage = formattedArgs ? `${message} ${formattedArgs}` : message;
	return `${timestamp} [${levelName}]${categoryStr} ${fullMessage}`;
}

/**
 * 写入日志文件
 */
function writeToFile(config: LoggerConfig, formattedMessage: string): void {
	if (!config.enableFileLog || !config.logFilePath) {
		return;
	}

	try {
		// 确保日志目录存在
		const logDir = path.dirname(config.logFilePath);
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true });
		}

		// 追加写入日志文件
		fs.appendFileSync(config.logFilePath, formattedMessage + "\n", "utf-8");
	} catch (error) {
		// 文件写入失败时，使用 console.error 输出（避免循环）
		console.error("[Logger] Failed to write log to file:", error);
	}
}

/**
 * 日志记录器类
 */
class Logger {
	private config: LoggerConfig;

	constructor() {
		this.config = getConfig();
	}

	/**
	 * 更新配置
	 */
	updateConfig(config: Partial<LoggerConfig>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * 记录 DEBUG 级别日志
	 */
	debug(category: string, message: string, ...args: any[]): void {
		this.log(LogLevel.DEBUG, category, message, ...args);
	}

	/**
	 * 记录 INFO 级别日志
	 */
	info(category: string, message: string, ...args: any[]): void {
		this.log(LogLevel.INFO, category, message, ...args);
	}

	/**
	 * 记录 WARN 级别日志
	 */
	warn(category: string, message: string, ...args: any[]): void {
		this.log(LogLevel.WARN, category, message, ...args);
	}

	/**
	 * 记录 ERROR 级别日志
	 */
	error(category: string, message: string, ...args: any[]): void {
		this.log(LogLevel.ERROR, category, message, ...args);
	}

	/**
	 * 核心日志记录方法
	 */
	private log(level: LogLevel, category: string, message: string, ...args: any[]): void {
		// 检查日志级别
		if (level < this.config.level) {
			return;
		}

		const formattedMessage = formatMessage(level, category, message, ...args);

		// 控制台输出
		if (this.config.enableConsole) {
			switch (level) {
				case LogLevel.DEBUG:
					console.debug(formattedMessage);
					break;
				case LogLevel.INFO:
					console.info(formattedMessage);
					break;
				case LogLevel.WARN:
					console.warn(formattedMessage);
					break;
				case LogLevel.ERROR:
					console.error(formattedMessage);
					break;
			}
		}

		// 文件输出（ERROR 和 WARN 级别总是写入文件）
		if (level >= LogLevel.WARN || this.config.enableFileLog) {
			writeToFile(this.config, formattedMessage);
		}
	}
}

/**
 * 创建日志记录器实例
 */
const logger = new Logger();

/**
 * 导出便捷方法
 */
export const log = {
	debug: (category: string, message: string, ...args: any[]) => logger.debug(category, message, ...args),
	info: (category: string, message: string, ...args: any[]) => logger.info(category, message, ...args),
	warn: (category: string, message: string, ...args: any[]) => logger.warn(category, message, ...args),
	error: (category: string, message: string, ...args: any[]) => logger.error(category, message, ...args),
};

/**
 * 导出默认日志记录器实例
 */
export default logger;


