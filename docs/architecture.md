# CafeStock 系统架构文档

**创建日期**: 2025-12-16  
**最后更新**: 2025-12-17  
**文档版本**: v2.0.0  
**项目名称**: CafeStock (酷咖啡股票助手)

## 目录

-   [1. 系统概述](#1-系统概述)
-   [2. 技术栈](#2-技术栈)
-   [3. 架构设计](#3-架构设计)
-   [4. 目录结构](#4-目录结构)
-   [5. 核心模块](#5-核心模块)
-   [6. 数据流](#6-数据流)
-   [7. IPC 通信架构](#7-ipc-通信架构)
-   [8. 数据库设计](#8-数据库设计)
-   [9. 依赖注入](#9-依赖注入)
-   [10. 错误处理](#10-错误处理)
-   [11. 构建与部署](#11-构建与部署)
-   [12. 开发规范](#12-开发规范)

---

## 1. 系统概述

### 1.1 项目简介

CafeStock（酷咖啡股票助手）是一款基于 Electron + React 的桌面应用程序，专注于 A 股市场公告浏览和财经资讯获取。通过本地数据库设计，提供极速、无延迟的数据浏览体验。

### 1.2 核心特性

-   **智能数据同步**: 自动同步股票列表、公告、十大股东等数据
-   **本地数据库**: 使用 SQLite 存储所有数据，支持离线浏览
-   **公告分类**: 基于关键词规则的智能公告分类系统
-   **财经资讯**: 实时获取多源财经新闻
-   **自动更新**: 基于 electron-updater 的自动更新机制
-   **数据洞察**: 提供数据统计和可视化功能

### 1.3 设计原则

1. **主进程负责数据**: 所有数据同步、数据库操作都在主进程完成
2. **渲染进程纯展示**: 前端只负责展示，不直接请求外部 API
3. **本地优先**: 优先使用本地缓存，减少网络请求
4. **增量同步**: 智能检测已同步数据，避免重复请求
5. **分层架构**: 清晰的分层设计，职责明确
6. **依赖注入**: 使用 DI 容器管理依赖关系

### 1.4 架构特点 (v2.0)

-   ✅ **模块化设计**: 数据库、服务、仓储层清晰分离
-   ✅ **依赖注入**: 使用 DI 容器管理依赖，便于测试和扩展
-   ✅ **接口抽象**: 服务层和仓储层都有接口定义
-   ✅ **统一错误处理**: IPC 层使用中间件统一处理错误
-   ✅ **主进程独立**: 主进程完全独立于渲染进程代码

---

## 2. 技术栈

### 2.1 核心技术

| 技术       | 版本    | 用途                  |
| ---------- | ------- | --------------------- |
| Electron   | ^28.0.0 | 跨平台桌面应用框架    |
| React      | ^18.2.0 | UI 框架               |
| TypeScript | ^5.2.2  | 类型安全的 JavaScript |
| Vite       | ^5.0.8  | 现代化构建工具        |

### 2.2 UI 框架

| 技术         | 版本    | 用途      |
| ------------ | ------- | --------- |
| Ant Design   | ^6.1.0  | UI 组件库 |
| TailwindCSS  | ^4.1.18 | CSS 框架  |
| React Router | ^7.10.1 | 路由管理  |

### 2.3 数据层

| 技术           | 版本    | 用途              |
| -------------- | ------- | ----------------- |
| better-sqlite3 | ^12.5.0 | SQLite 数据库驱动 |
| Tushare Pro    | -       | A 股数据 API 服务 |

### 2.4 工程化工具

| 技术              | 版本    | 用途                |
| ----------------- | ------- | ------------------- |
| electron-builder  | ^24.0.0 | 应用打包工具        |
| electron-updater  | ^6.6.2  | 自动更新解决方案    |
| ESLint            | ^8.55.0 | 代码质量检查        |
| TypeScript ESLint | ^6.14.0 | TypeScript 代码检查 |

---

## 3. 架构设计

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    Electron 主进程 (Main Process)                │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    应用层 (Application)                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │  窗口管理     │  │  系统托盘     │  │  自动更新     │    │ │
│  │  │  Window      │  │  Tray        │  │  Updater     │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  IPC 层 (IPC Handlers)                      │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │  公告 IPC     │  │  股票 IPC     │  │  系统 IPC     │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │        错误处理中间件 (Error Handler)               │   │ │
│  │  └────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  服务层 (Services)                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │  公告服务     │  │  股票服务     │  │  分类服务     │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │  业务逻辑编排 + 数据聚合 + 业务规则验证                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              仓储层 (Repositories)                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │  Stock Repo  │  │  Ann Repo    │  │  Holder Repo │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │  数据访问抽象 + CRUD 操作 + 查询优化                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                数据库层 (Database)                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │  连接管理     │  │  迁移管理     │  │  同步标志     │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │  SQLite 数据库 + WAL 模式 + 索引优化                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              依赖注入容器 (DI Container)                    │ │
│  │  管理服务生命周期 + 依赖解析 + 单例管理                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              外部 API 层 (Tushare Client)                   │ │
│  │  API 请求封装 + 限流处理 + 错误重试                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                          ↕ IPC 通信 (统一响应格式)
┌─────────────────────────────────────────────────────────────────┐
│              Electron 渲染进程 (Renderer Process)                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           React + TypeScript 应用                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ 公告页面  │  │ 资讯页面  │  │ 数据洞察 │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ 设置页面  │  │ 股票列表  │  │ 收藏管理 │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Preload Script (桥接层)                      │   │
│  │         contextBridge.exposeInMainWorld                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 分层架构详解

#### 3.2.1 数据库层 (Database Layer)

**职责**: 数据库连接管理、表结构创建、迁移、同步标志位管理

**模块**:

-   `database/connection.ts`: 数据库连接和配置
-   `database/migrations.ts`: 数据库表创建和迁移
-   `database/syncFlags.ts`: 同步标志位管理

**特点**:

-   单例模式管理数据库连接
-   WAL 模式提高并发性能
-   自动执行数据库迁移

#### 3.2.2 仓储层 (Repository Layer)

**职责**: 数据访问抽象，提供 CRUD 操作

**模块**:

-   `repositories/interfaces/`: 仓储接口定义
-   `repositories/implementations/`: 仓储实现
-   `repositories/base/`: 基础仓储类

**特点**:

-   实现接口抽象
-   封装数据库操作
-   提供查询优化
-   支持事务操作

#### 3.2.3 服务层 (Service Layer)

**职责**: 业务逻辑编排，数据聚合和转换

**模块**:

-   `services/interfaces/`: 服务接口定义
-   `services/*.ts`: 服务实现

**特点**:

-   业务逻辑集中
-   调用仓储层和 API 层
-   数据聚合和转换
-   业务规则验证

#### 3.2.4 IPC 层 (IPC Layer)

**职责**: 进程间通信处理，参数验证，错误处理

**模块**:

-   `ipc/*.ts`: IPC 处理器
-   `ipc/middleware/`: IPC 中间件

**特点**:

-   统一错误处理
-   参数验证
-   响应格式标准化
-   日志记录

#### 3.2.5 依赖注入层 (DI Layer)

**职责**: 管理服务依赖关系，提供依赖解析

**模块**:

-   `di/container.ts`: DI 容器实现
-   `di/serviceRegistry.ts`: 服务注册

**特点**:

-   单例管理
-   依赖解析
-   便于测试
-   易于扩展

### 3.3 进程间通信 (IPC)

**通信模式**: 基于 Electron IPC 的双向通信

-   **渲染进程 → 主进程**: 通过 `ipcRenderer.invoke()` 调用主进程方法
-   **主进程 → 渲染进程**: 通过 `webContents.send()` 发送事件
-   **安全桥接**: 通过 `preload.ts` 使用 `contextBridge` 暴露安全的 API
-   **统一响应**: 使用 `IPCResponse<T>` 统一响应格式

### 3.4 数据同步策略

```
┌─────────────┐
│  用户请求    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ 检查本地缓存     │
│ (时间范围检查)   │
└──────┬──────────┘
       │
       ├─── 已缓存 ──► 从数据库读取 ──► 返回数据
       │
       └─── 未缓存 ──► 调用 Tushare API ──► 保存到数据库 ──► 返回数据
```

---

## 4. 目录结构

```
cafe-stock/
├── electron/                    # 主进程代码
│   ├── main.ts                  # 应用入口
│   ├── preload.ts               # 预加载脚本（IPC 桥接）
│   ├── db.ts                    # 数据库操作封装（向后兼容）
│   ├── tushare.ts               # Tushare API 客户端
│   │
│   ├── core/                    # 核心功能模块
│   │   ├── window.ts            # 窗口管理
│   │   ├── tray.ts              # 系统托盘
│   │   └── shortcuts.ts         # 全局快捷键
│   │
│   ├── database/                # 数据库模块 ⭐ 新增
│   │   ├── connection.ts        # 连接管理
│   │   ├── migrations.ts        # 数据库迁移
│   │   ├── syncFlags.ts         # 同步标志位管理
│   │   └── index.ts             # 统一导出
│   │
│   ├── di/                      # 依赖注入 ⭐ 新增
│   │   ├── container.ts         # DI 容器
│   │   ├── serviceRegistry.ts   # 服务注册
│   │   └── index.ts             # 统一导出
│   │
│   ├── ipc/                     # IPC 处理器
│   │   ├── index.ts             # IPC 注册入口
│   │   ├── announcement.ts      # 公告相关 IPC
│   │   ├── stock.ts             # 股票相关 IPC
│   │   ├── news.ts              # 资讯相关 IPC
│   │   ├── favorite.ts          # 收藏相关 IPC
│   │   ├── holder.ts            # 股东相关 IPC
│   │   ├── classification.ts    # 分类相关 IPC
│   │   ├── database.ts          # 数据库相关 IPC
│   │   ├── system.ts            # 系统相关 IPC
│   │   ├── updater.ts           # 更新相关 IPC
│   │   └── middleware/          # IPC 中间件 ⭐ 新增
│   │       ├── errorHandler.ts  # 错误处理中间件
│   │       └── index.ts         # 统一导出
│   │
│   ├── repositories/            # 仓储层
│   │   ├── base/                # 基础仓储
│   │   │   └── BaseRepository.ts
│   │   ├── interfaces/          # 仓储接口
│   │   │   ├── IRepository.ts
│   │   │   ├── IStockRepository.ts
│   │   │   ├── IAnnouncementRepository.ts
│   │   │   ├── IFavoriteRepository.ts
│   │   │   ├── IHolderRepository.ts
│   │   │   ├── IClassificationRepository.ts
│   │   │   └── index.ts
│   │   └── implementations/     # 仓储实现
│   │       ├── StockRepository.ts
│   │       ├── AnnouncementRepository.ts
│   │       ├── FavoriteRepository.ts
│   │       ├── HolderRepository.ts
│   │       ├── ClassificationRepository.ts
│   │       └── index.ts
│   │
│   ├── services/                # 业务服务层
│   │   ├── interfaces/          # 服务接口 ⭐ 新增
│   │   │   ├── IAnnouncementService.ts
│   │   │   ├── IStockService.ts
│   │   │   ├── IFavoriteService.ts
│   │   │   ├── IHolderService.ts
│   │   │   ├── IClassificationService.ts
│   │   │   ├── INewsService.ts
│   │   │   └── index.ts
│   │   ├── announcement.ts      # 公告服务
│   │   ├── stock.ts             # 股票服务
│   │   ├── news.ts              # 资讯服务
│   │   ├── favorite.ts          # 收藏服务
│   │   ├── holder.ts            # 股东服务
│   │   └── classification.ts    # 分类服务
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   ├── index.ts             # 通用类型
│   │   └── errors.ts            # 错误类型 ⭐ 新增
│   │
│   ├── utils/                   # 工具函数
│   │   ├── logger.ts            # 日志工具
│   │   └── announcementClassifier.ts  # 分类器 ⭐ 主进程版本
│   │
│   └── updater/                 # 自动更新模块
│       └── index.ts
│
├── src/                         # 渲染进程代码（React）
│   ├── main.tsx                 # React 应用入口
│   ├── App.tsx                  # 根组件
│   ├── components/              # React 组件
│   │   ├── Layout.tsx           # 布局组件
│   │   ├── AnnouncementList.tsx # 公告列表组件
│   │   ├── NewsList.tsx         # 资讯列表组件
│   │   ├── PDFViewer.tsx        # PDF 查看器
│   │   ├── FavoriteButton.tsx   # 收藏按钮
│   │   ├── StockList/           # 股票列表组件
│   │   └── ...
│   ├── pages/                   # 页面组件
│   │   ├── Announcements.tsx    # 公告页面
│   │   ├── News.tsx             # 资讯页面
│   │   ├── DataInsights.tsx     # 数据洞察页面
│   │   └── Settings.tsx         # 设置页面
│   ├── services/                # 前端服务层
│   │   ├── stockService.ts      # 股票服务
│   │   ├── favoriteStockService.ts # 收藏服务
│   │   └── stockListSync.ts     # 股票列表同步服务
│   ├── hooks/                   # React Hooks
│   │   ├── useStockList.ts      # 股票列表 Hook
│   │   ├── useStockSearch.ts    # 股票搜索 Hook
│   │   ├── useStockFilter.ts    # 股票筛选 Hook
│   │   └── useFavoriteStocks.ts # 收藏股票 Hook
│   ├── utils/                   # 工具函数
│   │   └── announcementClassifier.ts # 公告分类器（渲染进程版本）
│   └── types/                   # TypeScript 类型定义
│       └── stock.ts
│
├── docs/                        # 项目文档
│   ├── architecture.md          # 架构文档（本文档）
│   ├── refactoring-plan.md      # 重构计划
│   ├── refactoring-phase2-summary.md  # 重构总结
│   └── ...
│
├── build/                       # 构建资源
│   ├── icon.icns                # 应用图标
│   └── entitlements.mac.plist   # macOS 权限配置
│
├── dist/                        # Vite 构建输出（渲染进程）
├── dist-electron/               # Electron 构建输出（主进程）
├── release/                     # 打包输出目录
│
├── package.json                 # 项目配置
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置
└── tailwind.config.js           # TailwindCSS 配置
```

**⭐ v2.0 新增模块**:

-   `electron/database/`: 数据库模块化
-   `electron/di/`: 依赖注入容器
-   `electron/services/interfaces/`: 服务接口定义
-   `electron/ipc/middleware/`: IPC 中间件
-   `electron/types/errors.ts`: 错误类型定义
-   `electron/utils/announcementClassifier.ts`: 主进程版分类器

---

## 5. 核心模块

### 5.1 主进程模块

#### 5.1.1 应用入口 (`electron/main.ts`)

**职责**:

-   应用生命周期管理
-   窗口创建和管理
-   模块初始化
-   单实例锁定
-   **依赖注入容器初始化** ⭐

**关键功能**:

```typescript
- initialize(): 应用初始化
- registerServices(): 注册 DI 服务 ⭐
- createWindow(): 创建主窗口
- createTray(): 创建系统托盘
- registerShortcuts(): 注册全局快捷键
- setupIPC(): 注册 IPC 处理器
- setupAutoUpdater(): 设置自动更新
```

**初始化流程**:

1. 注册依赖注入服务
2. 创建主窗口
3. 创建系统托盘
4. 注册全局快捷键
5. 注册 IPC 处理器
6. 设置自动更新
7. 同步股票列表（如果需要）

#### 5.1.2 数据库层 (`electron/database/`)

**模块结构**:

1. **connection.ts** - 数据库连接管理

    - `initializeDatabase()`: 初始化数据库连接
    - `getDatabase()`: 获取数据库实例（单例）
    - `getDatabasePath()`: 获取数据库路径
    - `closeDatabase()`: 关闭数据库连接
    - `configureDatabasePerformance()`: 配置性能参数

2. **migrations.ts** - 数据库迁移

    - `createTables()`: 创建所有数据库表
    - `migrateDatabase()`: 执行数据库迁移
    - `migrateAnnouncementsTable()`: 迁移公告表
    - `migrateStocksTable()`: 迁移股票表
    - `initializeDefaultClassificationRules()`: 初始化分类规则

3. **syncFlags.ts** - 同步标志位管理
    - `SyncFlagManager` 类：
        - `getLastSyncDate()`: 获取上次同步日期
        - `updateSyncFlag()`: 更新同步标志位
        - `isSyncedToday()`: 检查今天是否已同步
        - `getAllSyncFlags()`: 获取所有同步标志位
        - `deleteSyncFlag()`: 删除同步标志位
        - `clearAllSyncFlags()`: 清空所有同步标志位

**核心表结构**:

-   `stocks`: 股票基本信息
-   `announcements`: 公告数据
-   `top10_holders`: 十大股东数据
-   `favorite_stocks`: 收藏股票（通过 stocks.is_favorite）
-   `sync_flags`: 同步标志位
-   `announcement_sync_ranges`: 公告同步范围记录
-   `classification_categories`: 分类定义
-   `classification_rules`: 分类规则

**性能优化**:

-   WAL 模式提高并发性能
-   批量插入使用事务
-   索引优化查询性能
-   64MB 缓存大小

#### 5.1.3 仓储层 (`electron/repositories/`)

**职责**: 数据访问抽象，提供 CRUD 操作

**接口定义** (`interfaces/`):

-   `IRepository<T>`: 基础仓储接口
-   `IStockRepository`: 股票仓储接口
-   `IAnnouncementRepository`: 公告仓储接口
-   `IFavoriteRepository`: 收藏仓储接口
-   `IHolderRepository`: 股东仓储接口
-   `IClassificationRepository`: 分类仓储接口

**实现类** (`implementations/`):

-   `BaseRepository`: 基础仓储类（提供通用方法）
-   `StockRepository`: 股票仓储实现
-   `AnnouncementRepository`: 公告仓储实现
-   `FavoriteRepository`: 收藏仓储实现
-   `HolderRepository`: 股东仓储实现
-   `ClassificationRepository`: 分类仓储实现

**特点**:

-   实现接口抽象
-   继承基础仓储类
-   封装数据库操作
-   提供查询优化
-   支持事务操作

#### 5.1.4 服务层 (`electron/services/`)

**职责**: 业务逻辑封装，连接 API 和数据库

**接口定义** (`interfaces/`):

-   `IAnnouncementService`: 公告服务接口
-   `IStockService`: 股票服务接口
-   `IFavoriteService`: 收藏服务接口
-   `IHolderService`: 股东服务接口
-   `IClassificationService`: 分类服务接口
-   `INewsService`: 资讯服务接口

**服务实现**:

-   `announcement.ts`: 公告服务（同步、查询、聚合）
-   `stock.ts`: 股票服务（列表同步、搜索）
-   `news.ts`: 资讯服务（实时获取）
-   `holder.ts`: 股东服务（十大股东同步）
-   `classification.ts`: 分类服务（规则管理、批量打标）
-   `favorite.ts`: 收藏服务（收藏管理）

**特点**:

-   业务逻辑集中
-   调用仓储层和 API 层
-   数据聚合和转换
-   业务规则验证

#### 5.1.5 依赖注入容器 (`electron/di/`)

**模块结构**:

1. **container.ts** - DI 容器实现

    - `DIContainer` 类：
        - `register()`: 注册服务工厂
        - `registerInstance()`: 注册服务实例
        - `resolve()`: 解析服务
        - `has()`: 检查服务是否注册
        - `clear()`: 清空容器
        - `getRegisteredKeys()`: 获取所有已注册的服务

2. **serviceRegistry.ts** - 服务注册
    - `registerServices()`: 注册所有服务和仓储
    - `getStockRepository()`: 获取股票仓储
    - `getFavoriteRepository()`: 获取收藏仓储
    - `getAnnouncementRepository()`: 获取公告仓储
    - `getHolderRepository()`: 获取股东仓储
    - `getClassificationRepository()`: 获取分类仓储

**特点**:

-   单例模式管理服务
-   依赖解析
-   便于测试
-   易于扩展

#### 5.1.6 IPC 层 (`electron/ipc/`)

**职责**: 进程间通信处理，参数验证，错误处理

**IPC 处理器**:

-   `system.ts`: 系统相关（3 个）
-   `updater.ts`: 自动更新（3 个）
-   `favorite.ts`: 收藏相关（5 个）
-   `news.ts`: 资讯相关（1 个）
-   `stock.ts`: 股票相关（7 个）
-   `announcement.ts`: 公告相关（12 个）
-   `holder.ts`: 股东相关（10 个）
-   `classification.ts`: 分类相关（8 个）
-   `database.ts`: 数据库相关（9 个）

**总计**: 58 个 IPC 处理器

**中间件** (`middleware/`):

-   `errorHandler.ts`: 错误处理中间件
    -   `withErrorHandler()`: 包装 IPC 处理器
    -   `wrapHandlers()`: 批量包装处理器

**特点**:

-   统一错误处理
-   参数验证
-   响应格式标准化
-   日志记录

#### 5.1.7 Tushare API 客户端 (`electron/tushare.ts`)

**职责**:

-   封装 Tushare API 请求
-   处理 API 限流和错误重试
-   数据格式转换

**主要 API**:

-   `getStockList()`: 获取股票列表
-   `getAnnouncements()`: 获取公告列表
-   `getAnnouncementsComplete()`: 完整获取公告（支持大范围）
-   `getNews()`: 获取财经资讯
-   `getTop10Holders()`: 获取十大股东数据

### 5.2 渲染进程模块

#### 5.2.1 路由和布局 (`src/App.tsx`, `src/components/Layout.tsx`)

**路由结构**:

```
/ (根路径)
├── /announcements (公告页面)
├── /news (资讯页面)
├── /data-insights (数据洞察)
└── /settings (设置页面)
```

#### 5.2.2 页面组件 (`src/pages/`)

-   **Announcements.tsx**: 公告列表展示，支持筛选、搜索、分页
-   **News.tsx**: 财经资讯展示，支持多源、时间筛选
-   **DataInsights.tsx**: 数据统计和可视化
-   **Settings.tsx**: 应用设置（分类规则、数据库管理等）

#### 5.2.3 服务层 (`src/services/`)

**职责**: 封装 IPC 调用，提供前端可用的服务接口

-   `stockService.ts`: 股票相关服务
-   `favoriteStockService.ts`: 收藏股票服务
-   `stockListSync.ts`: 股票列表同步服务

#### 5.2.4 Hooks (`src/hooks/`)

**职责**: 封装 React 状态逻辑和副作用

-   `useStockList.ts`: 股票列表管理
-   `useStockSearch.ts`: 股票搜索
-   `useStockFilter.ts`: 股票筛选
-   `useFavoriteStocks.ts`: 收藏股票管理

---

## 6. 数据流

### 6.1 公告数据流

```
用户操作
  │
  ├─► 选择日期范围 ──► IPC 调用 getAnnouncementsGrouped
  │                      │
  │                      ▼
  │              IPC 错误处理中间件 ⭐
  │                      │
  │                      ▼
  │              调用公告服务
  │                      │
  │                      ▼
  │              检查本地缓存 (announcement_sync_ranges)
  │                      │
  │                      ├─► 已缓存 ──► 从仓储层读取 ──► 返回前端
  │                      │
  │                      └─► 未缓存 ──► 调用 Tushare API
  │                                      │
  │                                      ▼
  │                              通过仓储层保存到数据库
  │                                      │
  │                                      ▼
  │                              记录同步范围
  │                                      │
  │                                      ▼
  │                              返回数据给前端
  │
  └─► 搜索公告 ──► IPC 调用 searchAnnouncementsGrouped
                     │
                     ▼
               仓储层数据库全文搜索
                     │
                     ▼
               返回搜索结果
```

### 6.2 股票列表同步流程

```
应用启动
  │
  ▼
DI 容器初始化 ⭐
  │
  ▼
检查股票数量（通过仓储层）
  │
  ├─► 数量 > 0 ──► 跳过同步
  │
  └─► 数量 = 0 ──► 调用股票服务
                     │
                     ▼
               调用 Tushare API 获取股票列表
                     │
                     ▼
               通过仓储层批量插入数据库
                     │
                     ▼
               显示同步完成通知
```

### 6.3 十大股东同步流程

```
用户触发同步
  │
  ▼
IPC 调用 syncAllTop10Holders
  │
  ▼
调用股东服务
  │
  ▼
通过仓储层获取股票列表
  │
  ▼
遍历股票（支持暂停/恢复）
  │
  ├─► 调用 Tushare API 获取十大股东
  │      │
  │      ▼
  │   通过仓储层保存到数据库
  │      │
  │      ▼
  │   发送进度事件给前端
  │
  └─► 完成 ──► 发送完成事件
```

---

## 7. IPC 通信架构

### 7.1 IPC 处理器注册

所有 IPC 处理器在 `electron/ipc/index.ts` 中统一注册：

```typescript
setupIPC(mainWindow) {
  registerSystemHandlers()        // 系统相关（3个）
  registerUpdaterHandlers()       // 自动更新（3个）
  registerFavoriteHandlers()      // 收藏相关（5个）
  registerNewsHandlers()           // 资讯相关（1个）
  registerStockHandlers()          // 股票相关（7个）
  registerAnnouncementHandlers()   // 公告相关（12个）
  registerHolderHandlers()         // 股东相关（10个）
  registerClassificationHandlers() // 分类相关（8个）
  registerDatabaseHandlers()        // 数据库相关（9个）
}
```

**总计**: 58 个 IPC 处理器

### 7.2 IPC 通信模式

#### 7.2.1 请求-响应模式（invoke）⭐ 使用错误处理中间件

**渲染进程**:

```typescript
const result = await window.electronAPI.getAnnouncements(page, pageSize);
// result: IPCResponse<T> = { success: boolean, data?: T, error?: ErrorDetails }
```

**主进程**:

```typescript
ipcMain.handle(
	"get-announcements",
	withErrorHandler(async (event, page, pageSize) => {
		return await announcementService.getAnnouncementsGrouped(page, pageSize);
	}, "get-announcements")
);
```

**响应格式**:

```typescript
interface IPCResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: {
		code: ErrorCode | string;
		message: string;
		details?: unknown;
	};
}
```

#### 7.2.2 事件监听模式（on/send）

**渲染进程**:

```typescript
window.electronAPI.onDataUpdated((data) => {
	console.log("Data updated:", data);
});
```

**主进程**:

```typescript
mainWindow.webContents.send("data-updated", data);
```

### 7.3 Preload 脚本 (`electron/preload.ts`)

**职责**: 安全地暴露 Electron API 到渲染进程

**关键特性**:

-   使用 `contextBridge` 确保安全隔离
-   统一 API 命名空间 `window.electronAPI`
-   提供类型定义 (`src/electron.d.ts`)

---

## 8. 数据库设计

### 8.1 数据库配置

-   **数据库引擎**: SQLite 3 (better-sqlite3)
-   **数据库位置**: `app.getPath('userData')/cafe_stock.db`
-   **WAL 模式**: 启用，提高并发性能
-   **缓存大小**: 64MB
-   **同步模式**: NORMAL

### 8.2 核心表结构

#### 8.2.1 stocks（股票表）

```sql
CREATE TABLE stocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts_code TEXT NOT NULL UNIQUE,      -- Tushare 股票代码
  symbol TEXT,                        -- 股票代码（6位）
  name TEXT,                          -- 股票名称
  area TEXT,                          -- 地区
  industry TEXT,                      -- 行业
  fullname TEXT,                      -- 全称
  enname TEXT,                        -- 英文名
  cnspell TEXT,                       -- 拼音
  market TEXT,                        -- 市场类型
  exchange TEXT,                      -- 交易所
  curr_type TEXT,                     -- 交易货币
  list_status TEXT,                   -- 上市状态
  list_date TEXT,                     -- 上市日期
  delist_date TEXT,                   -- 退市日期
  is_hs TEXT,                         -- 是否沪深港通
  is_favorite INTEGER DEFAULT 0,     -- 是否收藏
  updated_at TEXT NOT NULL            -- 更新时间
);
```

**索引**:

-   `idx_stock_name`: 股票名称
-   `idx_stock_industry`: 行业
-   `idx_stock_list_status`: 上市状态
-   `idx_stock_is_favorite`: 收藏状态

#### 8.2.2 announcements（公告表）

```sql
CREATE TABLE announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts_code TEXT NOT NULL,              -- 股票代码
  ann_date TEXT NOT NULL,             -- 公告日期
  ann_type TEXT,                      -- 公告类型
  title TEXT,                         -- 标题
  content TEXT,                       -- 内容
  pub_time TEXT,                      -- 发布时间
  file_path TEXT,                     -- PDF 文件路径
  name TEXT,                          -- 股票名称（冗余）
  category TEXT,                      -- 分类标签
  url TEXT,                           -- 公告 URL
  rec_time TEXT,                      -- 记录时间
  UNIQUE(ts_code, ann_date, title)    -- 唯一约束
);
```

**索引**:

-   `idx_ann_date`: 公告日期（DESC）
-   `idx_ann_ts_code`: 股票代码
-   `idx_ann_ts_code_date`: 股票代码+日期（复合）
-   `idx_ann_category`: 分类标签

#### 8.2.3 top10_holders（十大股东表）

```sql
CREATE TABLE top10_holders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts_code TEXT NOT NULL,              -- 股票代码
  ann_date TEXT NOT NULL,             -- 公告日期
  end_date TEXT NOT NULL,             -- 报告期
  holder_name TEXT NOT NULL,          -- 股东名称
  hold_amount REAL,                   -- 持股数量
  hold_ratio REAL,                    -- 持股比例
  updated_at TEXT NOT NULL,           -- 更新时间
  UNIQUE(ts_code, end_date, holder_name)
);
```

**索引**:

-   `idx_top10_ts_code`: 股票代码
-   `idx_top10_end_date`: 报告期（DESC）
-   `idx_top10_holder_name`: 股东名称
-   `idx_top10_ts_end_date`: 股票代码+报告期（复合）

#### 8.2.4 announcement_sync_ranges（同步范围表）

```sql
CREATE TABLE announcement_sync_ranges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts_code TEXT,                       -- 股票代码（NULL 表示全市场）
  start_date TEXT NOT NULL,           -- 开始日期
  end_date TEXT NOT NULL,             -- 结束日期
  synced_at TEXT NOT NULL             -- 同步时间
);
```

**用途**: 记录已同步的时间范围，避免重复同步

#### 8.2.5 classification_categories（分类定义表）

```sql
CREATE TABLE classification_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_key TEXT NOT NULL UNIQUE,  -- 分类键
  category_name TEXT NOT NULL,        -- 分类名称
  color TEXT,                         -- 颜色
  icon TEXT,                          -- 图标
  priority INTEGER NOT NULL,         -- 优先级
  enabled INTEGER DEFAULT 1,         -- 是否启用
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

#### 8.2.6 classification_rules（分类规则表）

```sql
CREATE TABLE classification_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_key TEXT NOT NULL,         -- 分类键
  keyword TEXT NOT NULL,              -- 关键词
  enabled INTEGER DEFAULT 1,         -- 是否启用
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (category_key) REFERENCES classification_categories(category_key)
);
```

### 8.3 数据库迁移

**迁移策略**: 在 `database/migrations.ts` 中实现 `migrateDatabase()` 函数，检查并添加缺失的列。

**已实现的迁移**:

-   添加 `announcements.name` 列
-   添加 `announcements.url` 列
-   添加 `announcements.rec_time` 列
-   添加 `stocks.is_favorite` 列
-   添加 `announcements.category` 列
-   初始化默认分类规则

---

## 9. 依赖注入

### 9.1 DI 容器设计

**容器类** (`di/container.ts`):

```typescript
class DIContainer {
	private services = new Map<string, any>();
	private factories = new Map<string, Factory<any>>();
	private singletons = new Map<string, any>();

	register<T>(key: string, factory: Factory<T>, singleton: boolean = true): void;
	registerInstance<T>(key: string, instance: T): void;
	resolve<T>(key: string): T;
	has(key: string): boolean;
	clear(): void;
	getRegisteredKeys(): string[];
}
```

### 9.2 服务注册

**注册流程** (`di/serviceRegistry.ts`):

```typescript
export function registerServices(): void {
	const db = getDatabase();

	// 注册仓储（单例）
	container.register("StockRepository", () => new StockRepository(db), true);
	container.register("FavoriteRepository", () => new FavoriteRepository(db), true);
	container.register("AnnouncementRepository", () => new AnnouncementRepository(db), true);
	container.register("HolderRepository", () => new HolderRepository(db), true);
	container.register("ClassificationRepository", () => new ClassificationRepository(db), true);
}
```

### 9.3 服务解析

**便捷方法**:

```typescript
export function getStockRepository(): IStockRepository {
	return container.resolve<IStockRepository>("StockRepository");
}

export function getAnnouncementRepository(): IAnnouncementRepository {
	return container.resolve<IAnnouncementRepository>("AnnouncementRepository");
}
```

### 9.4 使用示例

**在服务层使用**:

```typescript
import { getStockRepository, getAnnouncementRepository } from "../di/serviceRegistry.js";

const stockRepository = getStockRepository();
const announcementRepository = getAnnouncementRepository();
```

---

## 10. 错误处理

### 10.1 错误类型定义

**错误码枚举** (`types/errors.ts`):

```typescript
enum ErrorCode {
	// 通用错误 (1000-1999)
	UNKNOWN_ERROR = "UNKNOWN_ERROR",
	INVALID_PARAMS = "INVALID_PARAMS",
	OPERATION_FAILED = "OPERATION_FAILED",

	// 数据库错误 (2000-2999)
	DATABASE_ERROR = "DATABASE_ERROR",
	DATABASE_CONNECTION_ERROR = "DATABASE_CONNECTION_ERROR",
	DATABASE_QUERY_ERROR = "DATABASE_QUERY_ERROR",

	// API 错误 (3000-3999)
	API_ERROR = "API_ERROR",
	API_REQUEST_FAILED = "API_REQUEST_FAILED",
	API_RESPONSE_ERROR = "API_RESPONSE_ERROR",
	API_RATE_LIMIT = "API_RATE_LIMIT",

	// 业务错误 (4000-4999)
	STOCK_NOT_FOUND = "STOCK_NOT_FOUND",
	ANNOUNCEMENT_NOT_FOUND = "ANNOUNCEMENT_NOT_FOUND",
	SYNC_IN_PROGRESS = "SYNC_IN_PROGRESS",
	SYNC_FAILED = "SYNC_FAILED",
}
```

**错误响应接口**:

```typescript
interface IPCResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: {
		code: ErrorCode | string;
		message: string;
		details?: unknown;
	};
}
```

### 10.2 错误处理中间件

**中间件实现** (`ipc/middleware/errorHandler.ts`):

```typescript
export function withErrorHandler<T extends any[], R = any>(handler: IPCHandler<T, R>, handlerName?: string): WrappedIPCHandler<T> {
	return async (event: IpcMainInvokeEvent, ...args: T): Promise<IPCResponse> => {
		try {
			const result = await handler(event, ...args);
			return createSuccessResponse(result);
		} catch (error) {
			log.error("IPC", `请求失败: ${handlerName}`, error);
			return createErrorResponse(error);
		}
	};
}
```

### 10.3 自定义错误类

**AppError 类**:

```typescript
class AppError extends Error {
	public readonly code: ErrorCode | string;
	public readonly details?: unknown;

	constructor(code: ErrorCode | string, message: string, details?: unknown) {
		super(message);
		this.name = "AppError";
		this.code = code;
		this.details = details;
	}
}
```

### 10.4 使用示例

**在 IPC handler 中使用**:

```typescript
ipcMain.handle(
	"open-external",
	withErrorHandler(async (_event, url: string) => {
		// 安全检查
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			throw new AppError(ErrorCode.INVALID_PARAMS, "只支持 HTTP/HTTPS 协议");
		}

		await shell.openExternal(url);
		return { success: true };
	}, "open-external")
);
```

---

## 11. 构建与部署

### 11.1 开发环境

**启动命令**:

```bash
npm run dev
```

**构建流程**:

1. Vite 编译渲染进程代码（TypeScript → JavaScript）
2. TypeScript 编译主进程代码
3. Electron 启动应用

**启动日志**:

```
[INFO][DB] 初始化数据库连接
[INFO][DB] 数据库连接初始化成功
[INFO][DB] 开始创建数据库表...
[INFO][DB] 数据库表创建完成
[INFO][DB] 开始数据库迁移...
[INFO][DB] 数据库迁移完成
[INFO][DI] 开始注册服务...
[DEBUG][DI] 注册服务: StockRepository (单例: true)
[DEBUG][DI] 注册服务: FavoriteRepository (单例: true)
[DEBUG][DI] 注册服务: AnnouncementRepository (单例: true)
[DEBUG][DI] 注册服务: HolderRepository (单例: true)
[DEBUG][DI] 注册服务: ClassificationRepository (单例: true)
[INFO][DI] 服务注册完成
[INFO][IPC] All IPC handlers registered successfully
[INFO][App] 酷咖啡股票助手 - 启动完成
```

### 11.2 生产构建

**构建命令**:

```bash
npm run build
```

**构建流程**:

1. 编译 TypeScript 代码
2. Vite 构建渲染进程
3. 编译主进程代码
4. electron-builder 打包应用

**输出目录**:

-   `dist/`: 渲染进程构建输出
-   `dist-electron/`: 主进程构建输出
-   `release/`: 打包后的应用安装包

### 11.3 打包配置

**配置文件**: `package.json` 的 `build` 字段

**macOS 配置**:

```json
{
	"mac": {
		"category": "public.app-category.finance",
		"target": ["dmg"],
		"icon": "build/icon.icns",
		"hardenedRuntime": true,
		"entitlements": "build/entitlements.mac.plist"
	}
}
```

### 11.4 自动更新

**更新服务**: GitHub Releases

**配置**:

```json
{
	"publish": [
		{
			"provider": "github",
			"owner": "cafe9k",
			"repo": "cafe-stock"
		}
	]
}
```

**更新流程**:

1. 应用启动时自动检查更新
2. 发现新版本后后台下载
3. 下载完成后提示用户安装
4. 用户确认后重启应用安装新版本

---

## 12. 开发规范

### 12.1 代码规范

-   **命名规范**:

    -   类名: PascalCase（如 `UserService`）
    -   函数/变量: camelCase（如 `getUserName`）
    -   常量: UPPER_SNAKE_CASE（如 `MAX_RETRY_COUNT`）
    -   接口: I + PascalCase（如 `IStockRepository`）

-   **缩进**: 使用 Tab（2 空格）

-   **行长度**: 不超过 120 字符

### 12.2 TypeScript 规范

-   所有文件使用 TypeScript
-   避免使用 `any`，优先使用具体类型
-   导出类型定义到 `types/` 目录
-   服务层和仓储层必须定义接口
-   使用依赖注入而非直接实例化

### 12.3 文件组织

-   **主进程代码**: `electron/` 目录
-   **渲染进程代码**: `src/` 目录
-   **文档**: `docs/` 目录
-   **构建资源**: `build/` 目录
-   **接口定义**: `interfaces/` 子目录
-   **实现类**: `implementations/` 子目录

### 12.4 架构规范

-   **分层原则**: 严格遵守分层架构，不跨层调用
-   **依赖方向**: 上层依赖下层，下层不依赖上层
-   **接口抽象**: 服务层和仓储层必须定义接口
-   **依赖注入**: 使用 DI 容器管理依赖
-   **错误处理**: IPC 层使用统一的错误处理中间件
-   **主进程独立**: 主进程代码不依赖渲染进程代码

### 12.5 Git 提交规范

-   `feat`: 新功能
-   `fix`: 修复 bug
-   `docs`: 文档更新
-   `style`: 代码格式调整
-   `refactor`: 代码重构
-   `test`: 测试相关
-   `chore`: 构建/工具相关

---

## 附录

### A. 关键文件说明

| 文件                                      | 说明                                  |
| ----------------------------------------- | ------------------------------------- |
| `electron/main.ts`                        | 应用入口，生命周期管理，DI 容器初始化 |
| `electron/preload.ts`                     | IPC 桥接脚本                          |
| `electron/database/connection.ts`         | 数据库连接管理                        |
| `electron/database/migrations.ts`         | 数据库迁移                            |
| `electron/di/container.ts`                | 依赖注入容器                          |
| `electron/di/serviceRegistry.ts`          | 服务注册                              |
| `electron/ipc/middleware/errorHandler.ts` | IPC 错误处理中间件                    |
| `electron/types/errors.ts`                | 错误类型定义                          |
| `electron/tushare.ts`                     | Tushare API 客户端                    |
| `src/App.tsx`                             | React 应用根组件                      |
| `vite.config.ts`                          | Vite 构建配置                         |

### B. 环境变量

| 变量名          | 说明              | 默认值         |
| --------------- | ----------------- | -------------- |
| `TUSHARE_TOKEN` | Tushare API Token | 硬编码在代码中 |

### C. 性能优化

1. **数据库优化**:

    - 使用 WAL 模式提高并发性能
    - 合理使用索引
    - 批量操作使用事务
    - 64MB 缓存大小

2. **网络优化**:

    - 智能缓存策略
    - 增量同步避免重复请求
    - 批量请求减少 API 调用次数

3. **前端优化**:

    - React 组件懒加载
    - 虚拟滚动处理大量数据
    - 防抖和节流优化搜索

4. **架构优化** ⭐:
    - 依赖注入单例模式减少实例创建
    - 仓储层缓存查询结果
    - IPC 层统一错误处理减少重复代码

### D. 架构演进 (v1.0 → v2.0)

**v1.0 问题**:

-   数据库逻辑混乱，职责不清
-   服务层直接创建依赖，难以测试
-   IPC 层错误处理不统一
-   主进程依赖渲染进程代码

**v2.0 改进**:

-   ✅ 数据库模块化：连接、迁移、同步标志位分离
-   ✅ 依赖注入：使用 DI 容器管理依赖
-   ✅ 接口抽象：服务层和仓储层都有接口定义
-   ✅ 统一错误处理：IPC 层使用中间件
-   ✅ 主进程独立：分类器移到主进程

**架构对比**:

| 特性         | v1.0         | v2.0               |
| ------------ | ------------ | ------------------ |
| 数据库管理   | 单一文件     | 模块化（3 个文件） |
| 依赖管理     | 直接实例化   | DI 容器            |
| 接口抽象     | 仅仓储层     | 服务层+仓储层      |
| 错误处理     | 分散         | 统一中间件         |
| 主进程独立性 | 依赖渲染进程 | 完全独立           |
| 可测试性     | 低           | 高                 |
| 可扩展性     | 中           | 高                 |

---

**文档维护**: 本文档应随项目架构变更及时更新  
**最后更新**: 2025-12-17  
**版本**: v2.0.0 (架构重构版)
