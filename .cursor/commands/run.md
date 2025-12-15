# run

启动 cafe-stock 开发环境

清理旧进程并启动：

```bash
killall -9 Electron 2>/dev/null; lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null; sleep 1; cd /Users/ctrip/Desktop/cafe-stock && npm run dev
```
