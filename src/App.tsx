import { useState, useEffect } from 'react'
import './App.css'
import { supabase, StockItem } from './lib/supabaseClient'

function App() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null)
    const [stockItems, setStockItems] = useState<StockItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        unit: '',
        category: ''
    })

    const testConnection = async () => {
        setLoading(true)
        setError(null)
        try {
            const { error } = await supabase.from('stock_items').select('count')
            if (error) {
                setIsConnected(false)
                setError(`连接失败: ${error.message}`)
            } else {
                setIsConnected(true)
            }
        } catch (err) {
            setIsConnected(false)
            setError('无法连接到 Supabase 数据库')
        } finally {
            setLoading(false)
        }
    }

    const fetchStockItems = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase
                .from('stock_items')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                setError(`获取数据失败: ${error.message}`)
            } else {
                setStockItems(data || [])
            }
        } catch (err) {
            setError('获取数据时发生错误')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('stock_items')
                .insert([
                    {
                        name: formData.name,
                        quantity: parseInt(formData.quantity),
                        unit: formData.unit,
                        category: formData.category
                    }
                ])

            if (error) {
                setError(`添加失败: ${error.message}`)
            } else {
                setFormData({
                    name: '',
                    quantity: '',
                    unit: '',
                    category: ''
                })
                fetchStockItems()
            }
        } catch (err) {
            setError('添加数据时发生错误')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('确定要删除这个库存项吗?')) return

        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('stock_items')
                .delete()
                .eq('id', id)

            if (error) {
                setError(`删除失败: ${error.message}`)
            } else {
                fetchStockItems()
            }
        } catch (err) {
            setError('删除数据时发生错误')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        testConnection()
        fetchStockItems()
    }, [])

    return (
        <div className="app">
            <div className="container">
                <div className="header">
                    <h1>☕ 咖啡店库存管理系统</h1>
                    <p>连接到 Supabase 数据库</p>
                </div>

                <div className={`connection-status ${
                    loading ? 'loading' : 
                    isConnected === true ? 'connected' : 
                    isConnected === false ? 'disconnected' : 'loading'
                }`}>
                    <div className={`status-indicator ${
                        loading ? 'loading' : 
                        isConnected === true ? 'connected' : 
                        isConnected === false ? 'disconnected' : 'loading'
                    }`}></div>
                    <span>
                        {loading ? '正在连接...' : 
                         isConnected === true ? '✓ 数据库已连接' : 
                         isConnected === false ? '✗ 数据库连接失败' : 
                         '检查连接中...'}
                    </span>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-section">
                    <h2>添加库存项</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>名称</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="例如: 咖啡豆"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>数量</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="例如: 100"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>单位</label>
                                <input
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    placeholder="例如: 袋"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>类别</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">选择类别</option>
                                    <option value="原料">原料</option>
                                    <option value="包材">包材</option>
                                    <option value="器具">器具</option>
                                    <option value="其他">其他</option>
                                </select>
                            </div>
                        </div>
                        <div className="button-group">
                            <button type="submit" className="btn btn-primary" disabled={loading || !isConnected}>
                                {loading ? '添加中...' : '添加库存'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={fetchStockItems}
                                disabled={loading || !isConnected}
                            >
                                刷新数据
                            </button>
                        </div>
                    </form>
                </div>

                <div className="data-section">
                    <h2>库存列表</h2>
                    {loading ? (
                        <div className="loading">加载中...</div>
                    ) : stockItems.length === 0 ? (
                        <div className="empty-state">
                            暂无库存数据,请添加库存项
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>名称</th>
                                        <th>数量</th>
                                        <th>单位</th>
                                        <th>类别</th>
                                        <th>创建时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.category}</td>
                                            <td>{new Date(item.created_at).toLocaleString('zh-CN')}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn btn-danger btn-small"
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={loading}
                                                    >
                                                        删除
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default App
