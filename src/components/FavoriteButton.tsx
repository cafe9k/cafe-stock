/**
 * 依赖: useFavoriteStocks(hook), window.electron(IPC), Ant Design(UI组件)
 * 输出: FavoriteButton 组件 - 收藏按钮组件，提供股票收藏/取消收藏功能
 * 职责: 渲染进程UI组件，封装股票收藏功能的交互逻辑，可复用于多个场景
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/components/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { memo, useState, useEffect } from "react";
import { Button, App } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";

export interface FavoriteButtonProps {
	tsCode: string;
	isFavorite?: boolean;
	onChange?: (tsCode: string, isFavorite: boolean) => void;
	size?: "small" | "middle" | "large";
}

/**
 * 关注按钮组件
 */
function FavoriteButtonComponent({ tsCode, isFavorite = false, onChange, size = "small" }: FavoriteButtonProps) {
	const { message } = App.useApp();
	const [loading, setLoading] = useState(false);
	const [favoriteState, setFavoriteState] = useState(isFavorite);

	// 当 isFavorite prop 变化时，同步更新内部状态
	useEffect(() => {
		setFavoriteState(isFavorite);
	}, [isFavorite]);

	const handleClick = async (e: React.MouseEvent) => {
		// 阻止事件冒泡，避免触发行点击事件
		e.stopPropagation();

		if (!window.electronAPI) {
			message.error("Electron API 不可用");
			return;
		}

		setLoading(true);
		try {
			const newState = !favoriteState;
			let result: { success: boolean; message?: string };

			if (newState) {
				// 添加关注
				result = await window.electronAPI.addFavoriteStock(tsCode);
			} else {
				// 取消关注
				result = await window.electronAPI.removeFavoriteStock(tsCode);
			}

			if (result.success) {
				setFavoriteState(newState);
				message.success(newState ? "关注成功" : "已取消关注");
				// 通知父组件状态变化
				onChange?.(tsCode, newState);
			} else {
				message.error(result.message || (newState ? "关注失败" : "取消关注失败"));
			}
		} catch (error: any) {
			console.error("关注操作失败:", error);
			message.error(error.message || "操作失败");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			type="text"
			size={size}
			loading={loading}
			icon={favoriteState ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />}
			onClick={handleClick}
			title={favoriteState ? "取消关注" : "关注"}
		/>
	);
}

// 使用 memo 优化性能，避免不必要的重渲染
export const FavoriteButton = memo(FavoriteButtonComponent);
