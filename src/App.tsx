import { useState, useEffect } from 'react'
import './App.css'
import { supabase, Product, Category } from './lib/supabaseClient'

function App() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        current_stock: '',
        unit: '件',
        category_id: '',
        min_stock: '0',
        unit_price: '0'
    })

    const testConnection = async () => {
        setLoading(true)
        setError(null)
        try {
            const { error } = await supabase.from('products').select('count')
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

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (error) {
                console.error('获取分类失败:', error)
            } else {
                setCategories(data || [])
            }
        } catch (err) {
            console.error('获取分类时发生错误:', err)
        }
    }

    const fetchProducts = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                setError(`获取数据失败: ${error.message}`)
            } else {
                setProducts(data || [])
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
                .from('products')
                .insert([
                    {
                        name: formData.name,
                        current_stock: parseFloat(formData.current_stock),
                        unit: formData.unit,
                        category_id: formData.category_id || null,
                        min_stock: parseFloat(formData.min_stock),
                        unit_price: parseFloat(formData.unit_price),
                        status: 'active'
                    }
                ])

            if (error) {
                setError(`添加失败: ${error.message}`)
            } else {
                setFormData({
                    name: '',
                    current_stock: '',
                    unit: '件',
                    category_id: '',
                    min_stock: '0',
                    unit_price: '0'
                })
                fetchProducts()
            }
        } catch (err) {
            setError('添加数据时发生错误')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这个产品吗?')) return

        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id)

            if (error) {
                setError(`删除失败: ${error.message}`)
            } else {
                fetchProducts()
            }
        } catch (err) {
            setError('删除数据时发生错误')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        testConnection()
        fetchCategories()
        fetchProducts()
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
                    <h2>添加产品</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>产品名称</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="例如: 埃塞俄比亚咖啡豆"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>当前库存</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.current_stock}
                                    onChange={(e) => setFormData({ ...formData, current_stock: e.target.value })}
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
                                <label>分类</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <option value="">选择分类</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>最低库存</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.min_stock}
                                    onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                                    placeholder="例如: 10"
                                />
                            </div>
                            <div className="form-group">
                                <label>单价</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.unit_price}
                                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                                    placeholder="例如: 150.00"
                                />
                            </div>
                        </div>
                        <div className="button-group">
                            <button type="submit" className="btn btn-primary" disabled={loading || !isConnected}>
                                {loading ? '添加中...' : '添加产品'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={fetchProducts}
                                disabled={loading || !isConnected}
                            >
                                刷新数据
                            </button>
                        </div>
                    </form>
                </div>

                <div className="data-section">
                    <h2>产品列表</h2>
                    {loading ? (
                        <div className="loading">加载中...</div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            暂无产品数据，请添加产品
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>产品名称</th>
                                        <th>当前库存</th>
                                        <th>最低库存</th>
                                        <th>单位</th>
                                        <th>单价</th>
                                        <th>状态</th>
                                        <th>创建时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => {
                                        const isLowStock = product.current_stock <= product.min_stock
                                        return (
                                            <tr key={product.id} className={isLowStock ? 'low-stock' : ''}>
                                                <td>{product.name}</td>
                                                <td>{product.current_stock}</td>
                                                <td>{product.min_stock}</td>
                                                <td>{product.unit}</td>
                                                <td>¥{product.unit_price}</td>
                                                <td>
                                                    <span className={`status-badge ${product.status}`}>
                                                        {product.status === 'active' ? '启用' : '停用'}
                                                    </span>
                                                </td>
                                                <td>{new Date(product.created_at).toLocaleString('zh-CN')}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-danger btn-small"
                                                            onClick={() => handleDelete(product.id)}
                                                            disabled={loading}
                                                        >
                                                            删除
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
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
