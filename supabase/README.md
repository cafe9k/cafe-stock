# Supabase Edge Functions

本项目使用 Supabase Edge Functions 来代理 Tushare API 请求，解决 CORS 跨域问题。

## 目录结构

```
supabase/
├── functions/
│   └── tushare-proxy/
│       └── index.ts          # Tushare API 代理函数
├── config.toml               # Supabase 配置
└── README.md                 # 本文档
```

## 本地开发

### 1. 安装 Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (使用 Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

### 2. 启动本地 Supabase

```bash
# 在项目根目录执行
supabase start
```

这将启动本地 Supabase 服务，包括：
- API: http://localhost:54321
- Studio: http://localhost:54323
- Edge Functions

### 3. 设置环境变量

在 `supabase/` 目录下创建 `.env` 文件（已被 .gitignore 忽略）：

```bash
TUSHARE_TOKEN=your_tushare_token_here
```

### 4. 部署边缘函数到本地

```bash
supabase functions serve tushare-proxy --env-file supabase/.env
```

### 5. 测试边缘函数

```bash
curl -X POST http://localhost:54321/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "api_name": "stock_basic",
    "params": {"list_status": "L"},
    "fields": "ts_code,name,area,industry,list_date"
  }'
```

## 生产环境部署

### 1. 登录 Supabase

```bash
supabase login
```

### 2. 关联项目

```bash
supabase link --project-ref your-project-ref
```

### 3. 设置生产环境变量

```bash
supabase secrets set TUSHARE_TOKEN=your_tushare_token_here
```

### 4. 部署边缘函数

```bash
supabase functions deploy tushare-proxy
```

### 5. 获取函数 URL

部署成功后，函数 URL 格式为：
```
https://your-project-ref.supabase.co/functions/v1/tushare-proxy
```

## 边缘函数 API

### 请求格式

**Endpoint:** `POST /functions/v1/tushare-proxy`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "api_name": "stock_basic",
  "params": {
    "list_status": "L"
  },
  "fields": "ts_code,name,area,industry,list_date"
}
```

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

## 前端集成

更新 `src/lib/tushareClient.ts` 使用边缘函数：

```typescript
// 开发环境
const API_URL = 'http://localhost:54321/functions/v1/tushare-proxy'

// 生产环境
const API_URL = 'https://your-project-ref.supabase.co/functions/v1/tushare-proxy'
```

## 注意事项

1. **Token 安全**：不要将 Tushare Token 提交到代码仓库
2. **环境变量**：使用 Supabase Secrets 管理敏感信息
3. **CORS**：边缘函数已配置允许所有来源的跨域请求
4. **速率限制**：注意 Tushare API 的调用频率限制
5. **日志**：可以在 Supabase Dashboard 查看函数日志

## 常见问题

### 1. 边缘函数启动失败

检查 Deno 是否正确安装：
```bash
deno --version
```

### 2. Token 未配置

确保在 `.env` 文件或 Supabase Secrets 中设置了 `TUSHARE_TOKEN`。

### 3. CORS 错误

边缘函数已经处理了 CORS，如果仍有问题，检查请求头是否正确。

## 参考资源

- [Supabase Edge Functions 文档](https://supabase.com/docs/guides/functions)
- [Deno 文档](https://deno.land/manual)
- [Tushare Pro API 文档](https://tushare.pro/document/2)

