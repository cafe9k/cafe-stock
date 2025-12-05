/**
 * Tushare 客户端使用示例
 */

import { tushareClient } from './tushareClient'

/**
 * 股票基本信息接口
 */
export interface StockBasic {
    ts_code: string        // 股票代码
    name: string           // 股票名称
    area: string           // 地域
    industry: string       // 行业
    list_date: string      // 上市日期
}

/**
 * 日线行情接口
 */
export interface DailyQuote {
    trade_date: string     // 交易日期
    open: number           // 开盘价
    high: number           // 最高价
    low: number            // 最低价
    close: number          // 收盘价
    vol: number            // 成交量
}

/**
 * 示例1: 获取股票基本信息列表
 */
export async function getStockBasicList(): Promise<StockBasic[]> {
    try {
        const stocks = await tushareClient.query<StockBasic>(
            'stock_basic',
            {
                list_status: 'L'  // L=上市 D=退市 P=暂停上市
            },
            ['ts_code', 'name', 'area', 'industry', 'list_date']
        )
        
        console.log(`获取到 ${stocks.length} 只股票`)
        return stocks
    } catch (error) {
        console.error('获取股票列表失败:', error)
        throw error
    }
}

/**
 * 示例2: 获取指定股票的日线行情
 */
export async function getStockDaily(
    tsCode: string,
    startDate: string,
    endDate: string
): Promise<DailyQuote[]> {
    try {
        const dailyData = await tushareClient.query<DailyQuote>(
            'daily',
            {
                ts_code: tsCode,
                start_date: startDate,
                end_date: endDate
            },
            ['trade_date', 'open', 'high', 'low', 'close', 'vol']
        )
        
        console.log(`获取到 ${dailyData.length} 条行情数据`)
        return dailyData
    } catch (error) {
        console.error('获取日线行情失败:', error)
        throw error
    }
}

/**
 * 示例3: 获取交易日历
 */
export interface TradeCalendar {
    exchange: string       // 交易所
    cal_date: string       // 日期
    is_open: number        // 是否交易 0=休市 1=交易
}

export async function getTradeCalendar(
    exchange: string,
    startDate: string,
    endDate: string
): Promise<TradeCalendar[]> {
    try {
        const calendar = await tushareClient.query<TradeCalendar>(
            'trade_cal',
            {
                exchange: exchange,  // SSE=上交所 SZSE=深交所
                start_date: startDate,
                end_date: endDate
            },
            ['exchange', 'cal_date', 'is_open']
        )
        
        return calendar
    } catch (error) {
        console.error('获取交易日历失败:', error)
        throw error
    }
}

/**
 * 示例4: 使用原始响应格式
 */
export async function getStockBasicRaw() {
    try {
        const response = await tushareClient.queryRaw(
            'stock_basic',
            {
                list_status: 'L'
            },
            ['ts_code', 'name', 'area', 'industry', 'list_date']
        )
        
        console.log('字段列表:', response.data.fields)
        console.log('数据行数:', response.data.items.length)
        console.log('第一条数据:', response.data.items[0])
        
        return response
    } catch (error) {
        console.error('获取数据失败:', error)
        throw error
    }
}

/**
 * 示例5: 错误处理
 */
export async function exampleErrorHandling() {
    try {
        // 尝试调用一个不存在的接口
        await tushareClient.query('invalid_api', {})
    } catch (error: any) {
        if (error.name === 'TushareError') {
            console.error('Tushare 错误码:', error.code)
            console.error('错误信息:', error.message)
            
            // 根据错误码进行不同处理
            switch (error.code) {
                case 2002:
                    console.error('权限不足，请检查积分或权限')
                    break
                case -1:
                    console.error('请求失败，请检查网络连接')
                    break
                default:
                    console.error('未知错误')
            }
        } else {
            console.error('其他错误:', error)
        }
    }
}

/**
 * 示例6: 设置自定义 Token
 */
export function setCustomToken(token: string) {
    tushareClient.setToken(token)
    console.log('Token 已更新')
}

/**
 * 示例7: 检查 Token 配置
 */
export function checkTokenConfig() {
    const token = tushareClient.getToken()
    if (token) {
        console.log('Token 已配置')
        return true
    } else {
        console.warn('Token 未配置，请在 .env 文件中设置 VITE_TUSHARE_TOKEN')
        return false
    }
}

