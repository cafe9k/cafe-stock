#!/bin/bash

# 验证优化配置脚本

echo "🔍 验证优化配置..."
echo ""

PASS=0
FAIL=0

# 检查文件
echo "1. 检查必需文件"
for file in "package.json" "vite.config.ts" ".electronignore" "scripts/analyze-bundle.cjs" "scripts/optimize-build.sh" "docs/package-optimization.md"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
    ((PASS++))
  else
    echo "  ✗ $file (不存在)"
    ((FAIL++))
  fi
done

echo ""
echo "2. 检查 package.json 配置"
if grep -q '"compression": "maximum"' package.json; then
  echo "  ✓ 启用最大压缩"
  ((PASS++))
else
  echo "  ✗ 未启用最大压缩"
  ((FAIL++))
fi

if grep -q '"build:optimized"' package.json; then
  echo "  ✓ 优化构建命令存在"
  ((PASS++))
else
  echo "  ✗ 优化构建命令不存在"
  ((FAIL++))
fi

if grep -q '"analyze"' package.json; then
  echo "  ✓ 分析命令存在"
  ((PASS++))
else
  echo "  ✗ 分析命令不存在"
  ((FAIL++))
fi

echo ""
echo "3. 检查 vite.config.ts 配置"
if grep -q 'minify' vite.config.ts; then
  echo "  ✓ 配置了代码压缩"
  ((PASS++))
else
  echo "  ✗ 未配置代码压缩"
  ((FAIL++))
fi

if grep -q 'sourcemap.*false' vite.config.ts; then
  echo "  ✓ 禁用 source map"
  ((PASS++))
else
  echo "  ✗ 未禁用 source map"
  ((FAIL++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "通过: $PASS | 失败: $FAIL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAIL -eq 0 ]; then
  echo ""
  echo "✅ 所有优化配置验证通过！"
  echo ""
  echo "可以开始优化构建："
  echo "  npm run build:optimized"
  echo ""
  exit 0
else
  echo ""
  echo "❌ 发现 $FAIL 个配置问题"
  echo ""
  exit 1
fi
