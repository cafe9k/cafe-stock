# ☕ Cafe Stock - 咖啡店库存管理系统

一个基于 React + TypeScript + Supabase 的现代化库存管理系统,具有实时数据同步和优雅的用户界面。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-2.39-green.svg)

## ✨ 功能特性

- ✅ **实时数据库连接** - 自动检测并显示 Supabase 连接状态
- ✅ **库存管理** - 添加、查看、删除库存项
- ✅ **分类管理** - 支持原料、包材、器具等多种分类
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **现代化 UI** - 渐变背景、动画效果、流畅交互
- ✅ **TypeScript** - 完整的类型安全
- ✅ **实时更新** - 操作后自动刷新数据
- ✅ **Tushare 集成** - 支持调用 Tushare Pro 金融数据接口

## 🎯 项目截图

```
┌─────────────────────────────────────────┐
│  ☕ 咖啡店库存管理系统                    │
│  连接到 Supabase 数据库                  │
├─────────────────────────────────────────┤
│  ● 数据库已连接                          │
├─────────────────────────────────────────┤
│  添加库存项                              │
│  ┌──────┬──────┬──────┬──────┐         │
│  │ 名称 │ 数量 │ 单位 │ 类别 │         │
│  └──────┴──────┴──────┴──────┘         │
│  [添加库存] [刷新数据]                  │
├─────────────────────────────────────────┤
│  库存列表                                │
│  ID │ 名称  │ 数量 │ 单位 │ 类别 │...  │
│  ───┼───────┼─────┼─────┼─────┼────    │
│   1 │ 咖啡豆│ 100 │  袋 │ 原料 │[删除] │
└─────────────────────────────────────────┘
```

## 🚀 快速开始

### 前置要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Supabase 账号 (免费)

### 安装步骤

#### 1. 克隆项目

```bash
git clone <your-repo-url>
cd cafe-stock
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置 Supabase

##### 3.1 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账号
3. 创建新项目

##### 3.2 配置环境变量

编辑 `.env.local` 文件:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

从 Supabase 项目设置 → API 页面获取这些值。

##### 3.3 创建数据库表

在 Supabase SQL Editor 中执行以下 SQL:

```sql
-- 创建库存表
CREATE TABLE stock_items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建更新时间的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_items_updated_at
BEFORE UPDATE ON stock_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全性 (RLS)
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略 (开发环境)
CREATE POLICY "Enable all access for stock_items"
ON stock_items
FOR ALL
USING (true)
WITH CHECK (true);
```

#### 4. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 自动打开。

## 📁 项目结构

```
cafe-stock/
├── src/
│   ├── config/
│   │   ├── supabase.ts          # Supabase 配置
│   │   └── tushare.ts           # Tushare 配置
│   ├── lib/
│   │   ├── supabaseClient.ts    # Supabase 客户端和类型定义
│   │   ├── tushareClient.ts     # Tushare HTTP 客户端
│   │   └── tushareQuickTest.ts  # Tushare 快速测试
│   ├── App.tsx                  # 主应用组件
│   ├── App.css                  # 应用样式
│   ├── main.tsx                 # 应用入口
│   └── vite-env.d.ts            # Vite 类型定义
├── docs/
│   ├── TUSHARE_API.md           # Tushare API 使用文档
│   └── TUSHARE_RULES.md         # Tushare 接口调用规则
├── index.html                   # HTML 模板
├── package.json                 # 项目配置
├── tsconfig.json                # TypeScript 配置
├── vite.config.ts               # Vite 配置
├── .env.local                   # 环境变量(本地)
├── SETUP.md                     # 详细设置指南
└── README.md                    # 项目文档
```

## 🛠️ 技术栈

### 前端框架
- **React 18.2** - UI 框架
- **TypeScript 5.2** - 类型安全的 JavaScript

### 构建工具
- **Vite 5.0** - 快速的开发服务器和构建工具

### 数据库
- **Supabase** - 开源的 Firebase 替代方案
  - PostgreSQL 数据库
  - 实时订阅
  - 行级安全性 (RLS)
  - 自动生成的 RESTful API

### 开发工具
- **ESLint** - 代码质量检查
- **TypeScript ESLint** - TypeScript 代码规范

## 📝 可用脚本

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行代码检查
npm run lint
```

## 🗄️ 数据模型

### StockItem 接口

```typescript
interface StockItem {
    id: number              // 主键
    name: string            // 物品名称
    quantity: number        // 数量
    unit: string            // 单位
    category: string        // 分类
    created_at: string      // 创建时间
    updated_at: string      // 更新时间
}
```

### 示例数据

```json
{
    "id": 1,
    "name": "咖啡豆",
    "quantity": 100,
    "unit": "袋",
    "category": "原料",
    "created_at": "2023-12-05T10:00:00Z",
    "updated_at": "2023-12-05T10:00:00Z"
}
```

## 🔧 配置说明

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // 开发服务器端口
    open: true         // 自动打开浏览器
  }
})
```

### TypeScript 配置

- 严格模式启用
- JSX 支持 (react-jsx)
- ES2020 目标
- 模块捆绑解析

## 🔒 安全建议

### 开发环境

当前配置允许所有操作,适合开发测试。

### 生产环境

**重要**: 生产环境必须配置更严格的 RLS 策略:

```sql
-- 删除开发策略
DROP POLICY IF EXISTS "Enable all access for stock_items" ON stock_items;

-- 添加基于用户认证的策略
CREATE POLICY "Authenticated users can view stock items"
ON stock_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert stock items"
ON stock_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- 其他策略...
```

## 🐛 常见问题

### Q: 连接失败?

**A**: 检查以下几点:
1. `.env.local` 配置是否正确
2. Supabase 项目是否运行
3. 数据库表是否已创建
4. RLS 策略是否正确

### Q: 无法读取数据?

**A**: 
1. 确认表名为 `stock_items`
2. 检查 RLS 策略
3. 查看浏览器控制台错误

### Q: 端口被占用?

**A**: 修改 `vite.config.ts` 中的端口:

```typescript
server: {
  port: 3001,  // 改为其他端口
}
```

### Q: 如何添加认证?

**A**: 参考 Supabase 文档实现:
1. 启用认证提供商
2. 添加登录/注册组件
3. 更新 RLS 策略
4. 使用 `supabase.auth` API

## 🚀 部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Netlify 部署

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

### 环境变量配置

在部署平台配置以下环境变量:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📈 后续开发计划

- [ ] 用户认证系统
- [ ] 库存编辑功能
- [ ] 数据搜索和筛选
- [ ] 库存预警功能
- [ ] 数据导出 (CSV/Excel)
- [ ] 数据可视化图表
- [ ] 移动端优化
- [ ] 多语言支持
- [ ] 暗黑模式

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

开发者: [Your Name]

## 📊 Tushare 数据接口

本项目集成了 Tushare Pro 金融数据接口，可用于获取股票、基金、期货等金融数据。

### 快速使用

```typescript
import { tushareClient } from '@/lib/tushareClient'

// 获取股票列表
const stocks = await tushareClient.query('stock_basic', {
    list_status: 'L'
}, ['ts_code', 'name', 'area', 'industry'])

// 获取日线行情
const daily = await tushareClient.query('daily', {
    ts_code: '000001.SZ',
    start_date: '20231201',
    end_date: '20231231'
}, ['trade_date', 'open', 'high', 'low', 'close', 'vol'])
```

### 相关文档

- [Tushare API 使用文档](docs/TUSHARE_API.md)
- [Tushare 接口调用规则](docs/TUSHARE_RULES.md)
- [Tushare Pro 官方文档](https://tushare.pro/document/2?doc_id=14)

## 🙏 致谢

- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tushare Pro](https://tushare.pro/)

---

如有问题,请查看 [SETUP.md](SETUP.md) 获取详细的配置指南。
