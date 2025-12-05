# 📖 使用指南

## 目录
- [首次配置](#首次配置)
- [基本操作](#基本操作)
- [功能说明](#功能说明)
- [故障排除](#故障排除)

## 首次配置

### 步骤 1: 创建 Supabase 账号和项目

1. 打开浏览器访问: https://supabase.com
2. 点击右上角 "Start your project"
3. 使用 GitHub/Google 账号登录或邮箱注册
4. 点击 "New Project" 创建项目
5. 填写项目信息:
   - Project name: `cafe-stock` (或自定义名称)
   - Database Password: 设置一个强密码(请记住)
   - Region: 选择离你最近的区域
6. 点击 "Create new project" 等待项目创建(约 2 分钟)

### 步骤 2: 获取 API 凭证

1. 项目创建完成后,进入项目仪表板
2. 左侧菜单点击 ⚙️ **Settings** (设置)
3. 选择 **API** 选项卡
4. 找到以下信息并复制:
   
   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **API Keys - anon/public:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 步骤 3: 配置本地环境变量

1. 在项目根目录,编辑 `.env.local` 文件:

```bash
# 使用文本编辑器打开
nano .env.local
# 或
code .env.local
```

2. 将复制的信息粘贴进去:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. 保存文件 (nano: Ctrl+X → Y → Enter)

### 步骤 4: 创建数据库表

1. 回到 Supabase 仪表板
2. 左侧菜单点击 🗄️ **SQL Editor**
3. 点击 "+ New query" 创建新查询
4. 复制以下完整 SQL 代码:

```sql
-- ============================================
-- 咖啡店库存管理系统 - 数据库初始化脚本
-- ============================================

-- 1. 创建库存表
CREATE TABLE IF NOT EXISTS stock_items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    unit TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_stock_items_category ON stock_items(category);
CREATE INDEX IF NOT EXISTS idx_stock_items_created_at ON stock_items(created_at DESC);

-- 3. 创建自动更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 创建触发器
DROP TRIGGER IF EXISTS update_stock_items_updated_at ON stock_items;
CREATE TRIGGER update_stock_items_updated_at
BEFORE UPDATE ON stock_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. 启用行级安全性 (RLS)
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;

-- 6. 创建访问策略 (开发环境 - 允许所有操作)
DROP POLICY IF EXISTS "Enable all access for stock_items" ON stock_items;
CREATE POLICY "Enable all access for stock_items"
ON stock_items
FOR ALL
USING (true)
WITH CHECK (true);

-- 7. 插入示例数据
INSERT INTO stock_items (name, quantity, unit, category) VALUES
    ('咖啡豆', 50, '袋', '原料'),
    ('牛奶', 100, '升', '原料'),
    ('纸杯', 500, '个', '包材'),
    ('咖啡机', 2, '台', '器具')
ON CONFLICT DO NOTHING;

-- 完成
SELECT 'Database initialized successfully!' as message;
```

5. 点击右下角 "Run" 按钮执行
6. 看到 "Success" 和 "Database initialized successfully!" 表示成功

### 步骤 5: 验证数据

1. 在 Supabase 仪表板左侧点击 📊 **Table Editor**
2. 选择 `stock_items` 表
3. 应该能看到 4 条示例数据

### 步骤 6: 启动应用

```bash
# 如果服务器还未启动
npm run dev
```

浏览器会自动打开 http://localhost:3000

## 基本操作

### 1. 查看连接状态

打开应用后,页面顶部会显示连接状态:

- **🟢 绿色 "✓ 数据库已连接"** - 连接成功
- **🔴 红色 "✗ 数据库连接失败"** - 连接失败(检查配置)
- **🟡 黄色 "正在连接..."** - 正在连接中

### 2. 添加库存项

1. 在 "添加库存项" 表单中填写:
   - **名称**: 例如 "咖啡豆"
   - **数量**: 例如 100
   - **单位**: 例如 "袋"
   - **类别**: 从下拉菜单选择
     - 原料
     - 包材
     - 器具
     - 其他

2. 点击 **"添加库存"** 按钮

3. 成功后:
   - 表单自动清空
   - 库存列表自动刷新
   - 新项目出现在列表顶部

### 3. 查看库存列表

库存列表显示所有库存项,包含以下信息:

| 列名 | 说明 |
|------|------|
| ID | 系统自动生成的唯一标识 |
| 名称 | 物品名称 |
| 数量 | 当前库存数量 |
| 单位 | 计量单位 |
| 类别 | 物品分类 |
| 创建时间 | 添加到系统的时间 |
| 操作 | 可执行的操作(删除等) |

### 4. 删除库存项

1. 在库存列表中找到要删除的项
2. 点击该行最右侧的 **"删除"** 按钮
3. 弹出确认对话框,点击 **"确定"**
4. 该项从列表中移除

### 5. 刷新数据

如果数据未自动更新,点击 **"刷新数据"** 按钮手动刷新。

## 功能说明

### 实时状态指示器

应用顶部的状态指示器会实时显示:
- 连接状态(绿/红/黄灯)
- 操作状态(加载中、成功、失败)

### 表单验证

添加库存时会自动验证:
- ✅ 所有字段必填
- ✅ 数量必须是数字
- ✅ 类别必须从预设选项中选择

### 错误提示

操作失败时会显示红色错误消息框,包含:
- 错误原因
- 可能的解决方案

### 空状态

当列表为空时,显示提示信息:
"暂无库存数据,请添加库存项"

## 高级功能

### 数据库直接操作

在 Supabase SQL Editor 中可以执行高级操作:

#### 查询特定类别的库存

```sql
SELECT * FROM stock_items 
WHERE category = '原料' 
ORDER BY quantity DESC;
```

#### 查询低库存项(数量 < 10)

```sql
SELECT * FROM stock_items 
WHERE quantity < 10 
ORDER BY quantity ASC;
```

#### 批量更新数量

```sql
UPDATE stock_items 
SET quantity = quantity + 50 
WHERE name = '咖啡豆';
```

#### 清空所有数据

```sql
TRUNCATE TABLE stock_items RESTART IDENTITY;
```

## 故障排除

### 问题 1: 页面显示 "✗ 数据库连接失败"

**可能原因:**
- `.env.local` 配置错误
- Supabase 项目未启动
- 网络连接问题

**解决方案:**
1. 检查 `.env.local` 文件中的 URL 和 Key 是否正确
2. 访问 Supabase 仪表板确认项目正常运行
3. 检查网络连接

### 问题 2: 添加数据时报错 "permission denied"

**可能原因:**
- RLS 策略配置错误
- 表不存在

**解决方案:**
1. 重新执行数据库初始化 SQL
2. 确认 RLS 策略已创建:

```sql
-- 查看现有策略
SELECT * FROM pg_policies WHERE tablename = 'stock_items';
```

### 问题 3: 数据无法显示

**可能原因:**
- 表名错误
- 查询权限问题

**解决方案:**
1. 在 Supabase Table Editor 中确认表名为 `stock_items`
2. 检查浏览器控制台(F12)的错误信息
3. 尝试在 SQL Editor 中手动查询:

```sql
SELECT * FROM stock_items;
```

### 问题 4: 端口 3000 被占用

**解决方案:**

方法 1 - 杀死占用进程:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

方法 2 - 更改端口:
编辑 `vite.config.ts`:
```typescript
server: {
  port: 3001,  // 改为其他端口
  open: true
}
```

### 问题 5: npm install 失败

**解决方案:**

1. 清理缓存:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. 使用国内镜像:
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

### 问题 6: TypeScript 编译错误

**解决方案:**

1. 确保 TypeScript 正确安装:
```bash
npm install -D typescript
```

2. 重新生成类型:
```bash
npm run build
```

## 开发技巧

### 1. 查看实时日志

```bash
# 查看 Vite 日志
tail -f ~/.cursor/projects/Users-qing-GitHub-cafe-stock/terminals/1.txt
```

### 2. 清理构建缓存

```bash
rm -rf dist node_modules/.vite
npm run dev
```

### 3. 数据备份

在 Supabase 仪表板:
1. SQL Editor → New Query
2. 执行:

```sql
COPY (SELECT * FROM stock_items) TO STDOUT WITH CSV HEADER;
```

3. 复制输出保存为 CSV

### 4. 数据恢复

使用 Table Editor 的导入功能,或执行 SQL:

```sql
INSERT INTO stock_items (name, quantity, unit, category) VALUES
    ('物品1', 100, '个', '原料'),
    ('物品2', 50, '袋', '包材');
```

## 快捷键

| 操作 | 快捷键 |
|------|--------|
| 刷新页面 | Cmd/Ctrl + R |
| 打开开发者工具 | F12 或 Cmd/Ctrl + Shift + I |
| 聚焦到表单第一个字段 | Tab |
| 提交表单 | Enter(在输入框中) |

## 下一步

完成基本操作后,可以考虑:

1. 📊 添加数据可视化(图表统计)
2. 🔐 实现用户认证系统
3. 📱 优化移动端体验
4. 🔔 添加低库存预警功能
5. 📤 实现数据导出功能

详见 [README.md](README.md) 的后续开发计划。

---

**需要帮助?**
- 查看 [README.md](README.md)
- 查看 [SETUP.md](SETUP.md)
- 访问 [Supabase 文档](https://supabase.com/docs)
