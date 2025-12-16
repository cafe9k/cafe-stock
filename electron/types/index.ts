/**
 * 统一类型定义
 * 从 main.ts 提取并集中管理所有类型定义
 */

import { BrowserWindow, Tray, NativeImage } from "electron";
import { Server } from "http";

// ==================== 应用相关类型 ====================

/**
 * 扩展的 App 对象类型
 */
export interface ExtendedApp {
	isQuitting?: boolean;
}

// ==================== 窗口和托盘相关类型 ====================

/**
 * 窗口状态
 */
export interface WindowState {
	window: BrowserWindow | null;
	tray: Tray | null;
}

// ==================== 同步状态相关类型 ====================

/**
 * 同步状态管理
 */
export interface SyncState {
	isSyncing: boolean;
	isLoadingHistory: boolean;
	isSyncingHolders: boolean;
	isPausedHolders: boolean;
}

/**
 * 同步进度信息
 */
export interface SyncProgress {
	status: "started" | "syncing" | "completed" | "failed" | "skipped" | "paused" | "resumed";
	message?: string;
	total?: number;
	current?: number;
	stockCount?: number;
	error?: string;
	tsCode?: string;
	name?: string;
	successCount?: number;
	skipCount?: number;
	failCount?: number;
}

/**
 * 同步结果
 */
export interface SyncResult {
	success: boolean;
	stockCount?: number;
	message: string;
	status?: string;
	successCount?: number;
	skipCount?: number;
	failCount?: number;
	totalStocks?: number;
}

// ==================== SQLite HTTP Server 相关类型 ====================

/**
 * SQLite HTTP Server 状态
 */
export interface SqliteHttpServerState {
	server: Server | null;
	port: number;
	username: string;
	password: string;
}

/**
 * SQLite HTTP Server 状态信息
 */
export interface SqliteHttpServerStatus {
	running: boolean;
	port?: number;
	hasAuth?: boolean;
	dbPath?: string;
}

// ==================== 公告相关类型 ====================

/**
 * 公告数据项
 */
export interface Announcement {
	ts_code: string;
	ann_date: string;
	ann_type: string;
	title: string;
	content?: string;
	pub_time?: string;
	category?: string;
}

/**
 * 分组后的公告数据
 */
export interface GroupedAnnouncement {
	ts_code: string;
	name?: string;
	industry?: string;
	market?: string;
	announcements: Announcement[];
	totalCount: number;
	category_stats?: Record<string, number>;
	latest_ann_date?: string;
	latest_ann_time?: string;
	latest_ann_title?: string;
}

/**
 * 公告列表响应
 */
export interface AnnouncementListResponse {
	items: GroupedAnnouncement[];
	total: number;
	page: number;
	pageSize: number;
}

/**
 * 公告缓存统计
 */
export interface AnnouncementCacheStats {
	totalCount: number;
	dateRange: {
		earliest: string;
		latest: string;
	};
	stockCount: number;
}

// ==================== 股票相关类型 ====================

/**
 * 股票信息
 */
export interface Stock {
	id?: number;
	ts_code: string;
	symbol?: string;
	name: string;
	area?: string;
	industry?: string;
	fullname?: string;
	enname?: string;
	cnspell?: string;
	market?: string;
	exchange?: string;
	curr_type?: string;
	list_status?: string;
	list_date?: string;
	delist_date?: string;
	is_hs?: string;
	updated_at?: string;
}

/**
 * 股票列表同步信息
 */
export interface StockListSyncInfo {
	lastSyncDate: string | null;
	stockCount: number;
	isSyncedToday: boolean;
}

/**
 * 缓存数据统计
 */
export interface CacheDataStats {
	stocks: {
		total: number;
		lastSyncDate: string | null;
	};
	announcements: {
		total: number;
		untagged: number;
		dateRange: {
			earliest: string;
			latest: string;
		};
	};
	top10Holders: {
		total: number;
		stockCount: number;
	};
	favorites: {
		total: number;
	};
}

// ==================== 股东相关类型 ====================

/**
 * 十大股东信息
 */
export interface Top10Holder {
	ts_code: string;
	ann_date: string;
	end_date: string;
	holder_name: string;
	hold_amount: number;
	hold_ratio: number;
}

/**
 * 十大股东同步统计
 */
export interface Top10HoldersSyncStats {
	totalStocks: number;
	syncedStocks: number;
	unsyncedStocks: number;
}

// ==================== 新闻相关类型 ====================

/**
 * 财经新闻
 */
export interface News {
	datetime: string;
	content: string;
	title: string;
	channels?: string;
	score?: number;
}

// ==================== 分类相关类型 ====================

/**
 * 公告分类类别
 */
export interface ClassificationCategory {
	id: number;
	key: string;
	name: string;
	description?: string;
	enabled: boolean;
}

/**
 * 公告分类规则
 */
export interface ClassificationRule {
	id: number;
	category_key: string;
	keyword: string;
	priority: number;
	enabled: boolean;
}

// ==================== 数据库相关类型 ====================

/**
 * 数据库连接信息
 */
export interface DbConnectionInfo {
	path: string;
	size: number;
	tables: string[];
}

/**
 * 数据库重置选项
 */
export interface DbResetOptions {
	backup: boolean;
}

// ==================== IPC 事件类型 ====================

/**
 * IPC 事件名称枚举
 */
export enum IpcChannel {
	// 系统相关
	SHOW_NOTIFICATION = "show-notification",
	GET_APP_VERSION = "get-app-version",
	OPEN_EXTERNAL = "open-external",
	
	// 公告相关
	GET_ANNOUNCEMENTS_GROUPED = "get-announcements-grouped",
	GET_STOCK_ANNOUNCEMENTS = "get-stock-announcements",
	SEARCH_ANNOUNCEMENTS_GROUPED = "search-announcements-grouped",
	GET_FAVORITE_STOCKS_ANNOUNCEMENTS_GROUPED = "get-favorite-stocks-announcements-grouped",
	GET_ANNOUNCEMENT_PDF = "get-announcement-pdf",
	GET_ANNOUNCEMENTS_FROM_CACHE = "get-announcements-from-cache",
	CHECK_ANNOUNCEMENT_RANGE_SYNCED = "check-announcement-range-synced",
	SEARCH_ANNOUNCEMENTS_FROM_CACHE = "search-announcements-from-cache",
	GET_ANNOUNCEMENTS_CACHE_STATS = "get-announcements-cache-stats",
	TAG_ALL_ANNOUNCEMENTS = "tag-all-announcements",
	REPROCESS_ALL_ANNOUNCEMENTS = "reprocess-all-announcements",
	SYNC_ANNOUNCEMENTS_RANGE = "sync-announcements-range",
	
	// 股票相关
	SEARCH_STOCKS = "search-stocks",
	GET_STOCK_LIST_SYNC_INFO = "get-stock-list-sync-info",
	SYNC_ALL_STOCKS = "sync-all-stocks",
	CHECK_STOCK_LIST_SYNC_STATUS = "check-stock-list-sync-status",
	GET_LATEST_TRADE_DATE = "get-latest-trade-date",
	GET_CACHE_DATA_STATS = "get-cache-data-stats",
	GET_UNTAGGED_COUNT = "get-untagged-count",
	
	// 收藏相关
	ADD_FAVORITE_STOCK = "add-favorite-stock",
	REMOVE_FAVORITE_STOCK = "remove-favorite-stock",
	IS_FAVORITE_STOCK = "is-favorite-stock",
	GET_ALL_FAVORITE_STOCKS = "get-all-favorite-stocks",
	COUNT_FAVORITE_STOCKS = "count-favorite-stocks",
	
	// 股东相关
	GET_TOP10_HOLDERS = "get-top10-holders",
	SYNC_ALL_TOP10_HOLDERS = "sync-all-top10-holders",
	TOGGLE_PAUSE_TOP10_HOLDERS_SYNC = "toggle-pause-top10-holders-sync",
	STOP_TOP10_HOLDERS_SYNC = "stop-top10-holders-sync",
	SYNC_STOCK_TOP10_HOLDERS = "sync-stock-top10-holders",
	GET_TOP10_HOLDERS_FROM_DB = "get-top10-holders-from-db",
	HAS_TOP10_HOLDERS_DATA = "has-top10-holders-data",
	GET_TOP10_HOLDERS_SYNC_STATS = "get-top10-holders-sync-stats",
	GET_TOP10_HOLDERS_END_DATES = "get-top10-holders-end-dates",
	GET_TOP10_HOLDERS_BY_END_DATE = "get-top10-holders-by-end-date",
	
	// 新闻相关
	GET_NEWS = "get-news",
	
	// 分类相关
	GET_CLASSIFICATION_CATEGORIES = "get-classification-categories",
	GET_CLASSIFICATION_RULES = "get-classification-rules",
	GET_CLASSIFICATION_RULES_BY_CATEGORY = "get-classification-rules-by-category",
	UPDATE_CLASSIFICATION_CATEGORY = "update-classification-category",
	ADD_CLASSIFICATION_RULE = "add-classification-rule",
	UPDATE_CLASSIFICATION_RULE = "update-classification-rule",
	DELETE_CLASSIFICATION_RULE = "delete-classification-rule",
	RESET_CLASSIFICATION_RULES = "reset-classification-rules",
	
	// 数据库相关
	GET_DB_CONNECTION_INFO = "get-db-connection-info",
	START_SQLITE_HTTP_SERVER = "start-sqlite-http-server",
	STOP_SQLITE_HTTP_SERVER = "stop-sqlite-http-server",
	GET_SQLITE_HTTP_SERVER_STATUS = "get-sqlite-http-server-status",
	SET_SQLITE_HTTP_AUTH = "set-sqlite-http-auth",
	CLEAR_SQLITE_HTTP_AUTH = "clear-sqlite-http-auth",
	RESET_DATABASE = "reset-database",
	SAVE_COLUMN_WIDTHS = "save-column-widths",
	GET_COLUMN_WIDTHS = "get-column-widths",
	
	// 自动更新相关
	CHECK_FOR_UPDATES = "check-for-updates",
	DOWNLOAD_UPDATE = "download-update",
	INSTALL_UPDATE = "install-update",
}

/**
 * IPC 事件发送类型（主进程向渲染进程）
 */
export enum IpcSendChannel {
	STOCK_LIST_SYNC_PROGRESS = "stock-list-sync-progress",
	TOP10_HOLDERS_SYNC_PROGRESS = "top10-holders-sync-progress",
	UPDATE_CHECKING = "update-checking",
	UPDATE_AVAILABLE = "update-available",
	UPDATE_NOT_AVAILABLE = "update-not-available",
	UPDATE_DOWNLOAD_PROGRESS = "update-download-progress",
	UPDATE_DOWNLOADED = "update-downloaded",
	UPDATE_ERROR = "update-error",
}

// ==================== 服务层接口 ====================

/**
 * 窗口管理器接口
 */
export interface IWindowManager {
	createWindow(): BrowserWindow;
	getWindow(): BrowserWindow | null;
}

/**
 * 托盘管理器接口
 */
export interface ITrayManager {
	createTray(window: BrowserWindow): Tray;
	getTray(): Tray | null;
}

/**
 * 公告服务接口
 */
export interface IAnnouncementService {
	getAnnouncementsGrouped(
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string,
		market?: string,
		forceRefresh?: boolean
	): Promise<AnnouncementListResponse>;
	
	searchAnnouncementsGrouped(
		keyword: string,
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string
	): Promise<AnnouncementListResponse>;
	
	getFavoriteStocksAnnouncementsGrouped(
		page: number,
		pageSize: number,
		startDate?: string,
		endDate?: string
	): Promise<AnnouncementListResponse>;
}

/**
 * 股票服务接口
 */
export interface IStockService {
	syncStocksIfNeeded(): Promise<SyncResult>;
	syncAllStocks(): Promise<SyncResult>;
}

/**
 * 股东服务接口
 */
export interface IHolderService {
	syncAllTop10Holders(): Promise<SyncResult>;
	togglePauseSync(): Promise<{ status: string; message: string }>;
	stopSync(): Promise<{ status: string; message: string }>;
}

