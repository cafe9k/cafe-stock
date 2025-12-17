/**
 * 依赖注入容器
 * 管理服务和仓储的依赖关系
 */

import { log } from "../utils/logger.js";

type Factory<T> = () => T;

/**
 * 依赖注入容器类
 */
export class DIContainer {
	private services = new Map<string, any>();
	private factories = new Map<string, Factory<any>>();
	private singletons = new Map<string, any>();

	/**
	 * 注册服务工厂函数
	 * @param key 服务标识
	 * @param factory 工厂函数
	 * @param singleton 是否单例（默认 true）
	 */
	register<T>(key: string, factory: Factory<T>, singleton: boolean = true): void {
		this.factories.set(key, factory);
		if (!singleton) {
			this.services.set(key, factory);
		}
		log.debug("DI", `注册服务: ${key} (单例: ${singleton})`);
	}

	/**
	 * 注册服务实例（直接注册）
	 * @param key 服务标识
	 * @param instance 服务实例
	 */
	registerInstance<T>(key: string, instance: T): void {
		this.singletons.set(key, instance);
		log.debug("DI", `注册服务实例: ${key}`);
	}

	/**
	 * 解析服务
	 * @param key 服务标识
	 * @returns 服务实例
	 */
	resolve<T>(key: string): T {
		// 检查是否已有单例实例
		if (this.singletons.has(key)) {
			return this.singletons.get(key) as T;
		}

		// 检查是否注册了工厂函数
		const factory = this.factories.get(key);
		if (!factory) {
			throw new Error(`服务未注册: ${key}`);
		}

		// 创建实例
		const instance = factory();

		// 如果是单例，缓存实例
		if (!this.services.has(key)) {
			this.singletons.set(key, instance);
		}

		return instance as T;
	}

	/**
	 * 检查服务是否已注册
	 * @param key 服务标识
	 * @returns 是否已注册
	 */
	has(key: string): boolean {
		return this.factories.has(key) || this.singletons.has(key);
	}

	/**
	 * 清空容器
	 */
	clear(): void {
		this.services.clear();
		this.factories.clear();
		this.singletons.clear();
		log.debug("DI", "容器已清空");
	}

	/**
	 * 获取所有已注册的服务标识
	 */
	getRegisteredKeys(): string[] {
		const keys = new Set<string>();
		this.factories.forEach((_, key) => keys.add(key));
		this.singletons.forEach((_, key) => keys.add(key));
		return Array.from(keys);
	}
}

// 创建全局容器实例
export const container = new DIContainer();

