import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/supabase'

// 创建 Supabase 客户端
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 数据库类型定义
export interface StockItem {
    id: number
    name: string
    quantity: number
    unit: string
    category: string
    created_at: string
    updated_at: string
}
