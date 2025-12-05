// Tushare Pro 配置
// 文档: https://tushare.pro/document/1?doc_id=130

// 默认配置
const DEFAULT_TUSHARE_TOKEN = '834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d'
const DEFAULT_TUSHARE_API_URL = 'http://api.tushare.pro'

// 支持浏览器环境（Vite）和 Node.js 环境
export const TUSHARE_TOKEN = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TUSHARE_TOKEN) || 
    DEFAULT_TUSHARE_TOKEN

export const TUSHARE_API_URL = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TUSHARE_API_URL) || 
    DEFAULT_TUSHARE_API_URL

