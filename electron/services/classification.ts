/**
 * 依赖: announcementClassifier(分类工具)
 * 输出: classifyAnnouncementTitle(), classifyAnnouncementsBatch() - 分类规则管理接口
 * 职责: 公告分类规则服务，管理公告的智能分类逻辑
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. electron/services/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { classifyAnnouncement } from "../utils/announcementClassifier.js";

/**
 * 对公告进行分类
 */
export function classifyAnnouncementTitle(title: string): string {
	return classifyAnnouncement(title);
}

/**
 * 批量分类公告
 */
export function classifyAnnouncementsBatch(announcements: Array<{ title: string }>): Array<{ title: string; category: string }> {
	return announcements.map((ann) => ({
		title: ann.title,
		category: classifyAnnouncement(ann.title),
	}));
}
