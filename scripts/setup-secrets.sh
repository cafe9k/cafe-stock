#!/bin/bash

# Supabase Secrets 配置脚本
# 用于配置边缘函数所需的环境变量

set -e

echo "🔐 配置 Supabase Edge Function Secrets"
echo ""

# 检查是否安装了 Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ 错误: 未找到 Supabase CLI"
    echo ""
    echo "请先安装 Supabase CLI:"
    echo ""
    echo "macOS:"
    echo "  brew install supabase/tap/supabase"
    echo ""
    echo "Windows (Scoop):"
    echo "  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git"
    echo "  scoop install supabase"
    echo ""
    echo "Linux:"
    echo "  brew install supabase/tap/supabase"
    echo ""
    echo "或使用 npm:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI 已安装"
echo ""

# 检查是否已登录
if ! supabase projects list &> /dev/null; then
    echo "❌ 错误: 未登录 Supabase"
    echo ""
    echo "请先登录:"
    echo "  supabase login"
    echo ""
    exit 1
fi

echo "✅ 已登录 Supabase"
echo ""

# Tushare Token
TUSHARE_TOKEN="834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d"

echo "📝 配置 TUSHARE_TOKEN..."
if supabase secrets set TUSHARE_TOKEN="$TUSHARE_TOKEN"; then
    echo "✅ TUSHARE_TOKEN 配置成功"
else
    echo "❌ TUSHARE_TOKEN 配置失败"
    exit 1
fi

echo ""
echo "🔍 验证配置..."
if supabase secrets list | grep -q "TUSHARE_TOKEN"; then
    echo "✅ TUSHARE_TOKEN 已存在于 Secrets 中"
else
    echo "⚠️  警告: 无法验证 TUSHARE_TOKEN"
fi

echo ""
echo "✅ 所有 Secrets 配置完成!"
echo ""
echo "📋 已配置的 Secrets:"
supabase secrets list

echo ""
echo "🚀 下一步:"
echo "  1. 部署边缘函数: ./scripts/deploy-edge-function.sh"
echo "  2. 或手动部署: supabase functions deploy tushare-proxy"
echo ""
echo "🎉 完成!"

