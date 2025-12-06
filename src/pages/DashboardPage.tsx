/**
 * 主面板页面
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useWatchGroups, useWatchStocks } from '../hooks/useWatchList'
import { useStockQuotes, StockBasicInfo } from '../hooks/useStockQuotes'
import GroupSidebar from '../components/GroupSidebar'
import StockCard from '../components/StockCard'
import AddStockModal from '../components/AddStockModal'
import StockDetailPanel from '../components/StockDetailPanel'
import type { WatchStock } from '../types/database'
import './DashboardPage.css'

type SortOption = 'default' | 'change_desc' | 'change_asc' | 'volume' | 'turnover'

export default function DashboardPage() {
    const { user, signOut } = useAuth()
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [sortBy, setSortBy] = useState<SortOption>('default')
    const [selectedStock, setSelectedStock] = useState<WatchStock | null>(null)

    // 数据 hooks
    const { groups, createGroup, updateGroup, deleteGroup } = useWatchGroups()
    const { stocks, addStock, deleteStock, isStockWatched, fetchStocks } = useWatchStocks()
    const { loading: quotesLoading, lastUpdate, error: quotesError, fetchQuotes, getQuote } = useStockQuotes()

    // 计算每个分组的股票数量
    const stockCounts = useMemo(() => {
        const counts = new Map<string, number>()
        stocks.forEach(stock => {
            if (stock.group_id) {
                counts.set(stock.group_id, (counts.get(stock.group_id) || 0) + 1)
            }
        })
        return counts
    }, [stocks])

    // 按分组过滤股票
    const filteredStocks = useMemo(() => {
        if (selectedGroupId === null) {
            return stocks
        }
        return stocks.filter(s => s.group_id === selectedGroupId)
    }, [stocks, selectedGroupId])

    // 排序股票
    const sortedStocks = useMemo(() => {
        const sorted = [...filteredStocks]
        
        switch (sortBy) {
            case 'change_desc':
                sorted.sort((a, b) => {
                    const qa = getQuote(a.ts_code)
                    const qb = getQuote(b.ts_code)
                    return (qb?.pct_chg ?? 0) - (qa?.pct_chg ?? 0)
                })
                break
            case 'change_asc':
                sorted.sort((a, b) => {
                    const qa = getQuote(a.ts_code)
                    const qb = getQuote(b.ts_code)
                    return (qa?.pct_chg ?? 0) - (qb?.pct_chg ?? 0)
                })
                break
            case 'volume':
                sorted.sort((a, b) => {
                    const qa = getQuote(a.ts_code)
                    const qb = getQuote(b.ts_code)
                    return (qb?.vol ?? 0) - (qa?.vol ?? 0)
                })
                break
            case 'turnover':
                sorted.sort((a, b) => {
                    const qa = getQuote(a.ts_code)
                    const qb = getQuote(b.ts_code)
                    return (qb?.turnover_rate ?? 0) - (qa?.turnover_rate ?? 0)
                })
                break
            default:
                sorted.sort((a, b) => a.sort_order - b.sort_order)
        }
        
        return sorted
    }, [filteredStocks, sortBy, getQuote])

    // 获取行情数据
    useEffect(() => {
        if (stocks.length > 0) {
            const tsCodes = stocks.map(s => s.ts_code)
            fetchQuotes(tsCodes)
        }
    }, [stocks, fetchQuotes])

    // 刷新数据
    const handleRefresh = useCallback(() => {
        fetchStocks()
        if (stocks.length > 0) {
            fetchQuotes(stocks.map(s => s.ts_code))
        }
    }, [fetchStocks, fetchQuotes, stocks])

    // 添加股票
    const handleAddStock = async (stock: StockBasicInfo) => {
        console.log('handleAddStock 被调用:', stock)
        console.log('当前分组:', groups)
        
        // 使用第一个分组，如果没有分组则为 undefined（会存为 null）
        const defaultGroupId = groups.length > 0 ? groups[0].id : undefined
        console.log('使用的分组 ID:', defaultGroupId)
        
        try {
            const result = await addStock(stock.ts_code, stock.name, defaultGroupId)
            console.log('addStock 返回结果:', result)
        } catch (err) {
            console.error('handleAddStock 捕获到错误:', err)
            // 错误已在 AddStockModal 中处理
            throw err
        }
    }

    // 删除股票
    const handleDeleteStock = async (id: string) => {
        await deleteStock(id)
    }

    // 获取分组颜色
    const getGroupColor = (groupId: string | null) => {
        if (!groupId) return undefined
        return groups.find(g => g.id === groupId)?.color
    }

    // 统计涨跌
    const stats = useMemo(() => {
        let up = 0, down = 0, flat = 0
        stocks.forEach(stock => {
            const quote = getQuote(stock.ts_code)
            if (!quote) return
            if (quote.pct_chg > 0) up++
            else if (quote.pct_chg < 0) down++
            else flat++
        })
        return { up, down, flat }
    }, [stocks, getQuote])

    // 格式化更新时间
    const formatLastUpdate = () => {
        if (!lastUpdate) return '--'
        return lastUpdate.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="dashboard">
            {/* 顶部导航 */}
            <header className="dashboard-header">
                <div className="header-left">
                    <span className="logo">📊</span>
                    <h1>股票关注面板</h1>
                </div>
                <div className="header-right">
                    <span className="user-email">{user?.email}</span>
                    <button className="btn-logout" onClick={signOut}>
                        退出
                    </button>
                </div>
            </header>

            {/* 统计横幅 */}
            {stocks.length > 0 && (
                <div className="stats-banner">
                    <div className="stat-item">
                        <span className="stat-label">关注</span>
                        <span className="stat-value">{stocks.length}</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-label">上涨</span>
                        <span className="stat-value color-up">{stats.up}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">下跌</span>
                        <span className="stat-value color-down">{stats.down}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">平盘</span>
                        <span className="stat-value color-flat">{stats.flat}</span>
                    </div>
                </div>
            )}

            {/* 错误提示 */}
            {quotesError && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">
                        {quotesError.includes('IP数量超限') 
                            ? '行情数据获取受限，Tushare API IP 限制，请稍后重试' 
                            : quotesError}
                    </span>
                    <button className="btn-retry" onClick={handleRefresh}>重试</button>
                </div>
            )}

            {/* 主内容区 */}
            <div className="dashboard-content">
                {/* 左侧边栏 - 分组 */}
                <GroupSidebar
                    groups={groups}
                    selectedGroupId={selectedGroupId}
                    stockCounts={stockCounts}
                    totalCount={stocks.length}
                    onSelectGroup={setSelectedGroupId}
                    onCreateGroup={createGroup}
                    onUpdateGroup={updateGroup}
                    onDeleteGroup={deleteGroup}
                />

                {/* 主面板 */}
                <main className="main-panel">
                    {/* 工具栏 */}
                    <div className="toolbar">
                        <div className="toolbar-left">
                            <button className="btn-add-stock" onClick={() => setShowAddModal(true)}>
                                <span>+</span> 添加股票
                            </button>
                        </div>
                        <div className="toolbar-right">
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as SortOption)}
                            >
                                <option value="default">默认排序</option>
                                <option value="change_desc">涨幅从高到低</option>
                                <option value="change_asc">涨幅从低到高</option>
                                <option value="volume">成交量</option>
                                <option value="turnover">换手率</option>
                            </select>
                            <button
                                className={`btn-refresh ${quotesLoading ? 'loading' : ''}`}
                                onClick={handleRefresh}
                                disabled={quotesLoading}
                                title="刷新"
                            >
                                🔄
                            </button>
                        </div>
                    </div>

                    {/* 股票卡片网格 */}
                    <div className="stock-grid">
                        {sortedStocks.length > 0 ? (
                            sortedStocks.map(stock => (
                                <StockCard
                                    key={stock.id}
                                    stock={stock}
                                    quote={getQuote(stock.ts_code)}
                                    groupColor={getGroupColor(stock.group_id)}
                                    loading={quotesLoading}
                                    onDelete={handleDeleteStock}
                                    onClick={() => setSelectedStock(stock)}
                                />
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3>
                                    {selectedGroupId
                                        ? '该分组还没有股票'
                                        : '还没有关注的股票'}
                                </h3>
                                <p>点击"添加股票"开始追踪您感兴趣的股票</p>
                                <button
                                    className="btn-add-stock-large"
                                    onClick={() => setShowAddModal(true)}
                                >
                                    + 添加第一只股票
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* 底部状态栏 */}
            <footer className="dashboard-footer">
                <span className="status-item">
                    <span className="status-dot"></span>
                    数据来源: Tushare Pro
                </span>
                <span className="status-item">
                    最后更新: {formatLastUpdate()}
                </span>
            </footer>

            {/* 添加股票模态框 */}
            <AddStockModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddStock}
                isStockWatched={isStockWatched}
            />

            {/* 股票详情面板 */}
            {selectedStock && (
                <StockDetailPanel
                    stock={selectedStock}
                    quote={getQuote(selectedStock.ts_code)}
                    onClose={() => setSelectedStock(null)}
                />
            )}
        </div>
    )
}
