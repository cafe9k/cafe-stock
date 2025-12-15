# run

启动 cafe-stock 开发环境

## 一键启动（推荐）

清理旧进程并启动（兼容进程不存在的情况）：

```bash
(killall -9 Electron 2>/dev/null || true); (lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null || true); sleep 1; cd /Users/ctrip/Desktop/cafe-stock && npm run dev
```

**说明**：

-   使用 `|| true` 确保即使进程不存在也不会中断命令执行
-   括号分组确保错误处理正确
-   清理 Electron 进程和 5173 端口后启动开发服务器

## 使用启动脚本（更推荐）

项目提供了更完善的启动脚本：

```bash
cd /Users/ctrip/Desktop/cafe-stock && bash start.sh
```

**优势**：

-   智能检查进程是否存在
-   提供启动状态反馈
-   更完善的错误处理

## 快速启动

仅在应用未运行时使用（不清理旧进程）：

```bash
cd /Users/ctrip/Desktop/cafe-stock && npm run dev
```

## 停止应用

强制停止所有 Electron 进程：

```bash
killall -9 Electron 2>/dev/null || echo "没有运行中的 Electron 进程"
```

或者只停止 cafe-stock 相关进程：

```bash
pkill -f "cafe-stock|vite.*5173" 2>/dev/null || echo "没有运行中的进程"
```
