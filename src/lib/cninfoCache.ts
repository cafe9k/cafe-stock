/**
 * 巨潮资讯公告数据本地缓存
 * 
 * 功能：
 * 1. 日级别公告数据长期缓存（24小时）
 * 2. 支持 localStorage 持久化
 * 3. 自动过期清理
 * 4. 按股票代码+日期范围+类别作为缓存 key
 */

// 缓存请求参数（与 cninfoClient 的查询参数对应）
export interface CacheRequest {
    stock?: string
    searchkey?: string
    category?: string
    pageNum?: number
    pageSize?: number
    seDate?: string
}

// 缓存响应数据
export interface CacheResponse {
    code: number
    msg: string | null
    data: {
        totalRecordNum: number
        announcements: any[]
        hasMore: boolean
    } | null
}

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number  // 生存时间（毫秒）
}

interface CacheConfig {
    useLocalStorage: boolean  // 是否使用 localStorage 持久化
    prefix: string            // localStorage key 前缀
}

// 缓存时间配置（毫秒）
const TTL_CONFIG = {
    // 公告数据按日期范围缓存
    // 历史公告（非今日）：24小时缓存
    historical: 24 * 60 * 60 * 1000,
    // 包含今日的查询：5分钟缓存（可能有新公告）
    today: 5 * 60 * 1000,
    // 默认缓存时间
    default: 60 * 60 * 1000  // 1小时
}

class CninfoCache {
    private memoryCache = new Map<string, CacheEntry<any>>()
    private config: CacheConfig
    
    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            useLocalStorage: true,
            prefix: 'cninfo_cache_',
            ...config
        }
        
        // 启动时清理过期的 localStorage 缓存
        this.cleanExpiredLocalStorage()
    }
    
    /**
     * 生成缓存 key
     */
    private getCacheKey(request: CacheRequest): string {
        const parts = [
            request.stock || '',
            request.searchkey || '',
            request.category || '',
            request.seDate || '',
            String(request.pageNum || 1),
            String(request.pageSize || 10)
        ]
        return parts.join(':')
    }
    
    /**
     * 判断日期范围是否包含今天
     */
    private includestoday(seDate?: string): boolean {
        if (!seDate) return true  // 无日期范围视为包含今天
        
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        
        const [, endDate] = seDate.split('~')
        if (!endDate) return true
        
        return endDate >= todayStr
    }
    
    /**
     * 获取适当的 TTL
     */
    private getTTL(request: CacheRequest): number {
        if (this.includestoday(request.seDate)) {
            return TTL_CONFIG.today
        }
        return TTL_CONFIG.historical
    }
    
    /**
     * 获取缓存数据
     */
    get(request: CacheRequest): CacheResponse | null {
        const key = this.getCacheKey(request)
        
        // 1. 先检查内存缓存
        const memoryEntry = this.memoryCache.get(key)
        if (memoryEntry && !this.isExpired(memoryEntry)) {
            console.log(`[CninfoCache] 内存缓存命中: ${request.stock || request.searchkey}`)
            return memoryEntry.data
        }
        
        // 2. 检查 localStorage 缓存
        if (this.config.useLocalStorage) {
            const localEntry = this.getFromLocalStorage<CacheResponse>(key)
            if (localEntry && !this.isExpired(localEntry)) {
                // 恢复到内存缓存
                this.memoryCache.set(key, localEntry)
                console.log(`[CninfoCache] localStorage 缓存命中: ${request.stock || request.searchkey}`)
                return localEntry.data
            }
        }
        
        return null
    }
    
    /**
     * 设置缓存数据
     */
    set(request: CacheRequest, data: CacheResponse): void {
        const key = this.getCacheKey(request)
        const ttl = this.getTTL(request)
        
        const entry: CacheEntry<CacheResponse> = {
            data,
            timestamp: Date.now(),
            ttl
        }
        
        // 1. 存入内存缓存
        this.memoryCache.set(key, entry)
        
        // 2. 存入 localStorage
        if (this.config.useLocalStorage) {
            this.setToLocalStorage(key, entry)
        }
        
        const isHistorical = !this.includestoday(request.seDate)
        console.log(`[CninfoCache] 缓存已设置: ${request.stock || request.searchkey}, TTL: ${ttl / 1000}s, 类型: ${isHistorical ? '历史数据' : '实时数据'}`)
    }
    
    /**
     * 检查是否过期
     */
    private isExpired(entry: CacheEntry<any>): boolean {
        return Date.now() - entry.timestamp > entry.ttl
    }
    
    /**
     * 从 localStorage 获取
     */
    private getFromLocalStorage<T>(key: string): CacheEntry<T> | null {
        try {
            const storageKey = this.config.prefix + key
            const data = localStorage.getItem(storageKey)
            if (data) {
                return JSON.parse(data)
            }
        } catch (error) {
            console.warn('[CninfoCache] localStorage 读取失败:', error)
        }
        return null
    }
    
    /**
     * 存入 localStorage
     */
    private setToLocalStorage<T>(key: string, entry: CacheEntry<T>): void {
        try {
            const storageKey = this.config.prefix + key
            localStorage.setItem(storageKey, JSON.stringify(entry))
        } catch (error) {
            console.warn('[CninfoCache] localStorage 写入失败:', error)
            // 如果存储满了，清理过期数据后重试
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                this.cleanExpiredLocalStorage()
                try {
                    const storageKey = this.config.prefix + key
                    localStorage.setItem(storageKey, JSON.stringify(entry))
                } catch {
                    // 仍然失败，放弃持久化
                }
            }
        }
    }
    
    /**
     * 清理过期的 localStorage 缓存
     */
    private cleanExpiredLocalStorage(): void {
        if (!this.config.useLocalStorage) return
        
        try {
            const keysToRemove: string[] = []
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key && key.startsWith(this.config.prefix)) {
                    const data = localStorage.getItem(key)
                    if (data) {
                        try {
                            const entry = JSON.parse(data) as CacheEntry<any>
                            if (this.isExpired(entry)) {
                                keysToRemove.push(key)
                            }
                        } catch {
                            // 解析失败的也清理
                            keysToRemove.push(key)
                        }
                    }
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key))
            
            if (keysToRemove.length > 0) {
                console.log(`[CninfoCache] 清理了 ${keysToRemove.length} 个过期缓存`)
            }
        } catch (error) {
            console.warn('[CninfoCache] 清理 localStorage 失败:', error)
        }
    }
    
    /**
     * 删除指定缓存
     */
    delete(request: CacheRequest): void {
        const key = this.getCacheKey(request)
        
        this.memoryCache.delete(key)
        
        if (this.config.useLocalStorage) {
            try {
                localStorage.removeItem(this.config.prefix + key)
            } catch {
                // 忽略错误
            }
        }
    }
    
    /**
     * 清空所有公告缓存
     */
    clear(): void {
        this.memoryCache.clear()
        
        if (this.config.useLocalStorage) {
            try {
                const keysToRemove: string[] = []
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    if (key && key.startsWith(this.config.prefix)) {
                        keysToRemove.push(key)
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key))
            } catch {
                // 忽略错误
            }
        }
        
        console.log('[CninfoCache] 公告缓存已清空')
    }
    
    /**
     * 获取缓存统计信息
     */
    getStats(): {
        memoryEntries: number
        localStorageEntries: number
        totalSize: string
    } {
        let localStorageEntries = 0
        let totalSize = 0
        
        if (this.config.useLocalStorage) {
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    if (key && key.startsWith(this.config.prefix)) {
                        localStorageEntries++
                        const data = localStorage.getItem(key)
                        if (data) {
                            totalSize += data.length * 2 // UTF-16 编码
                        }
                    }
                }
            } catch {
                // 忽略错误
            }
        }
        
        return {
            memoryEntries: this.memoryCache.size,
            localStorageEntries,
            totalSize: this.formatSize(totalSize)
        }
    }
    
    /**
     * 格式化大小
     */
    private formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }
}

// 导出单例实例
export const cninfoCache = new CninfoCache()

// 导出类和配置
export { CninfoCache, TTL_CONFIG }
export type { CacheEntry, CacheConfig }

