// Tushare Pro 配置
// 文档: https://tushare.pro/document/1?doc_id=130
//
// 注意：Token 已迁移到 Supabase Edge Function Secrets 中
// 前端不再需要直接配置 Token，所有请求通过边缘函数代理

// 前端不再需要 Token（已在边缘函数中配置）
// Token 存储在 Supabase Secrets 中，通过边缘函数访问
export const TUSHARE_TOKEN = ''
