// Supabase Edge Function: Tushare API 代理
// 用于解决前端直接调用 Tushare API 的 CORS 问题
// Token 从 Supabase Secrets 中读取，确保安全性
// 包含 IP 并发限制功能，防止滥用

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TUSHARE_API_URL = "http://api.tushare.pro";
const TUSHARE_TOKEN = Deno.env.get("TUSHARE_TOKEN") || "";

// ==================== IP 限流配置 ====================
interface RateLimitConfig {
	maxConcurrent: number;      // 每个 IP 最大并发请求数
	maxRequestsPerMinute: number; // 每个 IP 每分钟最大请求数
	windowMs: number;           // 滑动窗口时间（毫秒）
	cleanupIntervalMs: number;  // 清理过期数据的间隔（毫秒）
}

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxConcurrent: 2,           // 每个 IP 最多 2 个并发请求
	maxRequestsPerMinute: 30,   // 每个 IP 每分钟最多 30 次请求
	windowMs: 60 * 1000,        // 1 分钟滑动窗口
	cleanupIntervalMs: 5 * 60 * 1000, // 每 5 分钟清理一次过期数据
};

// IP 请求追踪数据结构
interface IpTracker {
	concurrent: number;           // 当前并发数
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
	// Supabase/Cloudflare 会在这些 header 中传递真实 IP
	const forwardedFor = req.headers.get("x-forwarded-for");
	if (forwardedFor) {
		// 取第一个 IP（最原始的客户端 IP）
		return forwardedFor.split(",")[0].trim();
	}
	
	const realIp = req.headers.get("x-real-ip");
	if (realIp) {
		return realIp.trim();
	}
	
	// 如果都没有，使用 CF-Connecting-IP（Cloudflare）
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
	
	// 只在间隔时间后执行清理
	if (now - lastCleanup < RATE_LIMIT_CONFIG.cleanupIntervalMs) {
		return;
	}
	
	lastCleanup = now;
	const expireThreshold = now - RATE_LIMIT_CONFIG.windowMs * 2;
	
	for (const [ip, tracker] of ipTrackers.entries()) {
		// 删除超过 2 个窗口时间没有访问的 IP
		if (tracker.lastAccess < expireThreshold && tracker.concurrent === 0) {
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
			concurrent: 0,
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
 * 返回 null 表示通过，返回字符串表示被限流的原因
 */
function checkRateLimit(ip: string): string | null {
	const tracker = getOrCreateTracker(ip);
	
	// 清理过期请求
	cleanupOldRequests(tracker);
	
	// 检查并发限制
	if (tracker.concurrent >= RATE_LIMIT_CONFIG.maxConcurrent) {
		return `并发请求超限: 当前 ${tracker.concurrent}/${RATE_LIMIT_CONFIG.maxConcurrent}`;
	}
	
	// 检查频率限制
	if (tracker.requests.length >= RATE_LIMIT_CONFIG.maxRequestsPerMinute) {
		const oldestRequest = tracker.requests[0];
		const waitTime = Math.ceil((oldestRequest + RATE_LIMIT_CONFIG.windowMs - Date.now()) / 1000);
		return `请求频率超限: ${tracker.requests.length}/${RATE_LIMIT_CONFIG.maxRequestsPerMinute} 次/分钟，请等待 ${waitTime} 秒`;
	}
	
	return null;
}

/**
 * 记录请求开始
 */
function recordRequestStart(ip: string): void {
	const tracker = getOrCreateTracker(ip);
	tracker.concurrent++;
	tracker.requests.push(Date.now());
	tracker.lastAccess = Date.now();
}

/**
 * 记录请求结束
 */
function recordRequestEnd(ip: string): void {
	const tracker = ipTrackers.get(ip);
	if (tracker && tracker.concurrent > 0) {
		tracker.concurrent--;
	}
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
	
	return {
		"X-RateLimit-Limit": String(RATE_LIMIT_CONFIG.maxRequestsPerMinute),
		"X-RateLimit-Remaining": String(remaining),
		"X-RateLimit-Reset": String(resetTime),
		"X-RateLimit-Concurrent": `${tracker.concurrent}/${RATE_LIMIT_CONFIG.maxConcurrent}`,
	};
}

// ==================== CORS 配置 ====================

// 推荐的 CORS 头配置（按 Supabase 官方文档）
const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ==================== 启动检查 ====================

// 启动时检查 Token 配置
if (!TUSHARE_TOKEN) {
	console.warn("⚠️  TUSHARE_TOKEN not configured in Supabase Secrets");
	console.warn("Please run: supabase secrets set TUSHARE_TOKEN=your_token_here");
} else {
	console.log("✅ TUSHARE_TOKEN loaded from Supabase Secrets");
}

console.log(`✅ Rate limiting enabled: ${RATE_LIMIT_CONFIG.maxConcurrent} concurrent, ${RATE_LIMIT_CONFIG.maxRequestsPerMinute} req/min`);

interface TushareRequest {
	api_name: string;
	token?: string;
	params?: Record<string, any>;
	fields?: string;
}

interface TushareResponse {
	code: number;
	msg: string | null;
	data: {
		fields: string[];
		items: any[][];
	};
}

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
		return new Response(JSON.stringify({ error: "Method not allowed" }), {
			status: 405,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}

	// ==================== 限流检查 ====================
	const rateLimitError = checkRateLimit(clientIp);
	if (rateLimitError) {
		console.warn(`[RateLimit] IP ${clientIp} blocked: ${rateLimitError}`);
		
		return new Response(
			JSON.stringify({
				code: 429,
				msg: `请求被限流: ${rateLimitError}`,
				data: null,
			}),
			{
				status: 429,
				headers: { 
					...corsHeaders, 
					"Content-Type": "application/json",
					"Retry-After": "10",
					...getRateLimitHeaders(clientIp),
				},
			}
		);
	}

	// 记录请求开始
	recordRequestStart(clientIp);
	
	try {
		// 解析请求体
		const body: TushareRequest = await req.json();

		// 验证必需参数
		if (!body.api_name) {
			return new Response(
				JSON.stringify({
					code: -1,
					msg: "api_name is required",
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

		// 使用服务器端的 Token（优先使用客户端传入的 token，否则使用环境变量）
		const token = body.token || TUSHARE_TOKEN;

		if (!token) {
			return new Response(
				JSON.stringify({
					code: -1,
					msg: "Tushare token not configured",
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

		// 构建请求体
		const requestBody = {
			api_name: body.api_name,
			token: token,
			params: body.params || {},
			fields: body.fields || "",
		};

		console.log(`[Proxy] IP: ${clientIp} | API: ${body.api_name}`);

		// 调用 Tushare API
		const response = await fetch(TUSHARE_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			throw new Error(`Tushare API returned ${response.status}`);
		}

		const data: TushareResponse = await response.json();

		// 返回结果（包含限流信息头）
		return new Response(JSON.stringify(data), {
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
	} finally {
		// 无论成功还是失败，都要记录请求结束
		recordRequestEnd(clientIp);
	}
});
