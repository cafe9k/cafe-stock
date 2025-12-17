#!/usr/bin/env node

/**
 * 构建产物分析脚本
 * 分析 dist 和 dist-electron 目录的文件大小
 */

const fs = require('fs');
const path = require('path');

/**
 * 格式化文件大小
 */
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

/**
 * 递归获取目录中所有文件
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push({
        path: filePath,
        size: stat.size,
        ext: path.extname(file),
      });
    }
  });

  return arrayOfFiles;
}

/**
 * 分析目录
 */
function analyzeDirectory(dirPath, dirName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 ${dirName} 目录分析`);
  console.log('='.repeat(60));

  const files = getAllFiles(dirPath);
  
  if (files.length === 0) {
    console.log('目录为空或不存在');
    return;
  }

  // 按大小排序
  files.sort((a, b) => b.size - a.size);

  // 计算总大小
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  // 按扩展名分组
  const byExtension = {};
  files.forEach((file) => {
    const ext = file.ext || 'no-ext';
    if (!byExtension[ext]) {
      byExtension[ext] = { count: 0, size: 0, files: [] };
    }
    byExtension[ext].count++;
    byExtension[ext].size += file.size;
    byExtension[ext].files.push(file);
  });

  console.log(`\n📊 总体统计:`);
  console.log(`  文件总数: ${files.length}`);
  console.log(`  总大小: ${formatSize(totalSize)}`);

  console.log(`\n📁 按文件类型统计:`);
  Object.entries(byExtension)
    .sort((a, b) => b[1].size - a[1].size)
    .forEach(([ext, data]) => {
      const percentage = ((data.size / totalSize) * 100).toFixed(1);
      console.log(`  ${ext.padEnd(10)} ${formatSize(data.size).padEnd(12)} (${percentage}%) - ${data.count} 个文件`);
    });

  console.log(`\n📄 最大的 10 个文件:`);
  files.slice(0, 10).forEach((file, index) => {
    const relativePath = path.relative(process.cwd(), file.path);
    const percentage = ((file.size / totalSize) * 100).toFixed(1);
    console.log(`  ${(index + 1).toString().padStart(2)}. ${formatSize(file.size).padEnd(12)} (${percentage}%) - ${relativePath}`);
  });
}

/**
 * 主函数
 */
function main() {
  console.log('\n🔍 开始分析构建产物...\n');

  const distPath = path.join(process.cwd(), 'dist');
  const distElectronPath = path.join(process.cwd(), 'dist-electron');

  analyzeDirectory(distPath, 'dist (渲染进程)');
  analyzeDirectory(distElectronPath, 'dist-electron (主进程)');

  console.log('\n' + '='.repeat(60));
  console.log('✅ 分析完成');
  console.log('='.repeat(60) + '\n');

  // 提供优化建议
  console.log('💡 优化建议:');
  console.log('  1. 检查是否有未使用的大型依赖');
  console.log('  2. 考虑使用代码分割减少初始加载大小');
  console.log('  3. 压缩图片和其他静态资源');
  console.log('  4. 移除 source map 文件（生产环境）');
  console.log('  5. 使用 tree-shaking 移除未使用的代码\n');
}

main();

