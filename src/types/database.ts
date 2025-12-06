/**
 * 数据库类型定义
 * 与 Supabase 数据库表结构对应
 */

// 关注分组
export interface WatchGroup {
    id: string
    user_id: string
    name: string
    sort_order: number
    color: string
    created_at: string
    updated_at: string
}

// 关注股票
export interface WatchStock {
    id: string
    user_id: string
    group_id: string | null
    ts_code: string
    name: string | null
    sort_order: number
    notes: string | null
    target_price: number | null
    cost_price: number | null
    created_at: string
    updated_at: string
}

// 消息类型
export type AlertType = 
    | 'top_list'        // 龙虎榜
    | 'block_trade'     // 大宗交易
    | 'stk_holdertrade' // 股东增减持
    | 'share_float'     // 限售解禁
    | 'suspend_d'       // 停复牌
    | 'forecast'        // 业绩预告
    | 'express'         // 业绩快报
    | 'dividend'        // 分红送股
    | 'moneyflow'       // 资金流向
    | 'margin'          // 融资融券

// 消息优先级
export type AlertPriority = 1 | 2 | 3 // 1:高 2:中 3:低

// 消息记录
export interface StockAlert {
    id: string
    user_id: string
    ts_code: string
    alert_type: AlertType
    alert_date: string
    title: string
    content: Record<string, any> | null
    priority: AlertPriority
    is_read: boolean
    created_at: string
}

// 用户设置
export interface UserSettings {
    user_id: string
    theme: 'dark' | 'light'
    color_scheme: 'cn' | 'us' // cn: 涨红跌绿, us: 涨绿跌红
    alert_types: AlertType[]
    refresh_interval: number
    created_at: string
    updated_at: string
}

// 消息类型配置
export const ALERT_TYPE_CONFIG: Record<AlertType, { label: string; priority: AlertPriority; icon: string }> = {
    top_list: { label: '龙虎榜', priority: 1, icon: '🐉' },
    block_trade: { label: '大宗交易', priority: 1, icon: '💰' },
    stk_holdertrade: { label: '股东增减持', priority: 1, icon: '👥' },
    share_float: { label: '限售解禁', priority: 1, icon: '🔓' },
    suspend_d: { label: '停复牌', priority: 1, icon: '⏸️' },
    forecast: { label: '业绩预告', priority: 2, icon: '📊' },
    express: { label: '业绩快报', priority: 2, icon: '📈' },
    dividend: { label: '分红送股', priority: 2, icon: '🎁' },
    moneyflow: { label: '资金流向', priority: 2, icon: '💹' },
    margin: { label: '融资融券', priority: 2, icon: '📉' },
}

// 数据库表类型（用于 Supabase 客户端）
export interface Database {
    public: {
        Tables: {
            watch_groups: {
                Row: WatchGroup
                Insert: Omit<WatchGroup, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<WatchGroup, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
            }
            watch_stocks: {
                Row: WatchStock
                Insert: Omit<WatchStock, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<WatchStock, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
            }
            stock_alerts: {
                Row: StockAlert
                Insert: Omit<StockAlert, 'id' | 'created_at'>
                Update: Partial<Pick<StockAlert, 'is_read'>>
            }
            user_settings: {
                Row: UserSettings
                Insert: Omit<UserSettings, 'created_at' | 'updated_at'>
                Update: Partial<Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>>
            }
        }
    }
}

