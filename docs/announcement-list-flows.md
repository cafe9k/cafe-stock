# 公告列表业务流程图

本文档描述公告列表模块的核心业务流程及各种子业务场景。

---

## 1. 核心业务流程 - 公告列表加载流程

```mermaid
graph TD
    A[用户打开公告页面] --> B[AnnouncementList 组件挂载]
    B --> C[useStockList Hook 初始化]
    C --> D[useStockFilter Hook 初始化]
    D --> E[构建筛选条件 currentFilter]
    E --> F[调用 updateFilter]
    F --> G[触发 IPC: get-announcements-grouped]
    G --> H[主进程: registerAnnouncementHandlers]
    H --> I[announcementService.getAnnouncementsGroupedFromAPI]
    I --> J{检查是否已同步}
    J -->|已同步| K[从数据库读取公告]
    J -->|未同步| L[调用 Tushare API]
    L --> M[保存到数据库]
    M --> N[记录同步范围]
    K --> O[aggregateAnnouncementsByStock]
    N --> O
    O --> P[应用筛选条件]
    P --> Q{有搜索关键字?}
    Q -->|是| R[过滤股票和公告]
    Q -->|否| S[应用分类筛选]
    R --> S
    S --> T[应用市值筛选]
    T --> U[分页处理]
    U --> V[返回聚合结果]
    V --> W[渲染进程: 更新 UI]
    W --> X[StockList 组件渲染表格]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 用户打开公告页面 | `Announcements` | `src/pages/Announcements.tsx` | 页面容器组件 |
| AnnouncementList 组件 | `AnnouncementList` | `src/components/AnnouncementList.tsx` | 核心UI组件，管理列表状态 |
| useStockList Hook | `useStockList` | `src/hooks/useStockList.ts` | 数据加载和分页管理 |
| useStockFilter Hook | `useStockFilter` | `src/hooks/useStockFilter.ts` | 筛选条件管理 |
| IPC 调用 | `window.electronAPI` | `src/electron.d.ts` | IPC 接口定义 |
| 主进程 Handler | `registerAnnouncementHandlers` | `electron/ipc/announcement.ts` | IPC 处理器注册 |
| 业务逻辑层 | `announcementService` | `electron/services/announcement.ts` | 公告业务逻辑 |
| 数据访问层 | `AnnouncementRepository` | `electron/repositories/implementations/AnnouncementRepository.ts` | 数据库操作 |
| API 客户端 | `TushareClient` | `electron/tushare.ts` | Tushare API 调用 |
| 数据聚合 | `aggregateAnnouncementsByStock` | `electron/services/announcement.ts` | 按股票聚合公告 |
| UI 渲染 | `StockList` | `src/components/StockList/StockList.tsx` | 表格组件 |

---

## 2. 搜索业务流程

```mermaid
graph TD
    A[用户输入搜索关键字] --> B[onChange 事件触发]
    B --> C[更新 searchKeyword 状态]
    C --> D[启动防抖定时器 500ms]
    D --> E{500ms 内有新输入?}
    E -->|是| C
    E -->|否| F[更新 debouncedSearchKeyword]
    F --> G[useEffect 监听到变化]
    G --> H[清空展开行数据]
    H --> I[构建新的 currentFilter]
    I --> J[调用 updateFilter]
    J --> K[IPC: get-announcements-grouped]
    K --> L[应用关键字筛选]
    L --> M{匹配股票名称?}
    M -->|是| N[保留该股票]
    M -->|否| O{匹配股票代码?}
    O -->|是| N
    O -->|否| P{匹配公告标题?}
    P -->|是| N
    P -->|否| Q[过滤掉该股票]
    N --> R[返回筛选结果]
    R --> S[渲染搜索结果]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 输入组件 | `Search` (Ant Design) | `src/components/AnnouncementList.tsx` | 搜索输入框 |
| 防抖处理 | `useEffect + setTimeout` | `src/components/AnnouncementList.tsx` | 防抖逻辑 |
| 搜索过滤 | `announcementService` | `electron/services/announcement.ts` | 搜索业务逻辑 |
| 股票搜索 | `StockRepository.searchStocks` | `electron/repositories/implementations/StockRepository.ts` | 股票名称/代码搜索 |
| 公告搜索 | `AnnouncementRepository.searchAnnouncements` | `electron/repositories/implementations/AnnouncementRepository.ts` | 公告标题/内容搜索 |

---

## 3. 搜索历史管理流程

```mermaid
graph TD
    A[用户提交搜索] --> B[handleSearch 函数]
    B --> C[trim 搜索关键字]
    C --> D{关键字非空?}
    D -->|否| E[结束]
    D -->|是| F{历史中已存在?}
    F -->|是| G[不添加到历史]
    F -->|否| H[添加到历史数组头部]
    H --> I[限制历史数量 MAX_SEARCH_HISTORY]
    I --> J[保存到 localStorage]
    J --> K[更新 searchHistory 状态]
    K --> L[渲染历史标签]
    
    M[用户点击历史标签] --> N[handleUseSearchHistory]
    N --> O[设置 searchKeyword]
    O --> P[立即更新 debouncedSearchKeyword]
    P --> Q[触发搜索]
    
    R[用户删除历史] --> S[handleRemoveSearchHistory]
    S --> T[阻止事件冒泡]
    T --> U[从数组中移除]
    U --> V[保存到 localStorage]
    V --> W[更新状态]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 搜索提交 | `handleSearch` | `src/components/AnnouncementList.tsx` | 搜索处理函数 |
| 历史管理 | `useState + localStorage` | `src/components/AnnouncementList.tsx` | 搜索历史状态管理 |
| 历史使用 | `handleUseSearchHistory` | `src/components/AnnouncementList.tsx` | 使用历史记录 |
| 历史删除 | `handleRemoveSearchHistory` | `src/components/AnnouncementList.tsx` | 删除历史记录 |
| 历史渲染 | `Tag` (Ant Design) | `src/components/AnnouncementList.tsx` | 历史标签组件 |

---

## 4. 展开行加载公告详情流程

```mermaid
graph TD
    A[用户点击股票行] --> B[onRowClick 回调]
    B --> C{当前行是否已展开?}
    C -->|是| D[收起该行]
    C -->|否| E[展开该行]
    E --> F[调用 onExpand 函数]
    F --> G{该股票公告数据已加载?}
    G -->|是| H[直接渲染已有数据]
    G -->|否| I[设置加载状态]
    I --> J[IPC: get-stock-announcements]
    J --> K[主进程接收请求]
    K --> L[调用 TushareClient.getAnnouncements]
    L --> M[传入时间范围参数]
    M --> N[获取公告列表]
    N --> O[按日期和时间排序]
    O --> P[添加分类信息]
    P --> Q[返回公告数据]
    Q --> R[保存到 expandedData]
    R --> S[初始化分页状态]
    S --> T[清除加载状态]
    T --> U[渲染 expandedRowRender]
    U --> V[显示公告表格]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 行点击事件 | `onRowClick` | `src/components/AnnouncementList.tsx` | 行点击回调 |
| 展开逻辑 | `onExpand` | `src/components/AnnouncementList.tsx` | 展开行处理函数 |
| 展开数据管理 | `expandedData` state | `src/components/AnnouncementList.tsx` | 展开行数据状态 |
| IPC 调用 | `window.electronAPI.getStockAnnouncements` | `src/electron.d.ts` | 获取单只股票公告 |
| IPC Handler | `get-stock-announcements` | `electron/ipc/announcement.ts` | IPC 处理器 |
| API 调用 | `TushareClient.getAnnouncements` | `electron/tushare.ts` | API 请求 |
| 分类服务 | `classificationService.classifyAnnouncementTitle` | `electron/services/classification.ts` | 公告分类 |
| 展开内容渲染 | `expandedRowRender` | `src/components/AnnouncementList.tsx` | 展开行渲染函数 |

---

## 5. 公告分类筛选流程

```mermaid
graph TD
    A[用户点击分类按钮] --> B[更新 selectedCategories 状态]
    B --> C{选择全部?}
    C -->|是| D[清空分类数组]
    C -->|否| E{已选中该分类?}
    E -->|是| F[从数组中移除]
    E -->|否| G[添加到数组]
    D --> H[useEffect 监听变化]
    F --> H
    G --> H
    H --> I[清空展开行数据]
    I --> J[重置展开行分页]
    J --> K[更新 currentFilter]
    K --> L[后端应用分类筛选]
    L --> M{股票有选中分类的公告?}
    M -->|是| N[保留该股票]
    M -->|否| O[过滤掉该股票]
    N --> P[返回筛选结果]
    O --> P
    P --> Q[前端应用分类筛选]
    Q --> R[过滤展开行公告]
    R --> S[渲染筛选后的结果]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 分类按钮 | `Button` (Ant Design) | `src/components/AnnouncementList.tsx` | 分类筛选按钮 |
| 分类状态 | `selectedCategories` state | `src/components/AnnouncementList.tsx` | 选中分类状态 |
| 分类定义 | `AnnouncementCategory` | `src/utils/announcementClassifier.ts` | 分类枚举定义 |
| 后端筛选 | `getAnnouncementsGroupedFromAPI` | `electron/services/announcement.ts` | 后端分类筛选逻辑 |
| 前端筛选 | `expandedRowRender` | `src/components/AnnouncementList.tsx` | 展开行分类筛选 |
| 分类工具 | `classifyAnnouncement` | `electron/utils/announcementClassifier.ts` | 分类算法 |

---

## 6. 市值筛选流程

```mermaid
graph TD
    A[用户选择市值筛选] --> B[更新 marketCapFilter 状态]
    B --> C{选择类型}
    C -->|全部| D[清空市值范围]
    C -->|< 30/50/100亿| E[设置预设范围]
    C -->|自定义| F[显示输入框]
    F --> G[用户输入最小值/最大值]
    G --> H[更新 customMarketCapMin/Max]
    D --> I[构建 marketCapRange]
    E --> I
    H --> I
    I --> J[useEffect 监听变化]
    J --> K[清空展开行数据]
    K --> L[更新 currentFilter]
    L --> M[后端应用市值筛选]
    M --> N[批量获取市值数据]
    N --> O{股票市值在范围内?}
    O -->|是| P[保留该股票]
    O -->|否| Q[过滤掉该股票]
    P --> R[返回筛选结果]
    Q --> R
    R --> S[渲染筛选后的列表]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 市值选择器 | `Select` (Ant Design) | `src/components/AnnouncementList.tsx` | 市值筛选下拉框 |
| 自定义输入 | `InputNumber` (Ant Design) | `src/components/AnnouncementList.tsx` | 自定义市值输入 |
| 市值状态 | `marketCapFilter` state | `src/components/AnnouncementList.tsx` | 市值筛选状态 |
| 市值数据获取 | `StockDetailRepository.batchGetLatestMarketValues` | `electron/repositories/implementations/StockDetailRepository.ts` | 批量获取市值 |
| 市值筛选逻辑 | `getAnnouncementsGroupedFromAPI` | `electron/services/announcement.ts` | 市值范围筛选 |

---

## 7. 关注股票筛选流程

```mermaid
graph TD
    A[用户点击关注按钮] --> B[切换 showFavoriteOnly 状态]
    B --> C{仅关注模式?}
    C -->|是| D[调用关注股票接口]
    C -->|否| E[调用普通列表接口]
    D --> F[IPC: get-favorite-stocks-announcements-grouped]
    E --> G[IPC: get-announcements-grouped]
    F --> H[获取收藏股票代码列表]
    H --> I[FavoriteRepository.getAllFavoriteStocks]
    I --> J{有收藏股票?}
    J -->|否| K[返回空结果]
    J -->|是| L[获取股票信息]
    L --> M{检查时间范围是否已同步?}
    M -->|是| N[从数据库读取]
    M -->|否| O[逐个股票调用 API]
    N --> P[过滤收藏股票公告]
    O --> Q[添加延迟避免限流]
    Q --> R[保存到数据库]
    P --> S[按股票聚合]
    R --> S
    S --> T[返回收藏股票公告]
    T --> U[渲染列表]
    G --> V[正常加载流程]
    V --> U
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 关注按钮 | `Button` (Ant Design) | `src/components/AnnouncementList.tsx` | 关注筛选按钮 |
| 关注状态 | `showFavoriteOnly` state | `src/components/AnnouncementList.tsx` | 关注筛选状态 |
| 关注切换 | `handleToggleFavoriteFilter` | `src/components/AnnouncementList.tsx` | 切换关注筛选 |
| IPC 调用 | `get-favorite-stocks-announcements-grouped` | `electron/ipc/announcement.ts` | 关注股票 IPC |
| 业务逻辑 | `getFavoriteStocksAnnouncementsGroupedFromAPI` | `electron/services/announcement.ts` | 关注股票业务逻辑 |
| 收藏仓储 | `FavoriteRepository.getAllFavoriteStocks` | `electron/repositories/implementations/FavoriteRepository.ts` | 获取收藏列表 |

---

## 8. PDF 预览流程

```mermaid
graph TD
    A[用户点击公告] --> B[onRow onClick 触发]
    B --> C[调用 handlePdfPreview]
    C --> D[显示加载提示]
    D --> E[IPC: get-announcement-pdf]
    E --> F[主进程接收请求]
    F --> G[调用 TushareClient.getAnnouncementFiles]
    G --> H[获取该日期所有公告文件]
    H --> I{精确匹配标题?}
    I -->|是| J[返回匹配的文件]
    I -->|否| K{模糊匹配标题?}
    K -->|是| J
    K -->|否| L[返回无 PDF]
    J --> M{有 URL?}
    M -->|是| N[返回 PDF URL]
    M -->|否| L
    N --> O[IPC: open-external]
    O --> P[系统默认浏览器打开]
    P --> Q[显示成功提示]
    L --> R[显示无 PDF 提示]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 点击事件 | `onRow` | `src/components/AnnouncementList.tsx` | 表格行点击事件 |
| PDF 处理 | `handlePdfPreview` | `src/components/AnnouncementList.tsx` | PDF 预览处理函数 |
| IPC 调用 | `window.electronAPI.getAnnouncementPdf` | `src/electron.d.ts` | 获取 PDF IPC |
| IPC Handler | `get-announcement-pdf` | `electron/ipc/announcement.ts` | PDF IPC 处理器 |
| API 调用 | `TushareClient.getAnnouncementFiles` | `electron/tushare.ts` | 获取公告文件 |
| 外部打开 | `window.electronAPI.openExternal` | `src/electron.d.ts` | 打开外部链接 |
| 系统 IPC | `open-external` | `electron/ipc/system.ts` | 系统功能 IPC |

---

## 9. 时间范围快速选择流程

```mermaid
graph TD
    A[用户选择时间选项] --> B[handleQuickSelect 函数]
    B --> C{选项类型}
    C -->|今天| D[计算今天日期]
    C -->|明天| E[计算明天日期]
    C -->|昨天| F[计算昨天日期]
    C -->|最近一周| G[计算一周范围]
    C -->|最近一个月| H[计算一个月范围]
    C -->|最近三个月| I[计算三个月范围]
    D --> J[设置 dateRange]
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    J --> K[更新 quickSelectValue]
    K --> L[useEffect 监听 dateRange 变化]
    L --> M[清空展开行数据]
    M --> N[更新 currentFilter]
    N --> O[重新加载数据]
    O --> P[渲染新时间范围的公告]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 时间选择器 | `Select` (Ant Design) | `src/components/AnnouncementList.tsx` | 时间快速选择 |
| 时间处理 | `handleQuickSelect` | `src/hooks/useStockFilter.ts` | 快速选择处理 |
| 时间状态 | `dateRange` state | `src/hooks/useStockFilter.ts` | 时间范围状态 |
| 筛选器 Hook | `useStockFilter` | `src/hooks/useStockFilter.ts` | 筛选条件管理 |

---

## 10. 刷新数据流程

```mermaid
graph TD
    A[用户点击刷新按钮] --> B[handleRefresh 函数]
    B --> C[调用 refresh 函数]
    C --> D[传入 forceRefresh=true]
    D --> E[重新调用 IPC]
    E --> F[主进程接收 forceRefresh]
    F --> G[跳过缓存检查]
    G --> H[强制调用 API]
    H --> I[获取最新数据]
    I --> J[更新数据库]
    J --> K[返回新数据]
    K --> L[更新 UI]
    L --> M[清除加载状态]
    
    N[数据更新事件] --> O[onDataUpdated 监听]
    O --> P{更新类型}
    P -->|增量同步| Q{在第一页且无搜索?}
    P -->|历史同步| R[显示加载中]
    Q -->|是| S[自动刷新列表]
    Q -->|否| T[不刷新]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 刷新按钮 | `Button` (Ant Design) | `src/components/AnnouncementList.tsx` | 刷新按钮 |
| 刷新处理 | `handleRefresh` | `src/components/AnnouncementList.tsx` | 刷新处理函数 |
| 数据刷新 | `refresh` | `src/hooks/useStockList.ts` | 数据刷新逻辑 |
| 数据更新监听 | `onDataUpdated` | `src/components/AnnouncementList.tsx` | 数据更新监听 |
| IPC 事件 | `window.electronAPI.onDataUpdated` | `src/electron.d.ts` | 数据更新事件 |

---

## 11. 分页处理流程

```mermaid
graph TD
    A[用户操作分页] --> B{操作类型}
    B -->|上一页| C[调用 prevPage]
    B -->|下一页| D[调用 nextPage]
    B -->|跳转页码| E[调用 goToPage]
    C --> F[page - 1]
    D --> G[page + 1]
    E --> H[设置指定页码]
    F --> I[更新 page 状态]
    G --> I
    H --> I
    I --> J[useEffect 监听 page 变化]
    J --> K[保持筛选条件]
    K --> L[只更新分页参数]
    L --> M[调用 IPC]
    M --> N[后端计算 offset]
    N --> O[offset = page - 1 × pageSize]
    O --> P[slice 数据]
    P --> Q[返回当前页数据]
    Q --> R[更新表格显示]
    
    S[展开行分页] --> T[setExpandedPageMap]
    T --> U[更新指定股票的页码]
    U --> V[重新渲染展开内容]
    V --> W[显示对应页公告]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 主列表分页 | `page` state | `src/hooks/useStockList.ts` | 主列表分页状态 |
| 上一页 | `prevPage` | `src/hooks/useStockList.ts` | 上一页函数 |
| 下一页 | `nextPage` | `src/hooks/useStockList.ts` | 下一页函数 |
| 跳转页 | `goToPage` | `src/hooks/useStockList.ts` | 跳转页函数 |
| 展开行分页 | `expandedPageMap` state | `src/components/AnnouncementList.tsx` | 展开行分页映射 |
| 分页组件 | `Pagination` (Ant Design) | `src/components/AnnouncementList.tsx` | 分页 UI 组件 |

---

## 12. 数据同步与缓存流程

```mermaid
graph TD
    A[请求公告数据] --> B[检查同步范围]
    B --> C[查询 announcement_sync_ranges]
    C --> D{范围已覆盖?}
    D -->|是| E[从数据库读取]
    D -->|否| F[计算缺失范围]
    F --> G{结束日期 >= 今天?}
    G -->|是| H[扩展为今天+2天]
    G -->|否| I[使用原始日期]
    H --> J[调用 API 获取数据]
    I --> J
    J --> K[分批请求避免超限]
    K --> L[合并所有结果]
    L --> M[保存到 announcements 表]
    M --> N[记录同步范围]
    N --> O[更新 announcement_sync_ranges]
    E --> P[应用分类标签]
    O --> P
    P --> Q[返回数据]
    
    R[公告分类] --> S[读取分类规则]
    S --> T[ClassificationRepository.getAllRules]
    T --> U[按优先级排序]
    U --> V[遍历公告标题]
    V --> W[匹配关键词]
    W --> X[更新 category 字段]
    X --> Y[批量保存]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 同步范围检查 | `isAnnouncementRangeSynced` | `electron/repositories/implementations/AnnouncementRepository.ts` | 检查范围是否已同步 |
| 同步范围表 | `announcement_sync_ranges` | `electron/database/migrations.ts` | 数据库表 |
| 日期调整 | `adjustEndDateForFutureAnnouncements` | `electron/services/announcement.ts` | 日期范围调整 |
| API 调用 | `TushareClient.getAnnouncementsComplete` | `electron/tushare.ts` | 完整获取公告 |
| 数据保存 | `upsertAnnouncements` | `electron/repositories/implementations/AnnouncementRepository.ts` | 批量保存公告 |
| 记录同步范围 | `recordAnnouncementSyncRange` | `electron/repositories/implementations/AnnouncementRepository.ts` | 记录已同步范围 |
| 分类规则 | `getAllRules` | `electron/repositories/implementations/ClassificationRepository.ts` | 获取分类规则 |
| 批量分类 | `tagAnnouncementsBatch` | `electron/repositories/implementations/AnnouncementRepository.ts` | 批量标记分类 |

---

## 13. 筛选条件联动流程

```mermaid
graph TD
    A[任一筛选条件变化] --> B[构建 currentFilter 对象]
    B --> C[useMemo 计算新 filter]
    C --> D[useEffect 监听变化]
    D --> E[清空展开行数据]
    E --> F{哪些条件变化?}
    F -->|市场| G[重新加载]
    F -->|搜索| G
    F -->|关注| G
    F -->|时间范围| G
    F -->|市值范围| G
    F -->|分类| H[前后端同时筛选]
    G --> I[调用 updateFilter]
    H --> I
    I --> J[重置到第一页]
    J --> K[调用 IPC]
    K --> L[后端应用筛选]
    L --> M[返回新结果]
    M --> N[前端二次筛选展开行]
    N --> O[更新 UI]
    
    P[分类筛选特殊处理] --> Q[重置展开行分页]
    Q --> R[保持主列表页码]
    R --> S[只过滤展开行内容]
```

### 实现类映射表

| 流程节点 | 实现类/组件 | 文件路径 | 职责说明 |
|---------|-----------|---------|---------|
| 筛选条件构建 | `currentFilter` useMemo | `src/components/AnnouncementList.tsx` | 筛选条件计算 |
| 筛选监听 | `useEffect` | `src/components/AnnouncementList.tsx` | 监听筛选变化 |
| 筛选更新 | `updateFilter` | `src/hooks/useStockList.ts` | 更新筛选条件 |
| 筛选器 Hook | `useStockFilter` | `src/hooks/useStockFilter.ts` | 筛选状态管理 |
| 后端筛选 | `getAnnouncementsGroupedFromAPI` | `electron/services/announcement.ts` | 后端筛选逻辑 |

---

## 总结

### 核心类关系

```mermaid
graph LR
    A[Announcements 页面] --> B[AnnouncementList 组件]
    B --> C[useStockList Hook]
    B --> D[useStockFilter Hook]
    B --> E[StockList 组件]
    C --> F[window.electronAPI]
    F --> G[IPC Handlers]
    G --> H[announcementService]
    H --> I[AnnouncementRepository]
    H --> J[StockRepository]
    H --> K[FavoriteRepository]
    H --> L[StockDetailRepository]
    H --> M[TushareClient]
    I --> N[SQLite Database]
    J --> N
    K --> N
    L --> N
```

### 数据流向

1. **用户交互** → **React 组件** → **Hooks** → **IPC** → **主进程服务** → **Repository** → **数据库/API**
2. **数据返回** → **Service 聚合** → **IPC 返回** → **Hook 更新状态** → **组件重渲染**

### 关键特性

- **防抖搜索**: 避免频繁请求
- **数据缓存**: 减少 API 调用
- **智能同步**: 自动管理同步范围
- **分页加载**: 提升性能
- **分类筛选**: 灵活的多维度筛选
- **搜索历史**: 提升用户体验

