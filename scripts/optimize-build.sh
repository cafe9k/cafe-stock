#!/bin/bash

# 优化构建脚本
# 在构建完成后进行额外的优化处理

set -e

echo "🚀 开始优化构建..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 清理构建目录
echo -e "${BLUE}📦 清理旧的构建产物...${NC}"
rm -rf dist dist-electron release

# 2. 执行构建
echo -e "${BLUE}🔨 开始构建应用...${NC}"
tsc && vite build && tsc -p electron/tsconfig.json

# 3. 移除 source map（如果存在）
echo -e "${BLUE}🗑️  移除 source map 文件...${NC}"
find dist -name "*.map" -type f -delete 2>/dev/null || true
find dist-electron -name "*.map" -type f -delete 2>/dev/null || true

# 4. 分析构建产物
echo -e "${BLUE}📊 分析构建产物...${NC}"
node scripts/analyze-bundle.cjs

# 5. 打包应用
echo -e "${BLUE}📦 打包 Electron 应用...${NC}"
BUILD_DATE=$(date +%Y%m%d-%H%M) electron-builder --mac

# 6. 显示最终大小
echo -e "${GREEN}✅ 构建完成！${NC}"
echo -e "${YELLOW}📦 安装包信息:${NC}"
ls -lh release/*.dmg 2>/dev/null || echo "未找到 DMG 文件"

echo ""
echo -e "${GREEN}🎉 优化构建完成！${NC}"

