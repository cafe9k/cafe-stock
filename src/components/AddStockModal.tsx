/**
 * 添加股票模态框组件
 */

import { useState, useEffect, useRef } from 'react'
import { useStockSearch, StockBasicInfo } from '../hooks/useStockQuotes'
import './AddStockModal.css'

interface AddStockModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (stock: StockBasicInfo) => Promise<void>
    isStockWatched: (tsCode: string) => boolean
}

export default function AddStockModal({ isOpen, onClose, onAdd, isStockWatched }: AddStockModalProps) {
    const [keyword, setKeyword] = useState('')
    const [adding, setAdding] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    
    const { results, loading, search, clearResults } = useStockSearch()

    // 打开模态框时聚焦输入框
    useEffect(() => {
        if (isOpen) {
            // 聚焦输入框
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // 搜索防抖
    useEffect(() => {
        const timer = setTimeout(() => {
            search(keyword)
        }, 200)
        return () => clearTimeout(timer)
    }, [keyword, search])

    // 关闭时清空
    const handleClose = () => {
        setKeyword('')
        clearResults()
        onClose()
    }

    // 添加股票
    const handleAdd = async (stock: StockBasicInfo) => {
        // 检查是否已关注
        if (isStockWatched(stock.ts_code)) {
            console.log('股票已关注:', stock.ts_code)
            return
        }
        
        // 检查是否正在添加中
        if (adding) {
            console.log('正在添加中，忽略重复点击')
            return
        }
        
        console.log('开始添加股票:', stock.ts_code, stock.name)
        setAdding(stock.ts_code)
        
        try {
            await onAdd(stock)
            console.log('添加股票成功:', stock.ts_code)
            // 添加成功后可以显示提示
        } catch (err) {
            console.error('添加股票失败:', err)
            alert(err instanceof Error ? err.message : '添加失败，请重试')
        } finally {
            setAdding(null)
        }
    }

    // ESC 关闭
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
        }
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>添加股票</h2>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>

                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        placeholder="输入股票代码或名称搜索..."
                    />
                    {keyword && (
                        <button className="search-clear" onClick={() => setKeyword('')}>×</button>
                    )}
                </div>

                <div className="search-results">
                    {loading && (
                        <div className="search-loading">
                            <div className="loading-spinner small"></div>
                            <span>搜索中...</span>
                        </div>
                    )}

                    {!loading && keyword && results.length === 0 && (
                        <div className="search-empty">
                            未找到匹配的股票
                        </div>
                    )}

                    {results.map(stock => {
                        const watched = isStockWatched(stock.ts_code)
                        const isAdding = adding === stock.ts_code
                        
                        return (
                            <div
                                key={stock.ts_code}
                                className={`search-item ${watched ? 'watched' : ''}`}
                            >
                                <div className="stock-info">
                                    <div className="stock-main">
                                        <span className="stock-name">{stock.name}</span>
                                        <span className="stock-code">{stock.ts_code}</span>
                                    </div>
                                    <div className="stock-meta">
                                        <span className="stock-industry">{stock.industry}</span>
                                        <span className="stock-area">{stock.area}</span>
                                    </div>
                                </div>
                                <div className="stock-action">
                                    {watched ? (
                                        <span className="watched-badge">已关注</span>
                                    ) : isAdding ? (
                                        <div className="loading-spinner small"></div>
                                    ) : (
                                        <button 
                                            className="btn-add"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleAdd(stock)
                                            }}
                                        >
                                            + 添加
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {!keyword && !loading && (
                        <div className="search-hint">
                            <p>💡 输入股票代码（如 000001）或名称（如 平安银行）进行搜索</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

