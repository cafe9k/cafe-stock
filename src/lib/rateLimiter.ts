/**
 * Tushare API 请求节流器
 * 
 * 功能：
 * 1. 并发控制：最多同时 2 个请求
 * 2. 频率限制：每分钟最多 N 次请求（留 20% 余量）
 * 3. 请求队列：超出限制的请求排队等待
 */

interface QueueItem<T> {
    fn: () => Promise<T>
    resolve: (value: T) => void
    reject: (error: Error) => void
}

interface RateLimiterConfig {
    maxConcurrent: number      // 最大并发数
    requestsPerMinute: number  // 每分钟最大请求数
    safetyMargin: number       // 安全余量（0.2 = 20%）
}

const DEFAULT_CONFIG: RateLimiterConfig = {
    maxConcurrent: 2,          // 最多 2 个并发请求
    requestsPerMinute: 60,     // 假设每分钟 60 次限制
    safetyMargin: 0.2          // 留 20% 余量
}

class RateLimiter {
    private config: RateLimiterConfig
    private queue: QueueItem<any>[] = []
    private activeCount = 0
    private requestTimestamps: number[] = []
    private minInterval: number
    private effectiveRPM: number
    
    constructor(config: Partial<RateLimiterConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
        
        // 计算有效的每分钟请求数（扣除安全余量）
        this.effectiveRPM = Math.floor(
            this.config.requestsPerMinute * (1 - this.config.safetyMargin)
        )
        
        // 计算最小请求间隔（毫秒）
        this.minInterval = Math.ceil((60 * 1000) / this.effectiveRPM)
        
        console.log(`[RateLimiter] 初始化完成:`, {
            maxConcurrent: this.config.maxConcurrent,
            effectiveRPM: this.effectiveRPM,
            minInterval: `${this.minInterval}ms`
        })
    }
    
    /**
     * 执行一个受限流控制的请求
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue.push({ fn, resolve, reject })
            this.processQueue()
        })
    }
    
    /**
     * 处理请求队列
     */
    private async processQueue(): Promise<void> {
        // 检查是否可以处理更多请求
        if (this.activeCount >= this.config.maxConcurrent) {
            return
        }
        
        if (this.queue.length === 0) {
            return
        }
        
        // 检查频率限制
        const waitTime = this.getWaitTime()
        if (waitTime > 0) {
            setTimeout(() => this.processQueue(), waitTime)
            return
        }
        
        // 取出队列中的下一个请求
        const item = this.queue.shift()
        if (!item) return
        
        this.activeCount++
        this.recordRequest()
        
        try {
            const result = await item.fn()
            item.resolve(result)
        } catch (error) {
            item.reject(error instanceof Error ? error : new Error(String(error)))
        } finally {
            this.activeCount--
            // 继续处理队列
            this.processQueue()
        }
    }
    
    /**
     * 计算需要等待的时间（毫秒）
     */
    private getWaitTime(): number {
        const now = Date.now()
        const windowStart = now - 60 * 1000 // 1 分钟窗口
        
        // 清理过期的时间戳
        this.requestTimestamps = this.requestTimestamps.filter(ts => ts > windowStart)
        
        // 如果在窗口内的请求数已达上限，计算需要等待的时间
        if (this.requestTimestamps.length >= this.effectiveRPM) {
            const oldestInWindow = this.requestTimestamps[0]
            return oldestInWindow + 60 * 1000 - now + 100 // 多等 100ms 确保安全
        }
        
        // 只有当请求数超过一定阈值时才检查最小间隔
        // 这允许少量请求快速通过，同时防止大量请求时的限流
        const recentRequests = this.requestTimestamps.filter(ts => ts > now - 5000).length // 最近 5 秒的请求数
        if (recentRequests >= 5 && this.requestTimestamps.length > 0) {
            const lastRequest = this.requestTimestamps[this.requestTimestamps.length - 1]
            const elapsed = now - lastRequest
            if (elapsed < this.minInterval) {
                return this.minInterval - elapsed
            }
        }
        
        return 0
    }
    
    /**
     * 记录请求时间戳
     */
    private recordRequest(): void {
        this.requestTimestamps.push(Date.now())
    }
    
    /**
     * 获取当前状态
     */
    getStatus(): {
        queueLength: number
        activeCount: number
        requestsInLastMinute: number
    } {
        const now = Date.now()
        const windowStart = now - 60 * 1000
        const requestsInLastMinute = this.requestTimestamps.filter(ts => ts > windowStart).length
        
        return {
            queueLength: this.queue.length,
            activeCount: this.activeCount,
            requestsInLastMinute
        }
    }
    
    /**
     * 清空队列（取消所有等待中的请求）
     */
    clearQueue(): void {
        const error = new Error('请求已取消')
        while (this.queue.length > 0) {
            const item = this.queue.shift()
            item?.reject(error)
        }
    }
}

// 导出单例实例（用于 Tushare API）
export const tushareRateLimiter = new RateLimiter({
    maxConcurrent: 2,        // 最多 2 个并发请求
    requestsPerMinute: 60,   // 每分钟 60 次（根据实际积分等级调整）
    safetyMargin: 0.2        // 留 20% 余量，实际每分钟 48 次
})

// 导出类供自定义使用
export { RateLimiter }
export type { RateLimiterConfig }

