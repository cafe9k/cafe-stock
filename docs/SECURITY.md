# 安全配置指南

## 概述

本项目采用 Supabase Edge Functions + Secrets 的方式来管理敏感信息，确保 Tushare Token 等密钥不会暴露在前端代码中。

## 安全架构

```
┌─────────────────┐
│   前端应用       │
│  (React)        │
│  ❌ 无 Token    │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────┐
│ Supabase Edge   │
│   Function      │
│  ✅ 有 Token    │
│ (从 Secrets读取)│
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│  Tushare API    │
└─────────────────┘
```

## 为什么这样做？

### 问题

1. **前端代码可见**：任何人都可以查看浏览器中的 JavaScript 代码
2. **Token 泄露风险**：如果 Token 硬编码在前端，会被轻易获取
3. **无法撤销**：一旦 Token 泄露，需要重新生成并更新所有代码

### 解决方案

1. **Token 存储在服务端**：使用 Supabase Secrets 管理
2. **前端通过代理访问**：所有请求通过边缘函数转发
3. **易于更新**：只需更新 Secrets，无需修改代码

## 配置步骤

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

### 3. 关联项目

```bash
supabase link --project-ref fmbqlwagajrrktcycnxu
```

### 4. 配置 Secrets

#### 方式一：使用配置脚本（推荐）

```bash
./scripts/setup-secrets.sh
```

#### 方式二：手动配置

```bash
supabase secrets set TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
```

### 5. 验证配置

```bash
supabase secrets list
```

应该看到：
```
TUSHARE_TOKEN
```

### 6. 部署边缘函数

```bash
supabase functions deploy tushare-proxy
```

## 代码说明

### 边缘函数中读取 Token

```typescript
// supabase/functions/tushare-proxy/index.ts
const TUSHARE_TOKEN = Deno.env.get('TUSHARE_TOKEN') || ''
```

边缘函数运行时，`Deno.env.get()` 会从 Supabase Secrets 中读取配置的值。

### 前端不再包含 Token

```typescript
// src/config/tushare.ts
export const TUSHARE_TOKEN = ''  // 空值，不再使用
```

前端代码中不再包含实际的 Token 值。

### 前端调用边缘函数

```typescript
// src/lib/tushareClient.ts
this.apiUrl = `${SUPABASE_FUNCTIONS_URL}/tushare-proxy`
```

所有请求都通过 Supabase Edge Function 代理。

## 安全最佳实践

### ✅ 应该做的

1. **使用 Supabase Secrets** 存储所有敏感信息
2. **定期轮换 Token** 提高安全性
3. **监控 API 调用** 及时发现异常
4. **使用 HTTPS** 确保传输安全
5. **限制 CORS** 只允许特定域名访问

### ❌ 不应该做的

1. **不要在前端硬编码 Token**
2. **不要将 Token 提交到 Git**
3. **不要在日志中输出完整 Token**
4. **不要在 URL 参数中传递 Token**
5. **不要在客户端存储 Token**

## 更新 Token

### 1. 更新 Supabase Secrets

```bash
supabase secrets set TUSHARE_TOKEN=new_token_here
```

### 2. 重新部署边缘函数

```bash
supabase functions deploy tushare-proxy
```

**注意**：更新 Secrets 后，边缘函数会自动使用新值，但建议重新部署以确保生效。

## 本地开发

### 本地环境变量

在本地开发时，创建 `supabase/.env` 文件（已被 .gitignore 忽略）：

```bash
TUSHARE_TOKEN=834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d
```

### 启动本地边缘函数

```bash
supabase functions serve tushare-proxy --env-file supabase/.env
```

## 监控和审计

### 查看函数日志

```bash
supabase functions logs tushare-proxy
```

### 检查异常调用

在 Supabase Dashboard 中：
1. 进入 Edge Functions
2. 选择 tushare-proxy
3. 查看 Logs 和 Metrics

### 设置告警

可以在 Supabase Dashboard 中设置告警规则：
- 错误率超过阈值
- 调用量异常增长
- 响应时间过长

## 应急响应

### Token 泄露处理

如果怀疑 Token 泄露：

1. **立即撤销旧 Token**
   - 登录 Tushare Pro
   - 重新生成 Token

2. **更新 Supabase Secrets**
   ```bash
   supabase secrets set TUSHARE_TOKEN=new_token_here
   ```

3. **重新部署边缘函数**
   ```bash
   supabase functions deploy tushare-proxy
   ```

4. **检查日志**
   - 查看是否有异常调用
   - 确认新 Token 是否生效

5. **通知相关人员**
   - 记录事件
   - 分析泄露原因

## 合规性

### 数据保护

- Token 存储在 Supabase 的加密存储中
- 传输过程使用 HTTPS 加密
- 不在日志中记录敏感信息

### 访问控制

- 只有项目管理员可以访问 Secrets
- 使用 Supabase 的 RBAC 管理权限
- 定期审查访问日志

## 常见问题

### Q: 如何查看当前配置的 Token？

A: 出于安全考虑，Supabase Secrets 不支持查看明文值。你只能看到 Secret 的名称。

### Q: 可以在前端使用 Token 吗？

A: 不推荐。虽然技术上可行，但会带来安全风险。应该始终通过边缘函数代理。

### Q: 如何在多个环境中使用不同的 Token？

A: 为每个环境（开发、测试、生产）创建独立的 Supabase 项目，并配置不同的 Secrets。

### Q: 边缘函数的 Token 多久刷新一次？

A: Secrets 更新后，新的函数调用会立即使用新值。无需手动刷新。

## 参考资源

- [Supabase Secrets 文档](https://supabase.com/docs/guides/functions/secrets)
- [Deno 环境变量](https://deno.land/manual/getting_started/setup_your_environment)
- [OWASP API 安全](https://owasp.org/www-project-api-security/)

