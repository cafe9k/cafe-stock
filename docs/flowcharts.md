# CafeStock 核心功能流程图

本文档包含 CafeStock 项目的核心功能流程图，使用 Mermaid 语法绘制。

## 1. 应用启动流程

```mermaid
graph TD
    A[应用启动] --> B{单实例检查}
    B -->|已有实例| C[退出当前实例]
    B -->|无实例| D[注册依赖注入服务]
    D --> E[初始化数据库连接]
    E --> F[执行数据库迁移]
    F --> G[创建主窗口]
    G --> H[创建系统托盘]
    H --> I[注册全局快捷键]
    I --> J[注册 IPC 处理器]
    J --> K[设置自动更新]
    K --> L{股票列表是否为空?}
    L -->|是| M[同步股票列表]
    L -->|否| N[显示主窗口]
    M --> N
    N --> O[应用就绪]
```

## 2. 公告数据同步流程

```mermaid
graph TD
    A[用户请求公告数据] --> B{检查时间范围是否已同步?}
    B -->|是| C[从数据库读取]
    B -->|否| D[调用 Tushare API]
    D --> E[获取公告数据]
    E --> F[保存到数据库]
    F --> G[记录同步范围]
    G --> H[按股票聚合数据]
    C --> H
    H --> I[应用分类规则]
    I --> J[返回聚合结果]
    J --> K[渲染进程展示]
```

## 3. 股票列表同步流程

```mermaid
graph TD
    A[触发股票列表同步] --> B[检查数据库股票数量]
    B --> C{数量 > 0?}
    C -->|是| D[跳过同步]
    C -->|否| E[调用 Tushare API]
    E --> F[获取股票列表]
    F --> G[批量插入/更新数据库]
    G --> H[更新同步标志位]
    H --> I[发送完成通知]
    I --> J[更新 UI]
```

## 4. 公告分类流程

```mermaid
graph TD
    A[获取公告标题] --> B[加载分类规则]
    B --> C[按优先级排序规则]
    C --> D{遍历规则}
    D --> E{匹配关键词?}
    E -->|是| F[返回分类]
    E -->|否| G{还有规则?}
    G -->|是| D
    G -->|否| H[返回默认分类]
    F --> I[更新公告分类字段]
    H --> I
```

## 5. IPC 通信流程

```mermaid
sequenceDiagram
    participant R as 渲染进程
    participant P as Preload
    participant M as 主进程
    participant S as Service
    participant DB as 数据库

    R->>P: 调用 electronAPI.getAnnouncements()
    P->>M: ipcRenderer.invoke('get-announcements')
    M->>M: ipcMain.handle('get-announcements')
    M->>S: announcementService.getAnnouncements()
    S->>DB: announcementRepository.query()
    DB-->>S: 返回数据
    S-->>M: 返回结果
    M-->>P: 返回 Promise
    P-->>R: 返回数据
    R->>R: 更新 UI
```

## 6. 自动更新流程

```mermaid
graph TD
    A[应用启动/手动检查] --> B[调用 electron-updater]
    B --> C{有新版本?}
    C -->|否| D[显示已是最新版本]
    C -->|是| E[发送更新可用事件]
    E --> F[用户确认下载]
    F --> G[开始下载]
    G --> H[发送下载进度事件]
    H --> I{下载完成?}
    I -->|否| H
    I -->|是| J[发送下载完成事件]
    J --> K[用户确认安装]
    K --> L[退出应用]
    L --> M[安装更新]
    M --> N[重启应用]
```

## 7. 数据查询流程（渲染进程）

```mermaid
graph TD
    A[用户操作触发查询] --> B[调用 React Hook]
    B --> C[调用 electronAPI 方法]
    C --> D[IPC 通信]
    D --> E[主进程 IPC Handler]
    E --> F[调用 Service 方法]
    F --> G[Repository 查询数据库]
    G --> H[返回数据]
    H --> I[IPC 返回结果]
    I --> J[Hook 更新状态]
    J --> K[组件重新渲染]
```

## 8. 股票详情同步流程

```mermaid
graph TD
    A[触发股票详情同步] --> B[获取所有股票列表]
    B --> C[分批处理 100只/批]
    C --> D[提取股票代码]
    D --> E[调用 Tushare API 获取市值]
    E --> F[调用 Tushare API 获取公司信息]
    F --> G[批量保存到数据库]
    G --> H{还有批次?}
    H -->|是| I[延迟200ms]
    I --> C
    H -->|否| J[更新同步标志位]
    J --> K[发送完成通知]
```

## 9. 十大股东同步流程

```mermaid
graph TD
    A[触发十大股东同步] --> B[获取股票列表]
    B --> C{同步状态}
    C -->|暂停| D[等待恢复]
    C -->|停止| E[结束同步]
    C -->|运行| F[遍历股票]
    F --> G[调用 Tushare API]
    G --> H[获取股东数据]
    H --> I[保存到数据库]
    I --> J[发送进度事件]
    J --> K{还有股票?}
    K -->|是| F
    K -->|否| L[发送完成事件]
```

## 10. 公告搜索流程

```mermaid
graph TD
    A[用户输入关键词] --> B[搜索匹配股票]
    B --> C{找到股票?}
    C -->|否| D[返回空结果]
    C -->|是| E[提取股票代码]
    E --> F[调用 Tushare API]
    F --> G[获取公告数据]
    G --> H[按股票聚合]
    H --> I[应用分类规则]
    I --> J[返回搜索结果]
```

## 11. 收藏股票管理流程

```mermaid
graph TD
    A[用户点击收藏按钮] --> B{当前状态}
    B -->|未收藏| C[调用 addFavoriteStock]
    B -->|已收藏| D[调用 removeFavoriteStock]
    C --> E[Repository 添加记录]
    D --> F[Repository 删除记录]
    E --> G[更新 UI 状态]
    F --> G
    G --> H[刷新相关列表]
```

## 12. 数据库连接管理流程

```mermaid
graph TD
    A[应用启动] --> B{数据库实例存在?}
    B -->|是| C[返回现有实例]
    B -->|否| D[获取数据库路径]
    D --> E[创建 Database 实例]
    E --> F[配置 WAL 模式]
    F --> G[配置缓存大小]
    G --> H[配置同步模式]
    H --> I[返回数据库实例]
    I --> J[执行表创建/迁移]
```

## 13. 依赖注入服务解析流程

```mermaid
graph TD
    A[请求服务] --> B{单例实例存在?}
    B -->|是| C[返回缓存实例]
    B -->|否| D{工厂函数存在?}
    D -->|否| E[抛出错误]
    D -->|是| F[调用工厂函数]
    F --> G[创建服务实例]
    G --> H{是单例?}
    H -->|是| I[缓存实例]
    H -->|否| J[返回新实例]
    I --> K[返回实例]
    J --> K
```

## 14. 窗口生命周期流程

```mermaid
graph TD
    A[创建窗口] --> B[配置窗口属性]
    B --> C[加载 Preload 脚本]
    C --> D[加载页面内容]
    D --> E[ready-to-show 事件]
    E --> F[显示窗口]
    F --> G[用户操作]
    G --> H{关闭窗口?}
    H -->|否| G
    H -->|是| I{应用退出标志?}
    I -->|是| J[关闭窗口]
    I -->|否| K[隐藏窗口]
    K --> L[保持应用运行]
```

## 15. 系统托盘交互流程

```mermaid
graph TD
    A[创建托盘图标] --> B[监听点击事件]
    B --> C{窗口状态}
    C -->|隐藏| D[显示窗口]
    C -->|显示| E[隐藏窗口]
    D --> F[聚焦窗口]
    E --> G[窗口失焦]
    B --> H[监听右键菜单]
    H --> I{选择菜单项}
    I -->|显示| D
    I -->|退出| J[退出应用]
```

## 16. 公告聚合算法流程

```mermaid
graph TD
    A[获取公告列表] --> B[创建股票映射 Map]
    B --> C[遍历公告]
    C --> D{股票在 Map 中?}
    D -->|否| E[创建股票条目]
    D -->|是| F[添加到公告数组]
    E --> F
    F --> G{还有公告?}
    G -->|是| C
    G -->|否| H[转换为数组]
    H --> I[计算分类统计]
    I --> J[按最新日期排序]
    J --> K[返回聚合结果]
```

## 17. 错误处理流程

```mermaid
graph TD
    A[发生错误] --> B{错误类型}
    B -->|API 错误| C[记录错误日志]
    B -->|数据库错误| D[记录错误日志]
    B -->|IPC 错误| E[记录错误日志]
    C --> F[返回错误信息]
    D --> F
    E --> F
    F --> G{渲染进程?}
    G -->|是| H[显示错误提示]
    G -->|否| I[发送错误事件]
    I --> H
    H --> J[用户处理]
```

## 18. 数据同步范围检查流程

```mermaid
graph TD
    A[请求数据] --> B[提取时间范围]
    B --> C[查询同步范围表]
    C --> D{范围已覆盖?}
    D -->|是| E[从数据库读取]
    D -->|否| F[计算缺失范围]
    F --> G[调用 API 获取缺失数据]
    G --> H[保存到数据库]
    H --> I[更新同步范围]
    I --> E
    E --> J[返回数据]
```

## 19. 批量数据处理流程

```mermaid
graph TD
    A[获取数据列表] --> B[计算批次数量]
    B --> C[初始化批次索引]
    C --> D[提取当前批次]
    D --> E[处理批次数据]
    E --> F[发送进度事件]
    F --> G{还有批次?}
    G -->|是| H[延迟控制]
    H --> I[批次索引+1]
    I --> D
    G -->|否| J[发送完成事件]
    J --> K[返回处理结果]
```

## 20. 分类规则匹配流程

```mermaid
graph TD
    A[输入公告标题] --> B[获取所有启用规则]
    B --> C[按优先级排序]
    C --> D[遍历规则]
    D --> E{标题包含关键词?}
    E -->|是| F[返回对应分类]
    E -->|否| G{还有规则?}
    G -->|是| D
    G -->|否| H[返回默认分类]
    F --> I[记录分类结果]
    H --> I
```
