/**
 * 股票详情面板组件
 * 点击股票卡片后展开显示更多信息
 */

import { useState, useEffect } from 'react'
import type { WatchStock } from '../types/database'
import type { StockQuote } from '../hooks/useStockQuotes'
import { tushareClient } from '../lib/tushareClient'
import './StockDetailPanel.css'

interface StockDetailPanelProps {
    stock: WatchStock
    quote?: StockQuote
    onClose: () => void
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

export default function StockDetailPanel({ stock, quote, onClose }: StockDetailPanelProps) {
    const [historyData, setHistoryData] = useState<HistoryQuote[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

                {/* 历史数据表格 */}
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
                                {historyData.slice(0, 10).map(d => (
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

                {/* 用户备注 */}
                {stock.notes && (
                    <div className="notes-section">
                        <h3>备注</h3>
                        <p>{stock.notes}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

