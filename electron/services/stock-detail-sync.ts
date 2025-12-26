/**
 * INPUT: TushareClient(API), StockDetailRepository(数据), syncFlagManager(状态管理)
 * OUTPUT: syncStockDetailsWithResume(), getStockDetailsSyncProgress() - 断点续传同步接口
 * POS: 股票详情同步工具，实现增量更新、断点续传和进度管理的低级别同步引擎
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/services/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { Notification } from "electron";
import { TushareClient } from "../tushare.js";
import { StockRepository } from "../repositories/implementations/StockRepository.js";
import { StockDetailRepository } from "../repositories/implementations/StockDetailRepository.js";
import { getDb, syncFlagManager } from "../db.js";
import { log } from "../utils/logger.js";

const stockRepository = new StockRepository(getDb());
const stockDetailRepository = new StockDetailRepository(getDb());

interface SyncProgress {
	status: "started" | "syncing" | "completed" | "failed";
	message?: string;
	current?: number;
	total?: number;
	phase?: string;
	error?: string;
}

interface SyncResult {
	success: boolean;
	stockCount: number;
	message: string;
}

interface ResumeProgress {
	dailyBasicCompleted: boolean;
	syncedCompanies: string[];
	lastProcessedIndex: number;
}

const SYNC_TYPE = "stock_details";
const BATCH_SIZE = 50;
const REQUEST_DELAY = 350; // 350ms * 200次 = 70秒 < 1分钟，留有余量

/**
 * 同步股票详情信息（市值 + 公司信息）
 * 支持断点续传和每月同步一次策略
 */
export async function syncStockDetailsWithResume(
	autoTrigger: boolean = false,
	forceSync: boolean = false,
	onProgress?: (progress: SyncProgress) => void
): Promise<SyncResult> {
	try {
		log.info("StockDetail", `开始股票详情同步 (自动: ${autoTrigger}, 强制: ${forceSync})`);

		// 检查是否需要同步（月度检查）
		if (!forceSync && autoTrigger && syncFlagManager.isSyncedThisMonth(SYNC_TYPE)) {
			const lastSync = syncFlagManager.getLastSyncDate(SYNC_TYPE);
			log.info("StockDetail", `本月已同步过 (${lastSync})，跳过自动同步`);
			return {
				success: true,
				stockCount: 0,
				message: `本月已同步 (${lastSync})`,
			};
		}

		// 发送开始事件
		onProgress?.({
			status: "started",
			message: "初始化股票详情同步...",
			phase: "init",
		});

		// 获取所有上市股票代码
		const stocks = stockRepository.getAllStocks();
		if (!stocks || stocks.length === 0) {
			log.warn("StockDetail", "没有股票数据，跳过详情同步");
			onProgress?.({
				status: "failed",
				message: "没有股票数据",
			});
			return {
				success: false,
				stockCount: 0,
				message: "没有股票数据",
			};
		}

		log.info("StockDetail", `共 ${stocks.length} 只股票需要同步详情`);

		// 获取交易日期
		const today = new Date();
		const tradeDate = today.toISOString().slice(0, 10).replace(/-/g, "");
		log.info("StockDetail", `使用交易日期: ${tradeDate}`);

		// 尝试恢复断点续传进度
		let resumeProgress: ResumeProgress | null = null;
		
		if (!forceSync) {
			resumeProgress = syncFlagManager.getResumeProgress(SYNC_TYPE);
			if (resumeProgress) {
				log.info("StockDetail", `发现断点续传进度: 阶段1完成=${resumeProgress.dailyBasicCompleted}, 已同步公司=${resumeProgress.syncedCompanies.length}`);
			}
		}

		let dailyBasicCompleted = resumeProgress?.dailyBasicCompleted || false;
		const syncedCompanySet = new Set<string>(resumeProgress?.syncedCompanies || []);
		let dailyBasicCount = 0;
		let companyInfoCount = syncedCompanySet.size;
		const failedCompanies: string[] = [];

		// ========== 阶段1：批量获取所有股票的 daily_basic 数据 ==========
		if (!dailyBasicCompleted) {
			log.info("StockDetail", "阶段1：获取市值数据（按交易日期批量查询）");
			onProgress?.({
				status: "syncing",
				message: "正在获取市值数据...",
				current: 0,
				total: stocks.length,
				phase: "daily_basic",
			});

			try {
				let offset = 0;
				const limit = 5000;
				let hasMore = true;

				while (hasMore) {
					log.debug("StockDetail", `获取 daily_basic 数据，offset=${offset}, limit=${limit}`);
					const dailyBasicData = await TushareClient.getDailyBasic(undefined, tradeDate, undefined, undefined, limit, offset);

					if (dailyBasicData && dailyBasicData.length > 0) {
						log.info("StockDetail", `获取到 ${dailyBasicData.length} 条市值数据`);
						stockDetailRepository.upsertDailyBasic(dailyBasicData);
						dailyBasicCount += dailyBasicData.length;

						if (dailyBasicData.length < limit) {
							hasMore = false;
						} else {
							offset += limit;
							await new Promise((resolve) => setTimeout(resolve, 200));
						}
					} else {
						log.warn("StockDetail", "未获取到市值数据，可能非交易日或无数据");
						hasMore = false;
					}
				}

				dailyBasicCompleted = true;
				log.info("StockDetail", `阶段1完成：共获取 ${dailyBasicCount} 条市值数据`);

				// 保存阶段1完成的进度
				syncFlagManager.saveResumeProgress(SYNC_TYPE, {
					dailyBasicCompleted: true,
					syncedCompanies: Array.from(syncedCompanySet),
					lastProcessedIndex: 0,
				});
			} catch (error: any) {
				log.error("StockDetail", "获取市值数据失败:", error);
				// 保存当前进度
				syncFlagManager.saveResumeProgress(SYNC_TYPE, {
					dailyBasicCompleted: false,
					syncedCompanies: Array.from(syncedCompanySet),
					lastProcessedIndex: 0,
				});
				throw error;
			}
		} else {
			log.info("StockDetail", "阶段1已完成，跳过市值数据获取");
		}

		// ========== 阶段2：逐个获取公司信息（支持断点续传） ==========
		log.info("StockDetail", "阶段2：获取公司信息（逐个查询，支持断点续传）");

		// 过滤出尚未同步的股票
		const stocksToSync = stocks.filter((s: any) => !syncedCompanySet.has(s.ts_code));
		log.info("StockDetail", `需要同步的公司信息数: ${stocksToSync.length} (已同步: ${syncedCompanySet.size})`);

		const totalBatches = Math.ceil(stocksToSync.length / BATCH_SIZE);
		let processedCount = syncedCompanySet.size;

		for (let i = 0; i < totalBatches; i++) {
			const start = i * BATCH_SIZE;
			const end = Math.min(start + BATCH_SIZE, stocksToSync.length);
			const batch = stocksToSync.slice(start, end);
			const batchNumber = i + 1;

			log.info("StockDetail", `处理第 ${batchNumber}/${totalBatches} 批公司信息，股票数: ${batch.length}`);

			onProgress?.({
				status: "syncing",
				message: `正在获取公司信息 ${processedCount}/${stocks.length}`,
				current: processedCount,
				total: stocks.length,
				phase: "company_info",
			});

			// 逐个查询公司信息
			for (const stock of batch) {
				try {
					const companyData = await TushareClient.getStockCompany(stock.ts_code);

					if (companyData && companyData.length > 0) {
						stockDetailRepository.upsertCompanyInfo(companyData);
						syncedCompanySet.add(stock.ts_code);
						companyInfoCount++;
						processedCount++;
					}

					// API 限流控制：每次请求延迟 350ms
					await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
				} catch (error: any) {
					log.error("StockDetail", `获取 ${stock.ts_code} 公司信息失败:`, error);
					failedCompanies.push(stock.ts_code);
				}
			}

			// 每批次保存一次断点进度
			syncFlagManager.saveResumeProgress(SYNC_TYPE, {
				dailyBasicCompleted: true,
				syncedCompanies: Array.from(syncedCompanySet),
				lastProcessedIndex: end,
			});

			log.info("StockDetail", `批次 ${batchNumber} 完成，已同步 ${processedCount}/${stocks.length}`);

			// 批次间额外延迟
			if (i < totalBatches - 1) {
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}

		log.info("StockDetail", `阶段2完成：共获取 ${companyInfoCount} 条公司信息`);

		// 更新同步标志位（使用当前年月）
		const currentMonth = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}`;
		syncFlagManager.updateSyncFlag(SYNC_TYPE, currentMonth);

		// 清除断点续传进度
		syncFlagManager.clearResumeProgress(SYNC_TYPE);

		// 发送完成事件
		const successCount = dailyBasicCount + companyInfoCount;
		const message =
			failedCompanies.length > 0
				? `同步完成：市值 ${dailyBasicCount} 条，公司 ${companyInfoCount} 条，失败 ${failedCompanies.length} 个`
				: `成功同步：市值 ${dailyBasicCount} 条，公司 ${companyInfoCount} 条`;

		log.info("StockDetail", message);

		onProgress?.({
			status: "completed",
			message,
			current: stocks.length,
			total: stocks.length,
		});

		// 显示通知（仅手动触发时）
		if (!autoTrigger && Notification.isSupported()) {
			new Notification({
				title: "股票详情同步完成",
				body: message,
			}).show();
		}

		return {
			success: true,
			stockCount: successCount,
			message,
		};
	} catch (error: any) {
		log.error("StockDetail", "同步股票详情失败:", error);

		// 发送错误事件
		onProgress?.({
			status: "failed",
			message: error.message || "同步失败",
			error: error.message,
		});

		return {
			success: false,
			stockCount: 0,
			message: error.message || "同步失败",
		};
	}
}

/**
 * 获取股票详情同步进度信息
 */
export function getStockDetailsSyncProgress(): {
	hasProgress: boolean;
	progress: ResumeProgress | null;
	isSyncedThisMonth: boolean;
	lastSyncDate: string | null;
} {
	const progress = syncFlagManager.getResumeProgress(SYNC_TYPE);
	const isSynced = syncFlagManager.isSyncedThisMonth(SYNC_TYPE);
	const lastSync = syncFlagManager.getLastSyncDate(SYNC_TYPE);

	return {
		hasProgress: progress !== null,
		progress,
		isSyncedThisMonth: isSynced,
		lastSyncDate: lastSync,
	};
}

