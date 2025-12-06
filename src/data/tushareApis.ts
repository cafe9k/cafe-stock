/**
 * Tushare Pro API 列表
 * 数据来源: https://tushare.pro/document/2
 */

export interface TushareApi {
    name: string           // API 名称
    apiName: string        // 接口名称
    description: string    // 描述
    minPoints?: number     // 最低积分要求
}

export interface ApiCategory {
    category: string       // 分类名称
    icon: string          // 分类图标
    description: string   // 分类描述
    apis: TushareApi[]    // API 列表
}

export const tushareApiCategories: ApiCategory[] = [
    {
        category: '股票数据',
        icon: '📈',
        description: 'A股市场股票基础信息、行情数据、财务数据等',
        apis: [
            { name: '股票列表', apiName: 'stock_basic', description: '获取基础信息数据，包括股票代码、名称、上市日期、退市日期等', minPoints: 120 },
            { name: '交易日历', apiName: 'trade_cal', description: '获取各大交易所交易日历数据', minPoints: 120 },
            { name: '股票曾用名', apiName: 'namechange', description: '历史名称变更记录', minPoints: 120 },
            { name: '沪深股通成份股', apiName: 'hs_const', description: '获取沪股通、深股通成分数据', minPoints: 120 },
            { name: '上市公司基本信息', apiName: 'stock_company', description: '获取上市公司基础信息', minPoints: 120 },
            { name: 'IPO新股列表', apiName: 'new_share', description: '获取新股上市列表数据', minPoints: 120 },
            { name: '备用行情', apiName: 'bak_daily', description: '获取备用行情，包括特殊处理的行情数据', minPoints: 2000 },
        ]
    },
    {
        category: '行情数据',
        icon: '📊',
        description: '日线、周线、月线、分钟线等行情数据',
        apis: [
            { name: '日线行情', apiName: 'daily', description: '获取股票日线数据，包含开高低收量额等', minPoints: 120 },
            { name: '周线行情', apiName: 'weekly', description: '获取股票周线行情数据', minPoints: 120 },
            { name: '月线行情', apiName: 'monthly', description: '获取股票月线行情数据', minPoints: 120 },
            { name: '复权行情', apiName: 'pro_bar', description: '通用行情接口，支持股票、ETF、指数等', minPoints: 120 },
            { name: '复权因子', apiName: 'adj_factor', description: '获取股票复权因子', minPoints: 120 },
            { name: '停复牌信息', apiName: 'suspend_d', description: '获取股票每日停复牌信息', minPoints: 120 },
            { name: '每日指标', apiName: 'daily_basic', description: '获取股票每日基本指标，如PE、PB、换手率等', minPoints: 120 },
            { name: '个股资金流向', apiName: 'moneyflow', description: '获取个股资金流向数据', minPoints: 2000 },
            { name: '每日涨跌停价格', apiName: 'stk_limit', description: '获取每日涨跌停价格', minPoints: 120 },
            { name: '分钟行情', apiName: 'stk_mins', description: '获取股票分钟级别行情数据', minPoints: 5000 },
        ]
    },
    {
        category: '财务数据',
        icon: '💰',
        description: '利润表、资产负债表、现金流量表、财务指标等',
        apis: [
            { name: '利润表', apiName: 'income', description: '获取上市公司利润表数据', minPoints: 120 },
            { name: '资产负债表', apiName: 'balancesheet', description: '获取上市公司资产负债表', minPoints: 120 },
            { name: '现金流量表', apiName: 'cashflow', description: '获取上市公司现金流量表', minPoints: 120 },
            { name: '业绩预告', apiName: 'forecast', description: '获取业绩预告数据', minPoints: 120 },
            { name: '业绩快报', apiName: 'express', description: '获取上市公司业绩快报', minPoints: 120 },
            { name: '分红送股', apiName: 'dividend', description: '获取分红送股数据', minPoints: 120 },
            { name: '财务指标数据', apiName: 'fina_indicator', description: '获取上市公司财务指标数据', minPoints: 120 },
            { name: '财务审计意见', apiName: 'fina_audit', description: '获取上市公司财务审计意见', minPoints: 120 },
            { name: '主营业务构成', apiName: 'fina_mainbz', description: '获取上市公司主营业务构成', minPoints: 120 },
            { name: '财报披露计划', apiName: 'disclosure_date', description: '获取财报披露计划日期', minPoints: 120 },
        ]
    },
    {
        category: '市场参考数据',
        icon: '🏆',
        description: '龙虎榜、融资融券、大宗交易、股东数据等',
        apis: [
            { name: '龙虎榜每日明细', apiName: 'top_list', description: '获取龙虎榜每日交易明细数据', minPoints: 300 },
            { name: '龙虎榜机构交易明细', apiName: 'top_inst', description: '获取龙虎榜机构席位成交明细', minPoints: 300 },
            { name: '融资融券交易汇总', apiName: 'margin', description: '获取融资融券交易汇总数据', minPoints: 120 },
            { name: '融资融券交易明细', apiName: 'margin_detail', description: '获取沪深两市每日融资融券明细', minPoints: 2000 },
            { name: '大宗交易', apiName: 'block_trade', description: '获取大宗交易数据', minPoints: 300 },
            { name: '股东人数', apiName: 'stk_holdernumber', description: '获取上市公司股东人数', minPoints: 120 },
            { name: '前十大股东', apiName: 'top10_holders', description: '获取上市公司前十大股东数据', minPoints: 120 },
            { name: '前十大流通股东', apiName: 'top10_floatholders', description: '获取上市公司前十大流通股东', minPoints: 120 },
            { name: '股东增减持', apiName: 'stk_holdertrade', description: '获取上市公司股东增减持数据', minPoints: 300 },
            { name: '股权质押统计', apiName: 'pledge_stat', description: '获取股权质押统计数据', minPoints: 120 },
            { name: '股权质押明细', apiName: 'pledge_detail', description: '获取股权质押明细数据', minPoints: 120 },
            { name: '股票回购', apiName: 'repurchase', description: '获取上市公司回购股票数据', minPoints: 120 },
            { name: '限售股解禁', apiName: 'share_float', description: '获取限售股解禁数据', minPoints: 120 },
            { name: '概念股分类', apiName: 'concept', description: '获取股票概念分类', minPoints: 120 },
            { name: '概念股明细', apiName: 'concept_detail', description: '获取概念股明细数据', minPoints: 120 },
        ]
    },
    {
        category: '指数数据',
        icon: '📉',
        description: '指数基本信息、指数行情、成分股等',
        apis: [
            { name: '指数基本信息', apiName: 'index_basic', description: '获取指数基础信息', minPoints: 120 },
            { name: '指数日线行情', apiName: 'index_daily', description: '获取指数日线行情', minPoints: 120 },
            { name: '指数周线行情', apiName: 'index_weekly', description: '获取指数周线行情', minPoints: 120 },
            { name: '指数月线行情', apiName: 'index_monthly', description: '获取指数月线行情', minPoints: 120 },
            { name: '指数成分和权重', apiName: 'index_weight', description: '获取各类指数成分和权重', minPoints: 120 },
            { name: '大盘指数每日指标', apiName: 'index_dailybasic', description: '获取大盘指数每日指标', minPoints: 400 },
            { name: '申万行业分类', apiName: 'index_classify', description: '获取申万行业分类', minPoints: 120 },
            { name: '申万行业成分', apiName: 'index_member', description: '获取申万行业成分股', minPoints: 120 },
        ]
    },
    {
        category: '基金数据',
        icon: '💼',
        description: '公募基金、ETF、LOF 等基金数据',
        apis: [
            { name: '公募基金列表', apiName: 'fund_basic', description: '获取公募基金基础信息', minPoints: 120 },
            { name: '公募基金公司', apiName: 'fund_company', description: '获取公募基金公司列表', minPoints: 120 },
            { name: '公募基金经理', apiName: 'fund_manager', description: '获取公募基金经理数据', minPoints: 120 },
            { name: '基金规模', apiName: 'fund_share', description: '获取基金规模数据', minPoints: 120 },
            { name: '基金净值', apiName: 'fund_nav', description: '获取基金净值数据', minPoints: 120 },
            { name: '基金分红', apiName: 'fund_div', description: '获取基金分红数据', minPoints: 120 },
            { name: '基金持仓', apiName: 'fund_portfolio', description: '获取基金持仓数据', minPoints: 120 },
            { name: '基金行情', apiName: 'fund_daily', description: '获取基金行情数据', minPoints: 120 },
            { name: 'ETF申赎清单', apiName: 'fund_adj', description: '获取ETF申赎清单', minPoints: 120 },
        ]
    },
    {
        category: '期货数据',
        icon: '🛢️',
        description: '期货合约、行情、持仓等数据',
        apis: [
            { name: '期货合约信息', apiName: 'fut_basic', description: '获取期货合约信息表', minPoints: 120 },
            { name: '期货日线行情', apiName: 'fut_daily', description: '获取期货日线行情数据', minPoints: 120 },
            { name: '期货持仓量', apiName: 'fut_holding', description: '获取期货持仓量数据', minPoints: 120 },
            { name: '仓单日报', apiName: 'fut_wsr', description: '获取仓单日报数据', minPoints: 300 },
            { name: '结算参数', apiName: 'fut_settle', description: '获取每日结算参数', minPoints: 300 },
            { name: '期货主力与连续合约', apiName: 'fut_mapping', description: '获取期货主力与连续合约映射', minPoints: 120 },
        ]
    },
    {
        category: '期权数据',
        icon: '📋',
        description: '期权合约、行情、Greeks 等数据',
        apis: [
            { name: '期权合约信息', apiName: 'opt_basic', description: '获取期权合约信息', minPoints: 120 },
            { name: '期权日线行情', apiName: 'opt_daily', description: '获取期权日线行情', minPoints: 120 },
        ]
    },
    {
        category: '债券数据',
        icon: '📜',
        description: '可转债、国债、企业债等债券数据',
        apis: [
            { name: '可转债基本信息', apiName: 'cb_basic', description: '获取可转债基本信息', minPoints: 120 },
            { name: '可转债行情', apiName: 'cb_daily', description: '获取可转债日线行情', minPoints: 120 },
            { name: '可转债发行', apiName: 'cb_issue', description: '获取可转债发行数据', minPoints: 120 },
            { name: '可转债赎回', apiName: 'cb_call', description: '获取可转债赎回信息', minPoints: 120 },
            { name: '国债收益率', apiName: 'yc_cb', description: '获取中国国债收益率曲线', minPoints: 2000 },
        ]
    },
    {
        category: '港股数据',
        icon: '🇭🇰',
        description: '港股市场基础信息、行情数据',
        apis: [
            { name: '港股列表', apiName: 'hk_basic', description: '获取港股基础信息', minPoints: 120 },
            { name: '港股日线行情', apiName: 'hk_daily', description: '获取港股日线行情', minPoints: 300 },
        ]
    },
    {
        category: '美股数据',
        icon: '🇺🇸',
        description: '美股市场基础信息、行情数据',
        apis: [
            { name: '美股列表', apiName: 'us_basic', description: '获取美股基础信息', minPoints: 2000 },
            { name: '美股日线行情', apiName: 'us_daily', description: '获取美股日线行情', minPoints: 2000 },
            { name: '美股交易日历', apiName: 'us_tradecal', description: '获取美股交易日历', minPoints: 2000 },
        ]
    },
    {
        category: '外汇数据',
        icon: '💱',
        description: '外汇汇率、央行货币政策等',
        apis: [
            { name: '外汇日线行情', apiName: 'fx_daily', description: '获取外汇日线行情', minPoints: 2000 },
            { name: '外汇基础信息', apiName: 'fx_obasic', description: '获取外汇基础信息', minPoints: 2000 },
        ]
    },
    {
        category: '宏观经济',
        icon: '🌍',
        description: 'GDP、CPI、货币供应量、利率等宏观经济数据',
        apis: [
            { name: 'Shibor利率', apiName: 'shibor', description: '获取Shibor利率数据', minPoints: 120 },
            { name: 'Shibor报价数据', apiName: 'shibor_quote', description: '获取Shibor报价数据', minPoints: 120 },
            { name: 'Libor利率', apiName: 'libor', description: '获取Libor利率数据', minPoints: 120 },
            { name: 'Hibor利率', apiName: 'hibor', description: '获取Hibor利率数据', minPoints: 120 },
            { name: 'LPR利率', apiName: 'shibor_lpr', description: '获取LPR利率数据', minPoints: 120 },
            { name: '国内生产总值(GDP)', apiName: 'cn_gdp', description: '获取国内生产总值数据', minPoints: 120 },
            { name: '居民消费价格指数(CPI)', apiName: 'cn_cpi', description: '获取CPI数据', minPoints: 120 },
            { name: '工业生产者出厂价格指数(PPI)', apiName: 'cn_ppi', description: '获取PPI数据', minPoints: 120 },
            { name: '货币供应量', apiName: 'cn_m', description: '获取货币供应量数据', minPoints: 120 },
        ]
    },
    {
        category: '新闻资讯',
        icon: '📰',
        description: '财经新闻、公告、研报等资讯数据',
        apis: [
            { name: '新闻快讯', apiName: 'news', description: '获取财经新闻数据', minPoints: 5000 },
            { name: '新浪财经新闻', apiName: 'cctv_news', description: '获取新浪财经新闻', minPoints: 120 },
            { name: '信息地雷', apiName: 'major_news', description: '获取个股信息地雷', minPoints: 2000 },
        ]
    },
    {
        category: '特色数据',
        icon: '✨',
        description: '技术因子、另类数据等特色数据',
        apis: [
            { name: '技术因子(量化)', apiName: 'stk_factor', description: '获取股票技术面因子数据', minPoints: 2000 },
            { name: 'CCI技术指标', apiName: 'cci_tech', description: '获取CCI技术指标', minPoints: 2000 },
            { name: 'KDJ技术指标', apiName: 'kdj_tech', description: '获取KDJ技术指标', minPoints: 2000 },
            { name: 'BOLL技术指标', apiName: 'boll_tech', description: '获取布林带指标', minPoints: 2000 },
            { name: 'MACD技术指标', apiName: 'macd_tech', description: '获取MACD指标', minPoints: 2000 },
            { name: '股票技术面因子', apiName: 'stk_factor_pro', description: '获取股票技术面因子(专业版)', minPoints: 5000 },
            { name: '游资名录', apiName: 'broker_recommend', description: '获取券商金股数据', minPoints: 2000 },
        ]
    },
]

// 获取所有 API 数量
export const getTotalApiCount = (): number => {
    return tushareApiCategories.reduce((total, category) => total + category.apis.length, 0)
}

// 按积分要求筛选 API
export const filterApisByPoints = (maxPoints: number): ApiCategory[] => {
    return tushareApiCategories.map(category => ({
        ...category,
        apis: category.apis.filter(api => !api.minPoints || api.minPoints <= maxPoints)
    })).filter(category => category.apis.length > 0)
}

// 搜索 API
export const searchApis = (keyword: string): TushareApi[] => {
    const lowerKeyword = keyword.toLowerCase()
    const results: TushareApi[] = []
    
    tushareApiCategories.forEach(category => {
        category.apis.forEach(api => {
            if (
                api.name.toLowerCase().includes(lowerKeyword) ||
                api.apiName.toLowerCase().includes(lowerKeyword) ||
                api.description.toLowerCase().includes(lowerKeyword)
            ) {
                results.push(api)
            }
        })
    })
    
    return results
}

