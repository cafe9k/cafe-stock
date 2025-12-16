# CafeStock 项目文档

欢迎查阅 CafeStock（酷咖啡股票助手）项目文档。

## 📚 文档导航

### 快速开始

-   [项目概述](./overview.md) - 了解项目的核心功能和特性
-   [快速开始指南](./development/quick-start.md) - 快速搭建开发环境

### 开发文档

-   [开发指南](./development/development-guide.md) - 开发环境配置、项目结构、开发规范
-   [构建与发布](./development/build-and-release.md) - 构建打包和发布流程
-   [调试技巧](./development/debugging.md) - 常见问题和调试方法

### API 文档

-   [IPC 接口文档](./api/ipc-api.md) - 主进程与渲染进程通信接口
-   [数据库接口](./api/database-api.md) - SQLite 数据库操作接口
-   [Tushare 接口](./api/tushare-api.md) - Tushare API 调用说明

### 架构文档

-   [系统架构](./architecture/system-architecture.md) - 整体架构设计
-   [数据流设计](./architecture/data-flow.md) - 数据同步和流转机制
-   [存储设计](./architecture/storage-design.md) - 本地数据库设计

### 用户指南

-   [功能介绍](./user-guide/features.md) - 功能特性详细说明
-   [使用手册](./user-guide/user-manual.md) - 用户操作指南

### 更新日志

-   [CHANGELOG](./changelog/CHANGELOG.md) - 版本更新记录

## 🛠 技术栈

-   **Runtime**: Electron
-   **Frontend**: React + TypeScript + TailwindCSS
-   **Build Tool**: Vite
-   **Database**: SQLite (better-sqlite3)
-   **API Provider**: Tushare Pro

## 📝 文档贡献

如需添加或修改文档，请遵循 [文档规范](../.cursor/rules/documentation.mdc)。

## 📮 联系方式

如有问题或建议，欢迎提交 Issue。


