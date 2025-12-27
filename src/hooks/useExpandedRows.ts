/**
 * 依赖: useState, useCallback, window.electronAPI(IPC), Ant Design App(消息提示)
 * 输出: useExpandedRows Hook - 管理表格展开行的状态和数据加载
 * 职责: 渲染进程业务逻辑Hook，封装展开行的状态管理、数据加载和分页逻辑
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/hooks/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { useState, useCallback } from "react";
import { App } from "antd";

/**
 * 展开行数据类型
 */
export interface ExpandedRowData<T = any> {
	data: T[];
	loading: boolean;
	currentPage: number;
}

/**
 * 展开行 Hook 配置
 */
export interface UseExpandedRowsOptions {
	/**
	 * 每页显示数量，默认 10
	 */
	pageSize?: number;
	/**
	 * 数据加载函数
	 */
	loadDataFn: (key: string, ...args: any[]) => Promise<any[]>;
	/**
	 * 数据加载失败时的错误消息
	 */
	errorMessage?: string;
}

/**
 * 展开行管理 Hook
 * 管理表格展开行的状态、数据加载和分页
 */
export function useExpandedRows<T = any>(options: UseExpandedRowsOptions) {
	const { pageSize = 10, loadDataFn, errorMessage = "加载数据失败" } = options;
	const { message } = App.useApp();

	// 展开的行键列表
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
	
	// 展开行的数据缓存
	const [expandedDataMap, setExpandedDataMap] = useState<Record<string, T[]>>({});
	
	// 展开行的加载状态
	const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
	
	// 展开行的分页状态
	const [pageMap, setPageMap] = useState<Record<string, number>>({});

	// 切换展开状态
	const toggleExpanded = useCallback((key: string) => {
		setExpandedRowKeys((prev) => {
			if (prev.includes(key)) {
				return prev.filter((k) => k !== key);
			} else {
				return [...prev, key];
			}
		});
	}, []);

	// 设置展开的行键列表
	const setExpanded = useCallback((keys: string[]) => {
		setExpandedRowKeys(keys);
	}, []);

	// 检查是否已展开
	const isExpanded = useCallback(
		(key: string) => {
			return expandedRowKeys.includes(key);
		},
		[expandedRowKeys]
	);

	// 加载展开行数据
	const loadExpandedData = useCallback(
		async (key: string, ...args: any[]) => {
			// 如果已有数据，不重复加载
			if (expandedDataMap[key]) {
				return;
			}

			setLoadingMap((prev) => ({ ...prev, [key]: true }));
			try {
				const data = await loadDataFn(key, ...args);
				setExpandedDataMap((prev) => ({ ...prev, [key]: data }));
				// 初始化分页为第1页
				setPageMap((prev) => ({ ...prev, [key]: 1 }));
			} catch (error: any) {
				console.error(`Load expanded data error for key ${key}:`, error);
				message.error(errorMessage);
			} finally {
				setLoadingMap((prev) => ({ ...prev, [key]: false }));
			}
		},
		[expandedDataMap, loadDataFn, errorMessage, message]
	);

	// 获取展开行数据
	const getExpandedData = useCallback(
		(key: string): ExpandedRowData<T> => {
			return {
				data: expandedDataMap[key] || [],
				loading: loadingMap[key] || false,
				currentPage: pageMap[key] || 1,
			};
		},
		[expandedDataMap, loadingMap, pageMap]
	);

	// 设置展开行的当前页
	const setExpandedPage = useCallback((key: string, page: number) => {
		setPageMap((prev) => ({ ...prev, [key]: page }));
	}, []);

	// 清空所有展开行数据
	const clearAllExpanded = useCallback(() => {
		setExpandedRowKeys([]);
		setExpandedDataMap({});
		setLoadingMap({});
		setPageMap({});
	}, []);

	// 清空指定行的数据（保留展开状态）
	const clearExpandedData = useCallback((key: string) => {
		setExpandedDataMap((prev) => {
			const newMap = { ...prev };
			delete newMap[key];
			return newMap;
		});
		setPageMap((prev) => {
			const newMap = { ...prev };
			delete newMap[key];
			return newMap;
		});
	}, []);

	// 重置所有展开行的分页到第一页
	const resetAllPages = useCallback(() => {
		const resetPages: Record<string, number> = {};
		expandedRowKeys.forEach((key) => {
			resetPages[key] = 1;
		});
		if (Object.keys(resetPages).length > 0) {
			setPageMap((prev) => ({ ...prev, ...resetPages }));
		}
	}, [expandedRowKeys]);

	return {
		// 状态
		expandedRowKeys,
		pageSize,
		// 查询方法
		isExpanded,
		getExpandedData,
		// 操作方法
		toggleExpanded,
		setExpanded,
		loadExpandedData,
		setExpandedPage,
		clearAllExpanded,
		clearExpandedData,
		resetAllPages,
	};
}

