import './App.css'
import ApiList from './components/ApiList'

function App() {
    return (
        <div className="app">
            <div className="container">
                <div className="header">
                    <h1>📚 Tushare API 接口测试平台</h1>
                    <p>基于 Tushare Pro 提供 API 接口查询与测试服务</p>
                </div>

                <ApiList />
            </div>
        </div>
    )
}

export default App
