# Electron App

This is a minimal Electron shell project with React and Vite.

## Development

### 启动说明 (Important)

**必须** 使用 `npm run dev` 启动项目。

-   该命令会并行启动 Vite 开发服务器和 Electron 应用。
-   **请勿** 单独运行 `npm run electron:dev`，否则会导致 `preload.js` 加载错误 (ES Module not supported)。

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
