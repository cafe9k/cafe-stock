/**
 * 股票行情数据 Hook
 */

import { useState, useCallback } from 'react'
import { tushareClient } from '../lib/tushareClient'

// 日线行情数据
interface DailyQuote {
    ts_code: string
    trade_date: string
    open: number
    high: number
    low: number
    close: number
    pre_close: number
    change: number
    pct_chg: number
    vol: number
    amount: number
}

// 每日指标数据
interface DailyBasic {
    ts_code: string
    trade_date: string
    turnover_rate: number
    turnover_rate_f: number
    volume_ratio: number
    pe: number
    pe_ttm: number
    pb: number
    ps: number
    ps_ttm: number
    dv_ratio: number
    dv_ttm: number
    total_share: number
    float_share: number
    free_share: number
    total_mv: number
    circ_mv: number
}

// 合并后的行情数据
export interface StockQuote {
    ts_code: string
    name?: string
    trade_date: string
    open: number
    high: number
    low: number
    close: number
    pre_close: number
    change: number
    pct_chg: number
    vol: number
    amount: number
    turnover_rate?: number
    pe?: number
    pb?: number
    total_mv?: number
    circ_mv?: number
}

// 获取最近的交易日期（格式：YYYYMMDD）
function getRecentTradeDate(): string {
    const now = new Date()
    const hour = now.getHours()
    
    // 如果是 15:30 之前，使用前一天
    if (hour < 16) {
        now.setDate(now.getDate() - 1)
    }
    
    // 跳过周末
    const day = now.getDay()
    if (day === 0) now.setDate(now.getDate() - 2) // 周日 -> 周五
    if (day === 6) now.setDate(now.getDate() - 1) // 周六 -> 周五
    
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const date = String(now.getDate()).padStart(2, '0')
    
    return `${year}${month}${date}`
}

export function useStockQuotes() {
    const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    // 获取指定股票的行情数据
    const fetchQuotes = useCallback(async (tsCodes: string[]) => {
        if (tsCodes.length === 0) return

        setLoading(true)
        setError(null)

        try {
            const tradeDate = getRecentTradeDate()
            
            // 并行获取日线行情和每日指标
            const [dailyData, basicData] = await Promise.all([
                tushareClient.query<DailyQuote>('daily', {
                    trade_date: tradeDate,
                }, ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pre_close', 'change', 'pct_chg', 'vol', 'amount']),
                
                tushareClient.query<DailyBasic>('daily_basic', {
                    trade_date: tradeDate,
                }, ['ts_code', 'trade_date', 'turnover_rate', 'pe', 'pb', 'total_mv', 'circ_mv']),
            ])

            // 创建 Map 方便查找
            const dailyMap = new Map(dailyData.map(d => [d.ts_code, d]))
            const basicMap = new Map(basicData.map(d => [d.ts_code, d]))

            // 合并数据，只保留关注的股票
            const newQuotes = new Map<string, StockQuote>()
            
            for (const tsCode of tsCodes) {
                const daily = dailyMap.get(tsCode)
                const basic = basicMap.get(tsCode)
                
                if (daily) {
                    newQuotes.set(tsCode, {
                        ts_code: tsCode,
                        trade_date: daily.trade_date,
                        open: daily.open,
                        high: daily.high,
                        low: daily.low,
                        close: daily.close,
                        pre_close: daily.pre_close,
                        change: daily.change,
                        pct_chg: daily.pct_chg,
                        vol: daily.vol,
                        amount: daily.amount,
                        turnover_rate: basic?.turnover_rate,
                        pe: basic?.pe,
                        pb: basic?.pb,
                        total_mv: basic?.total_mv,
                        circ_mv: basic?.circ_mv,
                    })
                }
            }

            setQuotes(newQuotes)
            setLastUpdate(new Date())
        } catch (err) {
            console.error('获取行情数据失败:', err)
            setError(err instanceof Error ? err.message : '获取行情数据失败')
        } finally {
            setLoading(false)
        }
    }, [])

    // 获取单只股票的行情
    const getQuote = useCallback((tsCode: string): StockQuote | undefined => {
        return quotes.get(tsCode)
    }, [quotes])

    return {
        quotes,
        loading,
        error,
        lastUpdate,
        fetchQuotes,
        getQuote,
    }
}

// 股票搜索
export interface StockBasicInfo {
    ts_code: string
    symbol: string
    name: string
    area: string
    industry: string
    market: string
    list_date: string
}

export function useStockSearch() {
    const [results, setResults] = useState<StockBasicInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [allStocks, setAllStocks] = useState<StockBasicInfo[]>([])

    // 加载所有上市股票（用于本地搜索）
    const loadAllStocks = useCallback(async () => {
        if (allStocks.length > 0) return // 已加载

        setLoading(true)
        try {
            const data = await tushareClient.query<StockBasicInfo>('stock_basic', {
                list_status: 'L', // 只获取上市股票
            }, ['ts_code', 'symbol', 'name', 'area', 'industry', 'market', 'list_date'])
            
            setAllStocks(data)
        } catch (err) {
            console.error('加载股票列表失败:', err)
            setError(err instanceof Error ? err.message : '加载股票列表失败')
        } finally {
            setLoading(false)
        }
    }, [allStocks.length])

    // 搜索股票（本地搜索）
    const search = useCallback((keyword: string) => {
        if (!keyword.trim()) {
            setResults([])
            return
        }

        const kw = keyword.trim().toUpperCase()
        
        const filtered = allStocks.filter(stock => 
            stock.ts_code.toUpperCase().includes(kw) ||
            stock.symbol.includes(kw) ||
            stock.name.includes(keyword.trim())
        ).slice(0, 20) // 限制结果数量

        setResults(filtered)
    }, [allStocks])

    // 清空搜索结果
    const clearResults = useCallback(() => {
        setResults([])
    }, [])

    return {
        results,
        loading,
        error,
        loadAllStocks,
        search,
        clearResults,
        isLoaded: allStocks.length > 0,
    }
}

