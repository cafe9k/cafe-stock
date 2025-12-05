# ✅ 项目配置清单

## 📋 使用前必须完成的配置

### ✓ 已完成(由开发环境自动完成)

- [x] 安装 Node.js 和 npm
- [x] 创建项目结构
- [x] 安装所有依赖包
- [x] 配置 TypeScript
- [x] 配置 Vite 构建工具
- [x] 创建前端组件
- [x] 编写完整文档
- [x] 启动开发服务器

### ⚠️ 需要用户手动配置

- [ ] **创建 Supabase 账号**
  - 访问: https://supabase.com
  - 注册账号(免费)
  - 创建新项目

- [ ] **配置环境变量**
  - 编辑 `.env.local` 文件
  - 填入 Supabase URL
  - 填入 Supabase Anon Key

- [ ] **初始化数据库**
  - 打开 Supabase SQL Editor
  - 运行 `database/init.sql`
  - 验证表创建成功

## 🎯 快速检查(5分钟)

### 步骤 1: 检查服务器状态

```bash
# 如果服务器未运行,执行:
npm run dev
```

**预期结果**: 浏览器自动打开 http://localhost:3000

### 步骤 2: 访问 Supabase

1. 打开 https://supabase.com
2. 登录/注册账号
3. 创建新项目(如果还没有)
4. 等待项目初始化(约 2 分钟)

### 步骤 3: 获取 API 凭证

在 Supabase 仪表板:
1. 点击左侧 ⚙️ **Settings**
2. 选择 **API** 选项卡
3. 复制以下内容:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGci...很长的字符串...
```

### 步骤 4: 配置本地环境

编辑项目根目录的 `.env.local`:

```bash
# Mac/Linux
nano .env.local

# 或使用 VS Code
code .env.local
```

粘贴你的配置:

```env
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的Key
```

保存文件!

### 步骤 5: 初始化数据库

1. 回到 Supabase 仪表板
2. 左侧点击 🗄️ **SQL Editor**
3. 点击 **+ New query**
4. 打开 `database/init.sql` 复制全部内容
5. 粘贴到查询编辑器
6. 点击 **Run** 执行
7. 看到 "Success" 提示

### 步骤 6: 验证配置

1. 刷新浏览器 http://localhost:3000
2. 检查以下内容:

| 检查项 | 预期结果 | 状态 |
|--------|----------|------|
| 连接状态 | 🟢 "✓ 数据库已连接" | [ ] |
| 库存列表 | 显示 10 条示例数据 | [ ] |
| 添加功能 | 能成功添加新项 | [ ] |
| 删除功能 | 能成功删除项目 | [ ] |

## 🔍 故障排查清单

### 问题: 显示 "✗ 数据库连接失败"

检查以下内容:
- [ ] `.env.local` 文件是否存在
- [ ] URL 和 Key 是否正确复制(无空格)
- [ ] Supabase 项目是否正常运行
- [ ] 刷新页面重试

### 问题: 无法显示数据

检查以下内容:
- [ ] 数据库脚本是否执行成功
- [ ] 在 Supabase Table Editor 中能否看到 `stock_items` 表
- [ ] 表中是否有数据
- [ ] 浏览器控制台(F12)是否有错误

### 问题: 无法添加数据

检查以下内容:
- [ ] RLS 策略是否正确配置
- [ ] 在 SQL Editor 中手动插入测试:
  ```sql
  INSERT INTO stock_items (name, quantity, unit, category)
  VALUES ('测试', 1, '个', '其他');
  ```

## 📁 重要文件位置

| 文件 | 用途 | 是否需要编辑 |
|------|------|--------------|
| `.env.local` | 环境变量配置 | ✅ **必须** |
| `database/init.sql` | 数据库初始化 | ❌ 不需要 |
| `src/config/supabase.ts` | Supabase 配置 | ❌ 不需要 |
| `src/App.tsx` | 主应用代码 | ❌ 不需要 |

## 🎓 学习资源

如果你是第一次使用:

1. **Supabase**: 观看官方快速入门视频(10分钟)
   - https://supabase.com/docs/guides/getting-started

2. **React**: 了解基础概念(可选)
   - https://react.dev/learn

3. **本项目**: 阅读使用文档
   - [QUICK-START.md](QUICK-START.md) - 5分钟快速开始
   - [USAGE.md](USAGE.md) - 完整使用教程

## 🚀 配置完成后

一旦所有绿色复选框都打勾,你就可以:

1. ✅ 开始管理库存数据
2. ✅ 自定义界面和功能
3. ✅ 部署到生产环境
4. ✅ 邀请团队成员使用

## 📞 需要帮助?

### 快速问题
- 查看 [USAGE.md](USAGE.md) 的故障排除章节

### 详细教程
- 阅读 [SETUP.md](SETUP.md) 详细步骤

### Supabase 问题
- 访问 https://supabase.com/docs
- 或查看社区论坛

### 代码问题
- 检查浏览器控制台(F12)
- 查看 Supabase 日志

## ⏱️ 时间预估

| 任务 | 预计时间 |
|------|----------|
| 注册 Supabase | 2 分钟 |
| 创建项目 | 2 分钟 |
| 获取凭证 | 1 分钟 |
| 配置 .env | 1 分钟 |
| 运行 SQL 脚本 | 1 分钟 |
| 验证测试 | 2 分钟 |
| **总计** | **9 分钟** |

## 🎉 完成!

配置完成后,你将拥有一个功能完整的库存管理系统!

**下一步建议:**
1. 熟悉基本操作(添加、查看、删除)
2. 添加真实的库存数据
3. 根据需求定制功能
4. 考虑部署到生产环境

---

**最后更新**: 2025-12-05
**当前状态**: 🟢 开发服务器运行中
**端口**: 3000
**地址**: http://localhost:3000
