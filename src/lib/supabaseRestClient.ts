/**
 * Supabase REST API 客户端
 * 使用原生 fetch API 直接调用 Supabase REST API
 * 便于在浏览器开发者工具中观察网络请求
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/supabase'

// REST API 基础 URL
const REST_URL = `${SUPABASE_URL}/rest/v1`
const AUTH_URL = `${SUPABASE_URL}/auth/v1`

// 存储当前用户的 access token
let currentAccessToken: string | null = null

/**
 * 设置当前用户的 access token
 */
export function setAccessToken(token: string | null) {
    currentAccessToken = token
    if (token) {
        localStorage.setItem('supabase_access_token', token)
    } else {
        localStorage.removeItem('supabase_access_token')
    }
}

/**
 * 获取当前用户的 access token
 */
export function getAccessToken(): string | null {
    if (!currentAccessToken) {
        currentAccessToken = localStorage.getItem('supabase_access_token')
    }
    return currentAccessToken
}

/**
 * 获取请求头
 */
function getHeaders(useAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
    }
    
    const token = useAuth ? getAccessToken() : null
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    } else {
        headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`
    }
    
    return headers
}

/**
 * REST API 响应类型
 */
interface RestResponse<T> {
    data: T | null
    error: { message: string; code?: string } | null
}

/**
 * 执行 REST API 请求
 */
async function request<T>(
    url: string,
    options: RequestInit = {}
): Promise<RestResponse<T>> {
    try {
        console.log(`[Supabase REST] ${options.method || 'GET'} ${url}`)
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getHeaders(),
                ...options.headers,
            },
        })
        
        console.log(`[Supabase REST] Response: ${response.status} ${response.statusText}`)
        
        if (!response.ok) {
            const errorText = await response.text()
            let errorData
            try {
                errorData = JSON.parse(errorText)
            } catch {
                errorData = { message: errorText }
            }
            console.error(`[Supabase REST] Error:`, errorData)
            return {
                data: null,
                error: {
                    message: errorData.message || errorData.error || `HTTP ${response.status}`,
                    code: errorData.code,
                },
            }
        }
        
        // 检查响应是否为空
        const text = await response.text()
        if (!text) {
            return { data: null, error: null }
        }
        
        const data = JSON.parse(text)
        console.log(`[Supabase REST] Data:`, data)
        return { data, error: null }
    } catch (error) {
        console.error(`[Supabase REST] Fetch error:`, error)
        return {
            data: null,
            error: {
                message: error instanceof Error ? error.message : '网络请求失败',
            },
        }
    }
}

/**
 * 数据库操作 - SELECT
 */
export async function select<T>(
    table: string,
    options: {
        columns?: string
        filters?: Record<string, string>
        order?: { column: string; ascending?: boolean }
        limit?: number
        single?: boolean
    } = {}
): Promise<RestResponse<T>> {
    const params = new URLSearchParams()
    
    // 选择列
    params.set('select', options.columns || '*')
    
    // 过滤条件
    if (options.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
            params.set(key, value)
        }
    }
    
    // 排序
    if (options.order) {
        params.set('order', `${options.order.column}.${options.order.ascending !== false ? 'asc' : 'desc'}`)
    }
    
    // 限制数量
    if (options.limit) {
        params.set('limit', options.limit.toString())
    }
    
    const url = `${REST_URL}/${table}?${params.toString()}`
    
    const headers: HeadersInit = {}
    if (options.single) {
        headers['Accept'] = 'application/vnd.pgrst.object+json'
    }
    
    return request<T>(url, { method: 'GET', headers })
}

/**
 * 数据库操作 - INSERT
 */
export async function insert<T>(
    table: string,
    data: Record<string, any>,
    options: { returnData?: boolean; single?: boolean } = {}
): Promise<RestResponse<T>> {
    const url = `${REST_URL}/${table}`
    
    const headers: HeadersInit = {
        'Prefer': options.returnData !== false ? 'return=representation' : 'return=minimal',
    }
    
    if (options.single) {
        headers['Accept'] = 'application/vnd.pgrst.object+json'
    }
    
    return request<T>(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    })
}

/**
 * 数据库操作 - UPDATE
 */
export async function update<T>(
    table: string,
    data: Record<string, any>,
    filters: Record<string, string>,
    options: { returnData?: boolean } = {}
): Promise<RestResponse<T>> {
    const params = new URLSearchParams()
    
    for (const [key, value] of Object.entries(filters)) {
        params.set(key, value)
    }
    
    const url = `${REST_URL}/${table}?${params.toString()}`
    
    const headers: HeadersInit = {
        'Prefer': options.returnData !== false ? 'return=representation' : 'return=minimal',
    }
    
    return request<T>(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
    })
}

/**
 * 数据库操作 - DELETE
 */
export async function remove<T>(
    table: string,
    filters: Record<string, string>
): Promise<RestResponse<T>> {
    const params = new URLSearchParams()
    
    for (const [key, value] of Object.entries(filters)) {
        params.set(key, value)
    }
    
    const url = `${REST_URL}/${table}?${params.toString()}`
    
    return request<T>(url, { method: 'DELETE' })
}

/**
 * 认证 - 登录
 */
export async function signInWithPassword(
    email: string,
    password: string
): Promise<RestResponse<{ user: any; session: any }>> {
    const url = `${AUTH_URL}/token?grant_type=password`
    
    console.log(`[Supabase Auth] 登录: ${email}`)
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
    })
    
    console.log(`[Supabase Auth] Response: ${response.status}`)
    
    if (!response.ok) {
        const errorData = await response.json()
        console.error(`[Supabase Auth] Error:`, errorData)
        return {
            data: null,
            error: { message: errorData.error_description || errorData.message || '登录失败' },
        }
    }
    
    const data = await response.json()
    console.log(`[Supabase Auth] 登录成功:`, { user_id: data.user?.id })
    
    // 保存 access token
    if (data.access_token) {
        setAccessToken(data.access_token)
        localStorage.setItem('supabase_refresh_token', data.refresh_token)
        localStorage.setItem('supabase_user', JSON.stringify(data.user))
    }
    
    return {
        data: { user: data.user, session: data },
        error: null,
    }
}

/**
 * 认证 - 注册
 */
export async function signUp(
    email: string,
    password: string
): Promise<RestResponse<{ user: any; session: any }>> {
    const url = `${AUTH_URL}/signup`
    
    console.log(`[Supabase Auth] 注册: ${email}`)
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
    })
    
    console.log(`[Supabase Auth] Response: ${response.status}`)
    
    if (!response.ok) {
        const errorData = await response.json()
        console.error(`[Supabase Auth] Error:`, errorData)
        return {
            data: null,
            error: { message: errorData.error_description || errorData.message || '注册失败' },
        }
    }
    
    const data = await response.json()
    console.log(`[Supabase Auth] 注册成功:`, { user_id: data.user?.id })
    
    // 保存 access token
    if (data.access_token) {
        setAccessToken(data.access_token)
        localStorage.setItem('supabase_refresh_token', data.refresh_token)
        localStorage.setItem('supabase_user', JSON.stringify(data.user))
    }
    
    return {
        data: { user: data.user, session: data },
        error: null,
    }
}

/**
 * 认证 - 刷新 token
 */
export async function refreshToken(): Promise<RestResponse<{ user: any; session: any }>> {
    const refreshTokenValue = localStorage.getItem('supabase_refresh_token')
    
    if (!refreshTokenValue) {
        return { data: null, error: { message: '没有刷新令牌' } }
    }
    
    const url = `${AUTH_URL}/token?grant_type=refresh_token`
    
    console.log(`[Supabase Auth] 刷新 token`)
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ refresh_token: refreshTokenValue }),
    })
    
    console.log(`[Supabase Auth] Response: ${response.status}`)
    
    if (!response.ok) {
        const errorData = await response.json()
        console.error(`[Supabase Auth] Error:`, errorData)
        // 清除无效的 token
        signOut()
        return {
            data: null,
            error: { message: errorData.error_description || errorData.message || '刷新令牌失败' },
        }
    }
    
    const data = await response.json()
    console.log(`[Supabase Auth] Token 刷新成功`)
    
    // 更新 access token
    if (data.access_token) {
        setAccessToken(data.access_token)
        localStorage.setItem('supabase_refresh_token', data.refresh_token)
        localStorage.setItem('supabase_user', JSON.stringify(data.user))
    }
    
    return {
        data: { user: data.user, session: data },
        error: null,
    }
}

/**
 * 认证 - 登出
 */
export function signOut(): void {
    console.log(`[Supabase Auth] 登出`)
    setAccessToken(null)
    localStorage.removeItem('supabase_refresh_token')
    localStorage.removeItem('supabase_user')
}

/**
 * 认证 - 获取当前用户
 */
export function getCurrentUser(): any | null {
    const userStr = localStorage.getItem('supabase_user')
    if (!userStr) return null
    try {
        return JSON.parse(userStr)
    } catch {
        return null
    }
}

/**
 * 认证 - 获取当前会话
 */
export async function getSession(): Promise<RestResponse<{ user: any; session: any } | null>> {
    const token = getAccessToken()
    const user = getCurrentUser()
    
    if (!token || !user) {
        return { data: null, error: null }
    }
    
    // 尝试刷新 token 以确保有效
    const result = await refreshToken()
    if (result.error) {
        return { data: null, error: null }
    }
    
    return result
}

