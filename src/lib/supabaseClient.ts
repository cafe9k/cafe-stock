import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/supabase'

// 创建 Supabase 客户端
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 数据库类型定义
export interface Category {
    id: string
    name: string
    description?: string
    created_at: string
    updated_at: string
}

export interface Product {
    id: string
    name: string
    category_id?: string
    sku?: string
    unit: string
    min_stock: number
    current_stock: number
    unit_price: number
    supplier?: string
    description?: string
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
}

export interface StockRecord {
    id: string
    product_id: string
    type: 'in' | 'out' | 'adjust'
    quantity: number
    previous_stock: number
    current_stock: number
    unit_price?: number
    total_amount?: number
    operator?: string
    note?: string
    created_at: string
}

// 兼容旧接口
export interface StockItem extends Product {}
