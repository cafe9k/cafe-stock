# 🚀 从这里开始

欢迎使用**咖啡店库存管理系统**!

## 👋 你现在在哪里?

你的项目已经**完全创建好**了!
- ✅ 所有代码已编写
- ✅ 依赖已安装
- ✅ 开发服务器正在运行
- ✅ 文档已准备好

现在你只需要**3个步骤**就能开始使用!

## 🎯 三步快速开始

### 第一步: 打开浏览器

在浏览器中访问:
```
http://localhost:3000
```

你会看到一个漂亮的紫色渐变页面,但可能显示"数据库连接失败"。
这是正常的,因为你还没有配置 Supabase!

### 第二步: 配置 Supabase (5分钟)

1. **注册 Supabase**
   - 打开新标签页访问: https://supabase.com
   - 点击 "Start your project"
   - 使用 GitHub 或 Google 账号登录

2. **创建项目**
   - 点击 "New Project"
   - 项目名称: `cafe-stock` (或任意名称)
   - 数据库密码: 设置一个强密码(记住它)
   - 区域: 选择离你最近的
   - 等待约 2 分钟项目创建完成

3. **获取凭证**
   - 项目创建后,点击左侧 ⚙️ **Settings**
   - 选择 **API** 选项卡
   - 复制两个值:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: `eyJhbGci...` (很长的字符串)

4. **配置本地环境**
   - 在你的代码编辑器中打开 `.env.local` 文件
   - 替换为你刚才复制的值:
   ```env
   VITE_SUPABASE_URL=https://你的项目.supabase.co
   VITE_SUPABASE_ANON_KEY=你的长长的Key
   ```
   - 保存文件

### 第三步: 初始化数据库 (2分钟)

1. **打开 SQL Editor**
   - 回到 Supabase 仪表板
   - 左侧点击 🗄️ **SQL Editor**
   - 点击 **+ New query**

2. **运行初始化脚本**
   - 打开项目中的 `database/init.sql` 文件
   - 复制全部内容
   - 粘贴到 Supabase 的查询编辑器
   - 点击右下角 **Run** 按钮
   - 看到 "Success. No rows returned" 表示成功!

3. **验证数据**
   - 左侧点击 📊 **Table Editor**
   - 选择 `stock_items` 表
   - 应该能看到 10 条示例数据

## 🎉 完成!

刷新浏览器 http://localhost:3000

你应该看到:
- 🟢 绿色的 "✓ 数据库已连接"
- 📋 库存列表显示 10 条数据
- ➕ 可以添加新的库存项
- 🗑️ 可以删除库存项

## 📚 接下来做什么?

### 学习使用
阅读 [USAGE.md](USAGE.md) 了解所有功能

### 自定义数据
删除示例数据,添加你自己的库存

### 了解代码
查看 [README.md](README.md) 了解技术细节

### 部署上线
准备好后,阅读部署章节

## ❓ 遇到问题?

### 问题 1: 还是显示"连接失败"
- 检查 `.env.local` 是否保存
- URL 和 Key 是否正确(没有多余空格)
- 刷新浏览器

### 问题 2: 没有数据显示
- 确认数据库脚本执行成功
- 在 Supabase Table Editor 检查是否有数据
- 按 F12 查看浏览器控制台错误

### 问题 3: 无法添加数据
- 确认 RLS 策略已创建
- 重新运行 `database/init.sql`

### 更多帮助
查看 [CHECKLIST.md](CHECKLIST.md) 完整配置清单

## 🎓 推荐阅读顺序

1. **START-HERE.md** ← 你在这里
2. [QUICK-START.md](QUICK-START.md) - 快速参考卡片
3. [USAGE.md](USAGE.md) - 详细使用教程
4. [README.md](README.md) - 完整项目文档

## 💡 小贴士

### 开发服务器
- 当前正在运行在 http://localhost:3000
- 会自动重新加载你的更改
- 使用 Ctrl+C 停止服务器

### 常用命令
```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
```

### 重要文件
- `.env.local` - 你的 Supabase 配置 ⚠️ 不要提交到 Git
- `src/App.tsx` - 主要应用代码
- `database/init.sql` - 数据库结构

## 🌟 项目特色

✨ **零配置启动** - 只需 Supabase 凭证
✨ **现代化设计** - 紫色渐变 + 流畅动画
✨ **完整功能** - 增删查改全都有
✨ **类型安全** - 完整 TypeScript 支持
✨ **详尽文档** - 5 份完整文档
✨ **生产就绪** - 可直接部署使用

## 📞 需要帮助?

1. 首先查看 [CHECKLIST.md](CHECKLIST.md) 配置清单
2. 阅读 [USAGE.md](USAGE.md) 故障排除章节
3. 检查浏览器控制台(F12)的错误信息
4. 查看 Supabase 仪表板的日志

---

**预计配置时间**: 5-10 分钟
**难度**: ⭐⭐☆☆☆ (简单)
**技术栈**: React + TypeScript + Supabase

准备好了吗? 开始第一步吧! 🚀
