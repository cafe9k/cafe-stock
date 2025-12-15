# run

启动 cafe-stock 开发环境

## 一键启动（推荐）

清理旧进程并启动：

```bash
killall -9 Electron 2>/dev/null; lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null; sleep 1; cd /Users/ctrip/Desktop/cafe-stock && npm run dev
```

## 快速启动

仅在应用未运行时使用：

```bash
cd /Users/ctrip/Desktop/cafe-stock && npm run dev
```

## 停止应用

强制停止：

```bash
killall -9 Electron
```
