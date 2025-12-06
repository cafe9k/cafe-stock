import { useState } from 'react'
import { tushareApiCategories, getTotalApiCount, searchApis, TushareApi } from '../data/tushareApis'
import { tushareClient } from '../lib/tushareClient'
import './ApiList.css'

// 测试状态类型
type TestStatus = 'idle' | 'loading' | 'success' | 'error'

// 测试结果接口
interface TestResult {
    status: TestStatus
    message?: string
    data?: any
    time?: number  // 响应时间（毫秒）
}

function ApiList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const [pointsFilter, setPointsFilter] = useState<number | null>(null)
    
    // 测试状态：以 apiName 为 key
    const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
    
    // 测试结果弹窗
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState<{ api: TushareApi; result: TestResult } | null>(null)

    const totalApis = getTotalApiCount()

    // 切换分类展开/折叠
    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(category)) {
            newExpanded.delete(category)
        } else {
            newExpanded.add(category)
        }
        setExpandedCategories(newExpanded)
    }

    // 展开所有
    const expandAll = () => {
        setExpandedCategories(new Set(tushareApiCategories.map(c => c.category)))
    }

    // 折叠所有
    const collapseAll = () => {
        setExpandedCategories(new Set())
    }

    // 测试 API
    const testApi = async (api: TushareApi) => {
        const { apiName } = api
        
        // 设置为 loading 状态
        setTestResults(prev => ({
            ...prev,
            [apiName]: { status: 'loading' }
        }))

        const startTime = Date.now()

        try {
            // 根据不同 API 构建测试参数
            const testParams = getTestParams(apiName)
            
            // 使用 queryRaw 获取原始 JSON 响应
            const response = await tushareClient.queryRaw(
                apiName,
                testParams.params,
                testParams.fields
            )

            const endTime = Date.now()
            
            // 构建完整的 JSON 响应结构
            const itemCount = response.data?.items?.length || 0
            const jsonResponse = {
                code: response.code,
                msg: response.msg,
                data: {
                    fields: response.data?.fields || [],
                    items: (response.data?.items || []).slice(0, 5), // 只保留前5条
                    total: itemCount
                }
            }

            const result: TestResult = {
                status: 'success',
                message: `成功获取 ${itemCount} 条数据`,
                data: jsonResponse,
                time: endTime - startTime
            }

            setTestResults(prev => ({
                ...prev,
                [apiName]: result
            }))

        } catch (error) {
            const endTime = Date.now()
            const result: TestResult = {
                status: 'error',
                message: error instanceof Error ? error.message : '测试失败',
                data: {
                    code: -1,
                    msg: error instanceof Error ? error.message : '未知错误',
                    data: null
                },
                time: endTime - startTime
            }

            setTestResults(prev => ({
                ...prev,
                [apiName]: result
            }))
        }
    }

    // 根据 API 名称获取测试参数
    const getTestParams = (apiName: string): { params: Record<string, any>; fields?: string[] } => {
        // 为不同 API 提供合适的测试参数
        const paramsMap: Record<string, { params: Record<string, any>; fields?: string[] }> = {
            // 股票数据
            'stock_basic': { params: { limit: 5 }, fields: ['ts_code', 'name', 'area', 'industry'] },
            'trade_cal': { params: { exchange: 'SSE', start_date: '20241201', end_date: '20241205' }, fields: ['cal_date', 'is_open'] },
            'namechange': { params: { ts_code: '000001.SZ' }, fields: ['ts_code', 'name', 'start_date'] },
            'hs_const': { params: { hs_type: 'SH', limit: 5 }, fields: ['ts_code', 'hs_type'] },
            'stock_company': { params: { limit: 5 }, fields: ['ts_code', 'chairman', 'manager'] },
            'new_share': { params: { limit: 5 }, fields: ['ts_code', 'name', 'ipo_date'] },
            
            // 行情数据
            'daily': { params: { ts_code: '000001.SZ', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'open', 'close', 'vol'] },
            'weekly': { params: { ts_code: '000001.SZ', start_date: '20241101', end_date: '20241201' }, fields: ['trade_date', 'open', 'close'] },
            'monthly': { params: { ts_code: '000001.SZ', start_date: '20240101', end_date: '20241201' }, fields: ['trade_date', 'open', 'close'] },
            'adj_factor': { params: { ts_code: '000001.SZ', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'adj_factor'] },
            'suspend_d': { params: { suspend_type: 'S', limit: 5 }, fields: ['ts_code', 'suspend_date'] },
            'daily_basic': { params: { ts_code: '000001.SZ', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'pe', 'pb'] },
            'moneyflow': { params: { ts_code: '000001.SZ', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'buy_sm_vol', 'sell_sm_vol'] },
            'stk_limit': { params: { ts_code: '000001.SZ', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'up_limit', 'down_limit'] },
            
            // 财务数据
            'income': { params: { ts_code: '000001.SZ', limit: 3 }, fields: ['ann_date', 'total_revenue', 'n_income'] },
            'balancesheet': { params: { ts_code: '000001.SZ', limit: 3 }, fields: ['ann_date', 'total_assets', 'total_liab'] },
            'cashflow': { params: { ts_code: '000001.SZ', limit: 3 }, fields: ['ann_date', 'n_cashflow_act'] },
            'forecast': { params: { limit: 5 }, fields: ['ts_code', 'ann_date', 'type'] },
            'express': { params: { limit: 5 }, fields: ['ts_code', 'ann_date', 'revenue'] },
            'dividend': { params: { ts_code: '000001.SZ' }, fields: ['ts_code', 'div_proc', 'stk_div'] },
            'fina_indicator': { params: { ts_code: '000001.SZ', limit: 3 }, fields: ['ann_date', 'eps', 'roe'] },
            'fina_audit': { params: { ts_code: '000001.SZ', limit: 3 }, fields: ['ann_date', 'audit_result'] },
            'fina_mainbz': { params: { ts_code: '000001.SZ', limit: 3 }, fields: ['bz_item', 'bz_sales'] },
            'disclosure_date': { params: { limit: 5 }, fields: ['ts_code', 'ann_date', 'actual_date'] },
            
            // 市场参考数据
            'top_list': { params: { trade_date: '20241205' }, fields: ['ts_code', 'name', 'close'] },
            'top_inst': { params: { trade_date: '20241205' }, fields: ['ts_code', 'exalter', 'buy'] },
            'margin': { params: { trade_date: '20241205' }, fields: ['trade_date', 'rzye', 'rqye'] },
            'margin_detail': { params: { trade_date: '20241205', limit: 5 }, fields: ['ts_code', 'rzye', 'rqyl'] },
            'block_trade': { params: { limit: 5 }, fields: ['ts_code', 'trade_date', 'price', 'vol'] },
            'stk_holdernumber': { params: { ts_code: '000001.SZ' }, fields: ['ann_date', 'holder_num'] },
            'top10_holders': { params: { ts_code: '000001.SZ', limit: 3 }, fields: ['ann_date', 'holder_name', 'hold_amount'] },
            'top10_floatholders': { params: { ts_code: '000001.SZ', limit: 3 }, fields: ['ann_date', 'holder_name', 'hold_amount'] },
            'stk_holdertrade': { params: { limit: 5 }, fields: ['ts_code', 'holder_name', 'change_vol'] },
            'pledge_stat': { params: { ts_code: '000001.SZ' }, fields: ['end_date', 'pledge_count', 'pledge_ratio'] },
            'pledge_detail': { params: { ts_code: '000001.SZ' }, fields: ['ann_date', 'holder_name', 'pledge_amount'] },
            'repurchase': { params: { limit: 5 }, fields: ['ts_code', 'ann_date', 'proc'] },
            'share_float': { params: { limit: 5 }, fields: ['ts_code', 'ann_date', 'float_date'] },
            'concept': { params: { limit: 10 }, fields: ['code', 'name'] },
            'concept_detail': { params: { id: 'TS2', limit: 5 }, fields: ['ts_code', 'name'] },
            
            // 指数数据
            'index_basic': { params: { market: 'SSE', limit: 5 }, fields: ['ts_code', 'name', 'market'] },
            'index_daily': { params: { ts_code: '000001.SH', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'close', 'vol'] },
            'index_weekly': { params: { ts_code: '000001.SH', start_date: '20241101', end_date: '20241201' }, fields: ['trade_date', 'close'] },
            'index_monthly': { params: { ts_code: '000001.SH', start_date: '20240101', end_date: '20241201' }, fields: ['trade_date', 'close'] },
            'index_weight': { params: { index_code: '000300.SH', limit: 5 }, fields: ['con_code', 'trade_date', 'weight'] },
            'index_dailybasic': { params: { trade_date: '20241205' }, fields: ['ts_code', 'pe', 'pb'] },
            'index_classify': { params: { level: 'L1' }, fields: ['index_code', 'industry_name'] },
            'index_member': { params: { index_code: '850111.SI', limit: 5 }, fields: ['con_code', 'index_code'] },
            
            // 基金数据
            'fund_basic': { params: { market: 'E', limit: 5 }, fields: ['ts_code', 'name', 'fund_type'] },
            'fund_company': { params: { limit: 5 }, fields: ['name', 'shortname'] },
            'fund_manager': { params: { limit: 5 }, fields: ['ts_code', 'name', 'gender'] },
            'fund_share': { params: { ts_code: '150018.SZ' }, fields: ['ts_code', 'fd_share'] },
            'fund_nav': { params: { ts_code: '150018.SZ', limit: 5 }, fields: ['ann_date', 'unit_nav', 'accum_nav'] },
            'fund_div': { params: { limit: 5 }, fields: ['ts_code', 'ann_date', 'div_proc'] },
            'fund_portfolio': { params: { ts_code: '150018.SZ', limit: 5 }, fields: ['symbol', 'mkv', 'amount'] },
            'fund_daily': { params: { ts_code: '150018.SZ', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'open', 'close'] },
            'fund_adj': { params: { ts_code: '510050.SH', limit: 5 }, fields: ['trade_date', 'adj_factor'] },
            
            // 期货数据
            'fut_basic': { params: { exchange: 'DCE', limit: 5 }, fields: ['ts_code', 'symbol', 'name'] },
            'fut_daily': { params: { ts_code: 'CU2501.SHF', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'close', 'vol'] },
            'fut_holding': { params: { trade_date: '20241205', limit: 5 }, fields: ['symbol', 'broker', 'vol'] },
            'fut_wsr': { params: { trade_date: '20241205', limit: 5 }, fields: ['symbol', 'vol', 'vol_chg'] },
            'fut_settle': { params: { trade_date: '20241205', limit: 5 }, fields: ['ts_code', 'settle'] },
            'fut_mapping': { params: { ts_code: 'CU.SHF' }, fields: ['ts_code', 'trade_date', 'mapping_ts_code'] },
            
            // 期权数据
            'opt_basic': { params: { exchange: 'SSE', limit: 5 }, fields: ['ts_code', 'name', 'call_put'] },
            'opt_daily': { params: { exchange: 'SSE', trade_date: '20241205', limit: 5 }, fields: ['ts_code', 'close', 'vol'] },
            
            // 债券数据
            'cb_basic': { params: { limit: 5 }, fields: ['ts_code', 'bond_short_name', 'stk_code'] },
            'cb_daily': { params: { limit: 5 }, fields: ['ts_code', 'trade_date', 'close'] },
            'cb_issue': { params: { limit: 5 }, fields: ['ts_code', 'ann_date', 'issue_size'] },
            'cb_call': { params: { limit: 5 }, fields: ['ts_code', 'call_type', 'call_price'] },
            'yc_cb': { params: { curve_type: '0', limit: 5 }, fields: ['trade_date', 'curve_term', 'yield'] },
            
            // 港股数据
            'hk_basic': { params: { limit: 5 }, fields: ['ts_code', 'name', 'area'] },
            'hk_daily': { params: { ts_code: '00001.HK', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'close', 'vol'] },
            
            // 美股数据
            'us_basic': { params: { limit: 5 }, fields: ['ts_code', 'name', 'area'] },
            'us_daily': { params: { ts_code: 'AAPL', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'close', 'vol'] },
            'us_tradecal': { params: { start_date: '20241201', end_date: '20241210' }, fields: ['cal_date', 'is_open'] },
            
            // 外汇数据
            'fx_daily': { params: { ts_code: 'USDCNY.FXCM', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'close'] },
            'fx_obasic': { params: { limit: 5 }, fields: ['ts_code', 'name', 'classify'] },
            
            // 宏观经济
            'shibor': { params: { start_date: '20241201', end_date: '20241205' }, fields: ['date', 'on', '1w', '1m'] },
            'shibor_quote': { params: { date: '20241205' }, fields: ['bank', 'on', '1w'] },
            'libor': { params: { start_date: '20241201', end_date: '20241205' }, fields: ['date', 'on', '1m'] },
            'hibor': { params: { start_date: '20241201', end_date: '20241205' }, fields: ['date', 'on', '1w'] },
            'shibor_lpr': { params: { start_date: '20240101', end_date: '20241205' }, fields: ['date', 'lpr_1y', 'lpr_5y'] },
            'cn_gdp': { params: { limit: 5 }, fields: ['quarter', 'gdp', 'gdp_yoy'] },
            'cn_cpi': { params: { limit: 5 }, fields: ['month', 'nt_val', 'nt_yoy'] },
            'cn_ppi': { params: { limit: 5 }, fields: ['month', 'ppi_yoy'] },
            'cn_m': { params: { limit: 5 }, fields: ['month', 'm0', 'm1', 'm2'] },
            
            // 新闻资讯
            'news': { params: { start_date: '20241205 00:00:00', end_date: '20241205 23:59:59', limit: 5 }, fields: ['datetime', 'title'] },
            'cctv_news': { params: { date: '20241205' }, fields: ['title', 'content'] },
            'major_news': { params: { limit: 5 }, fields: ['title', 'pub_time'] },
            
            // 特色数据
            'stk_factor': { params: { ts_code: '000001.SZ', start_date: '20241201', end_date: '20241205' }, fields: ['trade_date', 'close', 'macd'] },
            'broker_recommend': { params: { limit: 5 }, fields: ['month', 'broker', 'ts_code'] },
        }

        return paramsMap[apiName] || { params: { limit: 5 } }
    }

    // 显示详细结果弹窗
    const showResultModal = (api: TushareApi) => {
        const result = testResults[api.apiName]
        if (result) {
            setModalData({ api, result })
            setShowModal(true)
        }
    }

    // 搜索结果
    const searchResults = searchTerm ? searchApis(searchTerm) : null

    // 按积分筛选
    const filteredCategories = tushareApiCategories.map(category => ({
        ...category,
        apis: category.apis.filter(api => 
            (!pointsFilter || !api.minPoints || api.minPoints <= pointsFilter)
        )
    })).filter(category => category.apis.length > 0)

    // 渲染 API 卡片
    const renderApiCard = (api: TushareApi, index: number) => {
        const result = testResults[api.apiName]
        const status = result?.status || 'idle'

        return (
            <div key={index} className={`api-card ${status !== 'idle' ? `status-${status}` : ''}`}>
                <div className="api-card-header">
                    <span className="api-name">{api.name}</span>
                    <code className="api-code">{api.apiName}</code>
                </div>
                <p className="api-description">{api.description}</p>
                
                <div className="api-card-footer">
                    {api.minPoints && (
                        <span className={`api-points ${api.minPoints >= 2000 ? 'high' : api.minPoints >= 300 ? 'medium' : 'low'}`}>
                            {api.minPoints}+ 积分
                        </span>
                    )}
                    
                    <div className="api-actions">
                        {status === 'loading' ? (
                            <span className="test-loading">测试中...</span>
                        ) : (
                            <>
                                <button 
                                    className="test-btn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        testApi(api)
                                    }}
                                >
                                    🧪 测试
                                </button>
                                
                                {status === 'success' && (
                                    <button 
                                        className="result-btn success"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            showResultModal(api)
                                        }}
                                    >
                                        ✅ {result?.time}ms
                                    </button>
                                )}
                                
                                {status === 'error' && (
                                    <button 
                                        className="result-btn error"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            showResultModal(api)
                                        }}
                                    >
                                        ❌ 失败
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="api-list-container">
            <div className="api-header">
                <h2>📚 Tushare API 接口大全</h2>
                <p className="api-subtitle">
                    共 <strong>{tushareApiCategories.length}</strong> 个分类，
                    <strong>{totalApis}</strong> 个接口
                </p>
            </div>

            {/* 搜索和筛选 */}
            <div className="api-filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="搜索接口名称、API名称或描述..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="clear-btn" onClick={() => setSearchTerm('')}>
                            ✕
                        </button>
                    )}
                </div>

                <div className="filter-actions">
                    <select
                        value={pointsFilter || ''}
                        onChange={(e) => setPointsFilter(e.target.value ? Number(e.target.value) : null)}
                        className="points-filter"
                    >
                        <option value="">全部积分</option>
                        <option value="120">120分可用</option>
                        <option value="300">300分可用</option>
                        <option value="2000">2000分可用</option>
                        <option value="5000">5000分可用</option>
                    </select>

                    <button onClick={expandAll} className="action-btn">
                        展开全部
                    </button>
                    <button onClick={collapseAll} className="action-btn">
                        折叠全部
                    </button>
                </div>
            </div>

            {/* 搜索结果 */}
            {searchResults && (
                <div className="search-results">
                    <h3>🔍 搜索结果 ({searchResults.length} 个)</h3>
                    {searchResults.length === 0 ? (
                        <p className="no-results">没有找到匹配的接口</p>
                    ) : (
                        <div className="api-grid">
                            {searchResults.map((api, index) => renderApiCard(api, index))}
                        </div>
                    )}
                </div>
            )}

            {/* 分类列表 */}
            {!searchResults && (
                <div className="categories-list">
                    {filteredCategories.map((category) => (
                        <div key={category.category} className="category-section">
                            <div 
                                className="category-header"
                                onClick={() => toggleCategory(category.category)}
                            >
                                <div className="category-info">
                                    <span className="category-icon">{category.icon}</span>
                                    <div className="category-text">
                                        <h3>{category.category}</h3>
                                        <p>{category.description}</p>
                                    </div>
                                </div>
                                <div className="category-meta">
                                    <span className="api-count">{category.apis.length} 个接口</span>
                                    <span className={`expand-icon ${expandedCategories.has(category.category) ? 'expanded' : ''}`}>
                                        ▶
                                    </span>
                                </div>
                            </div>

                            {expandedCategories.has(category.category) && (
                                <div className="category-content">
                                    <div className="api-grid">
                                        {category.apis.map((api, index) => renderApiCard(api, index))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* 测试结果弹窗 */}
            {showModal && modalData && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {modalData.result.status === 'success' ? '✅' : '❌'} 
                                {' '}{modalData.api.name} 测试结果
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="result-info">
                                <p><strong>接口名称：</strong><code>{modalData.api.apiName}</code></p>
                                <p><strong>响应时间：</strong>{modalData.result.time}ms</p>
                                <p><strong>状态：</strong>
                                    <span className={modalData.result.status === 'success' ? 'success-text' : 'error-text'}>
                                        {modalData.result.message}
                                    </span>
                                </p>
                            </div>
                            
                            {modalData.result.data && (
                                <div className="result-data">
                                    <h4>📋 JSON 响应结果{modalData.result.status === 'success' ? '（前5条数据）' : ''}：</h4>
                                    <pre>{JSON.stringify(modalData.result.data, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 底部说明 */}
            <div className="api-footer">
                <p>
                    📖 完整文档请访问：
                    <a href="https://tushare.pro/document/2" target="_blank" rel="noopener noreferrer">
                        Tushare Pro 官方文档
                    </a>
                </p>
                <p className="points-note">
                    💡 积分说明：不同接口需要不同的积分才能调用，
                    <a href="https://tushare.pro/document/1?doc_id=13" target="_blank" rel="noopener noreferrer">
                        了解如何获取积分
                    </a>
                </p>
            </div>
        </div>
    )
}

export default ApiList
