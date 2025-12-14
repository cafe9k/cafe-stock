# CafeStock (酷咖啡) - A 股公告浏览助手

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

### 2.2 本地化存储

-   使用 **SQLite** (`better-sqlite3`) 存储所有公告数据。
-   支持单次 2000 条的大批量数据写入。
-   数据去重策略保证数据一致性。

### 2.3 极速浏览

-   **零延迟翻页**: 基于本地数据库分页查询，翻页无网络等待。
-   **单页 200 条**: 高密度信息展示，适合快速浏览。

## 3. 技术栈

-   **Runtime**: Electron
-   **Frontend**: React, TypeScript, TailwindCSS
-   **Build Tool**: Vite
-   **Database**: SQLite (better-sqlite3)
-   **API Provider**: Tushare Pro (上市公司公告接口 `anns_d`)

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

## 5. 接口说明

**IPC 接口 (Renderer -> Main)**:

-   `getAnnouncements(page, pageSize)`: 分页获取本地公告。
-   `syncAnnouncements()`: 触发后台同步。
-   `getAppVersion()`: 获取版本号。
