# macOS 应用图标说明

本文件为占位符。要创建真实的 macOS 应用图标 (icon.icns)，请按照以下步骤操作：

## 方法 1: 使用在线工具

1. 访问 https://cloudconvert.com/png-to-icns
2. 上传一张 1024x1024 的 PNG 图片
3. 转换为 .icns 格式
4. 下载并替换此文件

## 方法 2: 使用 iconutil (macOS 自带工具)

```bash
# 1. 创建图标集目录
mkdir icon.iconset

# 2. 准备不同尺寸的图标
# 需要以下尺寸：
# - icon_16x16.png
# - icon_16x16@2x.png (32x32)
# - icon_32x32.png
# - icon_32x32@2x.png (64x64)
# - icon_128x128.png
# - icon_128x128@2x.png (256x256)
# - icon_256x256.png
# - icon_256x256@2x.png (512x512)
# - icon_512x512.png
# - icon_512x512@2x.png (1024x1024)

# 3. 生成 .icns 文件
iconutil -c icns icon.iconset -o icon.icns

# 4. 移动到 build 目录
mv icon.icns build/
```

## 临时方案

当前项目使用占位图标，应用可以正常运行，但会显示默认的 Electron 图标。
