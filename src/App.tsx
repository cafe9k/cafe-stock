import './App.css'
import StockList from './components/StockList'

function App() {


    return (
        <div className="app">
            <div className="container">
                <div className="header">
                    <h1>📈 A股股票数据查询系统</h1>
                    <p>基于 Tushare Pro 提供实时股票数据查询服务</p>
                </div>

                <StockList />
            </div>
        </div>
    )
}

export default App
