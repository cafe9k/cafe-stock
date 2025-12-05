# 边缘函数测试指南

## 测试状态

当前边缘函数需要部署到 Supabase 才能进行测试。

## 部署前准备

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

### 2. 验证安装

```bash
supabase --version
```

应该看到版本号，例如：`1.x.x`

### 3. 登录 Supabase

```bash
supabase login
```

这会打开浏览器进行身份验证。

### 4. 关联项目

```bash
cd /Users/qing/GitHub/cafe-stock
supabase link --project-ref fmbqlwagajrrktcycnxu
```

### 5. 配置 Secrets

```bash
./scripts/setup-secrets.sh
```

或手动配置：

```bash
supabase secrets set TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
```

### 6. 部署边缘函数

```bash
./scripts/deploy-edge-function.sh
```

或手动部署：

```bash
supabase functions deploy tushare-proxy
```

## 测试方法

### 方法 1: 使用 curl 测试

部署成功后，运行：

```bash
curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "api_name": "stock_basic",
    "params": {"list_status": "L"},
    "fields": "ts_code,name,area,industry,list_date"
  }'
```

**预期结果：**

```json
{
  "code": 0,
  "msg": null,
  "data": {
    "fields": ["ts_code", "name", "area", "industry", "list_date"],
    "items": [
      ["000001.SZ", "平安银行", "深圳", "银行", "19910403"],
      ["000002.SZ", "万科A", "深圳", "全国地产", "19910129"],
      ...
    ]
  }
}
```

### 方法 2: 使用浏览器测试

1. 打开浏览器开发者工具（F12）
2. 进入 Console 标签
3. 运行以下代码：

```javascript
fetch('https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    api_name: 'stock_basic',
    params: { list_status: 'L' },
    fields: 'ts_code,name,area,industry,list_date'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err))
```

### 方法 3: 通过前端应用测试

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:3000

3. 查看股票列表是否正常加载

4. 打开浏览器开发者工具，查看 Network 标签

5. 应该看到对 `tushare-proxy` 的请求

### 方法 4: 使用 Postman 测试

1. 打开 Postman
2. 创建新的 POST 请求
3. URL: `https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "api_name": "stock_basic",
  "params": {
    "list_status": "L"
  },
  "fields": "ts_code,name,area,industry,list_date"
}
```
6. 点击 Send

## 测试用例

### 测试用例 1: 获取股票列表

**请求：**
```json
{
  "api_name": "stock_basic",
  "params": {"list_status": "L"},
  "fields": "ts_code,name"
}
```

**预期：**
- HTTP 状态码: 200
- 返回 code: 0
- 返回数据包含股票列表

### 测试用例 2: 获取日线行情

**请求：**
```json
{
  "api_name": "daily",
  "params": {
    "ts_code": "000001.SZ",
    "start_date": "20231201",
    "end_date": "20231231"
  },
  "fields": "trade_date,open,high,low,close,vol"
}
```

**预期：**
- HTTP 状态码: 200
- 返回 code: 0
- 返回指定日期范围的行情数据

### 测试用例 3: 错误处理 - 缺少 api_name

**请求：**
```json
{
  "params": {"list_status": "L"}
}
```

**预期：**
- HTTP 状态码: 400
- 返回 code: -1
- 返回错误信息: "api_name is required"

### 测试用例 4: CORS 预检请求

**请求：**
```bash
curl -X OPTIONS https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**预期：**
- HTTP 状态码: 204
- 包含 CORS 响应头

## 查看日志

### 实时日志

```bash
supabase functions logs tushare-proxy --follow
```

### 历史日志

```bash
supabase functions logs tushare-proxy --limit 100
```

### 在 Dashboard 查看

1. 访问 https://supabase.com/dashboard
2. 选择项目 `cafe-stock`
3. 点击左侧菜单 "Edge Functions"
4. 选择 `tushare-proxy`
5. 查看 "Logs" 标签

## 性能测试

### 响应时间测试

```bash
for i in {1..10}; do
  curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
    -H "Content-Type: application/json" \
    -d '{"api_name": "stock_basic", "params": {"list_status": "L"}}' \
    -w "Time: %{time_total}s\n" \
    -o /dev/null -s
done
```

### 并发测试

```bash
# 使用 Apache Bench
ab -n 100 -c 10 -p request.json -T application/json \
  https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy
```

## 故障排查

### 问题 1: 404 Not Found

**原因：** 边缘函数未部署

**解决：**
```bash
supabase functions deploy tushare-proxy
```

### 问题 2: Token not configured

**原因：** Secrets 未配置

**解决：**
```bash
supabase secrets set TUSHARE_TOKEN=your_token_here
```

### 问题 3: CORS 错误

**原因：** 边缘函数未正确处理 CORS

**解决：** 检查边缘函数代码中的 CORS 头设置

### 问题 4: 超时

**原因：** Tushare API 响应慢或网络问题

**解决：** 
- 检查 Tushare API 状态
- 查看边缘函数日志
- 优化请求参数

## 监控指标

### 关键指标

- **成功率**: > 99%
- **平均响应时间**: < 2秒
- **P95 响应时间**: < 3秒
- **错误率**: < 1%

### 在 Dashboard 查看

1. 访问 Supabase Dashboard
2. 选择 Edge Functions
3. 查看 Metrics 标签
4. 关注：
   - Invocations（调用次数）
   - Errors（错误数）
   - Duration（执行时间）

## 自动化测试脚本

创建 `scripts/test-edge-function.sh`：

```bash
#!/bin/bash

echo "🧪 测试 Supabase Edge Function"
echo ""

# 测试端点
ENDPOINT="https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy"

# 测试 1: 基本调用
echo "测试 1: 基本 API 调用..."
response=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"api_name": "stock_basic", "params": {"list_status": "L"}}')

if echo "$response" | grep -q '"code":0'; then
  echo "✅ 测试 1 通过"
else
  echo "❌ 测试 1 失败"
  echo "$response"
fi

echo ""

# 测试 2: CORS 预检
echo "测试 2: CORS 预检请求..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$ENDPOINT" \
  -H "Access-Control-Request-Method: POST")

if [ "$http_code" = "204" ]; then
  echo "✅ 测试 2 通过"
else
  echo "❌ 测试 2 失败 (HTTP $http_code)"
fi

echo ""
echo "🎉 测试完成"
```

## 持续集成

在 CI/CD 流程中添加测试：

```yaml
# .github/workflows/test.yml
name: Test Edge Functions

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Test Edge Function
        run: |
          response=$(curl -s -X POST \
            https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \
            -H "Content-Type: application/json" \
            -d '{"api_name": "stock_basic"}')
          
          if echo "$response" | grep -q '"code":0'; then
            echo "✅ Edge Function is working"
          else
            echo "❌ Edge Function test failed"
            exit 1
          fi
```

## 总结

完成以上测试后，确认：

- ✅ 边缘函数已部署
- ✅ Secrets 已配置
- ✅ API 调用正常
- ✅ CORS 处理正确
- ✅ 错误处理完善
- ✅ 性能符合预期
- ✅ 日志记录完整

如有问题，请查看：
- [安全配置指南](SECURITY.md)
- [Supabase Edge Functions 部署](SUPABASE_EDGE_FUNCTIONS.md)
- [故障排查](SUPABASE_EDGE_FUNCTIONS.md#常见问题)

