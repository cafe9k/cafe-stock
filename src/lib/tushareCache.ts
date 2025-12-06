/**
 * Tushare 数据本地缓存
 * 
 * 功能：
 * 1. 静态数据长期缓存（股票列表、交易日历等）
 * 2. 动态数据短期缓存（行情数据等）
 * 3. 支持 localStorage 持久化
 * 4. 自动过期清理
 */

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number  // 生存时间（毫秒）
}

interface CacheConfig {
    useLocalStorage: boolean  // 是否使用 localStorage 持久化
    prefix: string            // localStorage key 前缀
}

// 不同接口的缓存时间配置（毫秒）
const TTL_CONFIG: Record<string, number> = {
    // 静态数据 - 长期缓存
    'stock_basic': 24 * 60 * 60 * 1000,        // 股票列表：24小时
    'trade_cal': 7 * 24 * 60 * 60 * 1000,      // 交易日历：7天
    'stock_company': 24 * 60 * 60 * 1000,      // 公司基本信息：24小时
    'index_basic': 24 * 60 * 60 * 1000,        // 指数基本信息：24小时
    'fund_basic': 24 * 60 * 60 * 1000,         // 基金基本信息：24小时
    'hs_const': 24 * 60 * 60 * 1000,           // 沪深股通成分：24小时
    
    // 半静态数据 - 中期缓存
    'namechange': 12 * 60 * 60 * 1000,         // 股票更名：12小时
    'concept': 12 * 60 * 60 * 1000,            // 概念板块：12小时
    'concept_detail': 12 * 60 * 60 * 1000,     // 概念成分：12小时
    
    // 动态数据 - 短期缓存
    'daily': 5 * 60 * 1000,                    // 日线行情：5分钟
    'daily_basic': 5 * 60 * 1000,              // 每日指标：5分钟
    'adj_factor': 60 * 60 * 1000,              // 复权因子：1小时
    'moneyflow': 5 * 60 * 1000,                // 资金流向：5分钟
    
    // 默认缓存时间
    'default': 60 * 1000                        // 默认：1分钟
}

// 需要持久化到 localStorage 的接口
const PERSISTENT_APIS = new Set([
    'stock_basic',
    'trade_cal',
    'stock_company',
    'index_basic',
    'fund_basic',
    'hs_const'
])

class TushareCache {
    private memoryCache = new Map<string, CacheEntry<any>>()
    private config: CacheConfig
    
    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            useLocalStorage: true,
            prefix: 'tushare_cache_',
            ...config
        }
        
        // 启动时清理过期的 localStorage 缓存
        this.cleanExpiredLocalStorage()
    }
    
    /**
     * 生成缓存 key
     */
    private getCacheKey(apiName: string, params?: Record<string, any>): string {
        const paramsStr = params ? JSON.stringify(this.sortObject(params)) : ''
        return `${apiName}:${paramsStr}`
    }
    
    /**
     * 对象排序（确保相同参数生成相同的 key）
     */
    private sortObject(obj: Record<string, any>): Record<string, any> {
        const sorted: Record<string, any> = {}
        Object.keys(obj).sort().forEach(key => {
            sorted[key] = obj[key]
        })
        return sorted
    }
    
    /**
     * 获取缓存数据
     */
    get<T>(apiName: string, params?: Record<string, any>): T | null {
        const key = this.getCacheKey(apiName, params)
        
        // 1. 先检查内存缓存
        const memoryEntry = this.memoryCache.get(key)
        if (memoryEntry && !this.isExpired(memoryEntry)) {
            console.log(`[TushareCache] 内存缓存命中: ${apiName}`)
            return memoryEntry.data
        }
        
        // 2. 检查 localStorage 缓存
        if (this.config.useLocalStorage && PERSISTENT_APIS.has(apiName)) {
            const localEntry = this.getFromLocalStorage<T>(key)
            if (localEntry && !this.isExpired(localEntry)) {
                // 恢复到内存缓存
                this.memoryCache.set(key, localEntry)
                console.log(`[TushareCache] localStorage 缓存命中: ${apiName}`)
                return localEntry.data
            }
        }
        
        return null
    }
    
    /**
     * 设置缓存数据
     */
    set<T>(apiName: string, params: Record<string, any> | undefined, data: T): void {
        const key = this.getCacheKey(apiName, params)
        const ttl = TTL_CONFIG[apiName] || TTL_CONFIG['default']
        
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl
        }
        
        // 1. 存入内存缓存
        this.memoryCache.set(key, entry)
        
        // 2. 如果是需要持久化的接口，存入 localStorage
        if (this.config.useLocalStorage && PERSISTENT_APIS.has(apiName)) {
            this.setToLocalStorage(key, entry)
        }
        
        console.log(`[TushareCache] 缓存已设置: ${apiName}, TTL: ${ttl / 1000}s`)
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
            console.warn('[TushareCache] localStorage 读取失败:', error)
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
            console.warn('[TushareCache] localStorage 写入失败:', error)
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
                console.log(`[TushareCache] 清理了 ${keysToRemove.length} 个过期缓存`)
            }
        } catch (error) {
            console.warn('[TushareCache] 清理 localStorage 失败:', error)
        }
    }
    
    /**
     * 删除指定缓存
     */
    delete(apiName: string, params?: Record<string, any>): void {
        const key = this.getCacheKey(apiName, params)
        
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
     * 清空所有缓存
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
        
        console.log('[TushareCache] 缓存已清空')
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
    
    /**
     * 获取所有缓存条目的详细信息（用于 UI 展示）
     */
    getCacheEntries(): CacheEntryInfo[] {
        const entries: CacheEntryInfo[] = []
        const now = Date.now()
        
        // 遍历内存缓存
        this.memoryCache.forEach((entry, key) => {
            const [apiName] = key.split(':')
            const remainingMs = entry.ttl - (now - entry.timestamp)
            const isExpired = remainingMs <= 0
            
            entries.push({
                apiName,
                key,
                cachedAt: new Date(entry.timestamp),
                ttl: entry.ttl,
                remainingMs: Math.max(0, remainingMs),
                isExpired,
                isPersistent: PERSISTENT_APIS.has(apiName),
                dataCount: Array.isArray(entry.data) ? entry.data.length : 1
            })
        })
        
        return entries.sort((a, b) => b.cachedAt.getTime() - a.cachedAt.getTime())
    }
}

/**
 * 缓存条目信息（用于 UI 展示）
 */
export interface CacheEntryInfo {
    apiName: string        // 接口名称
    key: string            // 缓存 key
    cachedAt: Date         // 缓存时间
    ttl: number            // 生存时间（毫秒）
    remainingMs: number    // 剩余时间（毫秒）
    isExpired: boolean     // 是否已过期
    isPersistent: boolean  // 是否持久化
    dataCount: number      // 数据条数
}

// 导出单例实例
export const tushareCache = new TushareCache()

// 导出类和配置
export { TushareCache, TTL_CONFIG, PERSISTENT_APIS }
export type { CacheEntry, CacheConfig }

