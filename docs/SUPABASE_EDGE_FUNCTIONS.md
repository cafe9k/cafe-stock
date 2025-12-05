# Supabase Edge Functions 部署指南

## 概述

本项目使用 Supabase Edge Functions 来代理 Tushare API 请求，完美解决了浏览器端直接调用 Tushare API 的 CORS 跨域问题。

## 架构说明

```
前端应用 (React)
    ↓
Supabase Edge Function (tushare-proxy)
    ↓
Tushare Pro API
```

### 优势

1. **解决 CORS 问题**：边缘函数作为服务端代理，不受浏览器同源策略限制
2. **Token 安全**：Tushare Token 存储在服务端环境变量中，不暴露给前端
3. **全球加速**：Supabase Edge Functions 基于 Deno Deploy，在全球多个节点部署
4. **自动扩展**：无需管理服务器，自动处理流量高峰
5. **成本低廉**：Supabase 免费套餐包含 500K 边缘函数调用/月

## 快速开始

### 前置要求

- Supabase 账号
- Supabase CLI
- Tushare Pro Token

### 1. 安装 Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase

# 或使用 npm
npm install -g supabase
```

### 2. 登录 Supabase

```bash
supabase login
```

### 3. 关联项目

如果已有 Supabase 项目：

```bash
supabase link --project-ref fmbqlwagajrrktcycnxu
```

如果需要创建新项目：

```bash
supabase projects create cafe-stock
```

### 4. 设置环境变量（Secrets）

**重要**：Token 应该存储在 Supabase Secrets 中，而不是代码中。

#### 方式一：使用配置脚本（推荐）

```bash
./scripts/setup-secrets.sh
```

#### 方式二：手动配置

```bash
supabase secrets set TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
```

**安全提示**：
- ✅ Token 存储在服务端，前端无法访问
- ✅ 不会被提交到 Git 仓库
- ✅ 易于更新和轮换
- ❌ 不要在前端代码中硬编码 Token

### 5. 部署边缘函数

```bash
supabase functions deploy tushare-proxy
```

部署成功后，你会看到函数 URL：
```
https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy
```

### 6. 测试边缘函数

```bash
curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "api_name": "stock_basic",
    "params": {"list_status": "L"},
    "fields": "ts_code,name,area,industry,list_date"
  }'
```

## 本地开发

### 1. 启动本地 Supabase

```bash
supabase start
```

### 2. 创建本地环境变量

在 `supabase/` 目录下创建 `.env` 文件：

```bash
TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
```

### 3. 启动边缘函数

```bash
supabase functions serve tushare-proxy --env-file supabase/.env
```

本地函数 URL：
```
http://localhost:54321/functions/v1/tushare-proxy
```

### 4. 更新前端配置

在开发环境中，更新 `src/config/supabase.ts`：

```typescript
const DEFAULT_SUPABASE_URL = 'http://localhost:54321'
```

## API 文档

### 请求格式

**Endpoint:** `POST /functions/v1/tushare-proxy`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "api_name": "stock_basic",
  "params": {
    "list_status": "L"
  },
  "fields": "ts_code,name,area,industry,list_date"
}
```

**参数说明：**
- `api_name` (必需): Tushare API 接口名称
- `params` (可选): 接口参数对象
- `fields` (可选): 返回字段列表，逗号分隔
- `token` (可选): 如果提供，将覆盖服务端配置的 Token

### 响应格式

**成功响应 (200):**
```json
{
  "code": 0,
  "msg": null,
  "data": {
    "fields": ["ts_code", "name", "area", "industry", "list_date"],
    "items": [
      ["000001.SZ", "平安银行", "深圳", "银行", "19910403"],
      ["000002.SZ", "万科A", "深圳", "全国地产", "19910129"]
    ]
  }
}
```

**错误响应:**
```json
{
  "code": -1,
  "msg": "Error message",
  "data": null
}
```

## 监控和日志

### 查看函数日志

在 Supabase Dashboard 中：
1. 进入项目
2. 点击左侧菜单 "Edge Functions"
3. 选择 "tushare-proxy"
4. 查看 "Logs" 标签

或使用 CLI：
```bash
supabase functions logs tushare-proxy
```

### 查看函数指标

在 Dashboard 的 "Edge Functions" 页面可以看到：
- 调用次数
- 错误率
- 平均响应时间
- 流量使用情况

## 常见问题

### 1. 部署失败

**问题：** `Error: Failed to deploy function`

**解决方案：**
- 检查是否已登录：`supabase login`
- 检查项目是否已关联：`supabase link --project-ref your-ref`
- 检查函数代码语法是否正确

### 2. Token 未配置

**问题：** `Tushare token not configured`

**解决方案：**
```bash
supabase secrets set TUSHARE_TOKEN=your_token_here
```

### 3. CORS 错误

**问题：** 前端仍然出现 CORS 错误

**解决方案：**
- 检查边缘函数是否已正确部署
- 检查前端 API URL 是否正确
- 确认边缘函数返回了正确的 CORS 头

### 4. 函数超时

**问题：** 函数执行超时

**解决方案：**
- Supabase Edge Functions 默认超时时间为 150 秒
- 优化 Tushare API 调用，减少数据量
- 考虑使用分页或批量请求

### 5. 速率限制

**问题：** Tushare API 返回速率限制错误

**解决方案：**
- 在前端实现请求缓存
- 控制前端请求频率
- 升级 Tushare 积分以获得更高的调用频次

## 成本估算

### Supabase 免费套餐

- Edge Functions: 500K 调用/月
- 数据传输: 10GB/月
- 数据库: 500MB

### 付费套餐

如果超出免费额度，可以升级到 Pro 套餐：
- $25/月
- 2M Edge Function 调用
- 50GB 数据传输
- 8GB 数据库

## 安全建议

1. **不要在前端硬编码 Token**
2. **使用 Supabase Secrets 管理敏感信息**
3. **定期轮换 Tushare Token**
4. **监控异常调用**
5. **设置合理的速率限制**

## 更新边缘函数

当需要更新函数代码时：

1. 修改 `supabase/functions/tushare-proxy/index.ts`
2. 重新部署：
```bash
supabase functions deploy tushare-proxy
```

3. 验证更新：
```bash
curl -X POST https://your-project.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_name": "stock_basic"}'
```

## 参考资源

- [Supabase Edge Functions 文档](https://supabase.com/docs/guides/functions)
- [Deno 文档](https://deno.land/manual)
- [Tushare Pro API 文档](https://tushare.pro/document/2)
- [Supabase CLI 参考](https://supabase.com/docs/reference/cli)

