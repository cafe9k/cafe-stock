/**
 * 依赖: 无（接口定义）
 * 输出: IClassificationService 接口规范 - 定义分类服务的契约
 * 职责: 服务层接口定义，规范分类服务的对外API
 *
 * ⚠️ 更新提醒：修改此文件后，请更新 electron/services/README.md
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
