/**
 * 巨潮资讯公告数据本地缓存
 * 
 * 功能：
 * 1. 所有数据持久化到 localStorage（24小时）
 * 2. 自动过期清理
 */

// 缓存请求参数
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
    prefix: string  // localStorage key 前缀
}

// 缓存时间配置（毫秒）- 所有数据 24 小时
const TTL_CONFIG = {
    default: 24 * 60 * 60 * 1000  // 24小时
}

class CninfoCache {
    private config: CacheConfig
    
    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
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
     * 获取缓存数据
     */
    get(request: CacheRequest): CacheResponse | null {
        const key = this.getCacheKey(request)
        const entry = this.getFromLocalStorage<CacheResponse>(key)
        
        if (entry && !this.isExpired(entry)) {
            console.log(`[CninfoCache] 缓存命中: ${request.stock || request.searchkey}`)
            return entry.data
        }
        
        return null
    }
    
    /**
     * 设置缓存数据
     */
    set(request: CacheRequest, data: CacheResponse): void {
        const key = this.getCacheKey(request)
        const ttl = TTL_CONFIG.default
        
        const entry: CacheEntry<CacheResponse> = {
            data,
            timestamp: Date.now(),
            ttl
        }
        
        this.setToLocalStorage(key, entry)
        console.log(`[CninfoCache] 缓存已设置: ${request.stock || request.searchkey}, TTL: ${ttl / 1000}s`)
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
        try {
            localStorage.removeItem(this.config.prefix + key)
        } catch {
            // 忽略错误
        }
    }
    
    /**
     * 清空所有公告缓存
     */
    clear(): void {
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
        
        console.log('[CninfoCache] 公告缓存已清空')
    }
    
    /**
     * 获取缓存统计信息
     */
    getStats(): {
        entries: number
        totalSize: string
    } {
        let entries = 0
        let totalSize = 0
        
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key && key.startsWith(this.config.prefix)) {
                    entries++
                    const data = localStorage.getItem(key)
                    if (data) {
                        totalSize += data.length * 2 // UTF-16 编码
                    }
                }
            }
        } catch {
            // 忽略错误
        }
        
        return {
            entries,
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
