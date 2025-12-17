/**
 * 服务注册模块
 * 负责将所有服务和仓储注册到 DI 容器
 */

import { container } from "./container.js";
import { getDatabase } from "../database/connection.js";
import { log } from "../utils/logger.js";

// 导入仓储
import { StockRepository } from "../repositories/implementations/StockRepository.js";
import { FavoriteRepository } from "../repositories/implementations/FavoriteRepository.js";
import { AnnouncementRepository } from "../repositories/implementations/AnnouncementRepository.js";
import { HolderRepository } from "../repositories/implementations/HolderRepository.js";
import { ClassificationRepository } from "../repositories/implementations/ClassificationRepository.js";

// 导入仓储接口类型
import type { IStockRepository } from "../repositories/interfaces/IStockRepository.js";
import type { IFavoriteRepository } from "../repositories/interfaces/IFavoriteRepository.js";
import type { IAnnouncementRepository } from "../repositories/interfaces/IAnnouncementRepository.js";
import type { IHolderRepository } from "../repositories/interfaces/IHolderRepository.js";
import type { IClassificationRepository } from "../repositories/interfaces/IClassificationRepository.js";

// 服务标识常量
export const SERVICE_KEYS = {
	// 仓储
	STOCK_REPOSITORY: "StockRepository",
	FAVORITE_REPOSITORY: "FavoriteRepository",
	ANNOUNCEMENT_REPOSITORY: "AnnouncementRepository",
	HOLDER_REPOSITORY: "HolderRepository",
	CLASSIFICATION_REPOSITORY: "ClassificationRepository",
	
	// 服务（暂时保留原有导出方式，逐步迁移）
	ANNOUNCEMENT_SERVICE: "AnnouncementService",
	STOCK_SERVICE: "StockService",
	FAVORITE_SERVICE: "FavoriteService",
	HOLDER_SERVICE: "HolderService",
	CLASSIFICATION_SERVICE: "ClassificationService",
	NEWS_SERVICE: "NewsService",
};

/**
 * 注册所有服务和仓储
 */
export function registerServices(): void {
	log.info("DI", "开始注册服务...");

	const db = getDatabase();

	// 注册仓储（单例）
	container.register<IStockRepository>(
		SERVICE_KEYS.STOCK_REPOSITORY,
		() => new StockRepository(db),
		true
	);

	container.register<IFavoriteRepository>(
		SERVICE_KEYS.FAVORITE_REPOSITORY,
		() => new FavoriteRepository(db),
		true
	);

	container.register<IAnnouncementRepository>(
		SERVICE_KEYS.ANNOUNCEMENT_REPOSITORY,
		() => new AnnouncementRepository(db),
		true
	);

	container.register<IHolderRepository>(
		SERVICE_KEYS.HOLDER_REPOSITORY,
		() => new HolderRepository(db),
		true
	);

	container.register<IClassificationRepository>(
		SERVICE_KEYS.CLASSIFICATION_REPOSITORY,
		() => new ClassificationRepository(db),
		true
	);

	log.info("DI", "服务注册完成");
}

/**
 * 获取仓储实例的便捷方法
 */
export function getStockRepository(): IStockRepository {
	return container.resolve<IStockRepository>(SERVICE_KEYS.STOCK_REPOSITORY);
}

export function getFavoriteRepository(): IFavoriteRepository {
	return container.resolve<IFavoriteRepository>(SERVICE_KEYS.FAVORITE_REPOSITORY);
}

export function getAnnouncementRepository(): IAnnouncementRepository {
	return container.resolve<IAnnouncementRepository>(SERVICE_KEYS.ANNOUNCEMENT_REPOSITORY);
}

export function getHolderRepository(): IHolderRepository {
	return container.resolve<IHolderRepository>(SERVICE_KEYS.HOLDER_REPOSITORY);
}

export function getClassificationRepository(): IClassificationRepository {
	return container.resolve<IClassificationRepository>(SERVICE_KEYS.CLASSIFICATION_REPOSITORY);
}

