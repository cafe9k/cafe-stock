// Supabase Edge Function: 巨潮资讯网公告代理
// 用于获取A股股票公告信息
// 包含每秒一次的频率限制

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CNINFO_API_URL = "http://www.cninfo.com.cn/new/hisAnnouncement/query";
const CNINFO_PDF_BASE_URL = "http://static.cninfo.com.cn/";

// ==================== 频率限制配置 ====================
interface RateLimitConfig {
  minIntervalMs: number;        // 最小请求间隔（毫秒）
  maxRequestsPerMinute: number; // 每分钟最大请求数
  windowMs: number;             // 滑动窗口时间（毫秒）
  cleanupIntervalMs: number;    // 清理过期数据的间隔（毫秒）
}

const RATE_LIMIT_CONFIG: RateLimitConfig = {
  minIntervalMs: 1000,          // 最小间隔 1 秒（每秒最多 1 次）
  maxRequestsPerMinute: 60,     // 每分钟最多 60 次
  windowMs: 60 * 1000,          // 1 分钟滑动窗口
  cleanupIntervalMs: 5 * 60 * 1000, // 每 5 分钟清理一次过期数据
};

// IP 请求追踪数据结构
interface IpTracker {
  lastRequestTime: number;      // 上次请求时间
  requests: number[];           // 请求时间戳数组（滑动窗口）
  lastAccess: number;           // 最后访问时间
}

// 内存存储（Edge Function 实例级别）
const ipTrackers = new Map<string, IpTracker>();
let lastCleanup = Date.now();

// ==================== 限流工具函数 ====================

/**
 * 获取客户端 IP 地址
 */
function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }
  
  return "unknown";
}

/**
 * 清理过期的 IP 追踪数据
 */
function cleanupExpiredTrackers(): void {
  const now = Date.now();
  
  if (now - lastCleanup < RATE_LIMIT_CONFIG.cleanupIntervalMs) {
    return;
  }
  
  lastCleanup = now;
  const expireThreshold = now - RATE_LIMIT_CONFIG.windowMs * 2;
  
  for (const [ip, tracker] of ipTrackers.entries()) {
    if (tracker.lastAccess < expireThreshold) {
      ipTrackers.delete(ip);
    }
  }
  
  console.log(`[RateLimit] Cleanup completed. Active IPs: ${ipTrackers.size}`);
}

/**
 * 获取或创建 IP 追踪器
 */
function getOrCreateTracker(ip: string): IpTracker {
  let tracker = ipTrackers.get(ip);
  
  if (!tracker) {
    tracker = {
      lastRequestTime: 0,
      requests: [],
      lastAccess: Date.now(),
    };
    ipTrackers.set(ip, tracker);
  }
  
  return tracker;
}

/**
 * 清理过期的请求时间戳（滑动窗口）
 */
function cleanupOldRequests(tracker: IpTracker): void {
  const windowStart = Date.now() - RATE_LIMIT_CONFIG.windowMs;
  tracker.requests = tracker.requests.filter(ts => ts > windowStart);
}

/**
 * 检查是否超过限流
 * 返回 null 表示通过，返回对象表示被限流
 */
function checkRateLimit(ip: string): { error: string; waitMs: number } | null {
  const tracker = getOrCreateTracker(ip);
  const now = Date.now();
  
  // 清理过期请求
  cleanupOldRequests(tracker);
  
  // 检查最小间隔（每秒一次限制）
  const timeSinceLastRequest = now - tracker.lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_CONFIG.minIntervalMs) {
    const waitMs = RATE_LIMIT_CONFIG.minIntervalMs - timeSinceLastRequest;
    return {
      error: `请求过于频繁，请等待 ${Math.ceil(waitMs / 1000)} 秒后重试`,
      waitMs,
    };
  }
  
  // 检查每分钟频率限制
  if (tracker.requests.length >= RATE_LIMIT_CONFIG.maxRequestsPerMinute) {
    const oldestRequest = tracker.requests[0];
    const waitMs = oldestRequest + RATE_LIMIT_CONFIG.windowMs - now;
    return {
      error: `请求频率超限: ${tracker.requests.length}/${RATE_LIMIT_CONFIG.maxRequestsPerMinute} 次/分钟，请等待 ${Math.ceil(waitMs / 1000)} 秒`,
      waitMs,
    };
  }
  
  return null;
}

/**
 * 记录请求
 */
function recordRequest(ip: string): void {
  const tracker = getOrCreateTracker(ip);
  const now = Date.now();
  tracker.lastRequestTime = now;
  tracker.requests.push(now);
  tracker.lastAccess = now;
}

/**
 * 获取限流状态（用于响应头）
 */
function getRateLimitHeaders(ip: string): Record<string, string> {
  const tracker = getOrCreateTracker(ip);
  cleanupOldRequests(tracker);
  
  const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxRequestsPerMinute - tracker.requests.length);
  const resetTime = tracker.requests.length > 0 
    ? Math.ceil((tracker.requests[0] + RATE_LIMIT_CONFIG.windowMs) / 1000)
    : Math.ceil(Date.now() / 1000) + 60;
  
  // 计算下次可请求时间
  const nextAllowedTime = tracker.lastRequestTime + RATE_LIMIT_CONFIG.minIntervalMs;
  const waitMs = Math.max(0, nextAllowedTime - Date.now());
  
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_CONFIG.maxRequestsPerMinute),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(resetTime),
    "X-RateLimit-MinInterval": String(RATE_LIMIT_CONFIG.minIntervalMs),
    "X-RateLimit-WaitMs": String(waitMs),
  };
}

// ==================== CORS 配置 ====================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ==================== 请求参数接口 ====================

interface AnnouncementRequest {
  stock?: string;           // 股票代码，如 "000001"
  searchkey?: string;       // 搜索关键词
  category?: string;        // 公告类别
  pageNum?: number;         // 页码，从1开始
  pageSize?: number;        // 每页数量，最大30
  column?: string;          // 板块：szse(深市)、sse(沪市)
  seDate?: string;          // 日期范围，格式 "2024-01-01~2024-12-06"
}

interface Announcement {
  id: string;
  secCode: string;
  secName: string;
  announcementId: string;
  announcementTitle: string;
  announcementTime: number;
  adjunctUrl: string;
  adjunctSize: number;
  adjunctType: string;
  announcementType: string;
  pdfUrl: string;           // 完整的 PDF 下载地址
}

interface AnnouncementResponse {
  code: number;
  msg: string | null;
  data: {
    totalRecordNum: number;
    announcements: Announcement[];
    hasMore: boolean;
  } | null;
}

// ==================== 公告类别映射 ====================

const CATEGORY_MAP: Record<string, string> = {
  "annual": "category_ndbg_szsh",        // 年度报告
  "semi_annual": "category_bndbg_szsh",  // 半年度报告
  "q1": "category_yjdbg_szsh",           // 一季度报告
  "q3": "category_sjdbg_szsh",           // 三季度报告
  "forecast": "category_yjyg_szsh",      // 业绩预告
  "shareholder": "category_gddh_szsh",   // 股东大会
  "daily": "category_rcjy_szsh",         // 日常经营
  "equity": "category_gqbd_szsh",        // 股权变动
  "holding": "category_zcdq_szsh",       // 增持/减持
  "governance": "category_gszl_szsh",    // 公司治理
};

console.log(`✅ CNInfo Proxy started with rate limiting: min interval ${RATE_LIMIT_CONFIG.minIntervalMs}ms, max ${RATE_LIMIT_CONFIG.maxRequestsPerMinute} req/min`);

serve(async (req) => {
  // 定期清理过期数据
  cleanupExpiredTrackers();
  
  // 获取客户端 IP
  const clientIp = getClientIp(req);
  
  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 只允许 POST 请求
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ 
      code: -1, 
      msg: "Method not allowed",
      data: null 
    }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ==================== 限流检查 ====================
  const rateLimitResult = checkRateLimit(clientIp);
  if (rateLimitResult) {
    console.warn(`[RateLimit] IP ${clientIp} blocked: ${rateLimitResult.error}`);
    
    return new Response(
      JSON.stringify({
        code: 429,
        msg: rateLimitResult.error,
        data: null,
      }),
      {
        status: 429,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(rateLimitResult.waitMs / 1000)),
          ...getRateLimitHeaders(clientIp),
        },
      }
    );
  }

  // 记录请求
  recordRequest(clientIp);
  
  try {
    // 解析请求体
    const body: AnnouncementRequest = await req.json();

    // 验证股票代码
    if (!body.stock && !body.searchkey) {
      return new Response(
        JSON.stringify({
          code: -1,
          msg: "stock 或 searchkey 至少需要提供一个",
          data: null,
        }),
        {
          status: 400,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            ...getRateLimitHeaders(clientIp),
          },
        }
      );
    }

    // 确定板块（根据股票代码判断）
    let column = body.column || "szse";
    if (body.stock) {
      const stockCode = body.stock.replace(/\.(SZ|SH|sz|sh)$/, "");
      // 6开头是沪市，其他是深市
      if (stockCode.startsWith("6")) {
        column = "sse";
      } else {
        column = "szse";
      }
    }

    // 处理类别参数
    let category = body.category || "";
    if (category && CATEGORY_MAP[category]) {
      category = CATEGORY_MAP[category];
    }

    // 构建请求参数
    const params = new URLSearchParams({
      stock: body.stock?.replace(/\.(SZ|SH|sz|sh)$/, "") || "",
      searchkey: body.searchkey || "",
      category: category,
      pageNum: String(body.pageNum || 1),
      pageSize: String(Math.min(body.pageSize || 10, 30)), // 最大30
      column: column,
      tabName: "fulltext",
      plate: "",
      seDate: body.seDate || "",
      sortName: "",
      sortType: "",
      isHLtitle: "true",
    });

    console.log(`[Proxy] IP: ${clientIp} | Stock: ${body.stock || 'N/A'} | Keyword: ${body.searchkey || 'N/A'}`);

    // 调用巨潮资讯网 API
    const response = await fetch(CNINFO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Origin": "http://www.cninfo.com.cn",
        "Referer": "http://www.cninfo.com.cn/new/disclosure/stock",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`CNInfo API returned ${response.status}`);
    }

    const rawData = await response.json();

    // 转换响应格式
    const announcements: Announcement[] = (rawData.announcements || []).map((ann: any) => ({
      id: ann.id || ann.announcementId,
      secCode: ann.secCode,
      secName: ann.secName,
      announcementId: ann.announcementId,
      announcementTitle: ann.announcementTitle?.replace(/<[^>]*>/g, "") || "", // 移除 HTML 标签
      announcementTime: ann.announcementTime,
      adjunctUrl: ann.adjunctUrl,
      adjunctSize: ann.adjunctSize,
      adjunctType: ann.adjunctType || "PDF",
      announcementType: ann.announcementType,
      pdfUrl: ann.adjunctUrl ? `${CNINFO_PDF_BASE_URL}${ann.adjunctUrl}` : "",
    }));

    const result: AnnouncementResponse = {
      code: 0,
      msg: null,
      data: {
        totalRecordNum: rawData.totalRecordNum || 0,
        announcements: announcements,
        hasMore: rawData.hasMore || false,
      },
    };

    // 返回结果
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        ...getRateLimitHeaders(clientIp),
      },
    });
  } catch (error) {
    console.error(`[Error] IP: ${clientIp} | Error:`, error);

    return new Response(
      JSON.stringify({
        code: -1,
        msg: error instanceof Error ? error.message : "Unknown error",
        data: null,
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          ...getRateLimitHeaders(clientIp),
        },
      }
    );
  }
});

