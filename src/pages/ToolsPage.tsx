/**
 * 工具页面
 * 提供数据同步等常用工具
 */

import { useEffect } from 'react'
import { useStockBasicSync, useStockBasicQuery, formatUpdateTime } from '../hooks/useStockBasic'
import './ToolsPage.css'

export default function ToolsPage() {
    const { status, syncStockBasic, cancelSync } = useStockBasicSync()
    const { count, lastUpdate, loading: statsLoading, fetchStats } = useStockBasicQuery()

    // 加载统计信息
    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    // 同步完成后刷新统计
    useEffect(() => {
        if (!status.syncing && status.progress === 100) {
            fetchStats()
        }
    }, [status.syncing, status.progress, fetchStats])

    return (
        <div className="tools-page">
            <div className="tools-container">
                {/* 股票数据同步工具 */}
                <section className="tool-section">
                    <div className="tool-header">
                        <div className="tool-icon">📊</div>
                        <div className="tool-title">
                            <h2>A股股票列表同步</h2>
                            <p>从 Tushare 获取全部 A 股股票基础信息并存储到数据库</p>
                        </div>
                    </div>

                    <div className="tool-stats">
                        <div className="stat-card">
                            <span className="stat-label">已同步股票</span>
                            <span className="stat-value">
                                {statsLoading ? '...' : (count ?? 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">最后更新</span>
                            <span className="stat-value stat-time">
                                {statsLoading ? '...' : formatUpdateTime(lastUpdate)}
                            </span>
                        </div>
                    </div>

                    {/* 同步进度 */}
                    {status.syncing && (
                        <div className="sync-progress">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${status.progress}%` }}
                                />
                            </div>
                            <div className="progress-info">
                                <span className="progress-text">{status.message}</span>
                                <span className="progress-percent">{status.progress}%</span>
                            </div>
                        </div>
                    )}

                    {/* 错误提示 */}
                    {status.error && (
                        <div className="sync-error">
                            <span className="error-icon">⚠️</span>
                            <span className="error-text">{status.error}</span>
                        </div>
                    )}

                    {/* 成功提示 */}
                    {!status.syncing && status.progress === 100 && !status.error && (
                        <div className="sync-success">
                            <span className="success-icon">✅</span>
                            <span className="success-text">{status.message}</span>
                        </div>
                    )}

                    <div className="tool-actions">
                        {status.syncing ? (
                            <button 
                                className="btn-cancel"
                                onClick={cancelSync}
                            >
                                取消同步
                            </button>
                        ) : (
                            <button 
                                className="btn-sync"
                                onClick={syncStockBasic}
                            >
                                <span className="btn-icon">🔄</span>
                                {count && count > 0 ? '更新股票列表' : '同步股票列表'}
                            </button>
                        )}
                    </div>

                    <div className="tool-tips">
                        <h4>说明</h4>
                        <ul>
                            <li>同步将获取所有 A 股上市股票的基础信息</li>
                            <li>数据来源于 Tushare Pro API</li>
                            <li>首次同步约需 1-2 分钟，后续更新会更快</li>
                            <li>同步后，添加股票时将从本地数据库搜索，速度更快</li>
                        </ul>
                    </div>
                </section>

                {/* 更多工具占位 */}
                <section className="tool-section tool-placeholder">
                    <div className="tool-header">
                        <div className="tool-icon">🛠️</div>
                        <div className="tool-title">
                            <h2>更多工具</h2>
                            <p>更多实用工具正在开发中...</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

