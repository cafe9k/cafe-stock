# Electron 桌面应用转换完成

## 转换概述

项目已成功从 Web 应用转换为 Electron macOS 桌面应用，并修改为直接请求 Tushare Pro API。

## 主要变更

### 1. Electron 集成

#### 新增文件
- `electron/main.ts` - 主进程代码，包含窗口管理、系统托盘、全局快捷键
- `electron/preload.ts` - 预加载脚本，安全地暴露 Electron API
- `electron/tsconfig.json` - Electron 专用 TypeScript 配置
- `src/electron.d.ts` - Electron API 类型定义

#### 修改的文件
- `package.json` - 添加 Electron 依赖和构建脚本
- `vite.config.ts` - 集成 vite-plugin-electron
- `tsconfig.json` - 排除 electron 目录
- `src/App.tsx` - 使用 HashRouter 替代 BrowserRouter
- `src/pages/DashboardPage.tsx` - 集成原生功能监听
- `src/hooks/useStockAlerts.ts` - 添加系统通知支持
- `.gitignore` - 添加 Electron 构建产物

### 2. Tushare API 直接请求

#### 修改说明
所有 Tushare 请求已从 Supabase Edge Function 代理改为直接请求 Tushare Pro API。

#### 变更文件
- `src/config/tushare.ts` - 添加 TUSHARE_API_URL 和 Token 配置
- `src/lib/tushareClient.ts` - 修改请求逻辑，直接调用 https://api.tushare.pro

#### 优势
- 减少中间层，提高响应速度
- 简化部署流程
- 降低 Supabase 函数调用成本

#### 注意事项
- Token 现在存储在前端配置中
- 直接请求可能遇到 CORS 问题（浏览器环境），但 Electron 不受影响
- 建议在生产环境使用环境变量管理 Token

## 桌面应用功能

### 原生功能
1. **系统托盘**
   - 点击图标显示/隐藏窗口
   - 右键菜单：显示、刷新、关于、退出

2. **全局快捷键**
   - `Cmd+Shift+S` - 显示/隐藏窗口
   - `Cmd+R` - 刷新股票数据

3. **系统通知**
   - 应用启动通知
   - 股票消息提醒（新消息扫描时）

4. **窗口管理**
   - 窗口大小：1280x800
   - 最小尺寸：800x600
   - 关闭窗口时隐藏到托盘，而非退出

## 开发运行

### 开发环境
```bash
# 启动开发服务器（带 Electron 窗口）
npm run dev

# 仅启动 Vite 开发服务器（不启动 Electron）
vite
```

### 构建应用
```bash
# 构建 macOS 应用（.dmg 和 .zip）
npm run build

# 构建到目录（不打包，用于测试）
npm run build:dir
```

### 预览构建
```bash
# 构建并预览
npm run electron:preview
```

## 文件结构

```
cafe-stock/
├── electron/                 # Electron 主进程代码
│   ├── main.ts              # 主进程入口
│   ├── preload.ts           # 预加载脚本
│   └── tsconfig.json        # TypeScript 配置
├── src/                     # React 应用代码
│   ├── electron.d.ts        # Electron API 类型定义
│   └── ...
├── build/                   # 应用资源
│   ├── tray-icon.png        # 托盘图标
│   ├── tray-icon@2x.png     # 托盘图标 2x
│   └── icon.icns.md         # 应用图标说明
├── dist/                    # Vite 构建输出
├── dist-electron/           # Electron 构建输出
└── release/                 # 打包后的应用
```

## 环境变量（可选）

创建 `.env` 文件覆盖默认配置：

```env
# Tushare Pro Token（可选，已在代码中配置）
VITE_TUSHARE_TOKEN=your_token_here

# Supabase 配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 图标资源

### 托盘图标
- 已创建占位符图标（22x22 和 44x44）
- 位置：`build/tray-icon.png` 和 `build/tray-icon@2x.png`
- 建议：使用设计工具创建自定义图标

### 应用图标
- 需要创建 `.icns` 格式的 macOS 图标
- 查看 `build/icon.icns.md` 了解创建方法
- 临时使用默认 Electron 图标

## API 配置说明

### Tushare API
- **API URL**: https://api.tushare.pro
- **Token**: 已在 `src/config/tushare.ts` 中配置
- **请求方式**: HTTP POST，JSON 格式
- **限流策略**: 并发 2 个，带节流控制

### Cninfo API（巨潮资讯）
- 仍通过 Supabase Edge Function 代理
- 原因：Cninfo 有更严格的 CORS 和限流策略
- 未来可考虑直接请求（需要处理限流）

## 已知问题

1. **应用图标**: 使用默认 Electron 图标，需要创建 .icns 文件
2. **托盘图标**: 占位符图标，建议替换为实际设计
3. **代码签名**: 未配置，正式发布需要 Apple Developer 证书

## 下一步

### 必须完成
- [ ] 创建正式的应用图标
- [ ] 测试所有功能
- [ ] 验证 Tushare API 直接请求是否正常

### 可选增强
- [ ] 添加自动更新功能（electron-updater）
- [ ] 原生菜单栏
- [ ] 窗口状态持久化
- [ ] macOS Touch Bar 支持
- [ ] Dock 徽章显示未读消息数量

## 技术栈

- **Electron**: ^28.0.0
- **React**: ^18.2.0
- **TypeScript**: ^5.2.2
- **Vite**: ^5.0.8
- **Supabase**: ^2.39.0
- **React Query**: ^5.90.12
- **React Router**: ^7.10.1

## 许可

MIT License
