# IPC 接口文档

**创建日期**: 2024-12-14  
**文档版本**: v1.0.0

## 概述

本文档描述 CafeStock 应用中主进程（Main Process）与渲染进程（Renderer Process）之间的 IPC（Inter-Process Communication）接口。所有接口通过 `window.electron` 对象调用。

## 接口分类

- [数据查询接口](#数据查询接口)
- [数据同步接口](#数据同步接口)
- [自动更新接口](#自动更新接口)
- [系统信息接口](#系统信息接口)

---

## 数据查询接口

### 1. getAnnouncements - 获取公告列表

获取本地数据库中的公告列表，支持分页查询。

#### 请求参数

```json
{
  "page": 1,
  "pageSize": 200
}
```

**参数说明**:
- `page` (number): 页码，从 1 开始
- `pageSize` (number): 每页数量，建议 200

#### 响应参数

```json
{
  "announcements": [
    {
      "ann_date": "20231214",
      "ts_code": "000001.SZ",
      "title": "关于XXX的公告",
      "chn_name": "平安银行",
      "content": "公告内容..."
    }
  ],
  "total": 5000
}
```

**响应字段说明**:
- `announcements` (array): 公告列表
  - `ann_date` (string): 公告日期，格式 YYYYMMDD
  - `ts_code` (string): 股票代码，如 000001.SZ
  - `title` (string): 公告标题
  - `chn_name` (string): 公司中文名称
  - `content` (string): 公告内容（HTML 格式）
- `total` (number): 总记录数

#### 示例代码

```typescript
// 获取第一页，每页 200 条
const result = await window.electron.getAnnouncements(1, 200);
console.log(`共 ${result.total} 条公告`);
console.log(result.announcements);
```

---

### 2. getNews - 获取财经资讯

实时从 Tushare API 获取财经资讯，无需本地存储。

#### 请求参数

```json
{
  "src": "sina",
  "startDate": "20231201",
  "endDate": "20231214"
}
```

**参数说明**:
- `src` (string): 新闻源，可选值：
  - `sina` - 新浪财经
  - `wallstreetcn` - 华尔街见闻
  - `10jqka` - 同花顺
  - `eastmoney` - 东方财富
  - `yuncaijing` - 云财经
- `startDate` (string): 开始日期，格式 YYYYMMDD
- `endDate` (string): 结束日期，格式 YYYYMMDD

#### 响应参数

```json
{
  "items": [
    {
      "datetime": "2023-12-14 10:30:00",
      "content": "【标题】新闻内容摘要...",
      "channels": "国内,股市"
    }
  ]
}
```

**响应字段说明**:
- `items` (array): 资讯列表
  - `datetime` (string): 发布时间
  - `content` (string): 资讯内容
  - `channels` (string): 资讯分类标签

#### 示例代码

```typescript
// 获取新浪财经最近一周的资讯
const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

const result = await window.electron.getNews(
  'sina',
  weekAgo.toISOString().slice(0, 10).replace(/-/g, ''),
  today.toISOString().slice(0, 10).replace(/-/g, '')
);

console.log(result.items);
```

---

## 数据同步接口

### 3. syncAnnouncements - 同步公告数据

触发后台数据同步，从 Tushare API 拉取最新公告数据到本地数据库。

#### 请求参数

无

#### 响应参数

```json
{
  "success": true,
  "message": "同步完成",
  "synced": 150
}
```

**响应字段说明**:
- `success` (boolean): 是否成功
- `message` (string): 同步消息
- `synced` (number): 本次同步的记录数

#### 示例代码

```typescript
const result = await window.electron.syncAnnouncements();
if (result.success) {
  console.log(`同步成功，新增 ${result.synced} 条公告`);
}
```

---

## 自动更新接口

### 4. checkForUpdates - 检查更新

检查是否有新版本可用。

#### 请求参数

无

#### 响应参数

无（通过事件监听器接收结果）

#### 示例代码

```typescript
// 检查更新
window.electron.checkForUpdates();

// 监听检查结果
window.electron.onUpdateAvailable((info) => {
  console.log('发现新版本:', info.version);
});

window.electron.onUpdateNotAvailable(() => {
  console.log('已是最新版本');
});
```

---

### 5. downloadUpdate - 下载更新

下载可用的更新包。

#### 请求参数

无

#### 响应参数

无（通过事件监听器接收进度）

#### 示例代码

```typescript
// 开始下载
window.electron.downloadUpdate();

// 监听下载进度
window.electron.onUpdateDownloadProgress((progress) => {
  console.log(`下载进度: ${progress.percent}%`);
});

// 监听下载完成
window.electron.onUpdateDownloaded(() => {
  console.log('下载完成，可以安装了');
});
```

---

### 6. installUpdate - 安装更新

安装已下载的更新并重启应用。

#### 请求参数

无

#### 响应参数

无（应用将自动重启）

#### 示例代码

```typescript
// 安装更新
window.electron.installUpdate();
```

---

### 7. 更新事件监听器

#### onUpdateChecking - 正在检查更新

```typescript
window.electron.onUpdateChecking(() => {
  console.log('正在检查更新...');
});
```

#### onUpdateAvailable - 发现新版本

```typescript
window.electron.onUpdateAvailable((info) => {
  console.log('发现新版本:', info);
  // info 包含: version, releaseDate, releaseNotes 等
});
```

#### onUpdateNotAvailable - 已是最新版本

```typescript
window.electron.onUpdateNotAvailable((info) => {
  console.log('当前已是最新版本:', info.version);
});
```

#### onUpdateDownloadProgress - 下载进度

```typescript
window.electron.onUpdateDownloadProgress((progress) => {
  const { percent, transferred, total } = progress;
  console.log(`下载进度: ${percent.toFixed(2)}%`);
  console.log(`已下载: ${(transferred / 1024 / 1024).toFixed(2)}MB`);
  console.log(`总大小: ${(total / 1024 / 1024).toFixed(2)}MB`);
});
```

#### onUpdateDownloaded - 下载完成

```typescript
window.electron.onUpdateDownloaded((info) => {
  console.log('更新下载完成:', info.version);
});
```

#### onUpdateError - 更新错误

```typescript
window.electron.onUpdateError((error) => {
  console.error('更新失败:', error.message);
});
```

---

## 系统信息接口

### 8. getAppVersion - 获取应用版本

获取当前应用的版本号。

#### 请求参数

无

#### 响应参数

```json
{
  "version": "1.0.0"
}
```

**响应字段说明**:
- `version` (string): 应用版本号（语义化版本）

#### 示例代码

```typescript
const version = await window.electron.getAppVersion();
console.log(`当前版本: v${version}`);
```

---

## 错误处理

所有 IPC 接口调用可能抛出异常，建议使用 try-catch 处理：

```typescript
try {
  const result = await window.electron.getAnnouncements(1, 200);
  console.log(result);
} catch (error) {
  console.error('获取公告失败:', error.message);
}
```

## 类型定义

完整的 TypeScript 类型定义请参考 `src/electron.d.ts` 文件。

```typescript
interface ElectronAPI {
  getAnnouncements: (page: number, pageSize: number) => Promise<AnnouncementsResult>;
  syncAnnouncements: () => Promise<SyncResult>;
  getNews: (src: string, startDate: string, endDate: string) => Promise<NewsResult>;
  getAppVersion: () => Promise<string>;
  checkForUpdates: () => void;
  downloadUpdate: () => void;
  installUpdate: () => void;
  onUpdateChecking: (callback: () => void) => void;
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void;
  onUpdateNotAvailable: (callback: (info: UpdateInfo) => void) => void;
  onUpdateDownloadProgress: (callback: (progress: ProgressInfo) => void) => void;
  onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => void;
  onUpdateError: (callback: (error: Error) => void) => void;
}
```

## 相关文档

- [数据库接口文档](./database-api.md)
- [Tushare API 文档](./tushare-api.md)
- [开发指南](../development/development-guide.md)
