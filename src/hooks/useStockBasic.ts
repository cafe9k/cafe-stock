/**
 * A股股票基础数据 Hook
 * 
 * 功能：
 * 1. 从 Tushare 同步股票列表到 Supabase
 * 2. 从 Supabase 搜索股票
 * 3. 获取同步状态和统计信息
 */

import { useState, useCallback, useRef } from 'react'
import { tushareClient } from '../lib/tushareClient'
import { select, insert, update } from '../lib/supabaseRestClient'
import type { StockBasic } from '../types/database'

// Tushare 返回的股票基础信息
interface TushareStockBasic {
    ts_code: string
    symbol: string
    name: string
    area: string
    industry: string
    market: string
    list_date: string
}

// 同步状态
interface SyncStatus {
    syncing: boolean
    progress: number      // 0-100
    total: number         // 总数
    synced: number        // 已同步数
    message: string       // 状态消息
    error: string | null  // 错误信息
}

// 同步结果
interface SyncResult {
    success: boolean
    total: number
    inserted: number
    updated: number
    error?: string
}

/**
 * 股票基础数据同步 Hook
 */
export function useStockBasicSync() {
    const [status, setStatus] = useState<SyncStatus>({
        syncing: false,
        progress: 0,
        total: 0,
        synced: 0,
        message: '准备就绪',
        error: null,
    })
    
    const abortRef = useRef(false)

    /**
     * 从 Tushare 同步股票列表到 Supabase
     */
    const syncStockBasic = useCallback(async (): Promise<SyncResult> => {
        if (status.syncing) {
            return { success: false, total: 0, inserted: 0, updated: 0, error: '同步进行中' }
        }

        abortRef.current = false
        setStatus({
            syncing: true,
            progress: 0,
            total: 0,
            synced: 0,
            message: '正在从 Tushare 获取股票列表...',
            error: null,
        })

        try {
            // 1. 从 Tushare 获取全部 A 股股票列表
            const stocks = await tushareClient.query<TushareStockBasic>(
                'stock_basic',
                { list_status: 'L' },  // L=上市
                ['ts_code', 'symbol', 'name', 'area', 'industry', 'market', 'list_date']
            )

            if (abortRef.current) {
                return { success: false, total: 0, inserted: 0, updated: 0, error: '同步已取消' }
            }

            const total = stocks.length
            setStatus(prev => ({
                ...prev,
                total,
                message: `获取到 ${total} 只股票，正在同步到数据库...`,
            }))

            // 2. 分批写入 Supabase（每批 100 条）
            const batchSize = 100
            let inserted = 0
            let updated = 0

            for (let i = 0; i < stocks.length; i += batchSize) {
                if (abortRef.current) {
                    return { success: false, total, inserted, updated, error: '同步已取消' }
                }

                const batch = stocks.slice(i, i + batchSize)
                
                // 使用 upsert 逻辑：先尝试插入，如果存在则更新
                for (const stock of batch) {
                    const stockData = {
                        ts_code: stock.ts_code,
                        symbol: stock.symbol,
                        name: stock.name,
                        area: stock.area || '',
                        industry: stock.industry || '',
                        market: stock.market || '',
                        list_date: stock.list_date || '',
                    }

                    // 尝试插入
                    const insertResult = await insert<StockBasic>('stock_basic', stockData, { single: true })
                    
                    if (insertResult.error) {
                        // 如果是主键冲突，尝试更新
                        if (insertResult.error.code === '23505' || insertResult.error.message.includes('duplicate')) {
                            const updateResult = await update<StockBasic>(
                                'stock_basic',
                                { ...stockData, updated_at: new Date().toISOString() },
                                { ts_code: `eq.${stock.ts_code}` }
                            )
                            if (!updateResult.error) {
                                updated++
                            }
                        }
                    } else {
                        inserted++
                    }
                }

                const synced = Math.min(i + batchSize, total)
                const progress = Math.round((synced / total) * 100)
                
                setStatus(prev => ({
                    ...prev,
                    synced,
                    progress,
                    message: `已同步 ${synced}/${total} (${progress}%)`,
                }))

                // 批次间延迟，避免请求过快
                if (i + batchSize < stocks.length) {
                    await new Promise(resolve => setTimeout(resolve, 100))
                }
            }

            setStatus({
                syncing: false,
                progress: 100,
                total,
                synced: total,
                message: `同步完成！共 ${total} 只股票，新增 ${inserted}，更新 ${updated}`,
                error: null,
            })

            return { success: true, total, inserted, updated }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '同步失败'
            setStatus(prev => ({
                ...prev,
                syncing: false,
                message: '同步失败',
                error: errorMsg,
            }))
            return { success: false, total: 0, inserted: 0, updated: 0, error: errorMsg }
        }
    }, [status.syncing])

    /**
     * 取消同步
     */
    const cancelSync = useCallback(() => {
        abortRef.current = true
    }, [])

    return {
        status,
        syncStockBasic,
        cancelSync,
    }
}

/**
 * 股票基础数据查询 Hook
 */
export function useStockBasicQuery() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [count, setCount] = useState<number | null>(null)
    const [lastUpdate, setLastUpdate] = useState<string | null>(null)

    /**
     * 获取股票总数和最后更新时间
     */
    const fetchStats = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // 获取总数
            const countResult = await select<StockBasic[]>('stock_basic', {
                columns: 'ts_code',
            })

            if (countResult.error) {
                throw new Error(countResult.error.message)
            }

            const stockCount = countResult.data?.length || 0
            setCount(stockCount)

            // 获取最后更新时间
            if (stockCount > 0) {
                const latestResult = await select<StockBasic[]>('stock_basic', {
                    columns: 'updated_at',
                    order: { column: 'updated_at', ascending: false },
                    limit: 1,
                })

                if (latestResult.data && latestResult.data.length > 0) {
                    setLastUpdate(latestResult.data[0].updated_at)
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取统计信息失败')
        } finally {
            setLoading(false)
        }
    }, [])

    /**
     * 从 Supabase 搜索股票
     */
    const searchStock = useCallback(async (keyword: string): Promise<StockBasic[]> => {
        if (!keyword.trim()) {
            return []
        }

        const kw = keyword.trim().toUpperCase()

        try {
            // 判断是代码搜索还是名称搜索
            const isCodeSearch = /^\d+$/.test(kw) || /^\d+\.[A-Z]+$/i.test(kw)

            let results: StockBasic[] = []

            if (isCodeSearch) {
                // 按代码搜索
                if (kw.includes('.')) {
                    // 完整代码，精确匹配
                    const result = await select<StockBasic[]>('stock_basic', {
                        filters: { ts_code: `eq.${kw}` },
                    })
                    results = result.data || []
                } else {
                    // 部分代码，模糊匹配 symbol
                    const result = await select<StockBasic[]>('stock_basic', {
                        filters: { symbol: `like.${kw}%` },
                        limit: 20,
                    })
                    results = result.data || []
                }
            } else {
                // 按名称搜索（模糊匹配）
                const result = await select<StockBasic[]>('stock_basic', {
                    filters: { name: `ilike.%${keyword.trim()}%` },
                    limit: 20,
                })
                results = result.data || []
            }

            return results
        } catch (err) {
            console.error('搜索股票失败:', err)
            return []
        }
    }, [])

    return {
        loading,
        error,
        count,
        lastUpdate,
        fetchStats,
        searchStock,
    }
}

/**
 * 格式化更新时间
 */
export function formatUpdateTime(isoString: string | null): string {
    if (!isoString) return '从未同步'
    
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins} 分钟前`
    if (diffHours < 24) return `${diffHours} 小时前`
    if (diffDays < 7) return `${diffDays} 天前`
    
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}



