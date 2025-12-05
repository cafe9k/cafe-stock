/**
 * Tushare Pro HTTP 客户端
 * 文档: https://tushare.pro/document/1?doc_id=130
 * 
 * 通过 Supabase Edge Function 代理请求，解决 CORS 问题
 */

import { TUSHARE_TOKEN } from '../config/tushare'
import { SUPABASE_FUNCTIONS_URL } from '../config/supabase'

/**
 * Tushare API 请求参数接口
 */
interface TushareRequestParams {
    api_name: string
    token: string
    params?: Record<string, any>
    fields?: string
}

/**
 * Tushare API 响应接口
 */
interface TushareResponse<T = any> {
    code: number
    msg: string | null
    data: {
        fields: string[]
        items: T[][]
    }
}

/**
 * Tushare API 错误类
 */
class TushareError extends Error {
    code: number
    
    constructor(code: number, message: string) {
        super(message)
        this.name = 'TushareError'
        this.code = code
    }
}

/**
 * Tushare HTTP 客户端类
 */
class TushareClient {
    private token: string
    private apiUrl: string
    
    constructor(token?: string, apiUrl?: string) {
        this.token = token || TUSHARE_TOKEN
        // 使用 Supabase Edge Function 代理，解决 CORS 问题
        this.apiUrl = apiUrl || `${SUPABASE_FUNCTIONS_URL}/tushare-proxy`
        
        if (!this.token) {
            console.warn('Tushare token 未配置，请在 .env 文件中设置 VITE_TUSHARE_TOKEN')
        }
    }
    
    /**
     * 设置 Token
     */
    setToken(token: string): void {
        this.token = token
    }
    
    /**
     * 获取当前 Token
     */
    getToken(): string {
        return this.token
    }
    
    /**
     * 发起 HTTP API 请求
     */
    private async request<T = any>(params: TushareRequestParams): Promise<TushareResponse<T>> {
        if (!this.token) {
            throw new TushareError(-1, 'Token 未配置，无法调用 API')
        }
        
        const requestBody = {
            api_name: params.api_name,
            token: this.token,
            params: params.params || {},
            fields: params.fields || ''
        }
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            
            if (!response.ok) {
                throw new TushareError(response.status, `HTTP 错误: ${response.statusText}`)
            }
            
            const result: TushareResponse<T> = await response.json()
            
            // 检查业务错误码
            if (result.code !== 0) {
                throw new TushareError(result.code, result.msg || '未知错误')
            }
            
            return result
        } catch (error) {
            if (error instanceof TushareError) {
                throw error
            }
            throw new TushareError(-1, `请求失败: ${error instanceof Error ? error.message : '未知错误'}`)
        }
    }
    
    /**
     * 查询数据并转换为对象数组
     */
    async query<T = any>(
        apiName: string,
        params?: Record<string, any>,
        fields?: string[]
    ): Promise<T[]> {
        const fieldsStr = fields ? fields.join(',') : ''
        
        const response = await this.request<any>({
            api_name: apiName,
            token: this.token,
            params,
            fields: fieldsStr
        })
        
        // 将数据转换为对象数组
        const { fields: fieldNames, items } = response.data
        
        return items.map(item => {
            const obj: any = {}
            fieldNames.forEach((field, index) => {
                obj[field] = item[index]
            })
            return obj as T
        })
    }
    
    /**
     * 查询数据并返回原始响应
     */
    async queryRaw<T = any>(
        apiName: string,
        params?: Record<string, any>,
        fields?: string[]
    ): Promise<TushareResponse<T>> {
        const fieldsStr = fields ? fields.join(',') : ''
        
        return this.request<T>({
            api_name: apiName,
            token: this.token,
            params,
            fields: fieldsStr
        })
    }
}

// 导出单例实例
export const tushareClient = new TushareClient()

// 导出类和类型
export { TushareClient, TushareError }
export type { TushareRequestParams, TushareResponse }

/**
 * 使用示例:
 * 
 * // 1. 查询股票基本信息
 * const stocks = await tushareClient.query('stock_basic', {
 *     list_status: 'L'
 * }, ['ts_code', 'name', 'area', 'industry', 'list_date'])
 * 
 * // 2. 查询日线行情
 * const daily = await tushareClient.query('daily', {
 *     ts_code: '000001.SZ',
 *     start_date: '20231201',
 *     end_date: '20231231'
 * }, ['trade_date', 'open', 'high', 'low', 'close', 'vol'])
 * 
 * // 3. 获取原始响应
 * const rawResponse = await tushareClient.queryRaw('stock_basic', {
 *     list_status: 'L'
 * })
 */

