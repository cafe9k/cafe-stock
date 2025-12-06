/**
 * 巨潮资讯网公告查询客户端
 * 通过 Supabase Edge Function 代理访问
 * 支持本地缓存，避免触发限流
 */

import { SUPABASE_FUNCTIONS_URL, SUPABASE_ANON_KEY } from '../config/supabase'
import { cninfoCache } from './cninfoCache'

// 公告数据结构
export interface Announcement {
    id: string
    secCode: string
    secName: string
    announcementId: string
    announcementTitle: string
    announcementTime: number  // 时间戳
    adjunctUrl: string
    adjunctSize: number
    adjunctType: string
    announcementType: string
    pdfUrl: string
}

// 查询参数
export interface AnnouncementQueryParams {
    stock: string           // 股票代码
    searchkey?: string      // 搜索关键词
    category?: string       // 公告类别
    pageNum?: number        // 页码
    pageSize?: number       // 每页数量
    seDate?: string         // 日期范围
}

// 响应结构
interface AnnouncementResponse {
    code: number
    msg: string | null
    data: {
        totalRecordNum: number
        announcements: Announcement[]
        hasMore: boolean
    } | null
}

// 公告类别
export const ANNOUNCEMENT_CATEGORIES = {
    annual: '年度报告',
    semi_annual: '半年度报告',
    q1: '一季度报告',
    q3: '三季度报告',
    forecast: '业绩预告',
    shareholder: '股东大会',
    daily: '日常经营',
    equity: '股权变动',
    holding: '增持/减持',
    governance: '公司治理',
} as const

export type AnnouncementCategory = keyof typeof ANNOUNCEMENT_CATEGORIES

class CninfoClient {
    private apiUrl: string
    private lastRequestTime: number = 0
    private minInterval: number = 1000  // 最小请求间隔 1 秒

    constructor() {
        this.apiUrl = `${SUPABASE_FUNCTIONS_URL}/cninfo-proxy`
    }

    /**
     * 等待到可以发送下一个请求
     */
    private async waitForRateLimit(): Promise<void> {
        const now = Date.now()
        const timeSinceLastRequest = now - this.lastRequestTime
        
        if (timeSinceLastRequest < this.minInterval) {
            const waitTime = this.minInterval - timeSinceLastRequest
            await new Promise(resolve => setTimeout(resolve, waitTime))
        }
    }

    /**
     * 查询公告（带缓存）
     */
    async query(params: AnnouncementQueryParams, useCache = true): Promise<{
        announcements: Announcement[]
        total: number
        hasMore: boolean
        fromCache: boolean
    }> {
        // 构建缓存请求参数
        const cacheRequest = {
            stock: params.stock,
            searchkey: params.searchkey,
            category: params.category,
            pageNum: params.pageNum || 1,
            pageSize: params.pageSize || 10,
            seDate: params.seDate,
        }

        // 1. 检查缓存
        if (useCache) {
            const cachedResult = cninfoCache.get(cacheRequest)
            if (cachedResult && cachedResult.data) {
                console.log(`[CninfoClient] 使用缓存数据: ${params.stock}`)
                return {
                    announcements: cachedResult.data.announcements || [],
                    total: cachedResult.data.totalRecordNum || 0,
                    hasMore: cachedResult.data.hasMore || false,
                    fromCache: true,
                }
            }
        }

        // 2. 频率限制
        await this.waitForRateLimit()
        this.lastRequestTime = Date.now()

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify(cacheRequest),
            })

            if (!response.ok) {
                // 检查是否是限流
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After')
                    throw new Error(`请求过于频繁，请等待 ${retryAfter || '1'} 秒后重试`)
                }
                throw new Error(`请求失败: ${response.status}`)
            }

            const result: AnnouncementResponse = await response.json()

            if (result.code !== 0) {
                throw new Error(result.msg || '查询失败')
            }

            // 3. 存入缓存
            if (useCache) {
                cninfoCache.set(cacheRequest, result)
            }

            return {
                announcements: result.data?.announcements || [],
                total: result.data?.totalRecordNum || 0,
                hasMore: result.data?.hasMore || false,
                fromCache: false,
            }
        } catch (error) {
            console.error('查询公告失败:', error)
            throw error
        }
    }

    /**
     * 获取最近一周的公告（带缓存）
     */
    async getRecentAnnouncements(tsCode: string, limit = 5, useCache = true): Promise<{
        announcements: Announcement[]
        fromCache: boolean
    }> {
        // 计算一周前的日期
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        
        const formatDate = (d: Date) => {
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        }

        const seDate = `${formatDate(startDate)}~${formatDate(endDate)}`
        
        // 去掉股票代码后缀
        const stockCode = tsCode.replace(/\.(SZ|SH|sz|sh)$/, '')

        const result = await this.query({
            stock: stockCode,
            pageNum: 1,
            pageSize: limit,
            seDate,
        }, useCache)

        return {
            announcements: result.announcements,
            fromCache: result.fromCache,
        }
    }

    /**
     * 获取指定股票的所有公告（分页，带缓存）
     */
    async getAnnouncements(
        tsCode: string, 
        options?: {
            category?: AnnouncementCategory
            pageNum?: number
            pageSize?: number
            seDate?: string
            useCache?: boolean
        }
    ): Promise<{
        announcements: Announcement[]
        total: number
        hasMore: boolean
        fromCache: boolean
    }> {
        // 去掉股票代码后缀
        const stockCode = tsCode.replace(/\.(SZ|SH|sz|sh)$/, '')

        return this.query({
            stock: stockCode,
            category: options?.category,
            pageNum: options?.pageNum || 1,
            pageSize: options?.pageSize || 10,
            seDate: options?.seDate,
        }, options?.useCache !== false)
    }

    /**
     * 清除指定股票的公告缓存
     */
    clearCache(tsCode?: string): void {
        if (tsCode) {
            // 清除指定股票的缓存需要知道完整的请求参数
            // 这里简化处理，直接清除所有缓存
            console.log(`[CninfoClient] 清除缓存: ${tsCode}`)
        }
        cninfoCache.clear()
    }

    /**
     * 获取缓存统计信息
     */
    getCacheStats() {
        return cninfoCache.getStats()
    }
}

// 导出单例
export const cninfoClient = new CninfoClient()

