/**
 * Tushare 数据本地缓存
 * 
 * 功能：
 * 1. 所有数据持久化到 localStorage
 * 2. 自动过期清理
 * 3. 日级别数据长期缓存（24小时）
 */

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number  // 生存时间（毫秒）
}

interface CacheConfig {
    prefix: string  // localStorage key 前缀
}

// 不同接口的缓存时间配置（毫秒）
// 所有数据都缓存 24 小时，因为不需要实时数据
const TTL_CONFIG: Record<string, number> = {
    // 静态数据 - 长期缓存
    'stock_basic': 24 * 60 * 60 * 1000,        // 股票列表：24小时
    'trade_cal': 7 * 24 * 60 * 60 * 1000,      // 交易日历：7天
    'stock_company': 24 * 60 * 60 * 1000,      // 公司基本信息：24小时
    'index_basic': 24 * 60 * 60 * 1000,        // 指数基本信息：24小时
    'fund_basic': 24 * 60 * 60 * 1000,         // 基金基本信息：24小时
    'hs_const': 24 * 60 * 60 * 1000,           // 沪深股通成分：24小时
    
    // 半静态数据 - 中期缓存
    'namechange': 24 * 60 * 60 * 1000,         // 股票更名：24小时
    'concept': 24 * 60 * 60 * 1000,            // 概念板块：24小时
    'concept_detail': 24 * 60 * 60 * 1000,     // 概念成分：24小时
    
    // 日级别数据 - 全部 24 小时缓存
    'daily': 24 * 60 * 60 * 1000,              // 日线行情：24小时
    'daily_basic': 24 * 60 * 60 * 1000,        // 每日指标：24小时
    'adj_factor': 24 * 60 * 60 * 1000,         // 复权因子：24小时
    'moneyflow': 24 * 60 * 60 * 1000,          // 资金流向：24小时
    
    // 其他日级别数据
    'top_list': 24 * 60 * 60 * 1000,           // 龙虎榜：24小时
    'block_trade': 24 * 60 * 60 * 1000,        // 大宗交易：24小时
    'suspend_d': 24 * 60 * 60 * 1000,          // 停复牌：24小时
    'stk_holdertrade': 24 * 60 * 60 * 1000,    // 股东增减持：24小时
    'share_float': 24 * 60 * 60 * 1000,        // 限售解禁：24小时
    
    // 默认缓存时间
    'default': 24 * 60 * 60 * 1000             // 默认：24小时
}

class TushareCache {
    private config: CacheConfig
    
    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
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
        const entry = this.getFromLocalStorage<T>(key)
        
        if (entry && !this.isExpired(entry)) {
            console.log(`[TushareCache] 缓存命中: ${apiName}`)
            return entry.data
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
        
        this.setToLocalStorage(key, entry)
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
        try {
            localStorage.removeItem(this.config.prefix + key)
        } catch {
            // 忽略错误
        }
    }
    
    /**
     * 清空所有缓存
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
        
        console.log('[TushareCache] 缓存已清空')
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
export const tushareCache = new TushareCache()

// 导出类和配置
export { TushareCache, TTL_CONFIG }
export type { CacheEntry, CacheConfig }
