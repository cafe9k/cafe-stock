/**
 * 消息详情弹窗组件
 * 显示单条消息的详细信息
 */

import type { StockAlert, AlertType } from '../types/database'
import { ALERT_CONFIG } from '../hooks/useStockAlerts'
import './AlertDetailModal.css'

interface AlertDetailModalProps {
    alert: StockAlert | null
    onClose: () => void
}

// 格式化日期
function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化数值
function formatNumber(value: number | null | undefined, decimals: number = 2): string {
    if (value === null || value === undefined) return '--'
    return value.toLocaleString('zh-CN', { 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals 
    })
}

// 格式化金额（万元）
function formatAmount(value: number | null | undefined): string {
    if (value === null || value === undefined) return '--'
    if (value >= 10000) {
        return `${(value / 10000).toFixed(2)}亿`
    }
    return `${value.toFixed(2)}万`
}

// 格式化百分比
function formatPercent(value: number | null | undefined): string {
    if (value === null || value === undefined) return '--'
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

// 获取优先级颜色类名
function getPriorityClass(priority: number): string {
    switch (priority) {
        case 1: return 'priority-high'
        case 2: return 'priority-medium'
        default: return 'priority-low'
    }
}

// 渲染龙虎榜详情
function renderTopListContent(content: Record<string, any>) {
    return (
        <div className="detail-content-grid">
            <div className="detail-item">
                <span className="label">股票名称</span>
                <span className="value">{content.name || '--'}</span>
            </div>
            <div className="detail-item">
                <span className="label">收盘价</span>
                <span className="value">{formatNumber(content.close)}</span>
            </div>
            <div className="detail-item">
                <span className="label">涨跌幅</span>
                <span className={`value ${(content.pct_change || 0) >= 0 ? 'color-up' : 'color-down'}`}>
                    {formatPercent(content.pct_change)}
                </span>
            </div>
            <div className="detail-item">
                <span className="label">换手率</span>
                <span className="value">{formatPercent(content.turnover_rate)}</span>
            </div>
            <div className="detail-item">
                <span className="label">成交额</span>
                <span className="value">{formatAmount(content.amount)}</span>
            </div>
            <div className="detail-item">
                <span className="label">龙虎榜买入</span>
                <span className="value color-up">{formatAmount(content.l_buy)}</span>
            </div>
            <div className="detail-item">
                <span className="label">龙虎榜卖出</span>
                <span className="value color-down">{formatAmount(content.l_sell)}</span>
            </div>
            <div className="detail-item">
                <span className="label">净买入</span>
                <span className={`value ${(content.net_mf_amount || 0) >= 0 ? 'color-up' : 'color-down'}`}>
                    {formatAmount(content.net_mf_amount)}
                </span>
            </div>
            {content.reason && (
                <div className="detail-item full-width">
                    <span className="label">上榜原因</span>
                    <span className="value">{content.reason}</span>
                </div>
            )}
        </div>
    )
}

// 渲染大宗交易详情
function renderBlockTradeContent(content: Record<string, any>) {
    return (
        <div className="detail-content-grid">
            <div className="detail-item">
                <span className="label">成交价</span>
                <span className="value">{formatNumber(content.price)}</span>
            </div>
            <div className="detail-item">
                <span className="label">成交量</span>
                <span className="value">{formatNumber(content.vol, 0)}股</span>
            </div>
            <div className="detail-item">
                <span className="label">成交额</span>
                <span className="value">{formatAmount(content.amount)}</span>
            </div>
            {content.buyer && (
                <div className="detail-item full-width">
                    <span className="label">买方营业部</span>
                    <span className="value">{content.buyer}</span>
                </div>
            )}
            {content.seller && (
                <div className="detail-item full-width">
                    <span className="label">卖方营业部</span>
                    <span className="value">{content.seller}</span>
                </div>
            )}
        </div>
    )
}

// 渲染股东增减持详情
function renderHolderTradeContent(content: Record<string, any>) {
    const isIncrease = content.in_de === 'IN'
    return (
        <div className="detail-content-grid">
            <div className="detail-item full-width">
                <span className="label">股东名称</span>
                <span className="value">{content.holder_name || '--'}</span>
            </div>
            <div className="detail-item">
                <span className="label">股东类型</span>
                <span className="value">{content.holder_type || '--'}</span>
            </div>
            <div className="detail-item">
                <span className="label">变动方向</span>
                <span className={`value ${isIncrease ? 'color-up' : 'color-down'}`}>
                    {isIncrease ? '增持' : '减持'}
                </span>
            </div>
            <div className="detail-item">
                <span className="label">变动数量</span>
                <span className={`value ${isIncrease ? 'color-up' : 'color-down'}`}>
                    {formatNumber(content.change_vol, 0)}股
                </span>
            </div>
            <div className="detail-item">
                <span className="label">变动比例</span>
                <span className={`value ${isIncrease ? 'color-up' : 'color-down'}`}>
                    {formatPercent(content.change_ratio)}
                </span>
            </div>
            <div className="detail-item">
                <span className="label">变动后持股</span>
                <span className="value">{formatNumber(content.after_share, 0)}股</span>
            </div>
            <div className="detail-item">
                <span className="label">变动后占比</span>
                <span className="value">{formatPercent(content.after_ratio)}</span>
            </div>
            {content.avg_price && (
                <div className="detail-item">
                    <span className="label">均价</span>
                    <span className="value">{formatNumber(content.avg_price)}</span>
                </div>
            )}
        </div>
    )
}

// 渲染限售解禁详情
function renderShareFloatContent(content: Record<string, any>) {
    return (
        <div className="detail-content-grid">
            <div className="detail-item">
                <span className="label">解禁股份</span>
                <span className="value">{formatNumber(content.float_share, 0)}股</span>
            </div>
            <div className="detail-item">
                <span className="label">解禁比例</span>
                <span className="value">{formatPercent(content.float_ratio)}</span>
            </div>
            {content.holder_name && (
                <div className="detail-item full-width">
                    <span className="label">股东名称</span>
                    <span className="value">{content.holder_name}</span>
                </div>
            )}
            {content.share_type && (
                <div className="detail-item full-width">
                    <span className="label">股份类型</span>
                    <span className="value">{content.share_type}</span>
                </div>
            )}
        </div>
    )
}

// 渲染停复牌详情
function renderSuspendContent(content: Record<string, any>) {
    const isSuspend = content.suspend_type === 'S'
    return (
        <div className="detail-content-grid">
            <div className="detail-item">
                <span className="label">状态</span>
                <span className={`value ${isSuspend ? 'color-down' : 'color-up'}`}>
                    {isSuspend ? '停牌' : '复牌'}
                </span>
            </div>
            {content.suspend_timing && (
                <div className="detail-item">
                    <span className="label">停牌时间</span>
                    <span className="value">{content.suspend_timing}</span>
                </div>
            )}
        </div>
    )
}

// 渲染通用详情
function renderDefaultContent(content: Record<string, any>) {
    return (
        <div className="detail-content-grid">
            {Object.entries(content).map(([key, value]) => (
                <div key={key} className="detail-item">
                    <span className="label">{key}</span>
                    <span className="value">
                        {typeof value === 'number' ? formatNumber(value) : String(value || '--')}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default function AlertDetailModal({ alert, onClose }: AlertDetailModalProps) {
    if (!alert) return null
    
    const config = ALERT_CONFIG[alert.alert_type as AlertType]
    const content = alert.content || {}
    
    // 根据消息类型渲染不同的内容
    const renderContent = () => {
        switch (alert.alert_type) {
            case 'top_list':
                return renderTopListContent(content)
            case 'block_trade':
                return renderBlockTradeContent(content)
            case 'stk_holdertrade':
                return renderHolderTradeContent(content)
            case 'share_float':
                return renderShareFloatContent(content)
            case 'suspend_d':
                return renderSuspendContent(content)
            default:
                return renderDefaultContent(content)
        }
    }
    
    return (
        <div className="alert-detail-overlay" onClick={onClose}>
            <div className="alert-detail-modal" onClick={e => e.stopPropagation()}>
                {/* 头部 */}
                <div className={`alert-detail-header ${getPriorityClass(alert.priority)}`}>
                    <div className="header-icon">{config?.icon || '📢'}</div>
                    <div className="header-info">
                        <div className="header-type">{config?.label || alert.alert_type}</div>
                        <div className="header-title">{alert.title}</div>
                    </div>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>
                
                {/* 基本信息 */}
                <div className="alert-detail-meta">
                    <div className="meta-item">
                        <span className="meta-label">股票代码</span>
                        <span className="meta-value code">{alert.ts_code}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">消息日期</span>
                        <span className="meta-value">{formatDate(alert.alert_date)}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">优先级</span>
                        <span className={`meta-value priority ${getPriorityClass(alert.priority)}`}>
                            {alert.priority === 1 ? '高' : alert.priority === 2 ? '中' : '低'}
                        </span>
                    </div>
                </div>
                
                {/* 详细内容 */}
                <div className="alert-detail-body">
                    <h4>详细信息</h4>
                    {renderContent()}
                </div>
                
                {/* 底部 */}
                <div className="alert-detail-footer">
                    <button className="btn-close-footer" onClick={onClose}>
                        关闭
                    </button>
                </div>
            </div>
        </div>
    )
}

