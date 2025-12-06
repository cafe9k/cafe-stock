/**
 * 消息列表面板组件
 * 显示所有消息，支持按日期分组、筛选、标记已读等
 */

import { useState, useMemo } from 'react'
import type { StockAlert, AlertType } from '../types/database'
import { ALERT_CONFIG } from '../hooks/useStockAlerts'
import './AlertListPanel.css'

interface AlertListPanelProps {
    isOpen: boolean
    alerts: StockAlert[]
    loading: boolean
    scanning: boolean
    onClose: () => void
    onMarkAsRead: (id: string) => void
    onMarkAllAsRead: () => void
    onDelete: (id: string) => void
    onScan: () => void
    onViewDetail: (alert: StockAlert) => void
}

// 按日期分组消息
function groupAlertsByDate(alerts: StockAlert[]): Map<string, StockAlert[]> {
    const groups = new Map<string, StockAlert[]>()
    
    for (const alert of alerts) {
        const date = alert.alert_date
        if (!groups.has(date)) {
            groups.set(date, [])
        }
        groups.get(date)!.push(alert)
    }
    
    return groups
}

// 格式化日期显示
function formatDateHeader(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const alertDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffDays = Math.floor((today.getTime() - alertDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays === 2) return '前天'
    
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    if (diffDays < 7) return weekDays[date.getDay()]
    
    return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取优先级颜色类名
function getPriorityClass(priority: number): string {
    switch (priority) {
        case 1: return 'priority-high'
        case 2: return 'priority-medium'
        default: return 'priority-low'
    }
}

// 消息类型筛选选项
const FILTER_OPTIONS: { value: string; label: string }[] = [
    { value: 'all', label: '全部消息' },
    { value: 'unread', label: '未读消息' },
    { value: 'high', label: '高优先级' },
    { value: 'top_list', label: '龙虎榜' },
    { value: 'block_trade', label: '大宗交易' },
    { value: 'stk_holdertrade', label: '股东增减持' },
    { value: 'share_float', label: '限售解禁' },
    { value: 'suspend_d', label: '停复牌' },
]

export default function AlertListPanel({
    isOpen,
    alerts,
    loading,
    scanning,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete,
    onScan,
    onViewDetail
}: AlertListPanelProps) {
    const [filter, setFilter] = useState('all')
    
    // 筛选消息
    const filteredAlerts = useMemo(() => {
        return alerts.filter(alert => {
            switch (filter) {
                case 'unread':
                    return !alert.is_read
                case 'high':
                    return alert.priority === 1
                case 'top_list':
                case 'block_trade':
                case 'stk_holdertrade':
                case 'share_float':
                case 'suspend_d':
                    return alert.alert_type === filter
                default:
                    return true
            }
        })
    }, [alerts, filter])
    
    // 按日期分组
    const groupedAlerts = useMemo(() => {
        return groupAlertsByDate(filteredAlerts)
    }, [filteredAlerts])
    
    // 统计
    const unreadCount = alerts.filter(a => !a.is_read).length
    
    if (!isOpen) return null
    
    return (
        <div className="alert-panel-overlay" onClick={onClose}>
            <div className="alert-panel" onClick={e => e.stopPropagation()}>
                {/* 头部 */}
                <div className="alert-panel-header">
                    <div className="header-title">
                        <span className="title-icon">📢</span>
                        <h2>消息中心</h2>
                        {unreadCount > 0 && (
                            <span className="unread-badge">{unreadCount}</span>
                        )}
                    </div>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>
                
                {/* 工具栏 */}
                <div className="alert-panel-toolbar">
                    <div className="toolbar-left">
                        <select 
                            className="filter-select"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        >
                            {FILTER_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="toolbar-right">
                        {unreadCount > 0 && (
                            <button 
                                className="btn-mark-all"
                                onClick={onMarkAllAsRead}
                            >
                                全部已读
                            </button>
                        )}
                        <button 
                            className={`btn-scan ${scanning ? 'scanning' : ''}`}
                            onClick={onScan}
                            disabled={scanning}
                        >
                            {scanning ? '扫描中...' : '🔍 扫描消息'}
                        </button>
                    </div>
                </div>
                
                {/* 消息列表 */}
                <div className="alert-panel-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>加载中...</p>
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>暂无消息</h3>
                            <p>
                                {filter === 'all' 
                                    ? '点击"扫描消息"获取关注股票的最新动态' 
                                    : '当前筛选条件下没有消息'}
                            </p>
                        </div>
                    ) : (
                        <div className="alert-list">
                            {Array.from(groupedAlerts.entries()).map(([date, dateAlerts]) => (
                                <div key={date} className="alert-date-group">
                                    <div className="date-header">
                                        <span className="date-text">{formatDateHeader(date)}</span>
                                        <span className="date-count">{dateAlerts.length} 条</span>
                                    </div>
                                    <div className="date-alerts">
                                        {dateAlerts.map(alert => (
                                            <AlertItem
                                                key={alert.id}
                                                alert={alert}
                                                onMarkAsRead={onMarkAsRead}
                                                onDelete={onDelete}
                                                onViewDetail={onViewDetail}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// 单条消息项组件
interface AlertItemProps {
    alert: StockAlert
    onMarkAsRead: (id: string) => void
    onDelete: (id: string) => void
    onViewDetail: (alert: StockAlert) => void
}

function AlertItem({ alert, onMarkAsRead, onDelete, onViewDetail }: AlertItemProps) {
    const config = ALERT_CONFIG[alert.alert_type as AlertType]
    
    const handleClick = () => {
        if (!alert.is_read) {
            onMarkAsRead(alert.id)
        }
        onViewDetail(alert)
    }
    
    return (
        <div 
            className={`alert-item ${getPriorityClass(alert.priority)} ${alert.is_read ? 'read' : 'unread'}`}
            onClick={handleClick}
        >
            <div className="alert-item-left">
                <span className="alert-icon">{config?.icon || '📢'}</span>
                {!alert.is_read && <span className="unread-dot"></span>}
            </div>
            
            <div className="alert-item-content">
                <div className="alert-item-header">
                    <span className="alert-type">{config?.label || alert.alert_type}</span>
                    <span className="alert-stock-code">{alert.ts_code}</span>
                </div>
                <div className="alert-item-title">{alert.title}</div>
            </div>
            
            <div className="alert-item-actions">
                <button 
                    className="btn-delete"
                    onClick={e => {
                        e.stopPropagation()
                        onDelete(alert.id)
                    }}
                    title="删除"
                >
                    🗑️
                </button>
            </div>
        </div>
    )
}

