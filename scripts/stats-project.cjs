const fs = require('fs');
const path = require('path');

// 需要排除的目录
const EXCLUDE_DIRS = [
  'node_modules',
  'dist',
  'dist-electron',
  'release',
  '.git',
  '.vscode',
  '.idea',
  'build/icon.icns.md' // 这是一个文件，但也要排除
];

// 需要排除的文件扩展名
const EXCLUDE_EXTENSIONS = [
  '.md', // 排除 markdown 文件（除了 README）
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.icns',
  '.plist',
  '.lock',
  '.map',
  '.log'
];

// 统计结果
const stats = {
  totalFolders: 0,
  folders: []
};

/**
 * 检查路径是否应该被排除
 */
function shouldExclude(filePath, isDir = false) {
  const relativePath = path.relative(process.cwd(), filePath);
  const parts = relativePath.split(path.sep);
  
  // 检查是否在排除目录中
  for (const excludeDir of EXCLUDE_DIRS) {
    if (parts.includes(excludeDir)) {
      return true;
    }
  }
  
  // 如果是文件，检查扩展名
  if (!isDir) {
    const ext = path.extname(filePath);
    const basename = path.basename(filePath);
    
    // 排除特定扩展名（但保留 README.md）
    if (EXCLUDE_EXTENSIONS.includes(ext) && basename !== 'README.md') {
      return true;
    }
  }
  
  return false;
}

/**
 * 统计文件行数
 */
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

/**
 * 递归遍历目录
 */
function traverseDirectory(dirPath, folderStats) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (shouldExclude(fullPath, true)) {
        continue;
      }
      
      // 创建子文件夹统计
      const subFolderStats = {
        path: path.relative(process.cwd(), fullPath),
        fileCount: 0,
        totalLines: 0,
        files: []
      };
      
      // 递归遍历子目录
      traverseDirectory(fullPath, subFolderStats);
      
      // 如果有文件或子文件夹，添加到统计中
      if (subFolderStats.fileCount > 0 || subFolderStats.files.length > 0) {
        folderStats.files.push({
          name: item,
          type: 'folder',
          stats: subFolderStats
        });
        stats.totalFolders++;
      }
    } else if (stat.isFile()) {
      if (shouldExclude(fullPath, false)) {
        continue;
      }
      
      const lines = countLines(fullPath);
      folderStats.fileCount++;
      folderStats.totalLines += lines;
      folderStats.files.push({
        name: item,
        type: 'file',
        lines: lines,
        path: path.relative(process.cwd(), fullPath)
      });
    }
  }
}

/**
 * 格式化输出
 */
function formatOutput(folderStats, indent = 0) {
  const prefix = '  '.repeat(indent);
  let output = '';
  
  // 输出文件夹信息
  if (indent === 0) {
    output += `${prefix}📁 ${folderStats.path || '根目录'}\n`;
  } else {
    output += `${prefix}📁 ${path.basename(folderStats.path)}\n`;
  }
  
  output += `${prefix}   文件数: ${folderStats.fileCount}\n`;
  output += `${prefix}   总行数: ${folderStats.totalLines}\n`;
  
  if (folderStats.files.length > 0) {
    output += `${prefix}   文件列表:\n`;
    for (const file of folderStats.files) {
      if (file.type === 'file') {
        output += `${prefix}   📄 ${file.name} (${file.lines} 行)\n`;
      } else if (file.type === 'folder') {
        output += formatOutput(file.stats, indent + 1);
      }
    }
  }
  
  return output;
}

/**
 * 生成汇总统计
 */
function generateSummary(folderStats) {
  const summary = {
    totalFiles: 0,
    totalLines: 0,
    totalFolders: stats.totalFolders
  };
  
  function countRecursive(folder) {
    for (const item of folder.files) {
      if (item.type === 'file') {
        summary.totalFiles++;
        summary.totalLines += item.lines;
      } else if (item.type === 'folder') {
        countRecursive(item.stats);
      }
    }
  }
  
  countRecursive(folderStats);
  return summary;
}

// 主函数
function main() {
  const rootPath = process.cwd();
  const rootStats = {
    path: rootPath,
    fileCount: 0,
    totalLines: 0,
    files: []
  };
  
  console.log('开始统计项目文件...\n');
  
  traverseDirectory(rootPath, rootStats);
  
  const summary = generateSummary(rootStats);
  
  console.log('='.repeat(60));
  console.log('项目统计汇总');
  console.log('='.repeat(60));
  console.log(`总文件夹数: ${summary.totalFolders}`);
  console.log(`总文件数: ${summary.totalFiles}`);
  console.log(`总代码行数: ${summary.totalLines}`);
  console.log('='.repeat(60));
  console.log('\n详细统计:\n');
  console.log(formatOutput(rootStats));
  
  // 保存到文件
  const outputFile = path.join(rootPath, 'project-stats.txt');
  const output = `项目统计报告\n生成时间: ${new Date().toLocaleString('zh-CN')}\n\n` +
    `总文件夹数: ${summary.totalFolders}\n` +
    `总文件数: ${summary.totalFiles}\n` +
    `总代码行数: ${summary.totalLines}\n\n` +
    `详细统计:\n${formatOutput(rootStats)}`;
  
  fs.writeFileSync(outputFile, output, 'utf-8');
  console.log(`\n统计结果已保存到: ${outputFile}`);
}

main();

