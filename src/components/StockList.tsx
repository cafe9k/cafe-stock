import { useState, useEffect } from 'react'
import { tushareClient, TushareError } from '../lib/tushareClient'
import './StockList.css'

/**
 * 股票基本信息接口
 */
interface StockBasic {
    ts_code: string        // 股票代码
    symbol: string         // 股票代码（不带后缀）
    name: string           // 股票名称
    area: string           // 地域
    industry: string       // 行业
    market: string         // 市场类型
    list_date: string      // 上市日期
}

function StockList() {
    const [stocks, setStocks] = useState<StockBasic[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterArea, setFilterArea] = useState('')
    const [filterIndustry, setFilterIndustry] = useState('')

    // 获取股票列表
    const fetchStocks = async () => {
        setLoading(true)
        setError(null)
        
        try {
            console.log('🔄 开始获取股票列表...')
            
            const data = await tushareClient.query<StockBasic>(
                'stock_basic',
                {
                    list_status: 'L'  // L=上市 D=退市 P=暂停上市
                },
                ['ts_code', 'symbol', 'name', 'area', 'industry', 'market', 'list_date']
            )
            
            console.log(`✅ 成功获取 ${data.length} 只股票`)
            setStocks(data)
        } catch (err) {
            console.error('❌ 获取股票列表失败:', err)
            
            if (err instanceof TushareError) {
                if (err.code === 2002) {
                    setError('权限不足，请检查 Tushare Token 是否有效或积分是否充足')
                } else if (err.code === -1) {
                    setError('请求失败，请检查网络连接或 Token 配置')
                } else {
                    setError(`API 错误 (${err.code}): ${err.message}`)
                }
            } else {
                setError('获取股票列表失败，请稍后重试')
            }
        } finally {
            setLoading(false)
        }
    }

    // 组件加载时获取数据
    useEffect(() => {
        fetchStocks()
    }, [])

    // 过滤股票列表
    const filteredStocks = stocks.filter(stock => {
        const matchSearch = !searchTerm || 
            stock.name.includes(searchTerm) || 
            stock.ts_code.includes(searchTerm) ||
            stock.symbol.includes(searchTerm)
        
        const matchArea = !filterArea || stock.area === filterArea
        const matchIndustry = !filterIndustry || stock.industry === filterIndustry
        
        return matchSearch && matchArea && matchIndustry
    })

    // 获取所有地域（去重）
    const areas = Array.from(new Set(stocks.map(s => s.area).filter(Boolean))).sort()
    
    // 获取所有行业（去重）
    const industries = Array.from(new Set(stocks.map(s => s.industry).filter(Boolean))).sort()

    // 格式化上市日期
    const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr.length !== 8) return dateStr
        return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
    }

    return (
        <div className="stock-list-container">
            <div className="stock-header">
                <h2>📈 A股股票列表</h2>
                <div className="stock-stats">
                    <span>总计: {stocks.length} 只</span>
                    <span>显示: {filteredStocks.length} 只</span>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <span>⚠️ {error}</span>
                    <button onClick={fetchStocks} className="retry-btn">
                        重试
                    </button>
                </div>
            )}

            <div className="stock-filters">
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="搜索股票代码或名称..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                
                <div className="filter-group">
                    <select
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">全部地域</option>
                        {areas.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <select
                        value={filterIndustry}
                        onChange={(e) => setFilterIndustry(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">全部行业</option>
                        {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>

                <button 
                    onClick={fetchStocks} 
                    disabled={loading}
                    className="refresh-btn"
                >
                    {loading ? '刷新中...' : '🔄 刷新'}
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>正在加载股票数据...</p>
                </div>
            ) : filteredStocks.length === 0 ? (
                <div className="empty-state">
                    {stocks.length === 0 ? '暂无股票数据' : '没有符合条件的股票'}
                </div>
            ) : (
                <div className="stock-table-container">
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>股票代码</th>
                                <th>股票名称</th>
                                <th>地域</th>
                                <th>行业</th>
                                <th>市场</th>
                                <th>上市日期</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStocks.map((stock) => (
                                <tr key={stock.ts_code}>
                                    <td className="code-cell">
                                        <span className="stock-code">{stock.ts_code}</span>
                                    </td>
                                    <td className="name-cell">{stock.name}</td>
                                    <td>{stock.area || '-'}</td>
                                    <td>{stock.industry || '-'}</td>
                                    <td>
                                        <span className={`market-badge ${stock.market?.toLowerCase()}`}>
                                            {stock.market || '-'}
                                        </span>
                                    </td>
                                    <td>{formatDate(stock.list_date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default StockList

