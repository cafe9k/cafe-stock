/**
 * 缓存状态栏组件
 * 在页面底部显示数据来源、更新时间和缓存状态
 */

import { useState, useEffect, useCallback } from 'react'
import { tushareCache } from '../lib/tushareCache'
import { cninfoCache } from '../lib/cninfoCache'
import './CacheStatusBar.css'

interface CacheStatusBarProps {
    className?: string
    lastUpdate?: string  // 最后更新时间
}

export default function CacheStatusBar({ className = '', lastUpdate = '--' }: CacheStatusBarProps) {
    const [expanded, setExpanded] = useState(false)
    const [stats, setStats] = useState({ entries: 0, totalSize: '0 B' })
    const [cninfoStats, setCninfoStats] = useState({ entries: 0, totalSize: '0 B' })
    
    // 刷新缓存状态
    const refreshStatus = useCallback(() => {
        setStats(tushareCache.getStats())
        setCninfoStats(cninfoCache.getStats())
    }, [])
    
    // 定时刷新
    useEffect(() => {
        refreshStatus()
        const timer = setInterval(refreshStatus, 5000) // 每 5 秒刷新
        return () => clearInterval(timer)
    }, [refreshStatus])
    
    // 清空缓存
    const handleClearCache = () => {
        if (confirm('确定要清空所有缓存吗？这将导致下次请求重新获取数据。')) {
            tushareCache.clear()
            cninfoCache.clear()
            refreshStatus()
        }
    }
    
    const totalEntries = stats.entries + cninfoStats.entries
    
    // 计算总大小
    const parseSize = (sizeStr: string): number => {
        const match = sizeStr.match(/^([\d.]+)\s*(B|KB|MB)$/)
        if (!match) return 0
        const value = parseFloat(match[1])
        const unit = match[2]
        if (unit === 'KB') return value * 1024
        if (unit === 'MB') return value * 1024 * 1024
        return value
    }
    
    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }
    
    const totalSize = formatSize(parseSize(stats.totalSize) + parseSize(cninfoStats.totalSize))
    
    return (
        <footer className={`cache-status-bar ${className} ${expanded ? 'expanded' : ''}`} role="contentinfo">
            {/* 折叠状态的简要信息 */}
            <div className="cache-summary" onClick={() => setExpanded(!expanded)} role="button" aria-expanded={expanded} tabIndex={0}>
                {/* 左侧：数据来源和更新时间 */}
                <div className="cache-summary-left">
                    <span className="status-item">
                        <span className="status-dot"></span>
                        数据来源: Tushare Pro / 巨潮资讯
                    </span>
                    <span className="status-divider">|</span>
                    <span className="status-item">
                        更新: {lastUpdate}
                    </span>
                </div>
                
                {/* 右侧：缓存状态 */}
                <div className="cache-summary-right">
                    <span className="cache-icon">💾</span>
                    <span className="cache-label">缓存</span>
                    <span className="cache-count">{totalEntries}</span>
                    <span className="cache-size">{totalSize}</span>
                    <span className={`expand-icon ${expanded ? 'rotated' : ''}`}>▲</span>
                </div>
            </div>
            
            {/* 展开状态的详细信息 */}
            {expanded && (
                <div className="cache-detail">
                    <div className="cache-detail-header">
                        <h4>缓存数据详情</h4>
                        <button className="btn-clear-cache" onClick={handleClearCache}>
                            清空缓存
                        </button>
                    </div>
                    
                    <div className="cache-stats-grid">
                        <div className="cache-stat-item">
                            <div className="cache-stat-label">Tushare 数据</div>
                            <div className="cache-stat-value">{stats.entries} 条</div>
                            <div className="cache-stat-size">{stats.totalSize}</div>
                        </div>
                        <div className="cache-stat-item">
                            <div className="cache-stat-label">公告数据</div>
                            <div className="cache-stat-value">{cninfoStats.entries} 条</div>
                            <div className="cache-stat-size">{cninfoStats.totalSize}</div>
                        </div>
                    </div>
                    
                    <div className="cache-tip">
                        💡 所有数据缓存 24 小时，避免重复请求
                    </div>
                </div>
            )}
        </footer>
    )
}
