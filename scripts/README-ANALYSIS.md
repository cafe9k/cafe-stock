# 公告分类分析脚本使用说明

本目录包含用于分析公告数据和验证分类规则的脚本。

## 📁 脚本文件

### 1. `analyze-announcements.cjs`
**用途**: 初始数据分析，生成分类规则建议

**运行**:
```bash
node analyze-announcements.cjs
```

**输出**:
- 控制台：关键词频率统计、分类覆盖率
- 文件：`announcement-analysis-report.json`

### 2. `validate-classification.cjs`
**用途**: 验证优化后的分类规则覆盖率

**运行**:
```bash
node validate-classification.cjs
```

**输出**:
- 控制台：各分类统计、总覆盖率
- 对比初始版本的提升

### 3. `analyze-uncovered.cjs`
**用途**: 分析未被覆盖的公告，寻找新的分类模式

**运行**:
```bash
node analyze-uncovered.cjs
```

**输出**:
- 控制台：未覆盖公告中的高频关键词
- 新分类建议

### 4. `final-validation.cjs`
**用途**: 最终验证完整分类规则

**运行**:
```bash
node final-validation.cjs
```

**输出**:
- 控制台：完整的分类统计和可视化
- 文件：`final-classification-report.json`
- 覆盖率提升对比

## 🔄 典型工作流程

### 首次分析
```bash
# 1. 初始分析
node analyze-announcements.cjs

# 2. 根据分析结果，更新 announcementClassifier.ts

# 3. 验证优化效果
node validate-classification.cjs

# 4. 分析未覆盖部分
node analyze-uncovered.cjs

# 5. 继续优化 announcementClassifier.ts

# 6. 最终验证
node final-validation.cjs
```

### 定期维护（建议每季度）
```bash
# 运行最终验证脚本
node final-validation.cjs

# 查看覆盖率是否下降
# 如果"其他"分类超过 10%，需要优化

# 分析未覆盖公告
node analyze-uncovered.cjs

# 根据结果更新关键词
```

## 📊 输出报告说明

### announcement-analysis-report.json
```json
{
  "timestamp": "分析时间",
  "totalCount": "数据库总公告数",
  "sampleSize": "采样数量",
  "keywordStats": "关键词统计",
  "categoryMapping": "分类规则映射",
  "coverage": "各分类覆盖率",
  "uncoveredSamples": "未覆盖样本"
}
```

### final-classification-report.json
```json
{
  "timestamp": "验证时间",
  "sampleSize": "采样数量",
  "totalCoverage": "总覆盖率",
  "categoryStats": "各分类统计",
  "uncoveredSamples": "未覆盖样本",
  "improvements": "覆盖率提升记录"
}
```

## ⚙️ 配置说明

### 修改采样数量
在脚本中找到：
```javascript
const sampleSize = 10000;
```
修改为所需的数量（建议 5000-20000）

### 修改数据库路径
如果数据库位置不同，修改：
```javascript
const dbPath = path.join(process.env.HOME, 'Library/Application Support/cafe-stock/cafe_stock.db');
```

## 🐛 故障排除

### 错误：数据库文件不存在
**解决**: 确保应用至少运行过一次，数据库已创建

### 错误：better-sqlite3 模块版本不匹配
**解决**: 
```bash
npm rebuild better-sqlite3
```

### 错误：内存不足
**解决**: 减少采样数量，如改为 5000

## 📈 性能优化

- **采样数量**: 10,000 条通常足够，更多不会显著提升准确性
- **运行时间**: 通常 5-10 秒
- **内存占用**: 约 100-200MB

## 🔍 分析技巧

### 查找高频未覆盖关键词
```bash
node analyze-uncovered.cjs | grep "关键词" | head -20
```

### 查看特定分类的覆盖情况
编辑脚本，添加过滤条件：
```javascript
const financialReports = samples.filter(s => 
  s.title.includes('年报') || s.title.includes('季报')
);
console.log(`财务报告相关: ${financialReports.length} 条`);
```

## 📝 维护建议

1. **定期运行**: 每季度运行一次 `final-validation.cjs`
2. **监控覆盖率**: 保持在 90% 以上
3. **关注新类型**: 留意"未覆盖样本"中的新模式
4. **更新关键词**: 根据监管政策和业务变化及时更新

## 🎯 目标指标

- **覆盖率**: ≥ 90%
- **"其他"分类占比**: ≤ 10%
- **分类数量**: 15-25 个（过多会导致混淆）

---

**最后更新**: 2025-12-16  
**当前覆盖率**: 94.02%  
**状态**: ✅ 优秀

