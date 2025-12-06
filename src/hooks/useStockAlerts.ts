/**
 * 股票消息 Hook
 * 负责消息扫描、获取、标记已读等功能
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { tushareClient } from '../lib/tushareClient'
import { useAuth } from '../contexts/AuthContext'
import type { StockAlert, AlertType, AlertPriority, ALERT_TYPE_CONFIG } from '../types/database'

// 消息类型配置
const ALERT_CONFIG: Record<AlertType, { label: string; priority: AlertPriority; icon: string }> = {
    top_list: { label: '龙虎榜', priority: 1, icon: '🐉' },
    block_trade: { label: '大宗交易', priority: 1, icon: '💰' },
    stk_holdertrade: { label: '股东增减持', priority: 1, icon: '👥' },
    share_float: { label: '限售解禁', priority: 1, icon: '🔓' },
    suspend_d: { label: '停复牌', priority: 1, icon: '⏸️' },
    forecast: { label: '业绩预告', priority: 2, icon: '📊' },
    express: { label: '业绩快报', priority: 2, icon: '📈' },
    dividend: { label: '分红送股', priority: 2, icon: '🎁' },
    moneyflow: { label: '资金流向', priority: 2, icon: '💹' },
    margin: { label: '融资融券', priority: 2, icon: '📉' },
}

// 获取最近交易日（简单实现，跳过周末）
function getRecentTradeDates(days: number = 5): string[] {
    const dates: string[] = []
    const today = new Date()
    let count = 0
    let current = new Date(today)
    
    while (count < days) {
        const dayOfWeek = current.getDay()
        // 跳过周末
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const year = current.getFullYear()
            const month = String(current.getMonth() + 1).padStart(2, '0')
            const day = String(current.getDate()).padStart(2, '0')
            dates.push(`${year}${month}${day}`)
            count++
        }
        current.setDate(current.getDate() - 1)
    }
    
    return dates
}

// 格式化日期为 YYYY-MM-DD
function formatDateForDb(dateStr: string): string {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
}

// 消息扫描结果
interface AlertScanResult {
    type: AlertType
    ts_code: string
    date: string
    title: string
    content: Record<string, any>
}

/**
 * 股票消息 Hook
 */
export function useStockAlerts() {
    const { user } = useAuth()
    const [alerts, setAlerts] = useState<StockAlert[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [scanning, setScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const scanningRef = useRef(false)

    // 获取用户消息列表
    const fetchAlerts = useCallback(async (limit: number = 50) => {
        if (!user) return

        setLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('stock_alerts')
                .select('*')
                .eq('user_id', user.id)
                .order('alert_date', { ascending: false })
                .order('priority', { ascending: true })
                .limit(limit)

            if (fetchError) throw fetchError

            setAlerts(data || [])
            setUnreadCount((data || []).filter(a => !a.is_read).length)
        } catch (err) {
            console.error('获取消息失败:', err)
            setError(err instanceof Error ? err.message : '获取消息失败')
        } finally {
            setLoading(false)
        }
    }, [user])

    // 标记消息为已读
    const markAsRead = useCallback(async (alertId: string) => {
        if (!user) return

        try {
            const { error: updateError } = await supabase
                .from('stock_alerts')
                .update({ is_read: true })
                .eq('id', alertId)
                .eq('user_id', user.id)

            if (updateError) throw updateError

            // 更新本地状态
            setAlerts(prev => prev.map(a => 
                a.id === alertId ? { ...a, is_read: true } : a
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) {
            console.error('标记已读失败:', err)
        }
    }, [user])

    // 标记所有消息为已读
    const markAllAsRead = useCallback(async () => {
        if (!user) return

        try {
            const { error: updateError } = await supabase
                .from('stock_alerts')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false)

            if (updateError) throw updateError

            // 更新本地状态
            setAlerts(prev => prev.map(a => ({ ...a, is_read: true })))
            setUnreadCount(0)
        } catch (err) {
            console.error('标记全部已读失败:', err)
        }
    }, [user])

    // 保存消息到数据库
    const saveAlert = useCallback(async (alert: AlertScanResult) => {
        if (!user) return false

        try {
            const config = ALERT_CONFIG[alert.type]
            const alertData = {
                user_id: user.id,
                ts_code: alert.ts_code,
                alert_type: alert.type,
                alert_date: formatDateForDb(alert.date),
                title: alert.title,
                content: alert.content,
                priority: config.priority,
                is_read: false
            }

            const { error: insertError } = await supabase
                .from('stock_alerts')
                .upsert(alertData, {
                    onConflict: 'user_id,ts_code,alert_type,alert_date'
                })

            if (insertError) {
                // 忽略重复插入错误
                if (!insertError.message.includes('duplicate')) {
                    console.error('保存消息失败:', insertError)
                    return false
                }
            }

            return true
        } catch (err) {
            console.error('保存消息异常:', err)
            return false
        }
    }, [user])

    // 扫描龙虎榜
    const scanTopList = async (watchCodes: string[], tradeDate: string): Promise<AlertScanResult[]> => {
        const results: AlertScanResult[] = []
        
        try {
            const data = await tushareClient.query('top_list', {
                trade_date: tradeDate
            }, ['ts_code', 'name', 'close', 'pct_change', 'turnover_rate', 'amount', 'l_sell', 'l_buy', 'net_mf_amount', 'reason'])

            for (const item of data) {
                if (watchCodes.includes(item.ts_code)) {
                    results.push({
                        type: 'top_list',
                        ts_code: item.ts_code,
                        date: tradeDate,
                        title: `${item.name || item.ts_code} 上榜龙虎榜`,
                        content: {
                            name: item.name,
                            close: item.close,
                            pct_change: item.pct_change,
                            turnover_rate: item.turnover_rate,
                            amount: item.amount,
                            l_sell: item.l_sell,
                            l_buy: item.l_buy,
                            net_mf_amount: item.net_mf_amount,
                            reason: item.reason
                        }
                    })
                }
            }
        } catch (err) {
            console.error('扫描龙虎榜失败:', err)
        }

        return results
    }

    // 扫描大宗交易
    const scanBlockTrade = async (watchCodes: string[], tradeDate: string): Promise<AlertScanResult[]> => {
        const results: AlertScanResult[] = []
        
        try {
            const data = await tushareClient.query('block_trade', {
                trade_date: tradeDate
            }, ['ts_code', 'trade_date', 'price', 'vol', 'amount', 'buyer', 'seller'])

            for (const item of data) {
                if (watchCodes.includes(item.ts_code)) {
                    results.push({
                        type: 'block_trade',
                        ts_code: item.ts_code,
                        date: tradeDate,
                        title: `${item.ts_code} 发生大宗交易`,
                        content: {
                            price: item.price,
                            vol: item.vol,
                            amount: item.amount,
                            buyer: item.buyer,
                            seller: item.seller
                        }
                    })
                }
            }
        } catch (err) {
            console.error('扫描大宗交易失败:', err)
        }

        return results
    }

    // 扫描股东增减持
    const scanHolderTrade = async (watchCodes: string[], startDate: string, endDate: string): Promise<AlertScanResult[]> => {
        const results: AlertScanResult[] = []
        
        try {
            const data = await tushareClient.query('stk_holdertrade', {
                start_date: startDate,
                end_date: endDate
            }, ['ts_code', 'ann_date', 'holder_name', 'holder_type', 'in_de', 'change_vol', 'change_ratio', 'after_share', 'after_ratio', 'avg_price', 'total_share'])

            for (const item of data) {
                if (watchCodes.includes(item.ts_code)) {
                    const action = item.in_de === 'IN' ? '增持' : '减持'
                    results.push({
                        type: 'stk_holdertrade',
                        ts_code: item.ts_code,
                        date: item.ann_date,
                        title: `${item.ts_code} 股东${action}`,
                        content: {
                            holder_name: item.holder_name,
                            holder_type: item.holder_type,
                            in_de: item.in_de,
                            change_vol: item.change_vol,
                            change_ratio: item.change_ratio,
                            after_share: item.after_share,
                            after_ratio: item.after_ratio,
                            avg_price: item.avg_price,
                            total_share: item.total_share
                        }
                    })
                }
            }
        } catch (err) {
            console.error('扫描股东增减持失败:', err)
        }

        return results
    }

    // 扫描限售解禁
    const scanShareFloat = async (watchCodes: string[], startDate: string, endDate: string): Promise<AlertScanResult[]> => {
        const results: AlertScanResult[] = []
        
        try {
            const data = await tushareClient.query('share_float', {
                start_date: startDate,
                end_date: endDate
            }, ['ts_code', 'float_date', 'float_share', 'float_ratio', 'holder_name', 'share_type'])

            for (const item of data) {
                if (watchCodes.includes(item.ts_code)) {
                    results.push({
                        type: 'share_float',
                        ts_code: item.ts_code,
                        date: item.float_date,
                        title: `${item.ts_code} 限售股解禁`,
                        content: {
                            float_share: item.float_share,
                            float_ratio: item.float_ratio,
                            holder_name: item.holder_name,
                            share_type: item.share_type
                        }
                    })
                }
            }
        } catch (err) {
            console.error('扫描限售解禁失败:', err)
        }

        return results
    }

    // 扫描停复牌
    const scanSuspend = async (watchCodes: string[], tradeDate: string): Promise<AlertScanResult[]> => {
        const results: AlertScanResult[] = []
        
        try {
            const data = await tushareClient.query('suspend_d', {
                trade_date: tradeDate
            }, ['ts_code', 'trade_date', 'suspend_timing', 'suspend_type'])

            for (const item of data) {
                if (watchCodes.includes(item.ts_code)) {
                    const typeText = item.suspend_type === 'S' ? '停牌' : '复牌'
                    results.push({
                        type: 'suspend_d',
                        ts_code: item.ts_code,
                        date: tradeDate,
                        title: `${item.ts_code} ${typeText}`,
                        content: {
                            suspend_timing: item.suspend_timing,
                            suspend_type: item.suspend_type
                        }
                    })
                }
            }
        } catch (err) {
            console.error('扫描停复牌失败:', err)
        }

        return results
    }

    // 执行消息扫描
    const scanAlerts = useCallback(async (watchCodes: string[]) => {
        if (!user || watchCodes.length === 0) return
        if (scanningRef.current) return // 防止重复扫描

        scanningRef.current = true
        setScanning(true)
        setError(null)

        try {
            const tradeDates = getRecentTradeDates(3) // 扫描最近 3 个交易日
            const latestDate = tradeDates[0]
            const earliestDate = tradeDates[tradeDates.length - 1]
            
            console.log(`[AlertScan] 开始扫描消息，关注股票: ${watchCodes.length} 只，日期范围: ${earliestDate} ~ ${latestDate}`)

            const allResults: AlertScanResult[] = []

            // 并行扫描多个消息源（只扫描最新交易日的日级数据）
            const [topListResults, blockTradeResults, suspendResults] = await Promise.all([
                scanTopList(watchCodes, latestDate),
                scanBlockTrade(watchCodes, latestDate),
                scanSuspend(watchCodes, latestDate)
            ])

            allResults.push(...topListResults, ...blockTradeResults, ...suspendResults)

            // 扫描区间数据（股东增减持、限售解禁）
            const [holderTradeResults, shareFloatResults] = await Promise.all([
                scanHolderTrade(watchCodes, earliestDate, latestDate),
                scanShareFloat(watchCodes, earliestDate, latestDate)
            ])

            allResults.push(...holderTradeResults, ...shareFloatResults)

            console.log(`[AlertScan] 扫描完成，发现 ${allResults.length} 条消息`)

            // 保存消息到数据库
            let savedCount = 0
            for (const result of allResults) {
                const saved = await saveAlert(result)
                if (saved) savedCount++
            }

            console.log(`[AlertScan] 保存了 ${savedCount} 条新消息`)

            // 刷新消息列表
            await fetchAlerts()
        } catch (err) {
            console.error('消息扫描失败:', err)
            setError(err instanceof Error ? err.message : '消息扫描失败')
        } finally {
            setScanning(false)
            scanningRef.current = false
        }
    }, [user, saveAlert, fetchAlerts])

    // 删除消息
    const deleteAlert = useCallback(async (alertId: string) => {
        if (!user) return

        try {
            const { error: deleteError } = await supabase
                .from('stock_alerts')
                .delete()
                .eq('id', alertId)
                .eq('user_id', user.id)

            if (deleteError) throw deleteError

            // 更新本地状态
            const deletedAlert = alerts.find(a => a.id === alertId)
            setAlerts(prev => prev.filter(a => a.id !== alertId))
            if (deletedAlert && !deletedAlert.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (err) {
            console.error('删除消息失败:', err)
        }
    }, [user, alerts])

    // 初始加载消息
    useEffect(() => {
        if (user) {
            fetchAlerts()
        }
    }, [user, fetchAlerts])

    return {
        alerts,
        unreadCount,
        loading,
        scanning,
        error,
        fetchAlerts,
        scanAlerts,
        markAsRead,
        markAllAsRead,
        deleteAlert,
        ALERT_CONFIG
    }
}

export { ALERT_CONFIG }
export type { AlertScanResult }

