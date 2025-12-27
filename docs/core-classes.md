# CafeStock 核心类功能对照表

本文档提供项目中所有核心类的快速参考，包括类名、文件路径、主要功能和关键方法。

## 主进程核心类

### 应用入口

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `initialize()` | `electron/main.ts` | 应用初始化 | - |
| `app` | `electron/main.ts` | Electron 应用实例 | `whenReady()`, `quit()` |

### 窗口管理

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `createWindow()` | `electron/core/window.ts` | 创建主窗口 | - |
| `getMainWindow()` | `electron/core/window.ts` | 获取主窗口实例 | - |
| `setMainWindow()` | `electron/core/window.ts` | 设置主窗口实例 | - |

### 系统托盘

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `createTray()` | `electron/core/tray.ts` | 创建系统托盘 | - |

### 快捷键

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `registerShortcuts()` | `electron/core/shortcuts.ts` | 注册全局快捷键 | - |

## 数据库层

### 数据库连接

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `initializeDatabase()` | `electron/database/connection.ts` | 初始化数据库连接 | - |
| `getDatabase()` | `electron/database/connection.ts` | 获取数据库实例 | - |
| `closeDatabase()` | `electron/database/connection.ts` | 关闭数据库连接 | - |
| `configureDatabasePerformance()` | `electron/database/connection.ts` | 配置数据库性能参数 | - |

### 数据库迁移

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `createTables()` | `electron/database/migrations.ts` | 创建数据库表 | - |
| `migrateDatabase()` | `electron/database/migrations.ts` | 执行数据库迁移 | - |

### 同步标志管理

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `SyncFlagManager` | `electron/database/syncFlags.ts` | 同步标志位管理 | `updateSyncFlag()`, `getSyncFlag()` |

## 依赖注入

### DI 容器

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `DIContainer` | `electron/di/container.ts` | 依赖注入容器 | `register()`, `resolve()`, `has()` |
| `container` | `electron/di/container.ts` | 全局容器实例 | - |

### 服务注册

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `registerServices()` | `electron/di/serviceRegistry.ts` | 注册所有服务 | - |
| `SERVICE_KEYS` | `electron/di/serviceRegistry.ts` | 服务标识常量 | - |
| `getStockRepository()` | `electron/di/serviceRegistry.ts` | 获取股票仓储 | - |
| `getFavoriteRepository()` | `electron/di/serviceRegistry.ts` | 获取收藏仓储 | - |
| `getAnnouncementRepository()` | `electron/di/serviceRegistry.ts` | 获取公告仓储 | - |
| `getHolderRepository()` | `electron/di/serviceRegistry.ts` | 获取股东仓储 | - |
| `getClassificationRepository()` | `electron/di/serviceRegistry.ts` | 获取分类仓储 | - |

## API 客户端

### Tushare 客户端

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `TushareClient` | `electron/tushare.ts` | Tushare API 客户端 | `request()`, `getStockList()`, `getAnnouncements()`, `getAnnouncementsComplete()`, `getDailyBasic()`, `getStockCompany()`, `getTop10Holders()`, `getNews()` |

## 仓储层 (Repository)

### 基础仓储

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `BaseRepository` | `electron/repositories/base/BaseRepository.ts` | 基础仓储类 | `transaction()`, `getCurrentTimestamp()`, `execute()` |

### 股票仓储

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `StockRepository` | `electron/repositories/implementations/StockRepository.ts` | 股票数据访问 | `upsertStocks()`, `getAllStocks()`, `countStocks()`, `searchStocks()`, `getStockListSyncInfo()` |
| `IStockRepository` | `electron/repositories/interfaces/IStockRepository.ts` | 股票仓储接口 | - |

### 公告仓储

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `AnnouncementRepository` | `electron/repositories/implementations/AnnouncementRepository.ts` | 公告数据访问 | `upsertAnnouncements()`, `getAnnouncementsByDateRange()`, `isAnnouncementRangeSynced()`, `recordAnnouncementSyncRange()`, `searchAnnouncements()` |
| `IAnnouncementRepository` | `electron/repositories/interfaces/IAnnouncementRepository.ts` | 公告仓储接口 | - |

### 收藏仓储

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `FavoriteRepository` | `electron/repositories/implementations/FavoriteRepository.ts` | 收藏数据访问 | `addFavorite()`, `removeFavorite()`, `isFavorite()`, `getAllFavoriteStocks()`, `countFavorites()` |
| `IFavoriteRepository` | `electron/repositories/interfaces/IFavoriteRepository.ts` | 收藏仓储接口 | - |

### 股东仓储

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `HolderRepository` | `electron/repositories/implementations/HolderRepository.ts` | 股东数据访问 | `upsertHolders()`, `getHoldersByStock()`, `getHoldersByEndDate()`, `getEndDates()`, `hasHoldersData()` |
| `IHolderRepository` | `electron/repositories/interfaces/IHolderRepository.ts` | 股东仓储接口 | - |

### 分类仓储

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `ClassificationRepository` | `electron/repositories/implementations/ClassificationRepository.ts` | 分类数据访问 | `getCategories()`, `getRules()`, `addRule()`, `updateRule()`, `deleteRule()`, `resetRules()` |
| `IClassificationRepository` | `electron/repositories/interfaces/IClassificationRepository.ts` | 分类仓储接口 | - |

### 股票详情仓储

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `StockDetailRepository` | `electron/repositories/implementations/StockDetailRepository.ts` | 股票详情数据访问 | `upsertDailyBasic()`, `upsertCompanyInfo()`, `countDailyBasic()`, `countCompanyInfo()` |

## 服务层 (Service)

### 股票服务

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `syncStocksIfNeeded()` | `electron/services/stock.ts` | 按需同步股票列表 | - |
| `syncAllStocks()` | `electron/services/stock.ts` | 同步所有股票 | - |
| `syncStockDetails()` | `electron/services/stock.ts` | 同步股票详情 | - |
| `getStockList()` | `electron/services/stock.ts` | 获取股票列表 | - |
| `getStockCount()` | `electron/services/stock.ts` | 获取股票数量 | - |
| `getStockDetailsStats()` | `electron/services/stock.ts` | 获取股票详情统计 | - |

### 公告服务

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `getAnnouncementsGroupedFromAPI()` | `electron/services/announcement.ts` | 获取聚合公告 | - |
| `searchAnnouncementsGroupedFromAPI()` | `electron/services/announcement.ts` | 搜索聚合公告 | - |
| `getFavoriteStocksAnnouncementsGroupedFromAPI()` | `electron/services/announcement.ts` | 获取关注股票公告 | - |
| `aggregateAnnouncementsByStock()` | `electron/services/announcement.ts` | 按股票聚合公告 | - |

### 收藏服务

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `addFavoriteStock()` | `electron/services/favorite.ts` | 添加收藏 | - |
| `removeFavoriteStock()` | `electron/services/favorite.ts` | 移除收藏 | - |
| `isFavoriteStock()` | `electron/services/favorite.ts` | 检查是否收藏 | - |
| `getAllFavoriteStocks()` | `electron/services/favorite.ts` | 获取所有收藏 | - |

### 股东服务

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `syncAllTop10Holders()` | `electron/services/holder.ts` | 同步所有股东数据 | - |
| `syncStockTop10Holders()` | `electron/services/holder.ts` | 同步单个股票股东数据 | - |
| `getTop10Holders()` | `electron/services/holder.ts` | 获取股东数据 | - |
| `getTop10HoldersSyncStats()` | `electron/services/holder.ts` | 获取同步统计 | - |

### 分类服务

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `classifyAnnouncementTitle()` | `electron/services/classification.ts` | 分类公告标题 | - |
| `getCategories()` | `electron/services/classification.ts` | 获取分类列表 | - |
| `getRules()` | `electron/services/classification.ts` | 获取规则列表 | - |
| `tagAllAnnouncements()` | `electron/services/classification.ts` | 批量打标公告 | - |
| `reprocessAllAnnouncements()` | `electron/services/classification.ts` | 重新处理所有公告 | - |

### 资讯服务

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `getNews()` | `electron/services/news.ts` | 获取财经资讯 | - |

## IPC 通信层

### IPC 注册

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `setupIPC()` | `electron/ipc/index.ts` | 注册所有 IPC 处理器 | - |
| `cleanupDatabaseResources()` | `electron/ipc/index.ts` | 清理数据库资源 | - |

### IPC 处理器模块

| 模块 | 文件路径 | 功能 | 主要 Handler |
|------|---------|------|-------------|
| `system.ts` | `electron/ipc/system.ts` | 系统相关 | `show-notification`, `get-app-version`, `open-external` |
| `updater.ts` | `electron/ipc/updater.ts` | 自动更新 | `check-for-updates`, `download-update`, `install-update` |
| `stock.ts` | `electron/ipc/stock.ts` | 股票相关 | `search-stocks`, `sync-all-stocks`, `sync-stock-details` |
| `announcement.ts` | `electron/ipc/announcement.ts` | 公告相关 | `get-announcements-grouped`, `get-stock-announcements`, `search-announcements-grouped` |
| `favorite.ts` | `electron/ipc/favorite.ts` | 收藏相关 | `add-favorite-stock`, `remove-favorite-stock`, `is-favorite-stock` |
| `holder.ts` | `electron/ipc/holder.ts` | 股东相关 | `get-top10-holders`, `sync-all-top10-holders`, `sync-stock-top10-holders` |
| `classification.ts` | `electron/ipc/classification.ts` | 分类相关 | `get-classification-categories`, `get-classification-rules`, `tag-all-announcements` |
| `news.ts` | `electron/ipc/news.ts` | 资讯相关 | `get-news` |
| `database.ts` | `electron/ipc/database.ts` | 数据库相关 | `get-db-connection-info`, `get-database-tables`, `reset-database` |

## Preload 脚本

| 对象 | 文件路径 | 功能 | 主要 API |
|------|---------|------|---------|
| `electronAPI` | `electron/preload.ts` | 暴露给渲染进程的 API | `getAnnouncements()`, `addFavoriteStock()`, `searchStocks()`, `checkForUpdates()` 等 |

## 工具类

### 日志工具

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `log` | `electron/utils/logger.ts` | 日志工具对象 | `debug()`, `info()`, `warn()`, `error()` |

### 公告分类器

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `classifyAnnouncement()` | `electron/utils/announcementClassifier.ts` | 分类公告标题 | - |
| `getCategoryColor()` | `electron/utils/announcementClassifier.ts` | 获取分类颜色 | - |
| `getCategoryIcon()` | `electron/utils/announcementClassifier.ts` | 获取分类图标 | - |
| `DEFAULT_CLASSIFICATION_RULES` | `electron/utils/announcementClassifier.ts` | 默认分类规则 | - |

## 自动更新

| 类/函数 | 文件路径 | 功能 | 关键方法 |
|---------|---------|------|---------|
| `setupAutoUpdater()` | `electron/updater/index.ts` | 设置自动更新 | - |

## 渲染进程核心类

### 应用入口

| 类/组件 | 文件路径 | 功能 | 关键特性 |
|---------|---------|------|---------|
| `App` | `src/App.tsx` | React 应用根组件 | 路由配置、同步状态管理 |

### 页面组件

| 组件 | 文件路径 | 功能 |
|------|---------|------|
| `Announcements` | `src/pages/Announcements.tsx` | 公告列表页面 |
| `News` | `src/pages/News.tsx` | 资讯页面 |
| `DataInsights` | `src/pages/DataInsights.tsx` | 数据洞察页面 |
| `Settings` | `src/pages/Settings.tsx` | 设置页面 |

### 业务组件

| 组件 | 文件路径 | 功能 |
|------|---------|------|
| `AnnouncementList` | `src/components/AnnouncementList.tsx` | 公告列表组件 |
| `NewsList` | `src/components/NewsList.tsx` | 资讯列表组件 |
| `StockList` | `src/components/StockList/` | 股票列表组件 |
| `FavoriteButton` | `src/components/FavoriteButton.tsx` | 收藏按钮组件 |
| `PDFViewer` | `src/components/PDFViewer.tsx` | PDF 查看器组件 |
| `Layout` | `src/components/Layout.tsx` | 布局组件 |

### 自定义 Hooks

| Hook | 文件路径 | 功能 |
|------|---------|------|
| `useStockList` | `src/hooks/useStockList.ts` | 股票列表管理 |
| `useFavoriteStocks` | `src/hooks/useFavoriteStocks.ts` | 收藏股票管理 |
| `useStockSearch` | `src/hooks/useStockSearch.ts` | 股票搜索 |
| `useStockFilter` | `src/hooks/useStockFilter.ts` | 股票过滤 |

### 服务层（渲染进程）

| 服务 | 文件路径 | 功能 |
|------|---------|------|
| `stockService` | `src/services/stockService.ts` | 股票服务 |
| `favoriteStockService` | `src/services/favoriteStockService.ts` | 收藏服务 |
| `stockListSyncService` | `src/services/stockListSync.ts` | 股票列表同步服务 |

## 类型定义

| 类型/接口 | 文件路径 | 功能 |
|----------|---------|------|
| `Stock` | `electron/types/index.ts` | 股票类型定义 |
| `Announcement` | `electron/types/index.ts` | 公告类型定义 |
| `GroupedAnnouncement` | `electron/types/index.ts` | 聚合公告类型定义 |
| `SyncResult` | `electron/types/index.ts` | 同步结果类型定义 |
| `ExtendedApp` | `electron/types/index.ts` | 扩展应用类型定义 |

## 数据库表结构

| 表名 | 功能 | 主要字段 |
|------|------|---------|
| `stocks` | 股票基本信息 | `ts_code`, `name`, `industry`, `market` |
| `announcements` | 公告数据 | `ts_code`, `ann_date`, `title`, `content` |
| `top10_holders` | 十大股东数据 | `ts_code`, `end_date`, `holder_name`, `hold_ratio` |
| `stock_daily_basic` | 股票日线基础数据 | `ts_code`, `trade_date`, `total_mv`, `pe` |
| `stock_company` | 公司信息 | `ts_code`, `chairman`, `introduction` |
| `sync_flags` | 同步标志位 | `sync_type`, `last_sync_date` |
| `announcement_sync_ranges` | 公告同步范围 | `ts_code`, `start_date`, `end_date` |
| `classification_categories` | 分类类别 | `category_key`, `category_name`, `priority` |
| `classification_rules` | 分类规则 | `category_key`, `keyword`, `enabled` |

## 使用说明

1. **查找功能**: 使用 Ctrl+F 搜索类名或功能关键词
2. **查看实现**: 点击文件路径可直接跳转到源码
3. **理解关系**: 结合 `architecture.md` 了解类之间的依赖关系
4. **查看流程**: 参考 `flowcharts.md` 了解功能执行流程





