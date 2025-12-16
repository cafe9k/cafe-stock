// analyze-announcements.cjs
// 用于分析公告标题并生成分类规则的脚本

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// 数据库路径
const dbPath = path.join(process.env.HOME, 'Library/Application Support/cafe-stock/cafe_stock.db');
const db = new Database(dbPath, { readonly: true });

console.log('📊 开始分析公告数据...\n');

// 1. 获取总数
const totalCount = db.prepare('SELECT COUNT(*) as count FROM announcements').get().count;
console.log(`数据库中共有 ${totalCount.toLocaleString()} 条公告\n`);

// 2. 采样 10000 条公告（随机采样）
const sampleSize = Math.min(10000, totalCount);
console.log(`正在采样 ${sampleSize} 条公告进行分析...\n`);

const samples = db.prepare(`
  SELECT title, ann_type 
  FROM announcements 
  WHERE title IS NOT NULL AND title != ''
  ORDER BY RANDOM() 
  LIMIT ?
`).all(sampleSize);

// 3. 关键词分析
console.log('🔍 关键词频率分析：\n');

// 定义候选关键词列表
const candidateKeywords = [
  // 财务类
  '年报', '半年报', '季报', '一季报', '三季报', '财务报告', '业绩快报', '业绩预告', 
  '盈利预告', '业绩', '财务', '审计', '会计',
  
  // 分红派息
  '分红', '派息', '送股', '转增', '利润分配', '股利', '现金分红', '权益分派',
  
  // 重大事项
  '重大事项', '重大资产重组', '收购', '兼并', '资产出售', '重大合同', '重组',
  '并购', '重大资产', '资产重组',
  
  // 股权变动
  '股权变动', '增持', '减持', '股份回购', '限售股', '解禁', '股东', '持股',
  '回购', '股份', '权益变动',
  
  // 公司治理
  '董事会', '监事会', '股东大会', '高管', '独立董事', '章程', '修订',
  '决议', '会议', '选举', '任命', '辞职',
  
  // 经营情况
  '经营情况', '生产经营', '项目', '中标', '合同', '签订', '协议',
  '投资', '建设', '进展', '完成',
  
  // 风险提示
  '风险提示', '异常波动', 'ST', '*ST', '退市', '警示', '风险',
  '停牌', '复牌', '核查', '问询',
  
  // 交易相关
  '关联交易', '购买资产', '出售资产', '交易', '买卖', '出售', '购买',
  
  // 诉讼仲裁
  '诉讼', '仲裁', '纠纷', '起诉', '被诉', '判决', '法律',
  
  // 对外投资
  '对外投资', '投资设立', '参股', '合资', '设立', '子公司',
  
  // 其他常见
  '公告', '更正', '补充', '取消', '终止', '延期', '变更',
  '披露', '提示性', '澄清', '说明', '回复', '问询函'
];

// 统计每个关键词出现的次数
const keywordStats = {};
candidateKeywords.forEach(keyword => {
  const count = samples.filter(s => s.title.includes(keyword)).length;
  if (count > 0) {
    keywordStats[keyword] = {
      count,
      percentage: ((count / sampleSize) * 100).toFixed(2)
    };
  }
});

// 按出现次数排序
const sortedKeywords = Object.entries(keywordStats)
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 50); // 显示前50个

console.log('Top 50 关键词（按出现频率排序）：');
console.log('关键词\t\t出现次数\t覆盖率');
console.log('─'.repeat(50));
sortedKeywords.forEach(([keyword, stats]) => {
  console.log(`${keyword.padEnd(12)}\t${stats.count}\t\t${stats.percentage}%`);
});

// 4. 分析 ann_type 字段
console.log('\n\n📋 公告类型（ann_type）分布：\n');
const annTypeStats = db.prepare(`
  SELECT ann_type, COUNT(*) as count 
  FROM announcements 
  WHERE ann_type IS NOT NULL AND ann_type != ''
  GROUP BY ann_type 
  ORDER BY count DESC 
  LIMIT 30
`).all();

console.log('类型\t\t\t\t数量');
console.log('─'.repeat(60));
annTypeStats.forEach(row => {
  console.log(`${(row.ann_type || '未知').padEnd(30)}\t${row.count.toLocaleString()}`);
});

// 5. 标题长度分析
console.log('\n\n📏 公告标题长度分析：\n');
const titleLengths = samples.map(s => s.title.length);
const avgLength = (titleLengths.reduce((a, b) => a + b, 0) / titleLengths.length).toFixed(2);
const maxLength = Math.max(...titleLengths);
const minLength = Math.min(...titleLengths);

console.log(`平均长度: ${avgLength} 字符`);
console.log(`最长: ${maxLength} 字符`);
console.log(`最短: ${minLength} 字符`);

// 6. 提取常见标题模式
console.log('\n\n🔤 常见标题开头模式（前20个）：\n');
const titlePrefixes = {};
samples.forEach(s => {
  // 提取标题前10个字符作为前缀
  const prefix = s.title.substring(0, Math.min(10, s.title.length));
  titlePrefixes[prefix] = (titlePrefixes[prefix] || 0) + 1;
});

const sortedPrefixes = Object.entries(titlePrefixes)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

console.log('前缀\t\t\t出现次数');
console.log('─'.repeat(50));
sortedPrefixes.forEach(([prefix, count]) => {
  console.log(`${prefix.padEnd(20)}\t${count}`);
});

// 7. 生成建议的分类规则
console.log('\n\n💡 基于分析的分类规则建议：\n');

// 根据关键词频率自动生成分类建议
const categoryMapping = {
  '财务报告': ['年报', '半年报', '季报', '财务报告', '业绩快报', '业绩预告', '审计'],
  '分红派息': ['分红', '派息', '送股', '转增', '利润分配', '股利', '权益分派'],
  '重大事项': ['重大事项', '重大资产重组', '收购', '兼并', '重组', '并购'],
  '股权变动': ['股权变动', '增持', '减持', '股份回购', '解禁', '权益变动'],
  '公司治理': ['董事会', '监事会', '股东大会', '高管', '独立董事', '章程', '决议', '任命', '辞职'],
  '经营情况': ['经营情况', '生产经营', '项目', '中标', '合同', '签订', '协议', '建设'],
  '风险提示': ['风险提示', '异常波动', 'ST', '退市', '警示', '停牌', '核查', '问询'],
  '交易公告': ['关联交易', '购买资产', '出售资产', '交易'],
  '诉讼仲裁': ['诉讼', '仲裁', '纠纷', '起诉', '判决'],
  '对外投资': ['对外投资', '投资设立', '参股', '合资', '子公司']
};

// 计算每个分类的覆盖率
Object.entries(categoryMapping).forEach(([category, keywords]) => {
  const covered = samples.filter(s => 
    keywords.some(kw => s.title.includes(kw))
  ).length;
  const coverage = ((covered / sampleSize) * 100).toFixed(2);
  console.log(`${category.padEnd(12)}: ${coverage}% (${covered}/${sampleSize})`);
});

// 8. 找出未被覆盖的公告示例
console.log('\n\n❓ 未被现有规则覆盖的公告示例（前20条）：\n');
const allKeywords = Object.values(categoryMapping).flat();
const uncovered = samples.filter(s => 
  !allKeywords.some(kw => s.title.includes(kw))
).slice(0, 20);

uncovered.forEach((s, i) => {
  console.log(`${i + 1}. ${s.title}`);
});

// 9. 计算总体覆盖率
const totalCovered = samples.filter(s => 
  allKeywords.some(kw => s.title.includes(kw))
).length;
const totalCoverage = ((totalCovered / sampleSize) * 100).toFixed(2);

console.log(`\n\n✅ 总体覆盖率: ${totalCoverage}% (${totalCovered}/${sampleSize})`);
console.log(`❌ 未覆盖: ${100 - parseFloat(totalCoverage)}% (${sampleSize - totalCovered}/${sampleSize})`);

// 10. 导出详细分析结果到文件
const reportPath = path.join(__dirname, 'announcement-analysis-report.json');
const report = {
  timestamp: new Date().toISOString(),
  totalCount,
  sampleSize,
  keywordStats: sortedKeywords,
  annTypeStats,
  titleLengthStats: { avgLength, maxLength, minLength },
  categoryMapping,
  coverage: {
    total: totalCoverage,
    byCategory: Object.fromEntries(
      Object.entries(categoryMapping).map(([category, keywords]) => {
        const covered = samples.filter(s => 
          keywords.some(kw => s.title.includes(kw))
        ).length;
        return [category, ((covered / sampleSize) * 100).toFixed(2)];
      })
    )
  },
  uncoveredSamples: uncovered.map(s => s.title)
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📄 详细报告已保存至: ${reportPath}`);

db.close();
console.log('\n✨ 分析完成！');

