/**
 * INPUT: 无（纯函数工具）
 * OUTPUT: classifyAnnouncement(), getCategoryColor(), getCategoryIcon() - 公告分类工具函数
 * POS: 渲染进程工具层，提供公告标题的智能分类功能，基于规则匹配进行分类
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. src/utils/README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */

/**
 * 公告分类枚举
 */
export enum AnnouncementCategory {
	FINANCIAL_REPORT = "财务报告",
	DIVIDEND = "分红派息",
	MAJOR_EVENT = "重大事项",
	EQUITY_CHANGE = "股权变动",
	GOVERNANCE = "公司治理",
	BUSINESS_OPERATION = "经营情况",
	RISK_WARNING = "风险提示",
	TRANSACTION = "交易公告",
	LITIGATION = "诉讼仲裁",
	INVESTMENT = "对外投资",
	GUARANTEE = "担保事项",
	BOND = "债券相关",
	INTERNAL_CONTROL = "内部控制",
	QUALIFICATION = "资质认证",
	FUND = "基金相关",
	FUNDRAISING = "募集资金",
	EQUITY_INCENTIVE = "股权激励",
	INVESTOR_RELATIONS = "投资者关系",
	SUPERVISION = "持续督导",
	ESG_REPORT = "ESG报告",
	SHARE_PLEDGE = "股份质押",
	OTHER = "其他",
}

/**
 * 分类规则接口
 */
export interface ClassificationRule {
	category: AnnouncementCategory;
	keywords: string[];
	priority: number; // 优先级，数字越小优先级越高
}

/**
 * 分类规则配置
 * 基于实际数据分析，按关键词出现频率和业务重要性排序
 */
const CLASSIFICATION_RULES: ClassificationRule[] = [
	// 优先级1: 财务报告类 (覆盖率: 7.19%)
	{
		category: AnnouncementCategory.FINANCIAL_REPORT,
		keywords: [
			"年度报告",
			"年报",
			"半年度报告",
			"半年报",
			"季度报告",
			"季报",
			"一季报",
			"三季报",
			"财务报告",
			"财务报表",
			"业绩快报",
			"业绩预告",
			"盈利预告",
			"审计报告",
			"审计",
			"会计",
			"会计师事务所",
			"业绩说明会",
		],
		priority: 1,
	},

	// 优先级2: 分红派息 (覆盖率: 1.81%)
	{
		category: AnnouncementCategory.DIVIDEND,
		keywords: ["分红", "派息", "现金分红", "送股", "转增", "利润分配", "股利分配", "权益分派", "除权除息"],
		priority: 2,
	},

	// 优先级3: 股权变动 (覆盖率: 1.72%)
	{
		category: AnnouncementCategory.EQUITY_CHANGE,
		keywords: [
			"股权变动",
			"权益变动",
			"增持",
			"减持",
			"股份回购",
			"回购股份",
			"回购",
			"限售股",
			"解禁",
			"股权激励",
			"员工持股",
			"出售股份",
			"出售已回购",
		],
		priority: 3,
	},

	// 优先级4: 风险提示 (覆盖率: 6.23%)
	{
		category: AnnouncementCategory.RISK_WARNING,
		keywords: [
			"风险提示",
			"风险警示",
			"异常波动",
			"股价异常",
			"ST",
			"*ST",
			"退市风险",
			"退市",
			"停牌",
			"复牌",
			"核查",
			"问询",
			"问询函",
			"关注函",
			"回复",
			"回复函",
			"澄清",
			"澄清公告",
			"资产减值",
			"计提减值",
		],
		priority: 4,
	},

	// 优先级5: 公司治理 (覆盖率: 30.39% - 最高)
	{
		category: AnnouncementCategory.GOVERNANCE,
		keywords: [
			"董事会",
			"董事会决议",
			"监事会",
			"监事会决议",
			"股东大会",
			"股东会",
			"临时股东大会",
			"独立董事",
			"董事",
			"高管",
			"总经理",
			"副总经理",
			"财务总监",
			"董事长",
			"监事",
			"任命",
			"选举",
			"辞职",
			"离职",
			"聘任",
			"章程",
			"章程修订",
			"会议通知",
			"会议决议",
			"会议",
			"提名",
			"候选人",
		],
		priority: 5,
	},

	// 优先级6: 担保事项 (新增，预计覆盖率: 2-3%)
	{
		category: AnnouncementCategory.GUARANTEE,
		keywords: ["担保", "提供担保", "反担保", "担保额度", "对外担保"],
		priority: 6,
	},

	// 优先级7: 交易公告 (覆盖率: 7.20%)
	{
		category: AnnouncementCategory.TRANSACTION,
		keywords: ["关联交易", "日常关联交易", "购买资产", "出售资产", "资产转让", "股权转让", "交易", "买卖"],
		priority: 7,
	},

	// 优先级8: 重大事项 (覆盖率: 0.70%)
	{
		category: AnnouncementCategory.MAJOR_EVENT,
		keywords: ["重大事项", "重大事件", "重大资产重组", "资产重组", "收购", "兼并", "并购", "重组", "整合", "重大合同"],
		priority: 8,
	},

	// 优先级9: 对外投资 (覆盖率: 3.44%)
	{
		category: AnnouncementCategory.INVESTMENT,
		keywords: ["对外投资", "投资设立", "设立", "参股", "控股", "合资", "合作", "子公司", "全资子公司", "投资进展"],
		priority: 9,
	},

	// 优先级10: 经营情况 (覆盖率: 2.76%)
	{
		category: AnnouncementCategory.BUSINESS_OPERATION,
		keywords: [
			"经营情况",
			"生产经营",
			"经营数据",
			"项目",
			"工程",
			"中标",
			"中标公告",
			"合同",
			"签订合同",
			"签署",
			"协议",
			"建设",
			"施工",
			"完成",
			"竣工",
			"授信",
			"综合授信",
			"银行授信",
		],
		priority: 10,
	},

	// 优先级11: 债券相关 (新增，预计覆盖率: 3-5%)
	{
		category: AnnouncementCategory.BOND,
		keywords: ["债券", "公司债", "可转债", "转债", "可转换债券", "付息", "兑付", "摘牌", "发行", "发行结果", "信用评级", "评级", "转股"],
		priority: 11,
	},

	// 优先级12: 内部控制 (新增，预计覆盖率: 1-2%)
	{
		category: AnnouncementCategory.INTERNAL_CONTROL,
		keywords: ["内部控制", "内控", "鉴证报告", "自我评价", "管理制度", "信息披露"],
		priority: 12,
	},

	// 优先级13: 资质认证 (新增，预计覆盖率: 0.5-1%)
	{
		category: AnnouncementCategory.QUALIFICATION,
		keywords: ["高新技术企业", "高新认定", "资质", "认证", "许可证", "证书", "专利", "知识产权"],
		priority: 13,
	},

	// 优先级14: 基金相关 (新增，预计覆盖率: 2-3%)
	{
		category: AnnouncementCategory.FUND,
		keywords: ["基金", "基金管理", "开放日常", "开放申购", "开放赎回", "基金份额", "基金净值", "估值调整"],
		priority: 14,
	},

	// 优先级15: 诉讼仲裁 (覆盖率: 0.64%)
	{
		category: AnnouncementCategory.LITIGATION,
		keywords: ["诉讼", "起诉", "被诉", "仲裁", "纠纷", "法律纠纷", "判决", "裁决", "法律"],
		priority: 15,
	},

	// 优先级16: 募集资金 (预计覆盖率: 3-4%)
	{
		category: AnnouncementCategory.FUNDRAISING,
		keywords: ["募集资金", "闲置募集资金", "现金管理", "理财产品", "补充流动资金", "募集资金管理"],
		priority: 16,
	},

	// 优先级17: 股权激励 (预计覆盖率: 2-3%)
	{
		category: AnnouncementCategory.EQUITY_INCENTIVE,
		keywords: ["股权激励", "激励计划", "股票期权", "期权激励", "限制性股票", "激励对象", "授予", "行权", "解锁"],
		priority: 17,
	},

	// 优先级18: 投资者关系 (预计覆盖率: 1-2%)
	{
		category: AnnouncementCategory.INVESTOR_RELATIONS,
		keywords: ["投资者关系", "投资者关系活动", "投资者关系管理", "投资者接待", "路演"],
		priority: 18,
	},

	// 优先级19: 持续督导 (预计覆盖率: 0.5-1%)
	{
		category: AnnouncementCategory.SUPERVISION,
		keywords: ["持续督导", "督导报告", "定期现场检查", "现场检查", "跟踪报告"],
		priority: 19,
	},

	// 优先级20: ESG报告 (预计覆盖率: 0.3-0.5%)
	{
		category: AnnouncementCategory.ESG_REPORT,
		keywords: ["ESG", "ESG报告", "社会责任", "社会责任报告", "可持续发展", "环境报告", "环境、社会及治理"],
		priority: 20,
	},

	// 优先级21: 股份质押 (预计覆盖率: 0.3-0.5%)
	{
		category: AnnouncementCategory.SHARE_PLEDGE,
		keywords: ["质押", "股份质押", "解除质押", "股权质押", "再质押", "补充质押"],
		priority: 21,
	},
];

/**
 * 导出默认分类规则（供数据库初始化使用）
 */
export const DEFAULT_CLASSIFICATION_RULES = CLASSIFICATION_RULES;

/**
 * 根据公告标题分类（使用自定义规则）
 * @param title 公告标题
 * @param customRules 自定义规则（可选，不传则使用默认规则）
 * @returns 公告分类
 */
export function classifyAnnouncementWithRules(
	title: string,
	customRules?: ClassificationRule[]
): AnnouncementCategory {
	if (!title) return AnnouncementCategory.OTHER;

	const rules = customRules || CLASSIFICATION_RULES;
	
	// 按优先级排序后匹配
	const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

	for (const rule of sortedRules) {
		for (const keyword of rule.keywords) {
			if (title.includes(keyword)) {
				return rule.category;
			}
		}
	}

	return AnnouncementCategory.OTHER;
}

/**
 * 根据公告标题分类（使用默认规则）
 * @param title 公告标题
 * @returns 公告分类
 */
export function classifyAnnouncement(title: string): AnnouncementCategory {
	return classifyAnnouncementWithRules(title, CLASSIFICATION_RULES);
}

/**
 * 批量分类公告
 * @param announcements 公告列表
 * @returns 带分类的公告列表
 */
export function classifyAnnouncements<T extends { title: string }>(announcements: T[]): Array<T & { category: AnnouncementCategory }> {
	return announcements.map((ann) => ({
		...ann,
		category: classifyAnnouncement(ann.title),
	}));
}

/**
 * 获取分类统计
 * @param announcements 公告列表
 * @returns 分类统计对象
 */
export function getCategoryStats(announcements: Array<{ title: string }>): Record<AnnouncementCategory, number> {
	const stats: Record<string, number> = {};

	// 初始化所有分类为0
	Object.values(AnnouncementCategory).forEach((category) => {
		stats[category] = 0;
	});

	// 统计每个分类的数量
	announcements.forEach((ann) => {
		const category = classifyAnnouncement(ann.title);
		stats[category] = (stats[category] || 0) + 1;
	});

	return stats as Record<AnnouncementCategory, number>;
}

/**
 * 获取分类的颜色配置（用于 UI 显示）
 */
export function getCategoryColor(category: AnnouncementCategory): string {
	const colorMap: Record<AnnouncementCategory, string> = {
		[AnnouncementCategory.FINANCIAL_REPORT]: "blue",
		[AnnouncementCategory.DIVIDEND]: "green",
		[AnnouncementCategory.MAJOR_EVENT]: "red",
		[AnnouncementCategory.EQUITY_CHANGE]: "purple",
		[AnnouncementCategory.GOVERNANCE]: "cyan",
		[AnnouncementCategory.BUSINESS_OPERATION]: "geekblue",
		[AnnouncementCategory.RISK_WARNING]: "orange",
		[AnnouncementCategory.TRANSACTION]: "volcano",
		[AnnouncementCategory.LITIGATION]: "magenta",
		[AnnouncementCategory.INVESTMENT]: "lime",
		[AnnouncementCategory.GUARANTEE]: "gold",
		[AnnouncementCategory.BOND]: "purple",
		[AnnouncementCategory.INTERNAL_CONTROL]: "cyan",
		[AnnouncementCategory.QUALIFICATION]: "green",
		[AnnouncementCategory.FUND]: "blue",
		[AnnouncementCategory.FUNDRAISING]: "lime",
		[AnnouncementCategory.EQUITY_INCENTIVE]: "magenta",
		[AnnouncementCategory.INVESTOR_RELATIONS]: "geekblue",
		[AnnouncementCategory.SUPERVISION]: "cyan",
		[AnnouncementCategory.ESG_REPORT]: "green",
		[AnnouncementCategory.SHARE_PLEDGE]: "gold",
		[AnnouncementCategory.OTHER]: "default",
	};

	return colorMap[category] || "default";
}

/**
 * 获取分类的图标（可选，用于 UI 显示）
 */
export function getCategoryIcon(category: AnnouncementCategory): string {
	const iconMap: Record<AnnouncementCategory, string> = {
		[AnnouncementCategory.FINANCIAL_REPORT]: "📊",
		[AnnouncementCategory.DIVIDEND]: "💰",
		[AnnouncementCategory.MAJOR_EVENT]: "⚠️",
		[AnnouncementCategory.EQUITY_CHANGE]: "📈",
		[AnnouncementCategory.GOVERNANCE]: "👔",
		[AnnouncementCategory.BUSINESS_OPERATION]: "🏭",
		[AnnouncementCategory.RISK_WARNING]: "🚨",
		[AnnouncementCategory.TRANSACTION]: "🤝",
		[AnnouncementCategory.LITIGATION]: "⚖️",
		[AnnouncementCategory.INVESTMENT]: "💼",
		[AnnouncementCategory.GUARANTEE]: "🛡️",
		[AnnouncementCategory.BOND]: "📜",
		[AnnouncementCategory.INTERNAL_CONTROL]: "🔒",
		[AnnouncementCategory.QUALIFICATION]: "🏆",
		[AnnouncementCategory.FUND]: "💹",
		[AnnouncementCategory.FUNDRAISING]: "💵",
		[AnnouncementCategory.EQUITY_INCENTIVE]: "🎁",
		[AnnouncementCategory.INVESTOR_RELATIONS]: "🤝",
		[AnnouncementCategory.SUPERVISION]: "👁️",
		[AnnouncementCategory.ESG_REPORT]: "🌱",
		[AnnouncementCategory.SHARE_PLEDGE]: "🔗",
		[AnnouncementCategory.OTHER]: "📄",
	};

	return iconMap[category] || "📄";
}
