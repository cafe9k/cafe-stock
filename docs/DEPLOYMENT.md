# 生产环境部署指南

## 重要说明

⚠️ **本项目是演示项目，所有操作直接在 Supabase 生产环境进行**

- ✅ 不使用本地 Supabase 环境
- ✅ 不运行 `supabase start`
- ✅ 直接部署到生产环境
- ✅ 快速迭代，简化流程

## 快速部署（3分钟）

### 1. 安装 Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 或使用 npm
npm install -g supabase
```

### 2. 登录 Supabase

```bash
supabase login
```

这会打开浏览器进行身份验证。

### 3. 关联生产项目

```bash
cd /Users/qing/GitHub/cafe-stock
supabase link --project-ref fmbqlwagajrrktcycnxu
```

### 4. 配置生产环境 Secrets

```bash
supabase secrets set TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
```

验证配置：

```bash
supabase secrets list
```

应该看到：
```
TUSHARE_TOKEN
```

### 5. 部署边缘函数到生产环境

```bash
supabase functions deploy tushare-proxy
```

部署成功后，会显示函数 URL：
```
https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy
```

### 6. 测试生产环境

```bash
curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_name": "stock_basic", "params": {"list_status": "L"}}'
```

应该返回股票列表数据。

### 7. 启动前端开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

前端会自动连接到生产环境的边缘函数。

## 更新部署

### 更新边缘函数

```bash
# 1. 修改代码
# 编辑 supabase/functions/tushare-proxy/index.ts

# 2. 直接部署到生产环境
supabase functions deploy tushare-proxy

# 3. 测试
curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_name": "stock_basic"}'
```

### 更新 Secrets

```bash
# 更新 Token
supabase secrets set TUSHARE_TOKEN=new_token_here

# 重新部署边缘函数（推荐）
supabase functions deploy tushare-proxy
```

### 更新前端

```bash
# 1. 修改前端代码
# 2. 重启开发服务器
npm run dev

# 或构建生产版本
npm run build
```

## 监控和日志

### 查看边缘函数日志

```bash
# 查看最近日志
supabase functions logs tushare-proxy

# 实时查看日志
supabase functions logs tushare-proxy --follow

# 查看最近 100 条
supabase functions logs tushare-proxy --limit 100
```

### 在 Dashboard 查看

1. 访问 https://supabase.com/dashboard
2. 选择项目 `cafe-stock`
3. 点击 "Edge Functions"
4. 选择 `tushare-proxy`
5. 查看：
   - Logs（日志）
   - Metrics（指标）
   - Invocations（调用统计）

## 常用命令

### Supabase CLI

```bash
# 查看项目列表
supabase projects list

# 查看函数列表
supabase functions list

# 查看 Secrets
supabase secrets list

# 删除 Secret
supabase secrets unset TUSHARE_TOKEN

# 查看项目信息
supabase projects info
```

### 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 故障排查

### 问题 1: 边缘函数 404

**原因：** 函数未部署

**解决：**
```bash
supabase functions deploy tushare-proxy
```

### 问题 2: Token not configured

**原因：** Secrets 未配置

**解决：**
```bash
supabase secrets set TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
supabase functions deploy tushare-proxy
```

### 问题 3: 前端无法加载数据

**检查步骤：**

1. 测试边缘函数
```bash
curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_name": "stock_basic"}'
```

2. 检查前端配置
```typescript
// src/config/supabase.ts
// 确认 URL 正确
const DEFAULT_SUPABASE_URL = 'https://fmbqlwagajrrktcycnxu.supabase.co'
```

3. 查看浏览器控制台
- 打开开发者工具（F12）
- 查看 Console 标签的错误信息
- 查看 Network 标签的请求状态

4. 查看边缘函数日志
```bash
supabase functions logs tushare-proxy --limit 50
```

### 问题 4: CORS 错误

**原因：** 边缘函数 CORS 配置问题

**解决：**
1. 检查 `supabase/functions/tushare-proxy/index.ts`
2. 确认包含 CORS 头：
```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
}
```
3. 重新部署：
```bash
supabase functions deploy tushare-proxy
```

## 性能优化

### 边缘函数优化

1. **减少数据量**
```typescript
// 只请求需要的字段
fields: 'ts_code,name,area,industry'
```

2. **使用缓存**（前端实现）
```typescript
// 缓存股票列表，避免重复请求
const cachedStocks = localStorage.getItem('stocks')
```

3. **批量请求**
```typescript
// 一次请求多个接口的数据
```

### 前端优化

1. **懒加载**
```typescript
// 使用虚拟滚动加载大量数据
```

2. **防抖节流**
```typescript
// 搜索输入使用防抖
const debouncedSearch = debounce(search, 300)
```

## 安全检查

### 定期检查

```bash
# 1. 检查 Secrets 配置
supabase secrets list

# 2. 查看最近的函数调用
supabase functions logs tushare-proxy --limit 100

# 3. 检查异常调用
# 在 Dashboard 中查看 Metrics
```

### Token 轮换

```bash
# 1. 生成新 Token（在 Tushare Pro 网站）
# 2. 更新 Secrets
supabase secrets set TUSHARE_TOKEN=new_token_here

# 3. 重新部署
supabase functions deploy tushare-proxy

# 4. 测试
curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_name": "stock_basic"}'
```

## 备份和恢复

### 备份边缘函数代码

```bash
# 代码已在 Git 仓库中
git add supabase/functions/
git commit -m "Backup edge functions"
git push
```

### 备份 Secrets

```bash
# 将 Secrets 记录在安全的地方
# 不要提交到 Git

# 示例：保存到密码管理器
TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
```

### 恢复部署

```bash
# 1. 克隆代码
git clone https://github.com/your-username/cafe-stock.git
cd cafe-stock

# 2. 关联项目
supabase link --project-ref fmbqlwagajrrktcycnxu

# 3. 配置 Secrets
supabase secrets set TUSHARE_TOKEN=your_token_here

# 4. 部署边缘函数
supabase functions deploy tushare-proxy

# 5. 测试
curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_name": "stock_basic"}'
```

## 成本估算

### Supabase 免费套餐

- Edge Functions: 500K 调用/月
- 数据传输: 10GB/月
- 数据库: 500MB
- 完全免费

### 预估使用量（演示项目）

- 每天约 100-1000 次调用
- 每月约 3K-30K 次调用
- 数据传输约 15MB-150MB/月
- **远低于免费额度**

## 总结

本项目采用直接生产环境部署的方式：

✅ **优势：**
- 简化流程，快速迭代
- 无需本地环境配置
- 降低学习成本
- 适合演示和原型项目

⚠️ **注意：**
- 这是演示项目的特殊做法
- 生产项目应该使用开发/测试/生产环境隔离
- 定期备份代码和配置
- 监控异常调用

## 相关文档

- [快速开始指南](../QUICKSTART.md)
- [安全配置指南](SECURITY.md)
- [测试指南](TESTING.md)
- [项目规则](.cursorrules)

