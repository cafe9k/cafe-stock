// Tushare Pro 配置
// 文档: https://tushare.pro/document/1?doc_id=130
//
// 注意：Token 已迁移到 Supabase Edge Function Secrets 中
// 前端不再需要直接配置 Token，所有请求通过边缘函数代理

// Tushare API URL（仅用于参考，实际请求通过 Supabase Edge Function）
const DEFAULT_TUSHARE_API_URL = 'http://api.tushare.pro'

// 前端不再需要 Token（已在边缘函数中配置）
// Token 存储在 Supabase Secrets 中，通过边缘函数访问
export const TUSHARE_TOKEN = ''

export const TUSHARE_API_URL = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TUSHARE_API_URL) || 
    DEFAULT_TUSHARE_API_URL

