# Tushare 接口调用规则

## 项目规则

当需要调用 Tushare 接口时，请遵循以下规则：

### 1. 查找接口文档

访问 [Tushare Pro 数据接口文档](https://tushare.pro/document/2?doc_id=14) 搜索相关接口信息。

### 2. 股票代码规范

在 Tushare 数据接口中，股票代码参数统一使用 `ts_code`，格式如下：

| 交易所 | 代码 | 后缀 | 示例 |
|--------|------|------|------|
| 上海证券交易所 | SSE | .SH | 600000.SH (股票)<br>000001.SH (指数) |
| 深圳证券交易所 | SZSE | .SZ | 000001.SZ (股票)<br>399005.SZ (指数) |
| 北京证券交易所 | BSE | .BJ | 9、8、4开头的股票 |
| 香港证券交易所 | HKEX | .HK | 00001.HK |

### 3. 主要数据分类

#### 3.1 股票数据

**基础数据**
- 股票列表 (`stock_basic`)
- 交易日历 (`trade_cal`)
- 上市公司基本信息 (`stock_company`)
- 沪深港通股票列表
- IPO新股上市

**行情数据**
- 日线行情 (`daily`)
- 周线行情 (`weekly`)
- 月线行情 (`monthly`)
- 分钟行情 (`stk_mins`)
- 复权因子 (`adj_factor`)
- 每日指标 (`daily_basic`)
- 停复牌信息 (`suspend_d`)
- 涨跌停价格 (`stk_limit`)

**财务数据**
- 利润表 (`income`)
- 资产负债表 (`balancesheet`)
- 现金流量表 (`cashflow`)
- 业绩预告 (`forecast`)
- 业绩快报 (`express`)
- 分红送股 (`dividend`)
- 财务指标 (`fina_indicator`)
- 主营业务构成 (`fina_mainbz`)

**参考数据**
- 前十大股东 (`top10_holders`)
- 前十大流通股东 (`top10_floatholders`)
- 股权质押 (`pledge_stat`, `pledge_detail`)
- 股票回购 (`repurchase`)
- 限售股解禁 (`share_float`)
- 大宗交易 (`block_trade`)
- 股东人数 (`stk_holdernumber`)

**特色数据**
- 券商盈利预测 (`forecast_vip`)
- 每日筹码及胜率 (`cyq_perf`)
- 每日筹码分布 (`cyq_chips`)
- 沪深股通持股明细 (`hk_hold`)
- AH股比价 (`ah_price`)
- 机构调研 (`stk_surv`)

**两融及转融通**
- 融资融券交易汇总 (`margin`)
- 融资融券交易明细 (`margin_detail`)
- 融资融券标的 (`margin_target`)

**资金流向**
- 个股资金流向 (`moneyflow`)
- 沪深港通资金流向 (`moneyflow_hsgt`)

**打板专题**
- 龙虎榜每日统计 (`top_list`)
- 龙虎榜机构交易 (`top_inst`)
- 涨跌停数据 (`limit_list_d`)
- 涨停连板天梯 (`ths_hot`)

#### 3.2 ETF专题

- ETF基本信息 (`fund_basic`)
- ETF日线行情 (`fund_daily`)
- ETF复权因子 (`fund_adj`)

#### 3.3 指数专题

- 指数基本信息 (`index_basic`)
- 指数日线行情 (`index_daily`)
- 指数周线行情 (`index_weekly`)
- 指数月线行情 (`index_monthly`)
- 指数成分和权重 (`index_weight`)
- 大盘指数每日指标 (`index_dailybasic`)

#### 3.4 期货数据

- 期货合约信息 (`fut_basic`)
- 期货日线行情 (`fut_daily`)
- 期货持仓排名 (`fut_holding`)
- 期货结算参数 (`fut_settle`)

#### 3.5 期权数据

- 期权合约信息 (`opt_basic`)
- 期权日线行情 (`opt_daily`)

#### 3.6 港股数据

- 港股列表 (`hk_basic`)
- 港股日线行情 (`hk_daily`)

#### 3.7 美股数据

- 美股列表 (`us_basic`)
- 美股日线行情 (`us_daily`)

#### 3.8 宏观经济

**利率数据**
- Shibor利率 (`shibor`)
- LPR贷款基础利率 (`shibor_lpr`)
- Libor利率 (`libor`)

**国民经济**
- 国内生产总值GDP (`cn_gdp`)

**价格指数**
- 居民消费价格指数CPI (`cn_cpi`)
- 工业生产者出厂价格指数PPI (`cn_ppi`)

**金融**
- 货币供应量 (`cn_m`)
- 社融增量 (`cn_shrzgm`)

**景气度**
- 采购经理指数PMI (`cn_pmi`)

#### 3.9 行业经济

- 电影票房 (`bo_cinema`)
- 台湾电子产业月营收 (`tw_income`)

### 4. 接口调用示例

```typescript
import { tushareClient } from '@/lib/tushareClient'

// 示例1: 获取股票列表
const stocks = await tushareClient.query('stock_basic', {
    list_status: 'L'  // L=上市 D=退市 P=暂停上市
}, ['ts_code', 'name', 'area', 'industry', 'list_date'])

// 示例2: 获取日线行情
const daily = await tushareClient.query('daily', {
    ts_code: '000001.SZ',
    start_date: '20231201',
    end_date: '20231231'
}, ['trade_date', 'open', 'high', 'low', 'close', 'vol', 'amount'])

// 示例3: 获取交易日历
const tradeCal = await tushareClient.query('trade_cal', {
    exchange: 'SSE',
    start_date: '20231201',
    end_date: '20231231'
}, ['cal_date', 'is_open'])

// 示例4: 获取财务指标
const indicators = await tushareClient.query('fina_indicator', {
    ts_code: '000001.SZ',
    period: '20231231'
}, ['ts_code', 'end_date', 'eps', 'roe', 'roa'])

// 示例5: 获取龙虎榜数据
const topList = await tushareClient.query('top_list', {
    trade_date: '20231229'
}, ['ts_code', 'name', 'close', 'pct_change', 'turnover_rate'])
```

### 5. 日期格式规范

- 所有日期参数统一使用 `YYYYMMDD` 格式
- 示例：`20231231`、`20240101`

### 6. 常用参数说明

| 参数名 | 说明 | 示例 |
|--------|------|------|
| ts_code | 股票代码 | 000001.SZ |
| trade_date | 交易日期 | 20231231 |
| start_date | 开始日期 | 20231201 |
| end_date | 结束日期 | 20231231 |
| exchange | 交易所代码 | SSE/SZSE/BSE |
| list_status | 上市状态 | L=上市 D=退市 P=暂停 |
| period | 报告期 | 20231231 |

### 7. 错误处理

```typescript
import { TushareError } from '@/lib/tushareClient'

try {
    const data = await tushareClient.query('stock_basic', {
        list_status: 'L'
    })
} catch (error) {
    if (error instanceof TushareError) {
        if (error.code === 2002) {
            console.error('权限不足，请检查积分或升级权限')
        } else {
            console.error('API错误:', error.message)
        }
    }
}
```

### 8. 注意事项

1. **权限和积分**：不同接口需要不同的积分和权限，详见 [积分频次对应表](https://tushare.pro/document/1?doc_id=108)
2. **请求频率**：注意控制请求频率，避免超出限制
3. **数据更新时间**：不同数据有不同的更新时间，详见具体接口文档
4. **历史数据**：部分接口提供的历史数据有时间限制

### 9. 快速查找接口

当需要某个数据时，按以下步骤查找：

1. 访问 https://tushare.pro/document/2?doc_id=14
2. 在左侧菜单找到对应的数据分类
3. 点击进入查看接口名称、参数说明和返回字段
4. 使用 `tushareClient.query()` 方法调用

### 10. 参考资源

- [Tushare Pro 官网](https://tushare.pro/)
- [数据接口文档](https://tushare.pro/document/2?doc_id=14)
- [HTTP API 文档](https://tushare.pro/document/1?doc_id=130)
- [积分获取说明](https://tushare.pro/document/1?doc_id=13)
- [数据更新时间](https://tushare.pro/document/1?doc_id=1119)

