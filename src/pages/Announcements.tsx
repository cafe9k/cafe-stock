/**
 * 依赖: AnnouncementList(组件)
 * 输出: Announcements 页面组件 - 公告列表页面
 * 职责: 渲染进程页面组件，公告功能的主入口页面
 *
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/pages/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

import { AnnouncementList } from "../components/AnnouncementList";

export function Announcements() {
	return <AnnouncementList />;
}
