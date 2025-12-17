/**
 * 公告分类服务模块
 * 负责公告分类相关功能
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

