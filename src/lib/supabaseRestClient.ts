/**
 * Supabase REST API 客户端
 * 使用原生 fetch API 直接调用 Supabase REST API
 * 便于在浏览器开发者工具中观察网络请求
 * 支持 Electron 桌面应用的本地持久化存储
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";

// REST API 基础 URL
const REST_URL = `${SUPABASE_URL}/rest/v1`;
const AUTH_URL = `${SUPABASE_URL}/auth/v1`;

// 存储当前用户的 access token
let currentAccessToken: string | null = null;

// 本地存储键名
const STORAGE_KEYS = {
	ACCESS_TOKEN: "cafe_stock_access_token",
	REFRESH_TOKEN: "cafe_stock_refresh_token",
	USER: "cafe_stock_user",
	SESSION_EXPIRY: "cafe_stock_session_expiry",
	REMEMBER_ME: "cafe_stock_remember_me",
};

/**
 * 获取存储接口（兼容浏览器和 Electron）
 */
function getStorage() {
	return localStorage;
}

/**
 * 设置当前用户的 access token
 */
export function setAccessToken(token: string | null) {
	currentAccessToken = token;
	const storage = getStorage();
	if (token) {
		storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
	} else {
		storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
	}
}

/**
 * 获取当前用户的 access token
 */
export function getAccessToken(): string | null {
	if (!currentAccessToken) {
		const storage = getStorage();
		currentAccessToken = storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
	}
	return currentAccessToken;
}

/**
 * 检查会话是否过期
 */
export function isSessionExpired(): boolean {
	const storage = getStorage();
	const expiryStr = storage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
	if (!expiryStr) return true;

	const expiry = parseInt(expiryStr, 10);
	return Date.now() > expiry;
}

/**
 * 设置会话过期时间
 * @param expiresIn 过期时间（秒）
 */
export function setSessionExpiry(expiresIn: number) {
	const storage = getStorage();
	const expiryTime = Date.now() + expiresIn * 1000;
	storage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());
}

/**
 * 设置是否记住登录状态
 */
export function setRememberMe(remember: boolean) {
	const storage = getStorage();
	storage.setItem(STORAGE_KEYS.REMEMBER_ME, remember ? "true" : "false");
}

/**
 * 获取是否记住登录状态
 */
export function getRememberMe(): boolean {
	const storage = getStorage();
	return storage.getItem(STORAGE_KEYS.REMEMBER_ME) === "true";
}

/**
 * 获取请求头
 */
function getHeaders(useAuth: boolean = true): HeadersInit {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
		apikey: SUPABASE_ANON_KEY,
	};

	const token = useAuth ? getAccessToken() : null;
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	} else {
		headers["Authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
	}

	return headers;
}

/**
 * REST API 响应类型
 */
interface RestResponse<T> {
	data: T | null;
	error: { message: string; code?: string } | null;
}

/**
 * 执行 REST API 请求
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<RestResponse<T>> {
	try {
		console.log(`[Supabase REST] ${options.method || "GET"} ${url}`);

		const response = await fetch(url, {
			...options,
			headers: {
				...getHeaders(),
				...options.headers,
			},
		});

		console.log(`[Supabase REST] Response: ${response.status} ${response.statusText}`);

		if (!response.ok) {
			const errorText = await response.text();
			let errorData;
			try {
				errorData = JSON.parse(errorText);
			} catch {
				errorData = { message: errorText };
			}
			console.error(`[Supabase REST] Error:`, errorData);
			return {
				data: null,
				error: {
					message: errorData.message || errorData.error || `HTTP ${response.status}`,
					code: errorData.code,
				},
			};
		}

		// 检查响应是否为空
		const text = await response.text();
		if (!text) {
			return { data: null, error: null };
		}

		const data = JSON.parse(text);
		console.log(`[Supabase REST] Data:`, data);
		return { data, error: null };
	} catch (error) {
		console.error(`[Supabase REST] Fetch error:`, error);
		return {
			data: null,
			error: {
				message: error instanceof Error ? error.message : "网络请求失败",
			},
		};
	}
}

/**
 * 数据库操作 - SELECT
 */
export async function select<T>(
	table: string,
	options: {
		columns?: string;
		filters?: Record<string, string>;
		order?: { column: string; ascending?: boolean };
		limit?: number;
		single?: boolean;
	} = {}
): Promise<RestResponse<T>> {
	const params = new URLSearchParams();

	// 选择列
	params.set("select", options.columns || "*");

	// 过滤条件
	if (options.filters) {
		for (const [key, value] of Object.entries(options.filters)) {
			params.set(key, value);
		}
	}

	// 排序
	if (options.order) {
		params.set("order", `${options.order.column}.${options.order.ascending !== false ? "asc" : "desc"}`);
	}

	// 限制数量
	if (options.limit) {
		params.set("limit", options.limit.toString());
	}

	const url = `${REST_URL}/${table}?${params.toString()}`;

	const headers: HeadersInit = {};
	if (options.single) {
		headers["Accept"] = "application/vnd.pgrst.object+json";
	}

	return request<T>(url, { method: "GET", headers });
}

/**
 * 数据库操作 - INSERT
 */
export async function insert<T>(
	table: string,
	data: Record<string, any>,
	options: { returnData?: boolean; single?: boolean } = {}
): Promise<RestResponse<T>> {
	const url = `${REST_URL}/${table}`;

	const headers: HeadersInit = {
		Prefer: options.returnData !== false ? "return=representation" : "return=minimal",
	};

	if (options.single) {
		headers["Accept"] = "application/vnd.pgrst.object+json";
	}

	return request<T>(url, {
		method: "POST",
		headers,
		body: JSON.stringify(data),
	});
}

/**
 * 数据库操作 - UPDATE
 */
export async function update<T>(
	table: string,
	data: Record<string, any>,
	filters: Record<string, string>,
	options: { returnData?: boolean } = {}
): Promise<RestResponse<T>> {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(filters)) {
		params.set(key, value);
	}

	const url = `${REST_URL}/${table}?${params.toString()}`;

	const headers: HeadersInit = {
		Prefer: options.returnData !== false ? "return=representation" : "return=minimal",
	};

	return request<T>(url, {
		method: "PATCH",
		headers,
		body: JSON.stringify(data),
	});
}

/**
 * 数据库操作 - DELETE
 */
export async function remove<T>(table: string, filters: Record<string, string>): Promise<RestResponse<T>> {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(filters)) {
		params.set(key, value);
	}

	const url = `${REST_URL}/${table}?${params.toString()}`;

	return request<T>(url, { method: "DELETE" });
}

/**
 * 认证 - 登录
 */
export async function signInWithPassword(
	email: string,
	password: string,
	rememberMe: boolean = true
): Promise<RestResponse<{ user: any; session: any }>> {
	const url = `${AUTH_URL}/token?grant_type=password`;

	console.log(`[Supabase Auth] 登录: ${email}, 记住登录: ${rememberMe}`);

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			apikey: SUPABASE_ANON_KEY,
		},
		body: JSON.stringify({ email, password }),
	});

	console.log(`[Supabase Auth] Response: ${response.status}`);

	if (!response.ok) {
		const errorData = await response.json();
		console.error(`[Supabase Auth] Error:`, errorData);
		return {
			data: null,
			error: { message: errorData.error_description || errorData.message || "登录失败" },
		};
	}

	const data = await response.json();
	console.log(`[Supabase Auth] 登录成功:`, { user_id: data.user?.id });

	// 保存登录状态
	const storage = getStorage();
	if (data.access_token) {
		setAccessToken(data.access_token);
		setRememberMe(rememberMe);

		// 设置会话过期时间（默认 1 小时）
		const expiresIn = data.expires_in || 3600;
		setSessionExpiry(expiresIn);

		if (rememberMe) {
			// 记住登录：保存 refresh token 和用户信息
			storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
			storage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
			console.log("[Supabase Auth] 已保存登录状态到本地");
		} else {
			// 不记住登录：仅保存到会话
			sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
			sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
			console.log("[Supabase Auth] 已保存登录状态到会话");
		}
	}

	return {
		data: { user: data.user, session: data },
		error: null,
	};
}

/**
 * 认证 - 注册
 */
export async function signUp(email: string, password: string, rememberMe: boolean = true): Promise<RestResponse<{ user: any; session: any }>> {
	const url = `${AUTH_URL}/signup`;

	console.log(`[Supabase Auth] 注册: ${email}`);

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			apikey: SUPABASE_ANON_KEY,
		},
		body: JSON.stringify({ email, password }),
	});

	console.log(`[Supabase Auth] Response: ${response.status}`);

	if (!response.ok) {
		const errorData = await response.json();
		console.error(`[Supabase Auth] Error:`, errorData);
		return {
			data: null,
			error: { message: errorData.error_description || errorData.message || "注册失败" },
		};
	}

	const data = await response.json();
	console.log(`[Supabase Auth] 注册成功:`, { user_id: data.user?.id });

	// 保存登录状态
	const storage = getStorage();
	if (data.access_token) {
		setAccessToken(data.access_token);
		setRememberMe(rememberMe);

		// 设置会话过期时间
		const expiresIn = data.expires_in || 3600;
		setSessionExpiry(expiresIn);

		if (rememberMe) {
			storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
			storage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
		} else {
			sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
			sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
		}
	}

	return {
		data: { user: data.user, session: data },
		error: null,
	};
}

/**
 * 认证 - 刷新 token
 */
export async function refreshToken(): Promise<RestResponse<{ user: any; session: any }>> {
	const storage = getStorage();
	const rememberMe = getRememberMe();

	// 根据是否记住登录，从不同的存储中获取 refresh token
	let refreshTokenValue = rememberMe ? storage.getItem(STORAGE_KEYS.REFRESH_TOKEN) : sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

	if (!refreshTokenValue) {
		return { data: null, error: { message: "没有刷新令牌" } };
	}

	const url = `${AUTH_URL}/token?grant_type=refresh_token`;

	console.log(`[Supabase Auth] 刷新 token`);

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			apikey: SUPABASE_ANON_KEY,
		},
		body: JSON.stringify({ refresh_token: refreshTokenValue }),
	});

	console.log(`[Supabase Auth] Response: ${response.status}`);

	if (!response.ok) {
		const errorData = await response.json();
		console.error(`[Supabase Auth] Error:`, errorData);

		// 只有在 refresh token 无效时才清除本地存储
		// error_description: "Invalid Refresh Token: Refresh Token Not Found"
		// error: "invalid_grant"
		if (errorData.error === "invalid_grant" || errorData.code === 400 || errorData.code === 401) {
			console.log("[Supabase Auth] Refresh Token 无效，清除登录状态");
			signOut();
		}

		return {
			data: null,
			error: { message: errorData.error_description || errorData.message || "刷新令牌失败" },
		};
	}

	const data = await response.json();
	console.log(`[Supabase Auth] Token 刷新成功`);

	// 更新 access token 和会话过期时间
	if (data.access_token) {
		setAccessToken(data.access_token);

		const expiresIn = data.expires_in || 3600;
		setSessionExpiry(expiresIn);

		if (rememberMe) {
			storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
			storage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
		} else {
			sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
			sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
		}
	}

	return {
		data: { user: data.user, session: data },
		error: null,
	};
}

/**
 * 认证 - 登出
 */
export function signOut(): void {
	console.log(`[Supabase Auth] 登出`);
	const storage = getStorage();

	// 清除所有认证相关的存储
	setAccessToken(null);
	storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
	storage.removeItem(STORAGE_KEYS.USER);
	storage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
	storage.removeItem(STORAGE_KEYS.REMEMBER_ME);

	// 同时清除 sessionStorage
	sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
	sessionStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * 认证 - 获取当前用户
 */
export function getCurrentUser(): any | null {
	const storage = getStorage();
	const rememberMe = getRememberMe();

	// 根据是否记住登录，从不同的存储中获取用户信息
	const userStr = rememberMe ? storage.getItem(STORAGE_KEYS.USER) : sessionStorage.getItem(STORAGE_KEYS.USER);

	if (!userStr) return null;

	try {
		return JSON.parse(userStr);
	} catch {
		return null;
	}
}

/**
 * 认证 - 获取当前会话
 */
export async function getSession(): Promise<RestResponse<{ user: any; session: any } | null>> {
	const token = getAccessToken();
	const user = getCurrentUser();

	if (!token || !user) {
		return { data: null, error: null };
	}

	// 尝试刷新 token 以确保有效
	const result = await refreshToken();
	if (result.error) {
		return { data: null, error: null };
	}

	return result;
}
