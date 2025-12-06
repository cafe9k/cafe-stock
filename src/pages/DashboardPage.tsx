import { useAuth } from '../contexts/AuthContext'
import './DashboardPage.css'

export default function DashboardPage() {
    const { user, signOut } = useAuth()

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

            {/* 消息横幅 */}
            <div className="alert-banner">
                <span className="alert-icon">🔔</span>
                <span className="alert-text">暂无新消息</span>
            </div>

            {/* 主内容区 */}
            <div className="dashboard-content">
                {/* 左侧边栏 - 分组 */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2>分组</h2>
                        <button className="btn-add-group" title="新建分组">+</button>
                    </div>
                    <nav className="group-list">
                        <a href="#" className="group-item active">
                            <span className="group-color" style={{ background: '#58a6ff' }}></span>
                            <span className="group-name">自选股</span>
                            <span className="group-count">0</span>
                        </a>
                    </nav>
                </aside>

                {/* 主面板 */}
                <main className="main-panel">
                    {/* 工具栏 */}
                    <div className="toolbar">
                        <div className="toolbar-left">
                            <button className="btn-add-stock">
                                <span>+</span> 添加股票
                            </button>
                        </div>
                        <div className="toolbar-right">
                            <select className="sort-select">
                                <option value="default">默认排序</option>
                                <option value="change_desc">涨幅从高到低</option>
                                <option value="change_asc">涨幅从低到高</option>
                                <option value="volume">成交量</option>
                            </select>
                            <button className="btn-refresh" title="刷新">
                                🔄
                            </button>
                        </div>
                    </div>

                    {/* 股票卡片网格 */}
                    <div className="stock-grid">
                        {/* 空状态 */}
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>还没有关注的股票</h3>
                            <p>点击"添加股票"开始追踪您感兴趣的股票</p>
                            <button className="btn-add-stock-large">
                                + 添加第一只股票
                            </button>
                        </div>
                    </div>
                </main>

                {/* 右侧详情面板（暂时隐藏） */}
                {/* <aside className="detail-panel">
                    详情面板
                </aside> */}
            </div>

            {/* 底部状态栏 */}
            <footer className="dashboard-footer">
                <span className="status-item">
                    <span className="status-dot"></span>
                    数据来源: Tushare Pro
                </span>
                <span className="status-item">
                    最后更新: --
                </span>
            </footer>
        </div>
    )
}

