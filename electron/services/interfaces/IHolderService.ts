/**
 * INPUT: 无（接口定义）
 * OUTPUT: IHolderService 接口规范 - 定义股东服务的契约
 * POS: 服务层接口定义，规范股东服务的对外API
 * 
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/services/README.md
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

