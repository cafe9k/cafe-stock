interface SyncProgress {
	status: "started" | "syncing" | "completed" | "failed";
	message?: string;
	total?: number;
	current?: number;
	stockCount?: number;
	error?: string;
}

interface SyncStatus {
	isSyncedToday: boolean;
	stockCount: number;
	lastSyncTime: string | null;
}

type SyncCompleteCallback = () => void;

class StockListSyncService {
	private syncInProgress = false;
	private progressCallback: ((progress: SyncProgress | null) => void) | null = null;

	/**
	 * 检查今日是否已同步
	 */
	async isSyncedToday(): Promise<boolean> {
		try {
			const status = await window.electronAPI.checkStockListSyncStatus();
			return status.isSyncedToday;
		} catch (error) {
			console.error("Failed to check sync status:", error);
			return false;
		}
	}

	/**
	 * 获取同步状态信息
	 */
	async getSyncStatus(): Promise<SyncStatus> {
		try {
			return await window.electronAPI.checkStockListSyncStatus();
		} catch (error) {
			console.error("Failed to get sync status:", error);
			return {
				isSyncedToday: false,
				stockCount: 0,
				lastSyncTime: null,
			};
		}
	}

	/**
	 * 设置进度回调
	 */
	setProgressCallback(callback: (progress: SyncProgress | null) => void) {
		this.progressCallback = callback;
	}

	/**
	 * 执行同步操作
	 */
	private async performSync(): Promise<boolean> {
		if (this.syncInProgress) {
			console.warn("Sync already in progress");
			return false;
		}

		this.syncInProgress = true;

		try {
			// 设置进度监听
			const unsubscribe = window.electronAPI.onStockListSyncProgress((progress: SyncProgress) => {
				if (this.progressCallback) {
					this.progressCallback(progress);
				}
			});

			// 执行同步
			const result = await window.electronAPI.syncAllStocks();

			// 清理监听
			unsubscribe();

			this.syncInProgress = false;

			return result.success;
		} catch (error: any) {
			console.error("Sync failed:", error);
			if (this.progressCallback) {
				this.progressCallback({
					status: "failed",
					message: error.message || "同步失败",
					error: error.message,
				});
			}
			this.syncInProgress = false;
			return false;
		}
	}

	/**
	 * 检查并同步（如果未同步）
	 * @param onComplete 同步完成回调
	 */
	async checkAndSyncIfNeeded(onComplete?: SyncCompleteCallback): Promise<boolean> {
		try {
			// 检查今日是否已同步
			const isSynced = await this.isSyncedToday();

			if (isSynced) {
				console.log("Stock list already synced today");
				if (onComplete) {
					onComplete();
				}
				return true;
			}

			// 未同步，执行同步
			console.log("Stock list not synced today, starting sync...");

			// 显示进度指示器
			if (this.progressCallback) {
				this.progressCallback({
					status: "started",
					message: "开始同步股票列表...",
				});
			}

			const success = await this.performSync();

			// 同步完成，隐藏指示器
			if (this.progressCallback) {
				if (success) {
					// 延迟一下再隐藏，让用户看到完成状态
					setTimeout(() => {
						if (this.progressCallback) {
							this.progressCallback(null);
						}
					}, 1500);
				} else {
					// 失败时保持显示，让用户看到错误信息
					setTimeout(() => {
						if (this.progressCallback) {
							this.progressCallback(null);
						}
					}, 3000);
				}
			}

			if (onComplete) {
				onComplete();
			}

			return success;
		} catch (error) {
			console.error("checkAndSyncIfNeeded failed:", error);
			if (this.progressCallback) {
				this.progressCallback(null);
			}
			if (onComplete) {
				onComplete();
			}
			return false;
		}
	}

	/**
	 * 手动触发同步（忽略今日是否已同步）
	 */
	async syncStockList(): Promise<boolean> {
		return this.performSync();
	}

	/**
	 * 检查是否正在同步
	 */
	isSyncing(): boolean {
		return this.syncInProgress;
	}
}

// 导出单例
export const stockListSyncService = new StockListSyncService();

