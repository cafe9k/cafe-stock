import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 获取初始会话
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)

                // 新用户注册时，创建默认分组和设置
                if (_event === 'SIGNED_IN' && session?.user) {
                    await initializeUserData(session.user.id)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // 初始化用户数据（默认分组和设置）
    const initializeUserData = async (userId: string) => {
        try {
            // 检查是否已有分组
            const { data: existingGroups } = await supabase
                .from('watch_groups')
                .select('id')
                .eq('user_id', userId)
                .limit(1)

            // 如果没有分组，创建默认分组
            if (!existingGroups || existingGroups.length === 0) {
                await supabase.from('watch_groups').insert([
                    { user_id: userId, name: '自选股', sort_order: 0, color: '#58a6ff' },
                ])
            }

            // 检查是否已有设置
            const { data: existingSettings } = await supabase
                .from('user_settings')
                .select('user_id')
                .eq('user_id', userId)
                .single()

            // 如果没有设置，创建默认设置
            if (!existingSettings) {
                await supabase.from('user_settings').insert({
                    user_id: userId,
                    theme: 'dark',
                    color_scheme: 'cn',
                    alert_types: ['top_list', 'block_trade', 'suspend_d', 'share_float'],
                    refresh_interval: 5,
                })
            }
        } catch (error) {
            console.error('初始化用户数据失败:', error)
        }
    }

    // 注册
    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { error }
    }

    // 登录
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { error }
    }

    // 登出
    const signOut = async () => {
        await supabase.auth.signOut()
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

