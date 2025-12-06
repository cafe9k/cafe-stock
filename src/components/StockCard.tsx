/**
 * 股票卡片组件
 */

import { useState } from 'react'
import type { WatchStock } from '../types/database'
import type { StockQuote } from '../hooks/useStockQuotes'
import { useRecentAnnouncements } from '../hooks/useAnnouncements'
import './StockCard.css'

interface StockCardProps {
    stock: WatchStock
    quote?: StockQuote
    groupColor?: string
    loading?: boolean
    onDelete: (id: string) => void
    onClick?: () => void
}

export default function StockCard({ stock, quote, groupColor, loading, onDelete, onClick }: StockCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [deleting, setDeleting] = useState(false)
    
    // 获取最近一周公告（最多3条）
    const { announcements, loading: announcementsLoading } = useRecentAnnouncements(stock.ts_code, 3)

    // 价格变动状态
    const priceChange = quote?.pct_chg ?? 0
    const changeClass = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'flat'
    const hasData = quote !== undefined

    // 格式化数字
    const formatNumber = (num: number | undefined, decimals = 2) => {
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
        // amount 单位是千元
        const yi = amount / 100000 // 转为亿
        if (yi >= 1) {
            return `${yi.toFixed(2)}亿`
        }
        return `${(amount / 100).toFixed(0)}万`
    }

    // 格式化市值
    const formatMarketCap = (mv: number | undefined) => {
        if (mv === undefined || mv === null) return '--'
        // total_mv 单位是万元
        const yi = mv / 10000 // 转为亿
        if (yi >= 10000) {
            return `${(yi / 10000).toFixed(2)}万亿`
        }
        return `${yi.toFixed(0)}亿`
    }

    // 格式化公告日期
    const formatAnnouncementDate = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return '今天'
        if (diffDays === 1) return '昨天'
        if (diffDays <= 7) return `${diffDays}天前`
        return `${date.getMonth() + 1}/${date.getDate()}`
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await onDelete(stock.id)
        } finally {
            setDeleting(false)
            setShowMenu(false)
        }
    }

    return (
        <div className={`stock-card ${changeClass} ${loading ? 'loading' : ''} ${!hasData ? 'no-data' : ''}`} onClick={onClick}>
            {/* 头部 */}
            <div className="card-header">
                <div className="card-title">
                    <span className="stock-name">{stock.name || '--'}</span>
                    <span className="stock-code">{stock.ts_code}</span>
                </div>
                <div className="card-actions">
                    {groupColor && (
                        <span className="group-dot" style={{ background: groupColor }}></span>
                    )}
                    <button
                        className="btn-menu"
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                    >
                        ⋮
                    </button>
                    {showMenu && (
                        <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                            <button onClick={handleDelete} disabled={deleting}>
                                {deleting ? '删除中...' : '🗑️ 取消关注'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 价格区域 */}
            <div className="card-price">
                <div className="price-main">
                    <span className={`price-value ${changeClass}`}>
                        {formatNumber(quote?.close)}
                    </span>
                    <span className={`price-change ${changeClass}`}>
                        {priceChange >= 0 ? '+' : ''}{formatNumber(quote?.change)}
                    </span>
                </div>
                <div className={`price-pct ${changeClass}`}>
                    {priceChange >= 0 ? '+' : ''}{formatNumber(priceChange)}%
                </div>
            </div>

            {/* 指标区域 */}
            <div className="card-metrics">
                <div className="metric-item">
                    <span className="metric-label">成交量</span>
                    <span className="metric-value">{formatVolume(quote?.vol)}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">成交额</span>
                    <span className="metric-value">{formatAmount(quote?.amount)}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">换手率</span>
                    <span className="metric-value">{formatNumber(quote?.turnover_rate)}%</span>
                </div>
            </div>

            {/* 扩展指标（悬浮显示） */}
            <div className="card-extra">
                <div className="extra-item">
                    <span className="extra-label">PE</span>
                    <span className="extra-value">{formatNumber(quote?.pe)}</span>
                </div>
                <div className="extra-item">
                    <span className="extra-label">PB</span>
                    <span className="extra-value">{formatNumber(quote?.pb)}</span>
                </div>
                <div className="extra-item">
                    <span className="extra-label">市值</span>
                    <span className="extra-value">{formatMarketCap(quote?.total_mv)}</span>
                </div>
            </div>

            {/* 最近公告（悬浮显示） */}
            {announcements.length > 0 && (
                <div className="card-announcements">
                    <div className="announcements-header">
                        <span className="announcements-icon">📢</span>
                        <span className="announcements-title">最近公告</span>
                    </div>
                    <div className="announcements-list">
                        {announcements.map((ann) => (
                            <a
                                key={ann.id}
                                className="announcement-item"
                                href={ann.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="announcement-date">{formatAnnouncementDate(ann.announcementTime)}</span>
                                <span className="announcement-title">{ann.announcementTitle}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* 点击遮罩层关闭菜单 */}
            {showMenu && (
                <div className="menu-backdrop" onClick={() => setShowMenu(false)}></div>
            )}
        </div>
    )
}

