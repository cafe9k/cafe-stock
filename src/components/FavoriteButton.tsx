/**
 * 关注按钮组件
 * 用于切换股票的关注状态
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
			let success = false;

			if (newState) {
				// 添加关注
				success = await window.electronAPI.addFavoriteStock(tsCode);
			} else {
				// 取消关注
				success = await window.electronAPI.removeFavoriteStock(tsCode);
			}

			if (success) {
				setFavoriteState(newState);
				message.success(newState ? "关注成功" : "已取消关注");
				// 通知父组件状态变化
				onChange?.(tsCode, newState);
			} else {
				message.error(newState ? "关注失败" : "取消关注失败");
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

