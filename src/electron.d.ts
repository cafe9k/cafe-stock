// Electron API 类型定义

/**
 * 分类定义
 */
export interface ClassificationCategory {
	id: number;
	category_key: string;
	category_name: string;
	color: string;
	icon: string;
	priority: number;
	enabled: boolean;
	created_at: string;
	updated_at: string;
}

/**
 * 分类规则项
 */
export interface ClassificationRuleItem {
	id: number;
	category_key: string;
	keyword: string;
	enabled: boolean;
	created_at: string;
	updated_at: string;
}

export interface ElectronAPI {
	showNotification: (title: string, body: string) => Promise<void>;
	getAppVersion: () => Promise<string>;
	getAnnouncements: (page: number, pageSize: number) => Promise<{ items: any[]; total: number; shouldLoadHistory: boolean }>;
	triggerIncrementalSync: () => Promise<{
		status: "success" | "failed" | "skipped";
		message: string;
		totalSynced?: number;
	}>;
	loadHistoricalData: () => Promise<{
		status: "success" | "failed" | "skipped";
		message: string;
		totalLoaded?: number;
		startDate?: string;
		endDate?: string;
	}>;
	onDataUpdated: (
		callback: (data: { type: "incremental" | "historical"; totalSynced?: number; totalLoaded?: number; currentBatchSize: number }) => void
	) => () => void;

	// 聚合公告相关
	getAnnouncementsGrouped: (
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string,
		market?: string,
		forceRefresh?: boolean,
		searchKeyword?: string,
		categories?: string[]
	) => Promise<{
		items: Array<{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcement_count: number;
			latest_ann_date: string;
		}>;
		total: number;
		page: number;
		pageSize: number;
	}>;
	getStockAnnouncements: (
		tsCode: string,
		limit?: number,
		startDate?: string,
		endDate?: string
	) => Promise<
		Array<{
			ts_code: string;
			ann_date: string;
			ann_type: string;
			title: string;
			content: string;
			pub_time: string;
		}>
	>;
	searchAnnouncementsGrouped: (
		keyword: string,
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string,
		market?: string
	) => Promise<{
		items: Array<{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcement_count: number;
			latest_ann_date: string;
		}>;
		total: number;
		page: number;
		pageSize: number;
	}>;

	// 获取最近交易日
	getLatestTradeDate: () => Promise<string>;

	// 获取公告 PDF 文件信息
	getAnnouncementPdf: (
		tsCode: string,
		annDate: string,
		title: string
	) => Promise<{
		success: boolean;
		url?: string;
		message?: string;
	}>;

	// 在浏览器中打开 URL
	openExternal: (url: string) => Promise<{
		success: boolean;
		message?: string;
	}>;

	// 关注股票相关
	addFavoriteStock: (tsCode: string) => Promise<{ success: boolean; message?: string }>;
	removeFavoriteStock: (tsCode: string) => Promise<{ success: boolean; message?: string }>;
	isFavoriteStock: (tsCode: string) => Promise<boolean>;
	getAllFavoriteStocks: () => Promise<string[]>;
	countFavoriteStocks: () => Promise<number>;
	getFavoriteStocksAnnouncementsGrouped: (
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string
	) => Promise<{
		items: Array<{
			ts_code: string;
			stock_name: string;
			industry: string;
			market: string;
			announcement_count: number;
			latest_ann_date: string;
			latest_ann_title?: string;
		}>;
		total: number;
		page: number;
		pageSize: number;
	}>;

	// 自动更新相关
	checkForUpdates: () => Promise<{ available: boolean; updateInfo?: any; error?: string; message?: string }>;
	downloadUpdate: () => Promise<{ success: boolean; error?: string }>;
	installUpdate: () => Promise<void>;
	onUpdateChecking: (callback: () => void) => () => void;
	onUpdateAvailable: (callback: (info: { version: string; releaseDate: string; releaseNotes?: string }) => void) => () => void;
	onUpdateNotAvailable: (callback: (info: any) => void) => () => void;
	onUpdateDownloadProgress: (callback: (progress: { percent: number; transferred: number; total: number }) => void) => () => void;
	onUpdateDownloaded: (callback: (info: { version: string }) => void) => () => void;
	onUpdateError: (callback: (error: string) => void) => () => void;

	// 十大股东相关
	getTop10Holders: (
		tsCode: string,
		period?: string,
		annDate?: string,
		startDate?: string,
		endDate?: string
	) => Promise<
		Array<{
			ts_code: string;
			ann_date: string;
			end_date: string;
			holder_name: string;
			hold_amount: number;
			hold_ratio: number;
		}>
	>;

	// 获取所有股票列表
	getAllStocks: () => Promise<
		Array<{
			ts_code: string;
			symbol: string;
			name: string;
			area: string;
			industry: string;
			market: string;
			list_date: string;
		}>
	>;

	// 同步所有股票的十大股东
	syncAllTop10Holders: () => Promise<{
		status: "success" | "failed" | "skipped" | "stopped";
		message: string;
		successCount?: number;
		skipCount?: number;
		failCount?: number;
		totalStocks?: number;
	}>;

	// 同步股票详情信息
	syncStockDetails: () => Promise<{
		success: boolean;
		stockCount: number;
		message: string;
	}>;

	// 获取股票详情统计
	getStockDetailsStats: () => Promise<{
		dailyBasicCount: number;
		companyInfoCount: number;
	}>;

	// 获取股票详情同步进度（断点续传）
	getStockDetailsSyncProgress: () => Promise<{
		hasProgress: boolean;
		progress: {
			dailyBasicCompleted: boolean;
			syncedCompanies: string[];
			lastProcessedIndex: number;
		} | null;
		isSyncedThisMonth: boolean;
		lastSyncDate: string | null;
	}>;

	// 获取股票公司信息
	getStockCompanyInfo: (tsCode: string) => Promise<{
		ts_code: string;
		chairman?: string;
		manager?: string;
		secretary?: string;
		reg_capital?: string;
		setup_date?: string;
		province?: string;
		city?: string;
		introduction?: string;
		website?: string;
		employees?: number;
		main_business?: string;
		business_scope?: string;
	} | null>;

	// 删除股票详情同步状态
	deleteStockDetailsSyncFlag: () => Promise<{
		success: boolean;
		message: string;
	}>;

	// 监听股票详情同步进度
	onStockDetailsSyncProgress: (
		callback: (progress: {
			status: "started" | "syncing" | "completed" | "failed";
			message?: string;
			current?: number;
			total?: number;
			error?: string;
		}) => void
	) => () => void;

	// 暂停/恢复同步
	togglePauseTop10HoldersSync: () => Promise<{
		status: "paused" | "resumed" | "failed";
		message: string;
		isPaused?: boolean;
	}>;

	// 停止同步
	stopTop10HoldersSync: () => Promise<{
		status: "success" | "failed";
		message: string;
	}>;

	// 同步单个股票的十大股东
	syncStockTop10Holders: (tsCode: string) => Promise<{
		status: "success" | "failed";
		message: string;
		count?: number;
	}>;

	// 从数据库获取十大股东数据
	getTop10HoldersFromDb: (
		tsCode: string,
		limit?: number
	) => Promise<
		Array<{
			ts_code: string;
			ann_date: string;
			end_date: string;
			holder_name: string;
			hold_amount: number;
			hold_ratio: number;
		}>
	>;

	// 检查是否已有十大股东数据
	hasTop10HoldersData: (tsCode: string) => Promise<boolean>;

	// 获取同步统计信息
	getTop10HoldersSyncStats: () => Promise<{
		totalStocks: number;
		syncedStocks: number;
		syncedStockCodes: string[];
		syncRate: string;
	}>;

	// 获取股票的所有报告期
	getTop10HoldersEndDates: (tsCode: string) => Promise<string[]>;

	// 根据报告期获取十大股东
	getTop10HoldersByEndDate: (
		tsCode: string,
		endDate: string
	) => Promise<
		Array<{
			ts_code: string;
			ann_date: string;
			end_date: string;
			holder_name: string;
			hold_amount: number;
			hold_ratio: number;
		}>
	>;

	// 监听十大股东同步进度
	onTop10HoldersSyncProgress: (
		callback: (progress: {
			current: number;
			total: number;
			tsCode: string;
			name: string;
			status: "success" | "skipped" | "failed";
			error?: string;
			successCount: number;
			skipCount: number;
			failCount: number;
		}) => void
	) => () => void;

	// 获取数据库连接信息
	getDbConnectionInfo: () => Promise<{
		success: boolean;
		dbPath?: string;
		connectionString?: string;
		httpServerUrl?: string | null;
		isServerRunning?: boolean;
		port?: number;
		hasAuth?: boolean;
		username?: string | null;
		password?: string;
		message?: string;
	}>;

	// 启动 SQLite HTTP 服务器
	startSqliteHttpServer: (port?: number) => Promise<{
		success: boolean;
		port?: number;
		url?: string;
		message?: string;
	}>;

	// 停止 SQLite HTTP 服务器
	stopSqliteHttpServer: () => Promise<{
		success: boolean;
		message?: string;
	}>;

	// 获取 SQLite HTTP 服务器状态
	getSqliteHttpServerStatus: () => Promise<{
		isRunning: boolean;
		port: number;
		url: string | null;
		hasAuth: boolean;
		username: string | null;
	}>;

	// 设置 SQLite HTTP 服务器认证信息
	setSqliteHttpAuth: (
		username: string,
		password: string
	) => Promise<{
		success: boolean;
		message?: string;
	}>;

	// 清除 SQLite HTTP 服务器认证信息
	clearSqliteHttpAuth: () => Promise<{
		success: boolean;
		message?: string;
	}>;

	// 监听 SQLite HTTP 服务器事件
	onSqliteHttpServerStarted: (callback: (data: { port: number; hasAuth: boolean; username: string | null }) => void) => () => void;
	onSqliteHttpServerStopped: (callback: () => void) => () => void;
	onSqliteHttpServerError: (callback: (error: { message: string }) => void) => () => void;

	// 股票列表同步相关
	getStockListSyncInfo: () => Promise<{
		stockCount: number;
		lastSyncTime: string | null;
	}>;
	syncAllStocks: () => Promise<{
		success: boolean;
		stockCount: number;
		message: string;
	}>;
	checkStockListSyncStatus: () => Promise<{
		isSyncedToday: boolean;
		stockCount: number;
		lastSyncTime: string | null;
	}>;
	onStockListSyncProgress: (
		callback: (progress: {
			status: "started" | "syncing" | "completed" | "failed";
			message?: string;
			total?: number;
			current?: number;
			stockCount?: number;
			error?: string;
		}) => void
	) => () => void;
	getCacheDataStats: () => Promise<{
		stocks: {
			count: number;
			lastSyncTime: string | null;
		};
		favoriteStocks: {
			count: number;
		};
		top10Holders: {
			stockCount: number;
			recordCount: number;
		};
		announcements: {
			count: number;
		};
		syncFlags: Array<{
			type: string;
			lastSyncDate: string;
			updatedAt: string;
		}>;
	}>;

	// ============= 公告缓存相关 =============

	// 获取公告（智能缓存）
	getAnnouncementsWithCache: (
		tsCode: string | null,
		startDate: string,
		endDate: string,
		onProgress?: boolean
	) => Promise<{
		success: boolean;
		data: Array<{
			ann_date: string;
			ts_code: string;
			name: string;
			title: string;
			url: string;
			rec_time: string;
		}>;
		source: "cache" | "api" | "error";
		count: number;
		error?: string;
	}>;

	// 获取公告（仅从缓存）
	getAnnouncementsFromCache: (
		tsCode: string | null,
		startDate: string,
		endDate: string
	) => Promise<{
		success: boolean;
		data: Array<{
			ann_date: string;
			ts_code: string;
			name: string;
			title: string;
			url: string;
			rec_time: string;
		}>;
		isCached: boolean;
		count: number;
		error?: string;
	}>;

	// 检查公告时间范围是否已缓存
	checkAnnouncementRangeSynced: (
		tsCode: string | null,
		startDate: string,
		endDate: string
	) => Promise<{
		success: boolean;
		isSynced: boolean;
		unsyncedRanges: Array<{
			start_date: string;
			end_date: string;
		}>;
		error?: string;
	}>;

	// 搜索公告（从缓存）
	searchAnnouncementsFromCache: (
		keyword: string,
		limit?: number
	) => Promise<{
		success: boolean;
		data: Array<{
			ann_date: string;
			ts_code: string;
			name: string;
			title: string;
			url: string;
			rec_time: string;
			stock_name?: string;
		}>;
		count: number;
		error?: string;
	}>;

	// 获取缓存的公告统计信息
	getAnnouncementsCacheStats: () => Promise<{
		success: boolean;
		totalCount: number;
		error?: string;
	}>;

	// 监听公告同步进度
	onAnnouncementSyncProgress: (
		callback: (progress: { tsCode: string; startDate: string; endDate: string; currentBatch: number; totalFetched: number }) => void
	) => () => void;

	// ============= 公告打标相关 =============

	// 获取未打标公告数量
	getUntaggedCount: () => Promise<{ success: boolean; count: number; error?: string }>;

	// 批量打标所有公告
	tagAllAnnouncements: (batchSize?: number, reprocessAll?: boolean) => Promise<{
		success: boolean;
		processed: number;
		total: number;
		error?: string;
	}>;

	// 监听打标进度
	onTaggingProgress: (callback: (data: { processed: number; total: number; percentage: string }) => void) => () => void;

	// ============= 分类规则管理相关 =============

	// 获取所有分类
	getClassificationCategories: () => Promise<{
		success: boolean;
		categories: Array<ClassificationCategory>;
		error?: string;
	}>;

	// 获取所有规则
	getClassificationRules: () => Promise<{
		success: boolean;
		rules: Array<ClassificationRuleItem>;
		error?: string;
	}>;

	// 获取指定分类的规则
	getClassificationRulesByCategory: (categoryKey: string) => Promise<{
		success: boolean;
		rules: Array<ClassificationRuleItem>;
		error?: string;
	}>;

	// 更新分类信息
	updateClassificationCategory: (
		id: number,
		updates: {
			category_name?: string;
			color?: string;
			icon?: string;
			priority?: number;
			enabled?: boolean;
		}
	) => Promise<{
		success: boolean;
		changes: number;
		error?: string;
	}>;

	// 添加分类规则
	addClassificationRule: (categoryKey: string, keyword: string) => Promise<{
		success: boolean;
		id: number;
		error?: string;
	}>;

	// 更新分类规则
	updateClassificationRule: (id: number, keyword: string, enabled: boolean) => Promise<{
		success: boolean;
		changes: number;
		error?: string;
	}>;

	// 删除分类规则
	deleteClassificationRule: (id: number) => Promise<{
		success: boolean;
		changes: number;
		error?: string;
	}>;

	// 重置为默认规则
	resetClassificationRules: () => Promise<{
		success: boolean;
		error?: string;
	}>;

	// 重新处理所有公告
	reprocessAllAnnouncements: (batchSize?: number) => Promise<{
		success: boolean;
		processed: number;
		total: number;
		error?: string;
	}>;

	// 监听重新打标进度
	onReprocessProgress: (callback: (data: { processed: number; total: number; percentage: string }) => void) => () => void;

	// ============= 列宽配置相关 =============

	// 保存列宽配置
	saveColumnWidths: (
		tableId: string,
		columnWidths: Record<string, number>
	) => Promise<{
		success: boolean;
		error?: string;
	}>;

	// 获取列宽配置
	getColumnWidths: (tableId: string) => Promise<{
		success: boolean;
		columnWidths: Record<string, number>;
		error?: string;
	}>;

	// ============= 数据库重置相关 =============

	// 重置数据库
	resetDatabase: (options: { backup: boolean }) => Promise<{
		success: boolean;
		message: string;
		backupPath?: string | null;
	}>;

	// ============= 数据库 Schema 和样本数据相关 =============

	// 获取数据库所有表列表
	getDatabaseTables: () => Promise<{
		success: boolean;
		tables: string[];
		error?: string;
	}>;

	// 获取表的 schema 信息
	getTableSchema: (tableName: string) => Promise<{
		success: boolean;
		tableName?: string;
		columns?: Array<{
			cid: number;
			name: string;
			type: string;
			notNull: boolean;
			defaultValue: any;
			primaryKey: boolean;
		}>;
		indexes?: Array<{
			name: string;
			sql: string | null;
		}>;
		createSql?: string | null;
		error?: string;
	}>;

	// 获取表的样本数据
	getTableSampleData: (tableName: string, limit?: number) => Promise<{
		success: boolean;
		tableName?: string;
		totalCount?: number;
		sampleData?: any[];
		limit?: number;
		error?: string;
	}>;
}

declare global {
	interface Window {
		electronAPI: ElectronAPI;
	}

	// WebView 标签类型定义
	namespace JSX {
		interface IntrinsicElements {
			webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
				src?: string;
				allowpopups?: string;
				plugins?: string;
				partition?: string;
				preload?: string;
				useragent?: string;
			};
		}
	}
}

export {};
