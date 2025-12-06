import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

// 受保护路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>加载中...</p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth" replace />
    }

    return <>{children}</>
}

// 公共路由组件（已登录用户访问登录页时重定向到首页）
function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>加载中...</p>
            </div>
        )
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/auth"
                element={
                    <PublicRoute>
                        <AuthPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
