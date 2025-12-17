# 🚀 安装包优化快速参考

## 当前状态
- **优化前**: 101MB
- **优化目标**: 75-80MB (↓ 20-25%)

## 快速命令

```bash
# 优化构建（推荐用于发布）
npm run build:optimized

# 分析构建产物
npm run analyze

# 普通构建
npm run build
```

## 已实施优化 ✅

| 优化项 | 位置 | 效果 |
|--------|------|------|
| 最大压缩 | `package.json` | ↓ 15-25% |
| 代码分割 | `vite.config.ts` | ↓ 10-15% |
| 文件排除 | `.electronignore` | ↓ 5-10% |
| 移除 source map | 构建脚本 | ↓ 2-5% |

## 可选优化 💡

### 1️⃣ 启用 Terser（更好压缩，但构建更慢）

编辑 `vite.config.ts`:
```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
}
```
**效果**: ↓ 3-5% | **代价**: 构建时间 ↑ 30-50%

### 2️⃣ 懒加载路由

编辑 `src/App.tsx`:
```typescript
const Announcements = lazy(() => import('./pages/Announcements'));
```
**效果**: 初始加载 ↓ 20-30%

### 3️⃣ 优化图标
```bash
sips -Z 512 build/icon.icns
```
**效果**: ↓ 1-3%

## 验证优化效果

```bash
# 查看 DMG 大小
ls -lh release/*.dmg

# 分析构建产物
npm run analyze

# 检查 asar 包
npx asar list "release/mac-arm64/酷咖啡.app/Contents/Resources/app.asar" | head -20
```

## 详细文档

- 📖 [优化总结](docs/optimization-summary.md)
- 📖 [构建优化指南](docs/build-optimization-guide.md)
- 📖 [详细优化措施](docs/optimization.md)

## 构建流程建议

1. **开发**: `npm run dev`
2. **测试**: `npm run build:dir`
3. **发布**: `npm run build:optimized`
4. **验证**: `npm run analyze`

