/**
 * 公告查询 Hook
 * 用于获取股票公告信息
 */

import { useState, useEffect, useCallback } from 'react'
import { cninfoClient, type Announcement, type AnnouncementCategory } from '../lib/cninfoClient'

interface UseAnnouncementsOptions {
    tsCode: string
    category?: AnnouncementCategory
    pageSize?: number
    autoFetch?: boolean  // 是否自动获取
}

interface UseAnnouncementsReturn {
    announcements: Announcement[]
    total: number
    hasMore: boolean
    loading: boolean
    error: string | null
    pageNum: number
    refresh: () => Promise<void>
    loadMore: () => Promise<void>
    setCategory: (category?: AnnouncementCategory) => void
}

export function useAnnouncements(options: UseAnnouncementsOptions): UseAnnouncementsReturn {
    const { tsCode, category: initialCategory, pageSize = 10, autoFetch = true } = options
    
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pageNum, setPageNum] = useState(1)
    const [category, setCategory] = useState<AnnouncementCategory | undefined>(initialCategory)

    // 获取公告
    const fetchAnnouncements = useCallback(async (page: number, append = false) => {
        if (!tsCode) return
        
        setLoading(true)
        setError(null)
        
        try {
            const result = await cninfoClient.getAnnouncements(tsCode, {
                category,
                pageNum: page,
                pageSize,
            })
            
            if (append) {
                setAnnouncements(prev => [...prev, ...result.announcements])
            } else {
                setAnnouncements(result.announcements)
            }
            
            setTotal(result.total)
            setHasMore(result.hasMore)
            setPageNum(page)
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取公告失败')
        } finally {
            setLoading(false)
        }
    }, [tsCode, category, pageSize])

    // 刷新
    const refresh = useCallback(async () => {
        await fetchAnnouncements(1, false)
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
        refresh,
        loadMore,
        setCategory: handleSetCategory,
    }
}

/**
 * 获取最近一周公告的简化 Hook
 */
interface UseRecentAnnouncementsReturn {
    announcements: Announcement[]
    loading: boolean
    error: string | null
    refresh: () => Promise<void>
}

export function useRecentAnnouncements(tsCode: string, limit = 3): UseRecentAnnouncementsReturn {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAnnouncements = useCallback(async () => {
        if (!tsCode) return
        
        setLoading(true)
        setError(null)
        
        try {
            const result = await cninfoClient.getRecentAnnouncements(tsCode, limit)
            setAnnouncements(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取公告失败')
        } finally {
            setLoading(false)
        }
    }, [tsCode, limit])

    const refresh = useCallback(async () => {
        await fetchAnnouncements()
    }, [fetchAnnouncements])

    // 初始加载
    useEffect(() => {
        if (tsCode) {
            fetchAnnouncements()
        }
    }, [tsCode]) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        announcements,
        loading,
        error,
        refresh,
    }
}

