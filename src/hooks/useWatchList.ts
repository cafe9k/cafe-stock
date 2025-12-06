/**
 * 自选股数据管理 Hook
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
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

    // 获取分组列表
    const fetchGroups = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('watch_groups')
                .select('*')
                .eq('user_id', user.id)
                .order('sort_order', { ascending: true })

            if (error) throw error
            setGroups(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取分组失败')
        } finally {
            setLoading(false)
        }
    }, [user])

    // 创建分组
    const createGroup = async (name: string, color?: string) => {
        if (!user) return null

        try {
            const { data, error } = await supabase
                .from('watch_groups')
                .insert({
                    user_id: user.id,
                    name,
                    color: color || '#58a6ff',
                    sort_order: groups.length,
                })
                .select()
                .single()

            if (error) throw error
            setGroups(prev => [...prev, data])
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : '创建分组失败')
            return null
        }
    }

    // 更新分组
    const updateGroup = async (id: string, updates: Partial<Pick<WatchGroup, 'name' | 'color' | 'sort_order'>>) => {
        try {
            const { error } = await supabase
                .from('watch_groups')
                .update(updates)
                .eq('id', id)

            if (error) throw error
            setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : '更新分组失败')
            return false
        }
    }

    // 删除分组
    const deleteGroup = async (id: string) => {
        try {
            const { error } = await supabase
                .from('watch_groups')
                .delete()
                .eq('id', id)

            if (error) throw error
            setGroups(prev => prev.filter(g => g.id !== id))
            return true
        } catch (err) {
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

    // 获取关注股票列表
    const fetchStocks = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            let query = supabase
                .from('watch_stocks')
                .select('*')
                .eq('user_id', user.id)
                .order('sort_order', { ascending: true })

            // 如果指定了分组，则只获取该分组的股票
            if (groupId) {
                query = query.eq('group_id', groupId)
            }

            const { data, error } = await query

            if (error) throw error
            setStocks(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取股票列表失败')
        } finally {
            setLoading(false)
        }
    }, [user, groupId])

    // 添加关注股票
    const addStock = async (tsCode: string, name: string, groupId?: string) => {
        console.log('addStock 被调用:', { tsCode, name, groupId, user: user?.id })
        
        if (!user) {
            console.error('用户未登录，无法添加股票')
            throw new Error('请先登录')
        }

        try {
            console.log('准备插入数据到 watch_stocks 表')
            const insertData = {
                user_id: user.id,
                ts_code: tsCode,
                name,
                group_id: groupId || null,
                sort_order: stocks.length,
            }
            console.log('插入数据:', insertData)
            
            const response = supabase
                .from('watch_stocks')
                .insert(insertData)
                .select()
                .single()
            
            console.log('Supabase 请求已发送，等待响应...')
            
            const { data, error } = await response

            console.log('Supabase 返回:', { data, error })

            if (error) {
                if (error.code === '23505') {
                    throw new Error('该股票已在关注列表中')
                }
                throw error
            }
            setStocks(prev => [...prev, data])
            console.log('股票添加成功，更新本地状态')
            return data
        } catch (err) {
            console.error('添加股票出错:', err)
            const message = err instanceof Error ? err.message : '添加股票失败'
            setError(message)
            throw new Error(message)
        }
    }

    // 更新关注股票
    const updateStock = async (id: string, updates: Partial<Pick<WatchStock, 'group_id' | 'notes' | 'target_price' | 'cost_price' | 'sort_order'>>) => {
        try {
            const { error } = await supabase
                .from('watch_stocks')
                .update(updates)
                .eq('id', id)

            if (error) throw error
            setStocks(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : '更新股票失败')
            return false
        }
    }

    // 删除关注股票
    const deleteStock = async (id: string) => {
        try {
            const { error } = await supabase
                .from('watch_stocks')
                .delete()
                .eq('id', id)

            if (error) throw error
            setStocks(prev => prev.filter(s => s.id !== id))
            return true
        } catch (err) {
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

