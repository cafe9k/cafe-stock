/**
 * 自选股数据管理 Hook
 * 使用 REST API 直接调用 Supabase，便于观察网络日志
 * 
 * 优化：
 * 1. 使用 useRef 防止重复请求
 * 2. 使用 user.id 作为依赖而非整个 user 对象
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { select, insert, update, remove } from '../lib/supabaseRestClient'
import { useAuth } from '../contexts/AuthContext'
import type { WatchGroup, WatchStock } from '../types/database'

// 带行情数据的股票类型
export interface WatchStockWithQuote extends WatchStock {
    quote?: {
        close: number
        change: number
        pct_chg: number
        vol: number
        amount: number
        turnover_rate?: number
        pe?: number
        pb?: number
        total_mv?: number
        trade_date: string
    }
}

export function useWatchGroups() {
    const { user } = useAuth()
    const [groups, setGroups] = useState<WatchGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // 防止重复请求
    const fetchingRef = useRef(false)
    const lastUserIdRef = useRef<string | null>(null)

    // 获取分组列表
    const fetchGroups = useCallback(async () => {
        if (!user) return
        
        // 防止重复请求：同一用户只请求一次
        if (fetchingRef.current && lastUserIdRef.current === user.id) {
            return
        }

        fetchingRef.current = true
        lastUserIdRef.current = user.id

        try {
            setLoading(true)
            console.log('[useWatchGroups] 获取分组列表')
            
            const { data, error: fetchError } = await select<WatchGroup[]>('watch_groups', {
                columns: '*',
                filters: { 'user_id': `eq.${user.id}` },
                order: { column: 'sort_order', ascending: true },
            })

            if (fetchError) throw new Error(fetchError.message)
            setGroups(data || [])
            console.log('[useWatchGroups] 获取到', data?.length || 0, '个分组')
        } catch (err) {
            console.error('[useWatchGroups] 获取分组失败:', err)
            setError(err instanceof Error ? err.message : '获取分组失败')
        } finally {
            setLoading(false)
            fetchingRef.current = false
        }
    }, [user?.id]) // 只依赖 user.id 而非整个 user 对象

    // 创建分组
    const createGroup = async (name: string, color?: string) => {
        if (!user) return null

        try {
            console.log('[useWatchGroups] 创建分组:', name)
            
            const { data, error: insertError } = await insert<WatchGroup>('watch_groups', {
                user_id: user.id,
                name,
                color: color || '#58a6ff',
                sort_order: groups.length,
            }, { returnData: true, single: true })

            if (insertError) throw new Error(insertError.message)
            if (data) {
                setGroups(prev => [...prev, data])
                console.log('[useWatchGroups] 分组创建成功:', data.id)
            }
            return data
        } catch (err) {
            console.error('[useWatchGroups] 创建分组失败:', err)
            setError(err instanceof Error ? err.message : '创建分组失败')
            return null
        }
    }

    // 更新分组
    const updateGroup = async (id: string, updates: Partial<Pick<WatchGroup, 'name' | 'color' | 'sort_order'>>) => {
        try {
            console.log('[useWatchGroups] 更新分组:', id, updates)
            
            const { error: updateError } = await update('watch_groups', updates, { 'id': `eq.${id}` })

            if (updateError) throw new Error(updateError.message)
            setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
            console.log('[useWatchGroups] 分组更新成功')
            return true
        } catch (err) {
            console.error('[useWatchGroups] 更新分组失败:', err)
            setError(err instanceof Error ? err.message : '更新分组失败')
            return false
        }
    }

    // 删除分组
    const deleteGroup = async (id: string) => {
        try {
            console.log('[useWatchGroups] 删除分组:', id)
            
            const { error: deleteError } = await remove('watch_groups', { 'id': `eq.${id}` })

            if (deleteError) throw new Error(deleteError.message)
            setGroups(prev => prev.filter(g => g.id !== id))
            console.log('[useWatchGroups] 分组删除成功')
            return true
        } catch (err) {
            console.error('[useWatchGroups] 删除分组失败:', err)
            setError(err instanceof Error ? err.message : '删除分组失败')
            return false
        }
    }

    useEffect(() => {
        fetchGroups()
    }, [fetchGroups])

    return {
        groups,
        loading,
        error,
        fetchGroups,
        createGroup,
        updateGroup,
        deleteGroup,
    }
}

export function useWatchStocks(groupId?: string | null) {
    const { user } = useAuth()
    const [stocks, setStocks] = useState<WatchStock[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // 防止重复请求
    const fetchingRef = useRef(false)
    const lastFetchKeyRef = useRef<string | null>(null)

    // 获取关注股票列表
    const fetchStocks = useCallback(async () => {
        if (!user) return
        
        // 生成请求唯一键
        const fetchKey = `${user.id}-${groupId || 'all'}`
        
        // 防止重复请求
        if (fetchingRef.current && lastFetchKeyRef.current === fetchKey) {
            return
        }

        fetchingRef.current = true
        lastFetchKeyRef.current = fetchKey

        try {
            setLoading(true)
            console.log('[useWatchStocks] 获取股票列表, groupId:', groupId)
            
            const filters: Record<string, string> = {
                'user_id': `eq.${user.id}`,
            }
            
            // 如果指定了分组，则只获取该分组的股票
            if (groupId) {
                filters['group_id'] = `eq.${groupId}`
            }

            const { data, error: fetchError } = await select<WatchStock[]>('watch_stocks', {
                columns: '*',
                filters,
                order: { column: 'sort_order', ascending: true },
            })

            if (fetchError) throw new Error(fetchError.message)
            setStocks(data || [])
            console.log('[useWatchStocks] 获取到', data?.length || 0, '只股票')
        } catch (err) {
            console.error('[useWatchStocks] 获取股票列表失败:', err)
            setError(err instanceof Error ? err.message : '获取股票列表失败')
        } finally {
            setLoading(false)
            fetchingRef.current = false
        }
    }, [user?.id, groupId]) // 只依赖 user.id 而非整个 user 对象

    // 添加关注股票
    const addStock = async (tsCode: string, name: string, groupId?: string) => {
        console.log('[useWatchStocks] addStock 被调用:', { tsCode, name, groupId, user: user?.id })
        
        if (!user) {
            console.error('[useWatchStocks] 用户未登录，无法添加股票')
            throw new Error('请先登录')
        }

        try {
            console.log('[useWatchStocks] 准备插入数据到 watch_stocks 表')
            const insertData = {
                user_id: user.id,
                ts_code: tsCode,
                name,
                group_id: groupId || null,
                sort_order: stocks.length,
            }
            console.log('[useWatchStocks] 插入数据:', insertData)
            
            const { data, error: insertError } = await insert<WatchStock>('watch_stocks', insertData, {
                returnData: true,
                single: true,
            })

            console.log('[useWatchStocks] Supabase 返回:', { data, error: insertError })

            if (insertError) {
                if (insertError.code === '23505') {
                    throw new Error('该股票已在关注列表中')
                }
                throw new Error(insertError.message)
            }
            
            if (data) {
                setStocks(prev => [...prev, data])
                console.log('[useWatchStocks] 股票添加成功，更新本地状态')
            }
            return data
        } catch (err) {
            console.error('[useWatchStocks] 添加股票出错:', err)
            const message = err instanceof Error ? err.message : '添加股票失败'
            setError(message)
            throw new Error(message)
        }
    }

    // 更新关注股票
    const updateStock = async (id: string, updates: Partial<Pick<WatchStock, 'group_id' | 'notes' | 'target_price' | 'cost_price' | 'sort_order'>>) => {
        try {
            console.log('[useWatchStocks] 更新股票:', id, updates)
            
            const { error: updateError } = await update('watch_stocks', updates, { 'id': `eq.${id}` })

            if (updateError) throw new Error(updateError.message)
            setStocks(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
            console.log('[useWatchStocks] 股票更新成功')
            return true
        } catch (err) {
            console.error('[useWatchStocks] 更新股票失败:', err)
            setError(err instanceof Error ? err.message : '更新股票失败')
            return false
        }
    }

    // 删除关注股票
    const deleteStock = async (id: string) => {
        try {
            console.log('[useWatchStocks] 删除股票:', id)
            
            const { error: deleteError } = await remove('watch_stocks', { 'id': `eq.${id}` })

            if (deleteError) throw new Error(deleteError.message)
            setStocks(prev => prev.filter(s => s.id !== id))
            console.log('[useWatchStocks] 股票删除成功')
            return true
        } catch (err) {
            console.error('[useWatchStocks] 删除股票失败:', err)
            setError(err instanceof Error ? err.message : '删除股票失败')
            return false
        }
    }

    // 检查股票是否已关注
    const isStockWatched = (tsCode: string) => {
        return stocks.some(s => s.ts_code === tsCode)
    }

    useEffect(() => {
        fetchStocks()
    }, [fetchStocks])

    return {
        stocks,
        loading,
        error,
        fetchStocks,
        addStock,
        updateStock,
        deleteStock,
        isStockWatched,
    }
}

// 获取所有关注股票（不分组）
export function useAllWatchStocks() {
    return useWatchStocks(undefined)
}
