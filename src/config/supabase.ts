// Supabase 配置
// 项目: cafe-stock
// 区域: ap-southeast-1
// 项目 ID: ytsfrixjgykcqcfmzzye

// 默认配置（用于开发环境）
const DEFAULT_SUPABASE_URL = 'https://fmbqlwagajrrktcycnxu.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtYnFsd2FnYWpycmt0Y3ljbnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjUwNDcsImV4cCI6MjA4MDUwMTA0N30.tfOF-18cJPH6WZ-j2W4Hn7lcPJLSv8Vczpb1AN-id1s'

// 支持浏览器环境（Vite）和 Node.js 环境
export const SUPABASE_URL = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
    DEFAULT_SUPABASE_URL

export const SUPABASE_ANON_KEY = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
    DEFAULT_SUPABASE_ANON_KEY
