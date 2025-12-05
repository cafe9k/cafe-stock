#!/bin/bash

# Supabase Edge Function 部署脚本
# 用于快速部署 tushare-proxy 边缘函数

set -e

echo "🚀 开始部署 Supabase Edge Function..."
echo ""

# 检查是否安装了 Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ 错误: 未找到 Supabase CLI"
    echo "请先安装 Supabase CLI:"
    echo "  macOS: brew install supabase/tap/supabase"
    echo "  其他: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI 已安装"
echo ""

# 检查是否已登录
if ! supabase projects list &> /dev/null; then
    echo "❌ 错误: 未登录 Supabase"
    echo "请先登录: supabase login"
    exit 1
fi

echo "✅ 已登录 Supabase"
echo ""

# 检查是否已关联项目
if [ ! -f ".git/config" ] || ! grep -q "supabase" .git/config 2>/dev/null; then
    echo "⚠️  警告: 项目可能未关联到 Supabase"
    echo "如果部署失败，请运行: supabase link --project-ref your-project-ref"
    echo ""
fi

# 检查环境变量是否已设置
echo "📝 检查环境变量..."
if supabase secrets list | grep -q "TUSHARE_TOKEN"; then
    echo "✅ TUSHARE_TOKEN 已配置"
else
    echo "⚠️  警告: TUSHARE_TOKEN 未配置"
    echo "请运行: supabase secrets set TUSHARE_TOKEN=your_token_here"
    echo ""
    read -p "是否继续部署? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔨 开始部署 tushare-proxy 函数..."
supabase functions deploy tushare-proxy

echo ""
echo "✅ 部署成功!"
echo ""
echo "📋 函数信息:"
echo "  名称: tushare-proxy"
echo "  URL: https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy"
echo ""
echo "🧪 测试命令:"
echo '  curl -X POST https://fmbqlwagajrrktcycnxu.supabase.co/functions/v1/tushare-proxy \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '"'"'{"api_name": "stock_basic", "params": {"list_status": "L"}}'"'"
echo ""
echo "📊 查看日志:"
echo "  supabase functions logs tushare-proxy"
echo ""
echo "🎉 完成!"

