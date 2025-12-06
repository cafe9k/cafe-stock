/**
 * 股票行情数据 Hook
 * 
 * 优化功能：
 * 1. 使用 queryDailyBatch 获取全市场数据，减少请求次数
 * 2. 自动利用缓存，避免重复请求
 * 3. 支持批量股票查询
 */

import { useState, useCallback, useRef } from 'react'
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
    
    // 用于防止重复请求
    const fetchingRef = useRef(false)

    // 获取指定股票的行情数据（优化版）
    const fetchQuotes = useCallback(async (tsCodes: string[]) => {
        if (tsCodes.length === 0) return
        
        // 防止重复请求
        if (fetchingRef.current) {
            console.log('[useStockQuotes] 请求进行中，跳过')
            return
        }

        fetchingRef.current = true
        setLoading(true)
        setError(null)

        try {
            const tradeDate = getRecentTradeDate()
            
            // 使用优化的批量查询方法
            // 这会利用缓存，如果数据已缓存则直接返回
            const [dailyMap, basicMap] = await Promise.all([
                tushareClient.queryDailyBatch<DailyQuote>(
                    'daily',
                    tradeDate,
                    tsCodes,
                    ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pre_close', 'change', 'pct_chg', 'vol', 'amount']
                ),
                tushareClient.queryDailyBatch<DailyBasic>(
                    'daily_basic',
                    tradeDate,
                    tsCodes,
                    ['ts_code', 'trade_date', 'turnover_rate', 'pe', 'pb', 'total_mv', 'circ_mv']
                ),
            ])

            // 合并数据
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
            
            // 打印缓存和节流器状态（调试用）
            console.log('[useStockQuotes] 缓存状态:', tushareClient.getCacheStats())
            console.log('[useStockQuotes] 节流器状态:', tushareClient.getRateLimiterStatus())
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : '获取行情数据失败'
            console.error('获取行情数据失败:', err)
            setError(errorMsg)
            
            // 显示用户友好的错误提示
            if (errorMsg.includes('IP数量超限') || errorMsg.includes('频率')) {
                console.warn('⚠️ Tushare API 限流，请稍后重试')
            }
        } finally {
            setLoading(false)
            fetchingRef.current = false
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

/**
 * 股票搜索 Hook（优化版）
 * 
 * 优化策略：
 * - 按需搜索，不预加载全量股票列表
 * - 支持按股票代码或名称精确/模糊搜索
 * - 搜索结果缓存，避免重复请求
 */
export function useStockSearch() {
    const [results, setResults] = useState<StockBasicInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // 搜索结果缓存（内存级）
    const searchCacheRef = useRef<Map<string, StockBasicInfo[]>>(new Map())
    // 防止重复请求
    const searchingRef = useRef(false)
    // 当前搜索关键词
    const currentKeywordRef = useRef('')

    /**
     * 搜索股票（按需请求）
     * 支持：
     * - 股票代码搜索（如 000001、600000）
     * - 股票名称搜索（如 平安、招商）
     */
    const search = useCallback(async (keyword: string) => {
        const kw = keyword.trim()
        
        if (!kw) {
            setResults([])
            return
        }
        
        // 记录当前搜索关键词
        currentKeywordRef.current = kw
        
        // 检查缓存
        const cached = searchCacheRef.current.get(kw)
        if (cached) {
            setResults(cached)
            return
        }
        
        // 防止重复请求
        if (searchingRef.current) {
            return
        }
        
        searchingRef.current = true
        setLoading(true)
        setError(null)
        
        try {
            // 判断搜索类型
            const isCodeSearch = /^\d+$/.test(kw) || /^\d+\.[A-Z]+$/i.test(kw)
            
            let data: StockBasicInfo[] = []
            
            if (isCodeSearch) {
                // 按股票代码搜索
                // 尝试补全代码后缀
                const codes = []
                if (kw.includes('.')) {
                    codes.push(kw.toUpperCase())
                } else {
                    // 6 开头是上海，其他是深圳
                    if (kw.startsWith('6')) {
                        codes.push(`${kw}.SH`)
                    } else if (kw.startsWith('0') || kw.startsWith('3')) {
                        codes.push(`${kw}.SZ`)
                    } else {
                        // 不确定，两个都尝试
                        codes.push(`${kw}.SH`, `${kw}.SZ`)
                    }
                }
                
                // 使用 ts_code 精确查询
                for (const code of codes) {
                    try {
                        const result = await tushareClient.query<StockBasicInfo>('stock_basic', {
                            ts_code: code,
                            list_status: 'L',
                        }, ['ts_code', 'symbol', 'name', 'area', 'industry', 'market', 'list_date'])
                        
                        if (result.length > 0) {
                            data.push(...result)
                        }
                    } catch {
                        // 忽略单个查询失败
                    }
                }
                
                // 如果精确查询没结果，尝试模糊匹配
                if (data.length === 0 && kw.length >= 2) {
                    // 使用 name_code 参数进行模糊搜索（如果 API 支持）
                    // 否则退回到获取少量数据进行本地过滤
                    const partialData = await tushareClient.query<StockBasicInfo>('stock_basic', {
                        list_status: 'L',
                        exchange: kw.startsWith('6') ? 'SSE' : 'SZSE',
                    }, ['ts_code', 'symbol', 'name', 'area', 'industry', 'market', 'list_date'])
                    
                    data = partialData.filter(s => 
                        s.ts_code.includes(kw.toUpperCase()) || 
                        s.symbol.includes(kw)
                    ).slice(0, 20)
                }
            } else {
                // 按名称搜索 - 使用 name 参数（如果 API 支持模糊搜索）
                // Tushare stock_basic 不支持名称模糊搜索，需要获取数据后本地过滤
                // 优化：只获取主板股票，减少数据量
                const exchanges = ['SSE', 'SZSE'] // 上海、深圳
                
                for (const exchange of exchanges) {
                    try {
                        const result = await tushareClient.query<StockBasicInfo>('stock_basic', {
                            list_status: 'L',
                            exchange,
                        }, ['ts_code', 'symbol', 'name', 'area', 'industry', 'market', 'list_date'])
                        
                        // 本地过滤
                        const filtered = result.filter(s => 
                            s.name.includes(kw)
                        )
                        data.push(...filtered)
                        
                        // 如果已经找到足够多的结果，停止搜索
                        if (data.length >= 20) break
                    } catch {
                        // 忽略单个查询失败
                    }
                }
                
                data = data.slice(0, 20)
            }
            
            // 检查是否是最新的搜索请求
            if (currentKeywordRef.current === kw) {
                setResults(data)
                // 缓存结果
                searchCacheRef.current.set(kw, data)
                
                // 限制缓存大小
                if (searchCacheRef.current.size > 50) {
                    const firstKey = searchCacheRef.current.keys().next().value
                    if (firstKey) {
                        searchCacheRef.current.delete(firstKey)
                    }
                }
            }
            
            console.log(`[useStockSearch] 搜索 "${kw}" 找到 ${data.length} 只股票`)
        } catch (err) {
            console.error('搜索股票失败:', err)
            if (currentKeywordRef.current === kw) {
                setError(err instanceof Error ? err.message : '搜索股票失败')
            }
        } finally {
            searchingRef.current = false
            setLoading(false)
        }
    }, [])

    // 清空搜索结果
    const clearResults = useCallback(() => {
        setResults([])
        currentKeywordRef.current = ''
    }, [])

    return {
        results,
        loading,
        error,
        search,
        clearResults,
    }
}
