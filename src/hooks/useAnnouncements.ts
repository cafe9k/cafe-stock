/**
 * 公告查询 Hook
 * 用于获取股票公告信息
 * 支持本地缓存，避免触发限流
 */

import { useState, useEffect, useCallback } from 'react'
import { cninfoClient, type Announcement, type AnnouncementCategory } from '../lib/cninfoClient'

interface UseAnnouncementsOptions {
    tsCode: string
    category?: AnnouncementCategory
    pageSize?: number
    autoFetch?: boolean  // 是否自动获取
    useCache?: boolean   // 是否使用缓存
}

interface UseAnnouncementsReturn {
    announcements: Announcement[]
    total: number
    hasMore: boolean
    loading: boolean
    error: string | null
    pageNum: number
    fromCache: boolean   // 数据是否来自缓存
    refresh: () => Promise<void>
    loadMore: () => Promise<void>
    setCategory: (category?: AnnouncementCategory) => void
}

export function useAnnouncements(options: UseAnnouncementsOptions): UseAnnouncementsReturn {
    const { tsCode, category: initialCategory, pageSize = 10, autoFetch = true, useCache = true } = options
    
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pageNum, setPageNum] = useState(1)
    const [category, setCategory] = useState<AnnouncementCategory | undefined>(initialCategory)
    const [fromCache, setFromCache] = useState(false)

    // 获取公告
    const fetchAnnouncements = useCallback(async (page: number, append = false, forceRefresh = false) => {
        if (!tsCode) return
        
        setLoading(true)
        setError(null)
        
        try {
            const result = await cninfoClient.getAnnouncements(tsCode, {
                category,
                pageNum: page,
                pageSize,
                useCache: useCache && !forceRefresh,  // 强制刷新时不使用缓存
            })
            
            if (append) {
                setAnnouncements(prev => [...prev, ...result.announcements])
            } else {
                setAnnouncements(result.announcements)
            }
            
            setTotal(result.total)
            setHasMore(result.hasMore)
            setPageNum(page)
            setFromCache(result.fromCache)
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取公告失败')
        } finally {
            setLoading(false)
        }
    }, [tsCode, category, pageSize, useCache])

    // 刷新（强制从服务器获取）
    const refresh = useCallback(async () => {
        await fetchAnnouncements(1, false, true)
    }, [fetchAnnouncements])

    // 加载更多
    const loadMore = useCallback(async () => {
        if (!hasMore || loading) return
        await fetchAnnouncements(pageNum + 1, true)
    }, [fetchAnnouncements, hasMore, loading, pageNum])

    // 切换类别时重新获取
    const handleSetCategory = useCallback((newCategory?: AnnouncementCategory) => {
        setCategory(newCategory)
        setAnnouncements([])
        setPageNum(1)
    }, [])

    // 初始加载
    useEffect(() => {
        if (autoFetch && tsCode) {
            fetchAnnouncements(1, false)
        }
    }, [autoFetch, tsCode, category]) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        announcements,
        total,
        hasMore,
        loading,
        error,
        pageNum,
        fromCache,
        refresh,
        loadMore,
        setCategory: handleSetCategory,
    }
}

/**
 * 获取最近一周公告的简化 Hook
 * 支持本地缓存
 */
interface UseRecentAnnouncementsReturn {
    announcements: Announcement[]
    loading: boolean
    error: string | null
    fromCache: boolean
    refresh: () => Promise<void>
}

export function useRecentAnnouncements(tsCode: string, limit = 3, useCache = true): UseRecentAnnouncementsReturn {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fromCache, setFromCache] = useState(false)

    const fetchAnnouncements = useCallback(async (forceRefresh = false) => {
        if (!tsCode) return
        
        setLoading(true)
        setError(null)
        
        try {
            const result = await cninfoClient.getRecentAnnouncements(tsCode, limit, useCache && !forceRefresh)
            setAnnouncements(result.announcements)
            setFromCache(result.fromCache)
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取公告失败')
        } finally {
            setLoading(false)
        }
    }, [tsCode, limit, useCache])

    // 强制刷新
    const refresh = useCallback(async () => {
        await fetchAnnouncements(true)
    }, [fetchAnnouncements])

    // 初始加载
    useEffect(() => {
        if (tsCode) {
            fetchAnnouncements(false)
        }
    }, [tsCode]) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        announcements,
        loading,
        error,
        fromCache,
        refresh,
    }
}

