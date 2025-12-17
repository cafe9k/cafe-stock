# CafeStock (酷咖啡股票助手) - A 股公告浏览助手

基于 Electron + React 的本地化 A 股市场公告浏览器。通过离线数据库设计，提供极速、无延迟的公告阅读体验。

## 1. 核心架构

本项目采用 **"主进程同步 (Backend Sync) + 本地数据库 (Local DB) + 渲染进程展示 (Frontend Display)"** 架构。

-   **主进程 (Main Process)**: 负责数据同步、SQLite 数据库读写、与 Tushare API 通信。
-   **渲染进程 (Renderer Process)**: 纯展示层，不直接请求外部 API，仅通过 IPC 读取本地数据。

## 2. 功能特性

### 2.1 智能数据同步

-   **启动自动同步**: 应用启动时自动检测并同步最新公告。
-   **增量更新**: 自动记录上次更新时间，只拉取最新的增量数据。
-   **历史回补**: 首次运行或数据缺失时，自动回补最近 30 天的数据。
-   **手动刷新**: 界面提供刷新按钮，触发强制同步和列表刷新。

### 2.2 财经资讯 (NEW)

-   **多新闻源**: 支持新浪财经、华尔街见闻、同花顺、东方财富、云财经等主流财经网站。
-   **实时获取**: 直接从 Tushare API 获取最新资讯，无需本地存储。
-   **时间筛选**: 支持今天、昨天、最近一周、最近一个月及自定义日期范围。
-   **分页浏览**: 每页显示 20 条资讯，支持翻页查看。
-   **内容展开**: 资讯内容支持展开查看完整信息。

### 2.3 本地化存储

-   使用 **SQLite** (`better-sqlite3`) 存储所有公告数据。
-   支持单次 2000 条的大批量数据写入。
-   数据去重策略保证数据一致性。

### 2.4 极速浏览

-   **零延迟翻页**: 基于本地数据库分页查询，翻页无网络等待。
-   **单页 200 条**: 高密度信息展示，适合快速浏览。

### 2.5 自动更新

-   **自动检测**: 应用启动时自动检查新版本。
-   **手动检查**: 支持用户主动检查更新。
-   **后台下载**: 新版本在后台下载，不影响使用。
-   **一键安装**: 下载完成后，一键重启安装新版本。

## 3. 技术栈

-   **Runtime**: Electron
-   **Frontend**: React, TypeScript, TailwindCSS
-   **Build Tool**: Vite
-   **Database**: SQLite (better-sqlite3)
-   **API Provider**: Tushare Pro (上市公司公告接口 `anns_d`)
-   **Auto Update**: electron-updater

## 4. 开发指南

### 4.1 环境准备

首次开发前，必须重新编译原生模块以匹配 Electron 的 Node 版本：

```bash
npm install
npx electron-builder install-app-deps
```

### 4.2 启动项目

**必须** 使用 `npm run dev` 启动，它会正确处理 Vite 构建和 Electron 启动流程。

```bash
npm run dev
```

_注意：请勿直接运行 `electron .` 或其他命令，会导致 preload 脚本加载失败。_

### 4.3 项目结构

-   `electron/`: 主进程代码
    -   `main.ts`: 应用入口，包含同步逻辑和 IPC 监听。
    -   `db.ts`: 数据库操作封装。
    -   `tushare.ts`: Tushare API 客户端。
    -   `preload.ts`: IPC 桥接 (CommonJS)。
-   `src/`: 渲染进程代码 (React)。

### 4.4 打包构建

构建 macOS 应用（需要在 macOS 上运行）：

```bash
# 普通构建
npm run build

# 优化构建（推荐用于发布，包含额外优化）
npm run build:optimized

# 仅构建目录（用于测试，不生成安装包）
npm run build:dir

# 分析构建产物大小
npm run analyze
```

构建输出位于 `release/` 目录，包含 DMG 格式的安装包。

**优化构建说明**：

-   使用最大压缩级别
-   自动移除 source map
-   排除开发依赖和测试文件
-   提供详细的构建分析报告

详细的优化说明请参考 [构建优化指南](docs/build-optimization-guide.md)。

### 4.5 发布更新

1. 更新 `package.json` 中的版本号
2. 在 `package.json` 的 `build.publish` 中配置 GitHub 仓库信息
3. 运行 `npm run build` 构建应用
4. 在 GitHub 创建新的 Release，上传构建产物
5. electron-updater 会自动从 GitHub Releases 检测更新

## 5. 接口说明

**IPC 接口 (Renderer -> Main)**:

### 5.1 数据相关

-   `getAnnouncements(page, pageSize)`: 分页获取本地公告。
-   `syncAnnouncements()`: 触发后台同步。
-   `getNews(src, startDate, endDate)`: 获取财经资讯（实时）。
-   `getAppVersion()`: 获取版本号。

### 5.2 自动更新相关

-   `checkForUpdates()`: 检查更新。
-   `downloadUpdate()`: 下载更新。
-   `installUpdate()`: 安装更新并重启。
-   `onUpdateChecking(callback)`: 监听检查更新事件。
-   `onUpdateAvailable(callback)`: 监听发现新版本事件。
-   `onUpdateNotAvailable(callback)`: 监听已是最新版本事件。
-   `onUpdateDownloadProgress(callback)`: 监听下载进度事件。
-   `onUpdateDownloaded(callback)`: 监听下载完成事件。
-   `onUpdateError(callback)`: 监听更新错误事件。

## 6. 配置说明

### 6.1 应用信息配置

在 `package.json` 中配置：

```json
{
	"name": "cafe-stock",
	"version": "1.0.0",
	"build": {
		"appId": "com.cafestock.app",
		"productName": "酷咖啡股票助手"
	}
}
```

### 6.2 自动更新配置

在 `package.json` 的 `build.publish` 中配置 GitHub 仓库：

```json
{
	"publish": [
		{
			"provider": "github",
			"owner": "your-github-username",
			"repo": "cafe-stock"
		}
	]
}
```
