/**
 * 消息横幅组件
 * 在页面顶部显示未读消息的滚动展示
 */

import { useState, useEffect, useCallback } from 'react'
import type { StockAlert, AlertType } from '../types/database'
import { ALERT_CONFIG } from '../hooks/useStockAlerts'
import './AlertBanner.css'

interface AlertBannerProps {
    alerts: StockAlert[]
    unreadCount: number
    onViewAll: () => void
    onMarkAsRead: (id: string) => void
}

// 获取优先级颜色类名
function getPriorityClass(priority: number): string {
    switch (priority) {
        case 1: return 'priority-high'
        case 2: return 'priority-medium'
        default: return 'priority-low'
    }
}

// 格式化日期显示
function formatAlertDate(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays < 7) return `${diffDays}天前`
    
    return `${date.getMonth() + 1}月${date.getDate()}日`
}

export default function AlertBanner({ alerts, unreadCount, onViewAll, onMarkAsRead }: AlertBannerProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    
    // 未读消息
    const unreadAlerts = alerts.filter(a => !a.is_read)
    
    // 自动轮播
    useEffect(() => {
        if (unreadAlerts.length <= 1 || isHovered) return
        
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % unreadAlerts.length)
        }, 4000)
        
        return () => clearInterval(timer)
    }, [unreadAlerts.length, isHovered])
    
    // 手动切换
    const goToPrev = useCallback(() => {
        setCurrentIndex(prev => 
            prev === 0 ? unreadAlerts.length - 1 : prev - 1
        )
    }, [unreadAlerts.length])
    
    const goToNext = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % unreadAlerts.length)
    }, [unreadAlerts.length])
    
    // 处理消息点击
    const handleAlertClick = (alert: StockAlert) => {
        onMarkAsRead(alert.id)
    }
    
    // 如果没有未读消息，不显示横幅
    if (unreadAlerts.length === 0) return null
    
    const currentAlert = unreadAlerts[currentIndex] || unreadAlerts[0]
    if (!currentAlert) return null
    
    const config = ALERT_CONFIG[currentAlert.alert_type as AlertType]
    
    return (
        <div 
            className={`alert-banner ${getPriorityClass(currentAlert.priority)}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="alert-banner-content">
                {/* 左侧图标和标签 */}
                <div className="alert-banner-left">
                    <span className="alert-icon">{config?.icon || '📢'}</span>
                    <span className="alert-type-label">{config?.label || '消息'}</span>
                    <span className="alert-date">{formatAlertDate(currentAlert.alert_date)}</span>
                </div>
                
                {/* 中间消息内容 */}
                <div 
                    className="alert-banner-message"
                    onClick={() => handleAlertClick(currentAlert)}
                >
                    <span className="alert-title">{currentAlert.title}</span>
                    <span className="alert-code">{currentAlert.ts_code}</span>
                </div>
                
                {/* 右侧控制 */}
                <div className="alert-banner-right">
                    {/* 消息数量指示器 */}
                    {unreadAlerts.length > 1 && (
                        <div className="alert-nav">
                            <button 
                                className="nav-btn" 
                                onClick={goToPrev}
                                aria-label="上一条"
                            >
                                ‹
                            </button>
                            <span className="nav-indicator">
                                {currentIndex + 1} / {unreadAlerts.length}
                            </span>
                            <button 
                                className="nav-btn" 
                                onClick={goToNext}
                                aria-label="下一条"
                            >
                                ›
                            </button>
                        </div>
                    )}
                    
                    {/* 查看全部按钮 */}
                    <button className="btn-view-all" onClick={onViewAll}>
                        <span className="unread-badge">{unreadCount}</span>
                        查看全部
                    </button>
                </div>
            </div>
            
            {/* 进度条 */}
            {unreadAlerts.length > 1 && !isHovered && (
                <div className="alert-progress">
                    <div 
                        className="alert-progress-bar" 
                        key={currentIndex}
                    />
                </div>
            )}
        </div>
    )
}

