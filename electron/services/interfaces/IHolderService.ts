/**
 * 股东服务接口
 */

import { BrowserWindow } from "electron";
import { SyncResult, SyncProgress } from "../../types/index.js";

export interface IHolderService {
	/**
	 * 同步所有股票的十大股东数据
	 */
	syncAllTop10Holders(
		mainWindow: BrowserWindow | null,
		onProgress?: (progress: SyncProgress) => void
	): Promise<SyncResult>;

	/**
	 * 暂停同步
	 */
	pauseSync(): void;

	/**
	 * 恢复同步
	 */
	resumeSync(): void;

	/**
	 * 停止同步
	 */
	stopSync(): void;

	/**
	 * 获取同步状态
	 */
	getSyncStatus(): {
		isSyncing: boolean;
		isPaused: boolean;
	};
}

