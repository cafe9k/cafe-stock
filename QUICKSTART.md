# 🚀 快速开始指南

## 项目简介

A股股票数据查询系统 - 基于 React + TypeScript + Supabase Edge Functions + Tushare Pro

## ⚠️ 重要说明

**本项目是演示项目，所有 Supabase 操作直接在生产环境进行**

- ✅ 不使用本地 Supabase 环境
- ✅ 不运行 `supabase start`
- ✅ 直接部署到生产环境
- ✅ 快速迭代，简化流程

详见：[.cursorrules](.cursorrules) 和 [部署指南](docs/DEPLOYMENT.md)

## 前置要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Supabase 账号（免费）
- Tushare Pro Token（已配置）

## 快速部署（3分钟）

### 1. 克隆项目

```bash
git clone https://github.com/your-username/cafe-stock.git
cd cafe-stock
```

### 2. 安装依赖

```bash
npm install
```

### 3. 安装 Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 或使用 npm
npm install -g supabase
```

### 4. 登录 Supabase

```bash
supabase login
```

### 5. 关联项目

```bash
supabase link --project-ref fmbqlwagajrrktcycnxu
```

### 6. 配置 Secrets

```bash
./scripts/setup-secrets.sh
```

或手动配置：

```bash
supabase secrets set TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
```

### 7. 部署边缘函数

```bash
./scripts/deploy-edge-function.sh
```

或手动部署：

```bash
supabase functions deploy tushare-proxy
```

### 8. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 验证部署

### 测试边缘函数

```bash
curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_name": "stock_basic", "params": {"list_status": "L"}}'
```

应该返回股票列表数据。

### 查看函数日志

```bash
supabase functions logs tushare-proxy
```

## 目录结构

```
cafe-stock/
├── src/
│   ├── components/        # React 组件
│   │   └── StockList.tsx  # 股票列表组件
│   ├── config/            # 配置文件
│   │   ├── supabase.ts    # Supabase 配置
│   │   └── tushare.ts     # Tushare 配置（不含 Token）
│   ├── lib/               # 工具库
│   │   ├── supabaseClient.ts
│   │   └── tushareClient.ts
│   └── App.tsx            # 主应用
├── supabase/
│   ├── functions/
│   │   └── tushare-proxy/ # Tushare API 代理函数
│   └── config.toml        # Supabase 配置
├── scripts/
│   ├── setup-secrets.sh   # Secrets 配置脚本
│   └── deploy-edge-function.sh  # 部署脚本
└── docs/
    ├── SECURITY.md        # 安全配置指南 ⭐
    ├── SUPABASE_EDGE_FUNCTIONS.md
    ├── TUSHARE_API.md
    └── TUSHARE_RULES.md
```

## 常用命令

### 开发

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产版本
```

### Supabase

```bash
supabase login                    # 登录
supabase projects list            # 查看项目列表
supabase secrets list             # 查看 Secrets
supabase functions deploy         # 部署所有函数
supabase functions logs           # 查看日志
```

## 核心功能

### 1. 股票数据查询

```typescript
import { tushareClient } from '@/lib/tushareClient'

// 查询股票列表
const stocks = await tushareClient.query('stock_basic', {
    list_status: 'L'
}, ['ts_code', 'name', 'area', 'industry'])
```

### 2. 多维度筛选

- 按地域筛选（33个地域）
- 按行业筛选（120+个行业）
- 按股票代码/名称搜索

### 3. 实时数据

- 自动刷新
- 响应式更新
- 错误处理

## 安全说明

### ✅ 安全特性

- Token 存储在 Supabase Secrets 中
- 前端代码不包含敏感信息
- 所有请求通过 HTTPS 加密
- 边缘函数自动处理 CORS

### ⚠️ 注意事项

- 不要在前端代码中硬编码 Token
- 不要将 `.env` 文件提交到 Git
- 定期轮换 Token
- 监控异常调用

详见：[安全配置指南](docs/SECURITY.md)

## 故障排查

### 问题 1: 边缘函数部署失败

**解决方案：**
1. 检查是否已登录：`supabase login`
2. 检查项目是否已关联：`supabase link --project-ref your-ref`
3. 检查 Secrets 是否已配置：`supabase secrets list`

### 问题 2: Token 未配置

**错误信息：** `Tushare token not configured`

**解决方案：**
```bash
supabase secrets set TUSHARE_TOKEN=your_token_here
supabase functions deploy tushare-proxy
```

### 问题 3: CORS 错误

**解决方案：**
- 确认边缘函数已部署
- 检查前端 API URL 是否正确
- 查看边缘函数日志：`supabase functions logs tushare-proxy`

### 问题 4: 数据加载失败

**解决方案：**
1. 打开浏览器开发者工具
2. 查看 Network 标签
3. 检查请求是否成功
4. 查看响应内容

## 下一步

### 学习资源

- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Supabase 文档](https://supabase.com/docs)
- [Tushare Pro 文档](https://tushare.pro/document/2)

### 扩展功能

- [ ] 添加股票详情页
- [ ] 实现K线图展示
- [ ] 添加数据导出功能
- [ ] 实现用户收藏功能
- [ ] 添加实时行情推送

### 贡献

欢迎提交 Issue 和 Pull Request！

## 获取帮助

- 📖 查看 [文档](docs/)
- 🐛 提交 [Issue](https://github.com/your-username/cafe-stock/issues)
- 💬 加入讨论

## License

MIT License

