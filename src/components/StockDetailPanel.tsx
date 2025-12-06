/**
 * 股票详情面板组件
 * 点击股票卡片后展开显示更多信息
 * 
 * 功能：
 * - K线图展示
 * - 近30日行情数据表格
 * - 相关消息时间线
 * - 用户备注编辑
 * - 目标价/成本价设置
 * - 技术指标信号
 */

import { useState, useEffect, useCallback } from 'react'
import type { WatchStock, StockAlert, AlertType } from '../types/database'
import type { StockQuote } from '../hooks/useStockQuotes'
import { tushareClient } from '../lib/tushareClient'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { ALERT_CONFIG } from '../hooks/useStockAlerts'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { ANNOUNCEMENT_CATEGORIES, type AnnouncementCategory } from '../lib/cninfoClient'
import './StockDetailPanel.css'

interface StockDetailPanelProps {
    stock: WatchStock
    quote?: StockQuote
    onClose: () => void
    onUpdateStock?: (id: string, updates: Partial<Pick<WatchStock, 'notes' | 'target_price' | 'cost_price'>>) => Promise<boolean>
}

// 历史日线数据
interface HistoryQuote {
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

// 技术指标信号
interface TechSignal {
    name: string
    value: string
    signal: 'buy' | 'sell' | 'neutral'
    description: string
}

// Tab 类型
type TabType = 'chart' | 'history' | 'announcements' | 'alerts' | 'settings'

export default function StockDetailPanel({ stock, quote, onClose, onUpdateStock }: StockDetailPanelProps) {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<TabType>('chart')
    const [historyData, setHistoryData] = useState<HistoryQuote[]>([])
    const [alerts, setAlerts] = useState<StockAlert[]>([])
    const [loading, setLoading] = useState(false)
    const [alertsLoading, setAlertsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // 编辑状态
    const [, setIsEditingNotes] = useState(false)
    const [notesValue, setNotesValue] = useState(stock.notes || '')
    const [targetPrice, setTargetPrice] = useState(stock.target_price?.toString() || '')
    const [costPrice, setCostPrice] = useState(stock.cost_price?.toString() || '')
    const [saving, setSaving] = useState(false)

    // ESC 键关闭
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    // 格式化数字
    const formatNumber = (num: number | undefined | null, decimals = 2) => {
        if (num === undefined || num === null) return '--'
        return num.toFixed(decimals)
    }

    // 格式化成交量（万手）
    const formatVolume = (vol: number | undefined) => {
        if (vol === undefined || vol === null) return '--'
        if (vol >= 10000) {
            return `${(vol / 10000).toFixed(1)}万`
        }
        return vol.toFixed(0)
    }

    // 格式化金额（亿元）
    const formatAmount = (amount: number | undefined) => {
        if (amount === undefined || amount === null) return '--'
        const yi = amount / 100000
        if (yi >= 1) {
            return `${yi.toFixed(2)}亿`
        }
        return `${(amount / 100).toFixed(0)}万`
    }

    // 格式化市值
    const formatMarketCap = (mv: number | undefined) => {
        if (mv === undefined || mv === null) return '--'
        const yi = mv / 10000
        if (yi >= 10000) {
            return `${(yi / 10000).toFixed(2)}万亿`
        }
        return `${yi.toFixed(0)}亿`
    }

    // 格式化日期
    const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr.length !== 8) return dateStr
        return `${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
    }

    // 格式化消息日期
    const formatAlertDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return `${date.getMonth() + 1}月${date.getDate()}日`
    }

    // 格式化公告日期
    const formatAnnouncementDate = (timestamp: number) => {
        const date = new Date(timestamp)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    // 获取历史数据
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            setError(null)
            
            try {
                // 计算日期范围（近30个交易日）
                const endDate = new Date()
                const startDate = new Date()
                startDate.setDate(startDate.getDate() - 60) // 取60天以确保有30个交易日
                
                const formatDateStr = (d: Date) => {
                    const year = d.getFullYear()
                    const month = String(d.getMonth() + 1).padStart(2, '0')
                    const day = String(d.getDate()).padStart(2, '0')
                    return `${year}${month}${day}`
                }

                const data = await tushareClient.query<HistoryQuote>('daily', {
                    ts_code: stock.ts_code,
                    start_date: formatDateStr(startDate),
                    end_date: formatDateStr(endDate),
                }, ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pre_close', 'change', 'pct_chg', 'vol', 'amount'])

                // 按日期降序排列，取前30条
                const sorted = data.sort((a, b) => b.trade_date.localeCompare(a.trade_date)).slice(0, 30)
                setHistoryData(sorted)
            } catch (err) {
                console.error('获取历史数据失败:', err)
                setError(err instanceof Error ? err.message : '获取历史数据失败')
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [stock.ts_code])

    // 获取相关消息
    useEffect(() => {
        const fetchAlerts = async () => {
            if (!user) return
            
            setAlertsLoading(true)
            try {
                const { data, error: fetchError } = await supabase
                    .from('stock_alerts')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('ts_code', stock.ts_code)
                    .order('alert_date', { ascending: false })
                    .limit(20)
                
                if (fetchError) throw fetchError
                setAlerts(data || [])
            } catch (err) {
                console.error('获取消息失败:', err)
            } finally {
                setAlertsLoading(false)
            }
        }

        fetchAlerts()
    }, [user, stock.ts_code])

    // 获取公告
    const {
        announcements,
        total: announcementsTotal,
        hasMore: announcementsHasMore,
        loading: announcementsLoading,
        error: announcementsError,
        loadMore: loadMoreAnnouncements,
        setCategory: setAnnouncementCategory,
    } = useAnnouncements({
        tsCode: stock.ts_code,
        pageSize: 10,
        autoFetch: activeTab === 'announcements',
    })

    // 计算涨跌颜色
    const getChangeClass = (pctChg: number) => {
        if (pctChg > 0) return 'up'
        if (pctChg < 0) return 'down'
        return 'flat'
    }

    // 当前涨跌状态
    const priceChange = quote?.pct_chg ?? 0
    const changeClass = getChangeClass(priceChange)

    // 计算简易K线数据（用于缩略图）
    const klineData = historyData.slice().reverse() // 按时间正序

    // 计算K线的最高最低价，用于缩放
    const priceRange = klineData.length > 0 ? {
        min: Math.min(...klineData.map(d => d.low)),
        max: Math.max(...klineData.map(d => d.high)),
    } : { min: 0, max: 0 }

    const scaleY = (price: number) => {
        if (priceRange.max === priceRange.min) return 50
        return 100 - ((price - priceRange.min) / (priceRange.max - priceRange.min)) * 100
    }

    // 计算技术指标信号
    const techSignals: TechSignal[] = []
    
    if (klineData.length >= 10) {
        // 计算 MA5 和 MA10
        const closes = klineData.map(d => d.close)
        const ma5 = closes.slice(-5).reduce((a, b) => a + b, 0) / 5
        const ma10 = closes.slice(-10).reduce((a, b) => a + b, 0) / 10
        const currentPrice = closes[closes.length - 1]
        
        // MA 金叉/死叉信号
        const maSignal: TechSignal = {
            name: 'MA均线',
            value: `MA5: ${ma5.toFixed(2)} / MA10: ${ma10.toFixed(2)}`,
            signal: ma5 > ma10 ? 'buy' : ma5 < ma10 ? 'sell' : 'neutral',
            description: ma5 > ma10 ? '短期均线在长期均线上方，多头趋势' : 
                         ma5 < ma10 ? '短期均线在长期均线下方，空头趋势' : '均线交叉'
        }
        techSignals.push(maSignal)
        
        // 价格相对位置
        const pricePosition = ((currentPrice - priceRange.min) / (priceRange.max - priceRange.min) * 100).toFixed(0)
        const positionSignal: TechSignal = {
            name: '价格位置',
            value: `${pricePosition}%`,
            signal: Number(pricePosition) > 70 ? 'sell' : Number(pricePosition) < 30 ? 'buy' : 'neutral',
            description: `当前价格处于近30日价格区间的 ${pricePosition}% 位置`
        }
        techSignals.push(positionSignal)
        
        // 成交量信号
        if (klineData.length >= 5) {
            const recentVols = klineData.slice(-5).map(d => d.vol)
            const avgVol = recentVols.reduce((a, b) => a + b, 0) / 5
            const todayVol = recentVols[recentVols.length - 1]
            const volRatio = todayVol / avgVol
            
            const volSignal: TechSignal = {
                name: '成交量',
                value: `${(volRatio * 100).toFixed(0)}%`,
                signal: volRatio > 1.5 ? (priceChange > 0 ? 'buy' : 'sell') : 'neutral',
                description: volRatio > 1.5 ? '放量' + (priceChange > 0 ? '上涨，买入信号' : '下跌，卖出信号') :
                             volRatio < 0.7 ? '缩量，观望' : '成交量正常'
            }
            techSignals.push(volSignal)
        }
    }

    // 保存设置
    const handleSaveSettings = useCallback(async () => {
        if (!onUpdateStock) return
        
        setSaving(true)
        try {
            const updates: Partial<Pick<WatchStock, 'notes' | 'target_price' | 'cost_price'>> = {}
            
            if (notesValue !== (stock.notes || '')) {
                updates.notes = notesValue || null
            }
            
            const newTargetPrice = targetPrice ? parseFloat(targetPrice) : null
            if (newTargetPrice !== stock.target_price) {
                updates.target_price = newTargetPrice
            }
            
            const newCostPrice = costPrice ? parseFloat(costPrice) : null
            if (newCostPrice !== stock.cost_price) {
                updates.cost_price = newCostPrice
            }
            
            if (Object.keys(updates).length > 0) {
                await onUpdateStock(stock.id, updates)
            }
            
            setIsEditingNotes(false)
        } catch (err) {
            console.error('保存设置失败:', err)
        } finally {
            setSaving(false)
        }
    }, [onUpdateStock, stock, notesValue, targetPrice, costPrice])

    // 计算盈亏
    const calculateProfit = () => {
        if (!quote?.close || !stock.cost_price) return null
        const profit = ((quote.close - stock.cost_price) / stock.cost_price * 100)
        return {
            value: profit,
            class: profit >= 0 ? 'up' : 'down'
        }
    }

    const profit = calculateProfit()

    return (
        <div className="detail-panel-overlay" onClick={onClose}>
            <div className="detail-panel" onClick={e => e.stopPropagation()}>
                {/* 头部 */}
                <div className="detail-header">
                    <div className="detail-title">
                        <h2>{stock.name || '--'}</h2>
                        <span className="detail-code">{stock.ts_code}</span>
                    </div>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>

                {/* 价格概览 */}
                <div className="detail-price-section">
                    <div className="price-overview">
                        <span className={`current-price ${changeClass}`}>
                            {formatNumber(quote?.close)}
                        </span>
                        <div className="price-changes">
                            <span className={changeClass}>
                                {priceChange >= 0 ? '+' : ''}{formatNumber(quote?.change)}
                            </span>
                            <span className={`pct-change ${changeClass}`}>
                                {priceChange >= 0 ? '+' : ''}{formatNumber(priceChange)}%
                            </span>
                        </div>
                    </div>
                    
                    {/* 成本价和盈亏显示 */}
                    {stock.cost_price && (
                        <div className="cost-profit-bar">
                            <span className="cost-label">成本 {formatNumber(stock.cost_price)}</span>
                            {profit && (
                                <span className={`profit-value ${profit.class}`}>
                                    {profit.value >= 0 ? '+' : ''}{profit.value.toFixed(2)}%
                                </span>
                            )}
                            {stock.target_price && (
                                <span className="target-label">目标 {formatNumber(stock.target_price)}</span>
                            )}
                        </div>
                    )}
                    
                    {/* 当日行情 */}
                    <div className="price-detail-grid">
                        <div className="price-item">
                            <span className="label">开盘</span>
                            <span className="value">{formatNumber(quote?.open)}</span>
                        </div>
                        <div className="price-item">
                            <span className="label">最高</span>
                            <span className="value up">{formatNumber(quote?.high)}</span>
                        </div>
                        <div className="price-item">
                            <span className="label">最低</span>
                            <span className="value down">{formatNumber(quote?.low)}</span>
                        </div>
                        <div className="price-item">
                            <span className="label">昨收</span>
                            <span className="value">{formatNumber(quote?.pre_close)}</span>
                        </div>
                    </div>
                </div>

                {/* 关键指标 */}
                <div className="detail-metrics">
                    <div className="metrics-row">
                        <div className="metric-box">
                            <span className="metric-label">成交量</span>
                            <span className="metric-value">{formatVolume(quote?.vol)}</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-label">成交额</span>
                            <span className="metric-value">{formatAmount(quote?.amount)}</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-label">换手率</span>
                            <span className="metric-value">{formatNumber(quote?.turnover_rate)}%</span>
                        </div>
                    </div>
                    <div className="metrics-row">
                        <div className="metric-box">
                            <span className="metric-label">市盈率PE</span>
                            <span className="metric-value">{formatNumber(quote?.pe)}</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-label">市净率PB</span>
                            <span className="metric-value">{formatNumber(quote?.pb)}</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-label">总市值</span>
                            <span className="metric-value">{formatMarketCap(quote?.total_mv)}</span>
                        </div>
                    </div>
                </div>

                {/* Tab 导航 */}
                <div className="detail-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chart')}
                    >
                        📈 走势
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        📊 行情
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('announcements')}
                    >
                        📄 公告
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('alerts')}
                    >
                        📢 消息 {alerts.length > 0 && <span className="tab-badge">{alerts.length}</span>}
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        ⚙️ 设置
                    </button>
                </div>

                {/* Tab 内容 */}
                <div className="detail-tab-content">
                    {/* K线图 Tab */}
                    {activeTab === 'chart' && (
                        <>
                            {/* K线缩略图 */}
                            <div className="kline-section">
                                <h3>近30日走势</h3>
                                {loading ? (
                                    <div className="kline-loading">加载中...</div>
                                ) : error ? (
                                    <div className="kline-error">{error}</div>
                                ) : (
                                    <div className="kline-chart">
                                        <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                                            {/* 网格线 */}
                                            <line x1="0" y1="25" x2="300" y2="25" className="grid-line" />
                                            <line x1="0" y1="50" x2="300" y2="50" className="grid-line" />
                                            <line x1="0" y1="75" x2="300" y2="75" className="grid-line" />
                                            
                                            {/* K线蜡烛 */}
                                            {klineData.map((d, i) => {
                                                const x = (i / klineData.length) * 300 + 5
                                                const candleWidth = 280 / klineData.length - 2
                                                const isUp = d.close >= d.open
                                                const bodyTop = scaleY(Math.max(d.open, d.close))
                                                const bodyBottom = scaleY(Math.min(d.open, d.close))
                                                const bodyHeight = Math.max(bodyBottom - bodyTop, 1)
                                                
                                                return (
                                                    <g key={d.trade_date}>
                                                        {/* 影线 */}
                                                        <line
                                                            x1={x + candleWidth / 2}
                                                            y1={scaleY(d.high)}
                                                            x2={x + candleWidth / 2}
                                                            y2={scaleY(d.low)}
                                                            className={`wick ${isUp ? 'up' : 'down'}`}
                                                        />
                                                        {/* 实体 */}
                                                        <rect
                                                            x={x}
                                                            y={bodyTop}
                                                            width={candleWidth}
                                                            height={bodyHeight}
                                                            className={`candle ${isUp ? 'up' : 'down'}`}
                                                        />
                                                    </g>
                                                )
                                            })}
                                        </svg>
                                        <div className="kline-legend">
                                            <span>{formatNumber(priceRange.max)}</span>
                                            <span>{formatNumber(priceRange.min)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 技术指标信号 */}
                            {techSignals.length > 0 && (
                                <div className="tech-signals-section">
                                    <h3>技术指标</h3>
                                    <div className="tech-signals-list">
                                        {techSignals.map((signal, i) => (
                                            <div key={i} className={`tech-signal-item signal-${signal.signal}`}>
                                                <div className="signal-header">
                                                    <span className="signal-name">{signal.name}</span>
                                                    <span className={`signal-badge ${signal.signal}`}>
                                                        {signal.signal === 'buy' ? '看多' : 
                                                         signal.signal === 'sell' ? '看空' : '中性'}
                                                    </span>
                                                </div>
                                                <div className="signal-value">{signal.value}</div>
                                                <div className="signal-desc">{signal.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* 历史行情 Tab */}
                    {activeTab === 'history' && (
                        <div className="history-section">
                            <h3>近期行情</h3>
                            <div className="history-table-wrapper">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>日期</th>
                                            <th>收盘</th>
                                            <th>涨跌幅</th>
                                            <th>成交量</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map(d => (
                                            <tr key={d.trade_date}>
                                                <td>{formatDate(d.trade_date)}</td>
                                                <td>{formatNumber(d.close)}</td>
                                                <td className={getChangeClass(d.pct_chg)}>
                                                    {d.pct_chg >= 0 ? '+' : ''}{formatNumber(d.pct_chg)}%
                                                </td>
                                                <td>{formatVolume(d.vol)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 公告 Tab */}
                    {activeTab === 'announcements' && (
                        <div className="announcements-section">
                            <div className="announcements-header-bar">
                                <h3>公司公告</h3>
                                <span className="announcements-count">共 {announcementsTotal} 条</span>
                            </div>
                            
                            {/* 类别筛选 */}
                            <div className="announcements-filter">
                                <button 
                                    className="filter-btn active"
                                    onClick={() => setAnnouncementCategory(undefined)}
                                >
                                    全部
                                </button>
                                {Object.entries(ANNOUNCEMENT_CATEGORIES).map(([key, label]) => (
                                    <button
                                        key={key}
                                        className="filter-btn"
                                        onClick={() => setAnnouncementCategory(key as AnnouncementCategory)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* 公告列表 */}
                            {announcementsLoading && announcements.length === 0 ? (
                                <div className="announcements-loading">加载中...</div>
                            ) : announcementsError ? (
                                <div className="announcements-error">{announcementsError}</div>
                            ) : announcements.length === 0 ? (
                                <div className="announcements-empty">
                                    <span className="empty-icon">📄</span>
                                    <p>暂无公告</p>
                                </div>
                            ) : (
                                <>
                                    <div className="announcements-list-detail">
                                        {announcements.map((ann) => (
                                            <a
                                                key={ann.id}
                                                className="announcement-card"
                                                href={ann.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className="announcement-card-header">
                                                    <span className="announcement-card-date">
                                                        {formatAnnouncementDate(ann.announcementTime)}
                                                    </span>
                                                    <span className="announcement-card-type">
                                                        {ann.adjunctType}
                                                    </span>
                                                </div>
                                                <div className="announcement-card-title">
                                                    {ann.announcementTitle}
                                                </div>
                                                <div className="announcement-card-footer">
                                                    <span className="announcement-card-size">
                                                        {ann.adjunctSize > 1024 
                                                            ? `${(ann.adjunctSize / 1024).toFixed(1)} MB`
                                                            : `${ann.adjunctSize} KB`
                                                        }
                                                    </span>
                                                    <span className="announcement-card-link">
                                                        查看 →
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    
                                    {/* 加载更多 */}
                                    {announcementsHasMore && (
                                        <div className="announcements-load-more">
                                            <button 
                                                onClick={loadMoreAnnouncements}
                                                disabled={announcementsLoading}
                                            >
                                                {announcementsLoading ? '加载中...' : '加载更多'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* 消息时间线 Tab */}
                    {activeTab === 'alerts' && (
                        <div className="alerts-timeline-section">
                            <h3>相关消息</h3>
                            {alertsLoading ? (
                                <div className="alerts-loading">加载中...</div>
                            ) : alerts.length === 0 ? (
                                <div className="alerts-empty">
                                    <span className="empty-icon">📭</span>
                                    <p>暂无相关消息</p>
                                </div>
                            ) : (
                                <div className="alerts-timeline">
                                    {alerts.map((alert, i) => {
                                        const config = ALERT_CONFIG[alert.alert_type as AlertType]
                                        return (
                                            <div key={alert.id} className={`timeline-item priority-${alert.priority}`}>
                                                <div className="timeline-dot">
                                                    <span className="dot-icon">{config?.icon || '📢'}</span>
                                                </div>
                                                <div className="timeline-content">
                                                    <div className="timeline-header">
                                                        <span className="timeline-type">{config?.label || alert.alert_type}</span>
                                                        <span className="timeline-date">{formatAlertDate(alert.alert_date)}</span>
                                                    </div>
                                                    <div className="timeline-title">{alert.title}</div>
                                                </div>
                                                {i < alerts.length - 1 && <div className="timeline-line"></div>}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 设置 Tab */}
                    {activeTab === 'settings' && (
                        <div className="settings-section">
                            {/* 价格设置 */}
                            <div className="settings-group">
                                <h3>价格设置</h3>
                                <div className="settings-row">
                                    <div className="setting-item">
                                        <label>成本价</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="输入成本价"
                                            value={costPrice}
                                            onChange={e => setCostPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-item">
                                        <label>目标价</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="输入目标价"
                                            value={targetPrice}
                                            onChange={e => setTargetPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 备注 */}
                            <div className="settings-group">
                                <h3>备注</h3>
                                <div className="notes-editor">
                                    <textarea
                                        placeholder="添加备注..."
                                        value={notesValue}
                                        onChange={e => setNotesValue(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* 保存按钮 */}
                            <div className="settings-actions">
                                <button 
                                    className="btn-save"
                                    onClick={handleSaveSettings}
                                    disabled={saving}
                                >
                                    {saving ? '保存中...' : '保存设置'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
