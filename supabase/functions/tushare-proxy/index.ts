// Supabase Edge Function: Tushare API 代理
// 用于解决前端直接调用 Tushare API 的 CORS 问题
// Token 从 Supabase Secrets 中读取，确保安全性

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TUSHARE_API_URL = 'http://api.tushare.pro'
const TUSHARE_TOKEN = Deno.env.get('TUSHARE_TOKEN') || ''

// 启动时检查 Token 配置
if (!TUSHARE_TOKEN) {
  console.warn('⚠️  TUSHARE_TOKEN not configured in Supabase Secrets')
  console.warn('Please run: supabase secrets set TUSHARE_TOKEN=your_token_here')
} else {
  console.log('✅ TUSHARE_TOKEN loaded from Supabase Secrets')
}

interface TushareRequest {
  api_name: string
  token?: string
  params?: Record<string, any>
  fields?: string
}

interface TushareResponse {
  code: number
  msg: string | null
  data: {
    fields: string[]
    items: any[][]
  }
}

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }

  try {
    // 解析请求体
    const body: TushareRequest = await req.json()

    // 验证必需参数
    if (!body.api_name) {
      return new Response(
        JSON.stringify({ 
          code: -1,
          msg: 'api_name is required',
          data: null
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // 使用服务器端的 Token（优先使用客户端传入的 token，否则使用环境变量）
    const token = body.token || TUSHARE_TOKEN

    if (!token) {
      return new Response(
        JSON.stringify({ 
          code: -1,
          msg: 'Tushare token not configured',
          data: null
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // 构建请求体
    const requestBody = {
      api_name: body.api_name,
      token: token,
      params: body.params || {},
      fields: body.fields || ''
    }

    console.log('Proxying request to Tushare API:', body.api_name)

    // 调用 Tushare API
    const response = await fetch(TUSHARE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`Tushare API returned ${response.status}`)
    }

    const data: TushareResponse = await response.json()

    // 返回结果
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('Error proxying Tushare API:', error)
    
    return new Response(
      JSON.stringify({
        code: -1,
        msg: error instanceof Error ? error.message : 'Unknown error',
        data: null
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})

