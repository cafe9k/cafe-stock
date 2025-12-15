#!/bin/bash

# cafe-stock 启动脚本
# 使用方法: ./start.sh 或 bash start.sh

echo "🚀 cafe-stock 启动脚本"
echo "========================================"

# 1. 检查并清理旧进程
echo ""
echo "🔍 检查运行中的进程..."
if ps aux | grep -q '[E]lectron.*cafe-stock'; then
  echo "  发现运行中的 Electron 进程，正在清理..."
  killall -9 Electron 2>/dev/null
  echo "  ✅ 已清理旧进程"
  sleep 1
else
  echo "  ✅ 无运行中的进程"
fi

# 2. 清理 Vite 端口
if lsof -i :5173 2>/dev/null | grep -q LISTEN; then
  echo ""
  echo "🔧 清理 5173 端口..."
  lsof -ti:5173 | xargs kill -9 2>/dev/null
  sleep 1
  echo "  ✅ 端口已清理"
fi

# 3. 启动应用
echo ""
echo "🚀 正在启动应用..."
cd "$(dirname "$0")"
npm run dev &

# 4. 等待启动
echo "  ⏳ 等待启动完成..."
sleep 6

# 5. 检查启动状态
echo ""
echo "📊 启动状态："
echo "========================================"

VITE_OK=false
ELECTRON_OK=false

if lsof -i :5173 2>/dev/null | grep -q LISTEN; then
  echo "✅ Vite 服务器: http://localhost:5173"
  VITE_OK=true
else
  echo "❌ Vite 服务器启动失败"
fi

if ps aux | grep -q '[E]lectron.*cafe-stock'; then
  echo "✅ Electron 应用已启动"
  ELECTRON_OK=true
else
  echo "⏳ Electron 应用启动中..."
fi

echo ""
if [ "$VITE_OK" = true ] && [ "$ELECTRON_OK" = true ]; then
  echo "🎉 应用启动成功！"
else
  echo "⚠️  部分服务启动失败，请查看终端日志"
fi

echo ""
echo "💡 使用说明："
echo "  - 应用窗口应已自动打开"
echo "  - DevTools 已自动打开"
echo "  - 前端代码修改会自动刷新"
echo "  - Electron 代码修改会自动重启"
echo "  - 使用 Cmd+Q 退出应用"
echo ""

