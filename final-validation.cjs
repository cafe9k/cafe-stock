// final-validation.cjs
// 最终验证完整分类规则的覆盖率

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.env.HOME, 'Library/Application Support/cafe-stock/cafe_stock.db');
const db = new Database(dbPath, { readonly: true });

console.log('🎯 最终验证完整分类规则...\n');

const sampleSize = 10000;
const samples = db.prepare(`
  SELECT title 
  FROM announcements 
  WHERE title IS NOT NULL AND title != ''
  ORDER BY RANDOM() 
  LIMIT ?
`).all(sampleSize);

console.log(`采样 ${sampleSize} 条公告进行最终验证\n`);

// 完整的分类规则
const AnnouncementCategory = {
	FINANCIAL_REPORT: '财务报告',
	DIVIDEND: '分红派息',
	MAJOR_EVENT: '重大事项',
	EQUITY_CHANGE: '股权变动',
	GOVERNANCE: '公司治理',
	BUSINESS_OPERATION: '经营情况',
	RISK_WARNING: '风险提示',
	TRANSACTION: '交易公告',
	LITIGATION: '诉讼仲裁',
	INVESTMENT: '对外投资',
	GUARANTEE: '担保事项',
	BOND: '债券相关',
	INTERNAL_CONTROL: '内部控制',
	QUALIFICATION: '资质认证',
	FUND: '基金相关',
	FUNDRAISING: '募集资金',
	EQUITY_INCENTIVE: '股权激励',
	INVESTOR_RELATIONS: '投资者关系',
	SUPERVISION: '持续督导',
	ESG_REPORT: 'ESG报告',
	SHARE_PLEDGE: '股份质押',
	OTHER: '其他'
};

const CLASSIFICATION_RULES = [
	{
		category: AnnouncementCategory.FINANCIAL_REPORT,
		keywords: [
			'年度报告', '年报', '半年度报告', '半年报', '季度报告', '季报', '一季报', '三季报',
			'财务报告', '财务报表', '业绩快报', '业绩预告', '盈利预告', '审计报告', '审计',
			'会计', '会计师事务所', '业绩说明会'
		],
		priority: 1
	},
	{
		category: AnnouncementCategory.DIVIDEND,
		keywords: [
			'分红', '派息', '现金分红', '送股', '转增', '利润分配', '股利分配', '权益分派', '除权除息'
		],
		priority: 2
	},
	{
		category: AnnouncementCategory.EQUITY_CHANGE,
		keywords: [
			'股权变动', '权益变动', '增持', '减持', '股份回购', '回购股份', '回购',
			'限售股', '解禁', '股权激励', '员工持股', '出售股份', '出售已回购'
		],
		priority: 3
	},
	{
		category: AnnouncementCategory.RISK_WARNING,
		keywords: [
			'风险提示', '风险警示', '异常波动', '股价异常', 'ST', '*ST', '退市风险', '退市',
			'停牌', '复牌', '核查', '问询', '问询函', '关注函', '回复', '回复函',
			'澄清', '澄清公告', '资产减值', '计提减值'
		],
		priority: 4
	},
	{
		category: AnnouncementCategory.GOVERNANCE,
		keywords: [
			'董事会', '董事会决议', '监事会', '监事会决议', '股东大会', '股东会', '临时股东大会',
			'独立董事', '董事', '高管', '总经理', '副总经理', '财务总监', '董事长', '监事',
			'任命', '选举', '辞职', '离职', '聘任', '章程', '章程修订',
			'会议通知', '会议决议', '会议', '提名', '候选人'
		],
		priority: 5
	},
	{
		category: AnnouncementCategory.GUARANTEE,
		keywords: ['担保', '提供担保', '反担保', '担保额度', '对外担保'],
		priority: 6
	},
	{
		category: AnnouncementCategory.TRANSACTION,
		keywords: [
			'关联交易', '日常关联交易', '购买资产', '出售资产', '资产转让', '股权转让', '交易', '买卖'
		],
		priority: 7
	},
	{
		category: AnnouncementCategory.MAJOR_EVENT,
		keywords: [
			'重大事项', '重大事件', '重大资产重组', '资产重组', '收购', '兼并', '并购', '重组', '整合', '重大合同'
		],
		priority: 8
	},
	{
		category: AnnouncementCategory.INVESTMENT,
		keywords: [
			'对外投资', '投资设立', '设立', '参股', '控股', '合资', '合作', '子公司', '全资子公司', '投资进展'
		],
		priority: 9
	},
	{
		category: AnnouncementCategory.BUSINESS_OPERATION,
		keywords: [
			'经营情况', '生产经营', '经营数据', '项目', '工程', '中标', '中标公告',
			'合同', '签订合同', '签署', '协议', '建设', '施工', '完成', '竣工',
			'授信', '综合授信', '银行授信'
		],
		priority: 10
	},
	{
		category: AnnouncementCategory.BOND,
		keywords: [
			'债券', '公司债', '可转债', '转债', '可转换债券', '付息', '兑付', '摘牌',
			'发行', '发行结果', '信用评级', '评级', '转股'
		],
		priority: 11
	},
	{
		category: AnnouncementCategory.INTERNAL_CONTROL,
		keywords: ['内部控制', '内控', '鉴证报告', '自我评价', '管理制度', '信息披露'],
		priority: 12
	},
	{
		category: AnnouncementCategory.QUALIFICATION,
		keywords: ['高新技术企业', '高新认定', '资质', '认证', '许可证', '证书', '专利', '知识产权'],
		priority: 13
	},
	{
		category: AnnouncementCategory.FUND,
		keywords: ['基金', '基金管理', '开放日常', '开放申购', '开放赎回', '基金份额', '基金净值', '估值调整'],
		priority: 14
	},
	{
		category: AnnouncementCategory.LITIGATION,
		keywords: ['诉讼', '起诉', '被诉', '仲裁', '纠纷', '法律纠纷', '判决', '裁决', '法律'],
		priority: 15
	},
	{
		category: AnnouncementCategory.FUNDRAISING,
		keywords: ['募集资金', '闲置募集资金', '现金管理', '理财产品', '补充流动资金', '募集资金管理'],
		priority: 16
	},
	{
		category: AnnouncementCategory.EQUITY_INCENTIVE,
		keywords: ['股权激励', '激励计划', '股票期权', '期权激励', '限制性股票', '激励对象', '授予', '行权', '解锁'],
		priority: 17
	},
	{
		category: AnnouncementCategory.INVESTOR_RELATIONS,
		keywords: ['投资者关系', '投资者关系活动', '投资者关系管理', '投资者接待', '路演'],
		priority: 18
	},
	{
		category: AnnouncementCategory.SUPERVISION,
		keywords: ['持续督导', '督导报告', '定期现场检查', '现场检查', '跟踪报告'],
		priority: 19
	},
	{
		category: AnnouncementCategory.ESG_REPORT,
		keywords: ['ESG', 'ESG报告', '社会责任', '社会责任报告', '可持续发展', '环境报告', '环境、社会及治理'],
		priority: 20
	},
	{
		category: AnnouncementCategory.SHARE_PLEDGE,
		keywords: ['质押', '股份质押', '解除质押', '股权质押', '再质押', '补充质押'],
		priority: 21
	}
];

function classifyAnnouncement(title) {
	if (!title) return AnnouncementCategory.OTHER;
	const sortedRules = [...CLASSIFICATION_RULES].sort((a, b) => a.priority - b.priority);
	for (const rule of sortedRules) {
		for (const keyword of rule.keywords) {
			if (title.includes(keyword)) {
				return rule.category;
			}
		}
	}
	return AnnouncementCategory.OTHER;
}

// 统计
const categoryStats = {};
Object.values(AnnouncementCategory).forEach(cat => {
	categoryStats[cat] = 0;
});

samples.forEach(sample => {
	const category = classifyAnnouncement(sample.title);
	categoryStats[category]++;
});

// 输出结果
console.log('📊 最终分类统计结果：\n');
console.log('分类\t\t\t数量\t\t覆盖率');
console.log('═'.repeat(60));

const sortedStats = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);

sortedStats.forEach(([category, count]) => {
	const percentage = ((count / sampleSize) * 100).toFixed(2);
	const bar = '█'.repeat(Math.floor(parseFloat(percentage) / 2));
	console.log(`${category.padEnd(16)}\t${count}\t\t${percentage}%\t${bar}`);
});

// 总覆盖率
const coveredCount = sampleSize - categoryStats[AnnouncementCategory.OTHER];
const coverageRate = ((coveredCount / sampleSize) * 100).toFixed(2);

console.log('\n' + '═'.repeat(60));
console.log(`✅ 总覆盖率: ${coverageRate}% (${coveredCount}/${sampleSize})`);
console.log(`❌ 未覆盖: ${(100 - parseFloat(coverageRate)).toFixed(2)}% (${categoryStats[AnnouncementCategory.OTHER]}/${sampleSize})`);

// 对比
console.log('\n\n📈 覆盖率提升对比：');
console.log('─'.repeat(60));
console.log(`初始版本:  55.47%`);
console.log(`优化版本:  88.84%  (+33.37%)`);
console.log(`最终版本:  ${coverageRate}%  (+${(parseFloat(coverageRate) - 55.47).toFixed(2)}%)`);

// 未覆盖样本
console.log('\n\n❓ 剩余未覆盖的公告示例（前20条）：\n');
const uncovered = samples
	.filter(s => classifyAnnouncement(s.title) === AnnouncementCategory.OTHER)
	.slice(0, 20);

uncovered.forEach((s, i) => {
	console.log(`${(i + 1).toString().padStart(2)}. ${s.title}`);
});

// 保存报告
const report = {
	timestamp: new Date().toISOString(),
	sampleSize,
	totalCoverage: coverageRate,
	categoryStats: Object.fromEntries(
		Object.entries(categoryStats).map(([cat, count]) => [
			cat,
			{
				count,
				percentage: ((count / sampleSize) * 100).toFixed(2)
			}
		])
	),
	uncoveredSamples: uncovered.map(s => s.title),
	improvements: {
		initial: '55.47%',
		optimized: '88.84%',
		final: `${coverageRate}%`
	}
};

const reportPath = path.join(__dirname, 'final-classification-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n\n📄 详细报告已保存至: ${reportPath}`);

db.close();
console.log('\n✨ 最终验证完成！');

