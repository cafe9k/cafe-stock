import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
import { 
    signInWithPassword, 
    signUp as restSignUp, 
    signOut as restSignOut,
    getCurrentUser,
    refreshToken,
    insert,
    select
} from '../lib/supabaseRestClient'

interface User {
    id: string
    email?: string
    [key: string]: any
}

interface AuthContextType {
    user: User | null
    session: any | null
    loading: boolean
    signUp: (email: string, password: string) => Promise<{ error: { message: string } | null }>
    signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    
    // 防止 StrictMode 导致的重复初始化
    const initRef = useRef(false)

    useEffect(() => {
        // 防止重复初始化
        if (initRef.current) return
        initRef.current = true
        
        // 获取初始会话
        const initAuth = async () => {
            console.log('[AuthContext] 初始化认证状态')
            
            // 先尝试从 localStorage 获取用户
            const cachedUser = getCurrentUser()
            if (cachedUser) {
                console.log('[AuthContext] 从缓存获取用户:', cachedUser.id)
                setUser(cachedUser)
                
                // 尝试刷新 token
                const { data, error } = await refreshToken()
                if (error) {
                    console.log('[AuthContext] Token 刷新失败，清除会话')
                    setUser(null)
                    setSession(null)
                } else if (data) {
                    console.log('[AuthContext] Token 刷新成功')
                    setUser(data.user)
                    setSession(data.session)
                }
            } else {
                console.log('[AuthContext] 没有缓存的用户')
            }
            
            setLoading(false)
        }
        
        initAuth()
    }, [])

    // 初始化用户数据（默认分组和设置）
    const initializeUserData = async (userId: string) => {
        try {
            console.log('[AuthContext] 初始化用户数据:', userId)
            
            // 检查是否已有分组
            const { data: existingGroups } = await select<any[]>('watch_groups', {
                columns: 'id',
                filters: { 'user_id': `eq.${userId}` },
                limit: 1,
            })

            // 如果没有分组，创建默认分组
            if (!existingGroups || existingGroups.length === 0) {
                console.log('[AuthContext] 创建默认分组')
                await insert('watch_groups', {
                    user_id: userId,
                    name: '自选股',
                    sort_order: 0,
                    color: '#58a6ff',
                })
            }

            // 检查是否已有设置
            const { data: existingSettings } = await select<any>('user_settings', {
                columns: 'user_id',
                filters: { 'user_id': `eq.${userId}` },
            })

            // 如果没有设置，创建默认设置
            if (!existingSettings || existingSettings.length === 0) {
                console.log('[AuthContext] 创建默认设置')
                await insert('user_settings', {
                    user_id: userId,
                    theme: 'dark',
                    color_scheme: 'cn',
                    alert_types: ['top_list', 'block_trade', 'suspend_d', 'share_float'],
                    refresh_interval: 5,
                })
            }
            
            console.log('[AuthContext] 用户数据初始化完成')
        } catch (error) {
            console.error('[AuthContext] 初始化用户数据失败:', error)
        }
    }

    // 注册
    const signUp = async (email: string, password: string) => {
        console.log('[AuthContext] 注册:', email)
        const { data, error } = await restSignUp(email, password)
        
        if (error) {
            return { error }
        }
        
        if (data) {
            setUser(data.user)
            setSession(data.session)
            
            // 初始化用户数据
            if (data.user?.id) {
                await initializeUserData(data.user.id)
            }
        }
        
        return { error: null }
    }

    // 登录
    const signIn = async (email: string, password: string) => {
        console.log('[AuthContext] 登录:', email)
        const { data, error } = await signInWithPassword(email, password)
        
        if (error) {
            return { error }
        }
        
        if (data) {
            setUser(data.user)
            setSession(data.session)
            
            // 初始化用户数据（确保有默认分组）
            if (data.user?.id) {
                await initializeUserData(data.user.id)
            }
        }
        
        return { error: null }
    }

    // 登出
    const signOut = async () => {
        console.log('[AuthContext] 登出')
        restSignOut()
        setUser(null)
        setSession(null)
    }

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
