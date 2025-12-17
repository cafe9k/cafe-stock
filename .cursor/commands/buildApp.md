# buildApp

构建 cafe-stock DMG 安装包

## 完整构建流程（一键执行）

停止开发服务器 → 清理旧构建 → 执行构建：

```bash
(killall -9 Electron 2>/dev/null || true); \
(lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null || true); \
cd /Users/ctrip/Desktop/cafe-stock && \
rm -rf dist dist-electron && \
npm run build:optimized
```

## 构建输出

构建成功后，在 `release/` 目录下会生成：

-   **DMG 安装包**：`酷咖啡-1.0.0-arm64-YYYYMMDD-HHmm.dmg`
-   **DMG blockmap**：`酷咖啡-1.0.0-arm64-YYYYMMDD-HHmm.dmg.blockmap`
-   **应用包**：`mac-arm64/酷咖啡.app/`
-   **构建配置**：`builder-debug.yml`、`latest-mac.yml`
