# Tushare 集成总结

## 已完成的工作

### 1. 配置文件

创建了 `src/config/tushare.ts`，配置了：
- Token: `834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d`
- API URL: `http://api.tushare.pro`
- 支持环境变量覆盖

### 2. HTTP 客户端

创建了 `src/lib/tushareClient.ts`，提供：

**核心功能：**
- ✅ HTTP POST 请求封装
- ✅ 自动 Token 管理
- ✅ 错误处理和错误类型
- ✅ 数据格式转换（数组 → 对象）
- ✅ TypeScript 类型支持

**主要方法：**
- `query()` - 查询数据并转换为对象数组
- `queryRaw()` - 查询数据并返回原始响应
- `setToken()` - 设置/更新 Token
- `getToken()` - 获取当前 Token

### 3. 测试工具

创建了 `src/lib/tushareQuickTest.ts`，提供：
- Token 配置检查
- API 连接测试
- 完整的测试流程

### 4. 文档

创建了三个文档：

**TUSHARE_API.md** - API 使用文档
- 快速开始指南
- 客户端方法说明
- 常用接口示例
- 错误处理
- 注意事项

**TUSHARE_RULES.md** - 接口调用规则
- 股票代码规范
- 主要数据分类（股票、ETF、指数、期货、期权、港股、美股、宏观经济等）
- 接口调用示例
- 日期格式规范
- 常用参数说明
- 快速查找接口方法

**TUSHARE_SUMMARY.md** - 本文档
- 集成总结
- 使用指南

### 5. 更新项目文档

更新了 `README.md`：
- 添加 Tushare 功能特性
- 更新项目结构
- 添加 Tushare 快速使用示例
- 添加相关文档链接

## 使用指南

### 基本使用

```typescript
import { tushareClient } from '@/lib/tushareClient'

// 1. 查询股票基本信息
const stocks = await tushareClient.query('stock_basic', {
    list_status: 'L'
}, ['ts_code', 'name', 'area', 'industry', 'list_date'])

// 2. 查询日线行情
const daily = await tushareClient.query('daily', {
    ts_code: '000001.SZ',
    start_date: '20231201',
    end_date: '20231231'
}, ['trade_date', 'open', 'high', 'low', 'close', 'vol'])

// 3. 查询交易日历
const calendar = await tushareClient.query('trade_cal', {
    exchange: 'SSE',
    start_date: '20231201',
    end_date: '20231231'
}, ['cal_date', 'is_open'])
```

### 错误处理

```typescript
import { TushareError } from '@/lib/tushareClient'

try {
    const data = await tushareClient.query('stock_basic', {
        list_status: 'L'
    })
} catch (error) {
    if (error instanceof TushareError) {
        console.error('错误码:', error.code)
        console.error('错误信息:', error.message)
    }
}
```

### 运行测试

```typescript
import { runAllTests } from '@/lib/tushareQuickTest'

// 运行完整测试
await runAllTests()
```

## 接口查找流程

当需要调用某个 Tushare 接口时：

1. 访问 [Tushare Pro 文档](https://tushare.pro/document/2?doc_id=14)
2. 在左侧菜单找到对应的数据分类
3. 查看接口名称、参数和返回字段
4. 参考 `docs/TUSHARE_RULES.md` 中的示例代码
5. 使用 `tushareClient.query()` 调用接口

## 股票代码规范

| 交易所 | 后缀 | 示例 |
|--------|------|------|
| 上海证券交易所 | .SH | 600000.SH |
| 深圳证券交易所 | .SZ | 000001.SZ |
| 北京证券交易所 | .BJ | 430047.BJ |
| 香港证券交易所 | .HK | 00001.HK |

## 常用接口速查

| 数据类型 | 接口名称 | 说明 |
|---------|---------|------|
| 股票列表 | stock_basic | 获取股票基本信息 |
| 日线行情 | daily | 获取日线行情数据 |
| 交易日历 | trade_cal | 获取交易日历 |
| 复权因子 | adj_factor | 获取复权因子 |
| 财务指标 | fina_indicator | 获取财务指标 |
| 利润表 | income | 获取利润表数据 |
| 资产负债表 | balancesheet | 获取资产负债表 |
| 现金流量表 | cashflow | 获取现金流量表 |
| 龙虎榜 | top_list | 获取龙虎榜数据 |
| 资金流向 | moneyflow | 获取个股资金流向 |

## 注意事项

1. **Token 安全**：Token 已配置在 `src/config/tushare.ts`，不要将其提交到公共代码仓库
2. **接口权限**：不同接口需要不同的积分和权限
3. **请求频率**：注意控制请求频率，避免超出限制
4. **日期格式**：统一使用 `YYYYMMDD` 格式（如 `20231231`）
5. **错误码 2002**：表示权限不足，需要检查积分或升级权限

## 相关资源

- [Tushare Pro 官网](https://tushare.pro/)
- [数据接口文档](https://tushare.pro/document/2?doc_id=14)
- [HTTP API 文档](https://tushare.pro/document/1?doc_id=130)
- [积分获取说明](https://tushare.pro/document/1?doc_id=13)
- [积分频次对应表](https://tushare.pro/document/1?doc_id=108)

## 下一步

现在您可以：

1. 使用 `tushareClient` 调用任何 Tushare Pro 接口
2. 参考 `docs/TUSHARE_RULES.md` 查找所需接口
3. 根据业务需求开发具体功能
4. 遇到问题时查看 `docs/TUSHARE_API.md` 文档

