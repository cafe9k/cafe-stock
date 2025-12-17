/**
 * 分类服务接口
 */

export interface IClassificationService {
	/**
	 * 对公告进行分类
	 */
	classifyAnnouncementTitle(title: string): string;

	/**
	 * 批量分类公告
	 */
	classifyAnnouncementsBatch(announcements: Array<{ title: string }>): Array<{ title: string; category: string }>;
}

