# 🚀 快速开始指南

## 1. 配置 Supabase

### 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账号
3. 点击 "New Project" 创建新项目
4. 记下项目名称和数据库密码

### 步骤 2: 获取 API 密钥

1. 在项目仪表板,点击左侧菜单的 "Settings" (设置)
2. 选择 "API"
3. 找到以下信息:
   - **Project URL** (项目 URL)
   - **anon/public key** (匿名/公钥)

### 步骤 3: 配置环境变量

1. 复制 `.env.local` 文件内容
2. 替换为你的实际配置:

```env
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的匿名密钥
```

## 2. 创建数据库表

### 在 Supabase SQL Editor 中执行:

1. 在项目仪表板,点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制以下 SQL 并执行:

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
-- 注意: 生产环境请使用更严格的策略
CREATE POLICY "Enable all access for stock_items"
ON stock_items
FOR ALL
USING (true)
WITH CHECK (true);
```

4. 点击 "Run" 执行 SQL

## 3. 启动项目

```bash
# 启动开发服务器
npm run dev
```

应用将在 http://localhost:3000 自动打开

## 4. 测试功能

1. **查看连接状态**: 页面顶部会显示数据库连接状态
2. **添加库存**: 填写表单并提交
3. **查看列表**: 自动显示所有库存项
4. **删除库存**: 点击删除按钮

## 常见问题

### Q: 连接失败怎么办?

A: 检查以下几点:
- `.env.local` 文件配置是否正确
- Supabase 项目是否正常运行
- 是否已创建 `stock_items` 表
- RLS 策略是否已设置

### Q: 无法读取数据?

A: 检查:
- 表名是否为 `stock_items`
- RLS 策略是否正确配置
- 浏览器控制台是否有错误信息

### Q: 端口 3000 被占用?

A: 修改 `vite.config.ts` 中的端口号:

```typescript
server: {
  port: 3001,  // 改为其他端口
  open: true
}
```

## 生产环境部署

### 更新 RLS 策略

生产环境应使用更严格的安全策略,例如:

```sql
-- 删除开发策略
DROP POLICY IF EXISTS "Enable all access for stock_items" ON stock_items;

-- 添加基于用户的策略
CREATE POLICY "Users can view their own stock items"
ON stock_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock items"
ON stock_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock items"
ON stock_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock items"
ON stock_items FOR DELETE
USING (auth.uid() = user_id);
```

## 下一步

- 添加用户认证功能
- 实现库存编辑功能
- 添加数据筛选和搜索
- 导出数据功能
- 数据可视化图表

祝你使用愉快! ☕
