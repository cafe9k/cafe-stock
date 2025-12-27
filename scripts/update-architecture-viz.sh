#!/bin/bash

# 更新架构可视化数据脚本
# 用途：重新生成 Cytoscape.js 可视化数据

set -e  # 遇到错误立即退出

echo ""
echo "=================================================="
echo "🔄 更新架构可视化数据"
echo "=================================================="
echo ""

# 切换到项目根目录
cd "$(dirname "$0")/.."

# 1. 生成 Cytoscape 数据
echo "📊 步骤 1/3: 生成依赖关系图数据..."
node scripts/generate-cytoscape-data.cjs

if [ $? -eq 0 ]; then
  echo "✅ 数据生成成功"
else
  echo "❌ 数据生成失败"
  exit 1
fi

echo ""

# 2. 显示统计信息
echo "📈 步骤 2/3: 统计数据..."
TOTAL_NODES=$(grep -o '"id":' src/assets/cytoscape-data.json | wc -l | xargs)
HIERARCHY_EDGES=$(grep -c '"type": "hierarchy"' src/assets/cytoscape-data.json || echo "0")
DEPENDENCY_EDGES=$(grep -c '"type": "dependency"' src/assets/cytoscape-data.json || echo "0")
TOTAL_EDGES=$((HIERARCHY_EDGES + DEPENDENCY_EDGES))

echo "  节点总数: $TOTAL_NODES"
echo "  边总数: $TOTAL_EDGES"
echo "    - 层级关系边: $HIERARCHY_EDGES"
echo "    - 依赖关系边: $DEPENDENCY_EDGES"

echo ""

# 3. 检查应用是否在运行
echo "🔍 步骤 3/3: 检查应用状态..."
if lsof -i :5173 2>/dev/null | grep -q LISTEN; then
  echo "✅ 应用正在运行，页面将自动刷新"
  echo ""
  echo "💡 提示: 访问 http://localhost:5173 查看架构可视化页面"
else
  echo "ℹ️  应用未运行"
  echo ""
  echo "💡 提示: 运行以下命令启动应用："
  echo "   npm run dev"
fi

echo ""
echo "=================================================="
echo "✨ 架构可视化数据更新完成！"
echo "=================================================="
echo ""

