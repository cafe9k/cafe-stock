/**
 * 缓存状态栏组件
 * 在页面底部显示数据来源、更新时间和缓存状态
 */

import { useState, useEffect, useCallback } from 'react'
import { tushareCache, CacheEntryInfo } from '../lib/tushareCache'
import './CacheStatusBar.css'

// 接口名称的中文映射
const API_NAME_MAP: Record<string, string> = {
    'stock_basic': '股票列表',
    'trade_cal': '交易日历',
    'stock_company': '公司信息',
    'index_basic': '指数信息',
    'fund_basic': '基金信息',
    'hs_const': '沪深股通',
    'namechange': '股票更名',
    'concept': '概念板块',
    'concept_detail': '概念成分',
    'daily': '日线行情',
    'daily_basic': '每日指标',
    'adj_factor': '复权因子',
    'moneyflow': '资金流向',
}

// 格式化剩余时间
function formatRemainingTime(ms: number): string {
    if (ms <= 0) return '已过期'
    
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}天${hours % 24}小时`
    if (hours > 0) return `${hours}小时${minutes % 60}分钟`
    if (minutes > 0) return `${minutes}分钟`
    return `${seconds}秒`
}

// 格式化缓存时间
function formatCacheTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60 * 1000) return '刚刚'
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60 / 1000)}分钟前`
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 60 / 60 / 1000)}小时前`
    
    return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

interface CacheStatusBarProps {
    className?: string
    lastUpdate?: string  // 最后更新时间
}

export default function CacheStatusBar({ className = '', lastUpdate = '--' }: CacheStatusBarProps) {
    const [entries, setEntries] = useState<CacheEntryInfo[]>([])
    const [expanded, setExpanded] = useState(false)
    const [stats, setStats] = useState({ memoryEntries: 0, localStorageEntries: 0, totalSize: '0 B' })
    
    // 刷新缓存状态
    const refreshStatus = useCallback(() => {
        setEntries(tushareCache.getCacheEntries())
        setStats(tushareCache.getStats())
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
            refreshStatus()
        }
    }
    
    // 按类型分组
    const staticEntries = entries.filter(e => e.isPersistent && !e.isExpired)
    const dynamicEntries = entries.filter(e => !e.isPersistent && !e.isExpired)
    const cacheCount = entries.filter(e => !e.isExpired).length
    
    return (
        <footer className={`cache-status-bar ${className} ${expanded ? 'expanded' : ''}`} role="contentinfo">
            {/* 折叠状态的简要信息 */}
            <div className="cache-summary" onClick={() => setExpanded(!expanded)} role="button" aria-expanded={expanded} tabIndex={0}>
                {/* 左侧：数据来源和更新时间 */}
                <div className="cache-summary-left">
                    <span className="status-item">
                        <span className="status-dot"></span>
                        数据来源: Tushare Pro
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
                    <span className="cache-count">{cacheCount}</span>
                    {staticEntries.length > 0 && (
                        <span className="cache-tag static" title="静态数据（24小时缓存）">
                            静态{staticEntries.length}
                        </span>
                    )}
                    {dynamicEntries.length > 0 && (
                        <span className="cache-tag dynamic" title="动态数据（5分钟缓存）">
                            动态{dynamicEntries.length}
                        </span>
                    )}
                    <span className="cache-size">{stats.totalSize}</span>
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
                    
                    {entries.length === 0 ? (
                        <div className="cache-empty">暂无缓存数据</div>
                    ) : (
                        <div className="cache-list">
                            {/* 静态数据（长期缓存） */}
                            {staticEntries.length > 0 && (
                                <div className="cache-group">
                                    <div className="cache-group-title">
                                        <span className="dot static"></span>
                                        静态数据（24小时+缓存）
                                    </div>
                                    {staticEntries.map((entry, idx) => (
                                        <CacheEntryItem key={idx} entry={entry} />
                                    ))}
                                </div>
                            )}
                            
                            {/* 动态数据（短期缓存） */}
                            {dynamicEntries.length > 0 && (
                                <div className="cache-group">
                                    <div className="cache-group-title">
                                        <span className="dot dynamic"></span>
                                        动态数据（短期缓存）
                                    </div>
                                    {dynamicEntries.map((entry, idx) => (
                                        <CacheEntryItem key={idx} entry={entry} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="cache-tip">
                        💡 提示：缓存数据可能不是最新的，点击刷新按钮可获取最新数据
                    </div>
                </div>
            )}
        </footer>
    )
}

// 单个缓存条目
function CacheEntryItem({ entry }: { entry: CacheEntryInfo }) {
    const apiNameCn = API_NAME_MAP[entry.apiName] || entry.apiName
    
    return (
        <div className="cache-entry">
            <div className="cache-entry-main">
                <span className="cache-entry-name">{apiNameCn}</span>
                <span className="cache-entry-count">{entry.dataCount} 条</span>
            </div>
            <div className="cache-entry-meta">
                <span className="cache-entry-time">
                    缓存于 {formatCacheTime(entry.cachedAt)}
                </span>
                <span className="cache-entry-remaining">
                    剩余 {formatRemainingTime(entry.remainingMs)}
                </span>
            </div>
        </div>
    )
}
