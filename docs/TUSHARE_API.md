# Tushare Pro HTTP 客户端使用文档

## 概述

本项目集成了 Tushare Pro 的 HTTP API 客户端，用于获取金融数据。客户端基于 [Tushare Pro 官方文档](https://tushare.pro/document/1?doc_id=130) 开发。

## 快速开始

### 1. Token 配置

项目已经在 `src/config/tushare.ts` 中配置了默认的 Tushare Token，可以直接使用。

如果需要使用自己的 Token：

**方式一：修改配置文件**

编辑 `src/config/tushare.ts`，修改 `DEFAULT_TUSHARE_TOKEN` 的值。

**方式二：使用环境变量（推荐）**

在项目根目录创建 `.env` 文件，添加以下配置：

```bash
VITE_TUSHARE_TOKEN=your_tushare_token_here
```

环境变量的优先级高于配置文件中的默认值。

### 2. 基本使用

```typescript
import { tushareClient } from './lib/tushareClient'

// 查询股票基本信息
const stocks = await tushareClient.query('stock_basic', {
    list_status: 'L'
}, ['ts_code', 'name', 'area', 'industry', 'list_date'])

console.log(stocks)
```

## API 说明

### 请求参数

所有 API 请求都使用 POST 方法，参数格式如下：

```json
{
    "api_name": "接口名称",
    "token": "用户Token",
    "params": {
        "参数名": "参数值"
    },
    "fields": "字段1,字段2,字段3"
}
```

### 响应格式

```json
{
    "code": 0,
    "msg": null,
    "data": {
        "fields": ["字段1", "字段2", "字段3"],
        "items": [
            ["值1", "值2", "值3"],
            ["值4", "值5", "值6"]
        ]
    }
}
```

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 2002 | 权限不足（积分不够或无权限） |
| -1 | 客户端错误（网络问题、Token未配置等） |

## 客户端方法

### query()

查询数据并自动转换为对象数组。

**方法签名：**

```typescript
async query<T = any>(
    apiName: string,
    params?: Record<string, any>,
    fields?: string[]
): Promise<T[]>
```

**参数说明：**

- `apiName`: 接口名称（如 `stock_basic`、`daily` 等）
- `params`: 查询参数对象（可选）
- `fields`: 需要返回的字段列表（可选）

**返回值：**

返回对象数组，每个对象的键为字段名，值为对应的数据。

**示例：**

```typescript
interface StockBasic {
    ts_code: string
    name: string
    area: string
    industry: string
    list_date: string
}

const stocks = await tushareClient.query<StockBasic>(
    'stock_basic',
    { list_status: 'L' },
    ['ts_code', 'name', 'area', 'industry', 'list_date']
)

// 输出: [{ ts_code: '000001.SZ', name: '平安银行', ... }, ...]
console.log(stocks)
```

### queryRaw()

查询数据并返回原始响应格式。

**方法签名：**

```typescript
async queryRaw<T = any>(
    apiName: string,
    params?: Record<string, any>,
    fields?: string[]
): Promise<TushareResponse<T>>
```

**返回值：**

返回完整的 Tushare API 响应对象。

**示例：**

```typescript
const response = await tushareClient.queryRaw(
    'stock_basic',
    { list_status: 'L' },
    ['ts_code', 'name']
)

console.log(response.data.fields)  // ['ts_code', 'name']
console.log(response.data.items)   // [['000001.SZ', '平安银行'], ...]
```

### setToken()

设置或更新 Token。

```typescript
tushareClient.setToken('your_new_token')
```

### getToken()

获取当前配置的 Token。

```typescript
const token = tushareClient.getToken()
```

## 常用接口示例

### 1. 股票基本信息 (stock_basic)

```typescript
const stocks = await tushareClient.query('stock_basic', {
    list_status: 'L'  // L=上市 D=退市 P=暂停上市
}, ['ts_code', 'name', 'area', 'industry', 'list_date'])
```

### 2. 日线行情 (daily)

```typescript
const dailyData = await tushareClient.query('daily', {
    ts_code: '000001.SZ',
    start_date: '20231201',
    end_date: '20231231'
}, ['trade_date', 'open', 'high', 'low', 'close', 'vol'])
```

### 3. 交易日历 (trade_cal)

```typescript
const calendar = await tushareClient.query('trade_cal', {
    exchange: 'SSE',  // SSE=上交所 SZSE=深交所
    start_date: '20231201',
    end_date: '20231231'
}, ['exchange', 'cal_date', 'is_open'])
```

### 4. 复权因子 (adj_factor)

```typescript
const adjFactor = await tushareClient.query('adj_factor', {
    ts_code: '000001.SZ',
    trade_date: '20231229'
}, ['ts_code', 'trade_date', 'adj_factor'])
```

## 错误处理

```typescript
import { TushareError } from './lib/tushareClient'

try {
    const data = await tushareClient.query('stock_basic', {
        list_status: 'L'
    })
} catch (error) {
    if (error instanceof TushareError) {
        console.error('错误码:', error.code)
        console.error('错误信息:', error.message)
        
        switch (error.code) {
            case 2002:
                console.error('权限不足，请检查积分或升级权限')
                break
            case -1:
                console.error('请求失败，请检查网络或 Token 配置')
                break
            default:
                console.error('未知错误')
        }
    } else {
        console.error('其他错误:', error)
    }
}
```

## 注意事项

1. **Token 安全**：不要将 Token 提交到代码仓库，使用环境变量管理
2. **接口权限**：不同接口需要不同的积分和权限，详见 [Tushare 积分频次对应表](https://tushare.pro/document/1?doc_id=108)
3. **请求频率**：注意控制请求频率，避免超出限制
4. **日期格式**：日期参数统一使用 `YYYYMMDD` 格式（如 `20231231`）
5. **股票代码**：A股代码格式为 `XXXXXX.SH`（上交所）或 `XXXXXX.SZ`（深交所）

## 更多接口

Tushare Pro 提供了丰富的数据接口，包括：

- 股票数据（基本信息、行情、财务、指标等）
- 基金数据
- 期货数据
- 期权数据
- 债券数据
- 外汇数据
- 宏观经济数据
- 新闻资讯

详细接口文档请访问：[Tushare Pro 数据接口](https://tushare.pro/document/2)

## 参考资源

- [Tushare Pro 官网](https://tushare.pro/)
- [HTTP API 文档](https://tushare.pro/document/1?doc_id=130)
- [数据接口列表](https://tushare.pro/document/2)
- [积分获取说明](https://tushare.pro/document/1?doc_id=13)

