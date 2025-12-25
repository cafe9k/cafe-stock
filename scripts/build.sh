#!/bin/bash

# 设置错误时退出
set -e

# 生成构建日期时间（格式：YYYYMMDD-HHmm）
export BUILD_DATE=$(date +"%Y%m%d-%H%M")

echo "构建日期时间: $BUILD_DATE"

# 执行编译和构建
tsc && tsc -p electron/tsconfig.json --noEmit && vite build && electron-builder --mac --publish never




