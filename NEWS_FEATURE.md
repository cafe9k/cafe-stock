# 资讯功能说明

## 功能概述

新增了"资讯"选项卡，用户可以查看来自各大财经网站的实时资讯信息。

## 功能特性

### 1. 多新闻源支持

支持以下新闻源：

-   新浪财经 (sina)
-   华尔街见闻 (wallstreetcn)
-   同花顺 (10jqka)
-   东方财富 (eastmoney)
-   云财经 (yuncaijing)

### 2. 时间范围筛选

提供快捷时间范围选择：

-   今天
-   昨天
-   最近一周
-   最近一个月
-   自定义日期范围

### 3. 数据展示

-   每页显示 20 条资讯
-   支持分页浏览
-   显示新闻标题、发布时间、频道、内容摘要
-   内容支持展开查看完整信息

### 4. 实时刷新

-   点击"刷新"按钮可获取最新资讯
-   支持切换不同新闻源实时加载数据

## 技术实现

### 数据源

-   数据来源：Tushare API (https://tushare.pro/document/2?doc_id=143)
-   接口：news
-   不存储到本地数据库，实时从 API 获取

### 架构

1. **后端 (Electron Main Process)**

    - `electron/tushare.ts`: 新增 `getNews()` 方法调用 Tushare API
    - `electron/main.ts`: 新增 IPC 处理器 `get-news`
    - `electron/preload.ts`: 暴露 `getNews()` 接口到渲染进程

2. **前端 (React)**
    - `src/components/NewsList.tsx`: 资讯列表组件
    - `src/pages/News.tsx`: 资讯页面
    - `src/App.tsx`: 添加资讯路由
    - `src/components/Layout.tsx`: 添加资讯导航菜单项
    - `src/electron.d.ts`: 添加资讯相关的 TypeScript 类型定义

### API 参数说明

#### 输入参数

-   `src`: 新闻来源（可选）
    -   sina: 新浪财经
    -   wallstreetcn: 华尔街见闻
    -   10jqka: 同花顺
    -   eastmoney: 东方财富
    -   yuncaijing: 云财经
-   `start_date`: 开始日期（YYYYMMDD 格式，可选）
-   `end_date`: 结束日期（YYYYMMDD 格式，可选）

#### 输出参数

-   `datetime`: 发布时间
-   `content`: 新闻内容
-   `title`: 新闻标题
-   `channels`: 频道

### 数据处理

-   从 Tushare API 获取原始数据
-   按发布时间降序排序
-   前端实现分页（每页 20 条）
-   支持内容展开/收起

## 使用方法

1. 启动应用后，点击顶部导航栏的"资讯"选项卡
2. 选择想查看的新闻源（默认为新浪财经）
3. 选择时间范围（默认为今天）
4. 浏览资讯列表
5. 点击"展开"可查看完整内容
6. 点击"刷新"按钮获取最新数据

## 开发说明

### 启动开发环境

```bash
npm run dev
```

### 构建应用

```bash
npm run build
```

## 注意事项

1. **API 权限**: 使用 Tushare 资讯接口需要至少 120 积分
2. **API 限量**: 单次最大返回 2000 条数据
3. **数据不缓存**: 资讯数据不存储到本地数据库，每次都从 API 实时获取
4. **网络依赖**: 需要网络连接才能加载资讯数据

## 文件清单

### 新增文件

-   `src/components/NewsList.tsx` - 资讯列表组件
-   `src/pages/News.tsx` - 资讯页面
-   `NEWS_FEATURE.md` - 功能说明文档

### 修改文件

-   `electron/tushare.ts` - 添加 `getNews()` 方法
-   `electron/main.ts` - 添加 IPC 处理器
-   `electron/preload.ts` - 暴露资讯接口
-   `src/App.tsx` - 添加资讯路由
-   `src/components/Layout.tsx` - 添加导航菜单项
-   `src/electron.d.ts` - 添加类型定义

## 未来优化方向

1. 添加资讯搜索功能
2. 支持资讯收藏
3. 添加资讯分类筛选
4. 支持多个新闻源同时查看
5. 添加资讯详情页面
6. 支持外部链接跳转
