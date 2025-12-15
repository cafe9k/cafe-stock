# 开发指南

**创建日期**: 2024-12-14  
**文档版本**: v1.0.0

## 目录

- [环境准备](#环境准备)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [开发规范](#开发规范)
- [常见问题](#常见问题)

---

## 环境准备

### 1. 系统要求

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **操作系统**: macOS 10.13+ / Windows 10+ / Linux

### 2. 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/cafe-stock.git
cd cafe-stock

# 安装依赖
npm install

# 重新编译原生模块（必须）
npx electron-builder install-app-deps
```

**重要提示**: `npx electron-builder install-app-deps` 命令会重新编译 `better-sqlite3` 等原生模块，使其与 Electron 的 Node 版本匹配。如果跳过此步骤，应用将无法正常运行。

### 3. 配置 Tushare Token

在项目根目录创建 `.env` 文件（如果不存在），添加你的 Tushare Token：

```bash
VITE_TUSHARE_TOKEN=your_tushare_token_here
```

获取 Token 的方法：
1. 访问 [Tushare Pro](https://tushare.pro/)
2. 注册并登录
3. 在用户中心获取你的 API Token

---

## 快速开始

### 启动开发环境

**必须使用** `npm run dev` 命令启动项目：

```bash
npm run dev
```

此命令会：
1. 使用 Vite 构建渲染进程代码
2. 编译主进程 TypeScript 代码
3. 启动 Electron 应用

**注意事项**:
- ❌ 不要直接运行 `electron .`
- ❌ 不要手动运行 `vite` 和 `electron` 分开的命令
- ✅ 始终使用 `npm run dev`

### 开发模式特性

开发模式下会自动：
- 🔄 热重载（HMR）- 前端代码修改后自动刷新
- 🔍 DevTools - 自动打开 Chrome 开发者工具
- 📡 Vite 开发服务器 - 运行在 `http://localhost:5173`

---

## 项目结构

```
cafe-stock/
├── electron/                # 主进程代码
│   ├── main.ts             # 应用入口，窗口管理，IPC 监听
│   ├── db.ts               # SQLite 数据库操作
│   ├── tushare.ts          # Tushare API 客户端
│   ├── preload.ts          # IPC 桥接（安全层）
│   └── tsconfig.json       # 主进程 TypeScript 配置
│
├── src/                     # 渲染进程代码（React）
│   ├── components/         # React 组件
│   │   ├── AnnouncementList.tsx  # 公告列表
│   │   ├── NewsList.tsx          # 资讯列表
│   │   ├── Layout.tsx            # 布局组件
│   │   └── UpdateChecker.tsx     # 更新检查器
│   ├── pages/              # 页面组件
│   │   ├── Announcements.tsx     # 公告页面
│   │   ├── News.tsx              # 资讯页面
│   │   └── DataInsights.tsx      # 数据洞察
│   ├── App.tsx             # 应用根组件
│   ├── main.tsx            # React 应用入口
│   ├── electron.d.ts       # Electron API 类型定义
│   └── index.css           # 全局样式
│
├── build/                   # 构建资源
│   ├── icon.icns           # macOS 应用图标
│   └── entitlements.mac.plist  # macOS 权限配置
│
├── docs/                    # 项目文档
│
├── dist/                    # Vite 构建输出（自动生成）
├── dist-electron/           # Electron 构建输出（自动生成）
├── release/                 # 应用打包输出（自动生成）
│
├── index.html              # HTML 入口文件
├── vite.config.ts          # Vite 配置
├── package.json            # 项目配置和依赖
├── tsconfig.json           # TypeScript 配置
└── tailwind.config.js      # TailwindCSS 配置
```

### 关键文件说明

#### electron/main.ts
- 应用入口，创建窗口
- 注册 IPC 监听器
- 实现数据同步逻辑
- 配置自动更新

#### electron/db.ts
- 封装 SQLite 数据库操作
- 提供公告的 CRUD 接口
- 实现数据库初始化和迁移

#### electron/tushare.ts
- Tushare API 客户端
- 处理 API 请求和错误
- 数据格式转换

#### electron/preload.ts
- 安全的 IPC 桥接层
- 暴露受限的 API 给渲染进程
- 使用 contextBridge 确保安全性

#### src/electron.d.ts
- TypeScript 类型定义
- 为 `window.electron` 提供类型提示

---

## 开发规范

### 1. React & TypeScript 规范

请参考 [React & TypeScript 开发规范](../../.cursor/rules/react-typescript.mdc)

关键点：
- 使用函数式组件和 Hooks
- 组件使用 PascalCase 命名
- Props 和 State 必须定义类型
- 使用 `interface` 定义类型
- 优先使用 `const` 和 `let`，避免 `var`

### 2. Electron 最佳实践

请参考 [Electron 最佳实践](../../.cursor/rules/electron-best-practices.mdc)

关键点：
- 主进程和渲染进程职责分离
- 使用 contextBridge 暴露 API
- 避免在渲染进程使用 Node.js API
- 实现进程崩溃恢复
- 正确处理窗口生命周期

### 3. 代码风格

使用 ESLint 和 Prettier 保持代码风格一致：

```bash
# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix
```

### 4. Git 提交规范

使用语义化提交消息：

```bash
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建/工具变动
```

示例：
```bash
git commit -m "feat: 添加公告搜索功能"
git commit -m "fix: 修复数据同步失败的问题"
git commit -m "docs: 更新 API 文档"
```

---

## 调试技巧

### 1. 主进程调试

在 VS Code 中创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "args": [".", "--remote-debugging-port=9223"],
      "outputCapture": "std"
    }
  ]
}
```

使用方法：
1. 在主进程代码中设置断点
2. 按 F5 启动调试
3. 程序会在断点处暂停

### 2. 渲染进程调试

开发模式下会自动打开 Chrome DevTools：
- 使用 Console 查看日志
- 使用 Network 查看网络请求
- 使用 Elements 检查 DOM 结构
- 使用 Sources 设置断点

### 3. 数据库调试

查看 SQLite 数据库：

```bash
# 安装 sqlite3 命令行工具
brew install sqlite3  # macOS
apt-get install sqlite3  # Linux

# 打开数据库
sqlite3 ~/Library/Application\ Support/cafe-stock/announcements.db

# 执行 SQL 查询
sqlite> SELECT COUNT(*) FROM announcements;
sqlite> SELECT * FROM announcements ORDER BY ann_date DESC LIMIT 10;
```

### 4. 日志记录

在代码中添加日志：

```typescript
// 主进程
console.log('[Main] 应用启动');

// 渲染进程
console.log('[Renderer] 组件挂载');
```

日志输出位置：
- 主进程：终端
- 渲染进程：Chrome DevTools Console

---

## 常见问题

### 1. 原生模块加载失败

**错误信息**:
```
Error: The module 'better-sqlite3' was compiled against a different Node.js version
```

**解决方法**:
```bash
npx electron-builder install-app-deps
```

### 2. Preload 脚本加载失败

**错误信息**:
```
Unable to load preload script
```

**原因**: 直接运行 `electron .` 而不是使用 `npm run dev`

**解决方法**: 始终使用 `npm run dev` 启动项目

### 3. Vite 端口被占用

**错误信息**:
```
Port 5173 is already in use
```

**解决方法**:
```bash
# 方法 1: 查找并杀死占用端口的进程
lsof -ti:5173 | xargs kill -9

# 方法 2: 修改 vite.config.ts 中的端口
server: {
  port: 5174
}
```

### 4. 应用启动后立即崩溃

**可能原因**:
1. Tushare Token 未配置或无效
2. 数据库文件损坏
3. 权限问题

**解决方法**:
1. 检查 `.env` 文件中的 `VITE_TUSHARE_TOKEN`
2. 删除数据库文件重新初始化：
   ```bash
   rm ~/Library/Application\ Support/cafe-stock/announcements.db
   ```
3. 检查终端输出的错误日志

### 5. 数据同步失败

**可能原因**:
1. Tushare API 访问频率超限
2. 网络连接问题
3. API Token 权限不足

**解决方法**:
1. 等待一段时间后重试
2. 检查网络连接
3. 升级 Tushare 会员等级

---

## 性能优化

### 1. 数据库优化

```sql
-- 创建索引加速查询
CREATE INDEX idx_ann_date ON announcements(ann_date DESC);
CREATE INDEX idx_ts_code ON announcements(ts_code);
```

### 2. React 组件优化

```typescript
// 使用 React.memo 避免不必要的重渲染
export const AnnouncementList = React.memo(() => {
  // ...
});

// 使用 useMemo 缓存计算结果
const filteredData = useMemo(() => {
  return data.filter(item => item.ts_code.includes(keyword));
}, [data, keyword]);

// 使用 useCallback 缓存回调函数
const handleClick = useCallback(() => {
  // ...
}, [dependency]);
```

### 3. 虚拟滚动

对于长列表，考虑使用虚拟滚动：

```bash
npm install react-window
```

---

## 测试

### 单元测试

```bash
npm run test
```

### 端到端测试

```bash
npm run test:e2e
```

---

## 相关文档

- [构建与发布](./build-and-release.md)
- [IPC 接口文档](../api/ipc-api.md)
- [系统架构](../architecture/system-architecture.md)
- [项目结构规范](../../.cursor/rules/project-structure.mdc)

