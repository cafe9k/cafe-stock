import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import {
	signInWithPassword,
	signUp as restSignUp,
	signOut as restSignOut,
	getCurrentUser,
	refreshToken,
	insert,
	select,
} from "../lib/supabaseRestClient";

interface User {
	id: string;
	email?: string;
	[key: string]: any;
}

interface AuthContextType {
	user: User | null;
	session: any | null;
	loading: boolean;
	signUp: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: { message: string } | null }>;
	signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: { message: string } | null }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	// 防止 StrictMode 导致的重复初始化
	const initRef = useRef(false);

	useEffect(() => {
		// 防止重复初始化
		if (initRef.current) return;
		initRef.current = true;

		// 获取初始会话
		const initAuth = async () => {
			console.log("[AuthContext] 初始化认证状态");

			// 先尝试从 localStorage 获取用户
			const cachedUser = getCurrentUser();
			if (cachedUser) {
				console.log("[AuthContext] 从缓存获取用户:", cachedUser.id);
				setUser(cachedUser);

				// 尝试刷新 token
				const { data, error } = await refreshToken();
				if (error) {
					console.log("[AuthContext] Token 刷新失败:", error.message);

					// 如果是网络错误，或者是服务器错误但不是认证错误，也许应该保留用户状态？
					// 但目前安全起见，只要刷新失败（且 supabaseRestClient 内部判定为需要登出），这里就会同步状态
					// 检查 token 是否还存在于 storage 中，如果不在了，说明在 refreshToken 中被 signOut 了
					const token = localStorage.getItem("cafe_stock_access_token");
					if (!token) {
						console.log("[AuthContext] 本地 Token 已清除，确认登出");
						setUser(null);
						setSession(null);
					} else {
						console.log("[AuthContext] 本地 Token 仍存在，可能是网络问题，暂时保留用户状态");
						// 这种情况下，我们可能需要一个机制来重试，或者让用户在使用需要 auth 的功能时再报错
						// 但为了简单，如果刷新失败但没被清除，我们假设原来的 token 可能还能用（虽然大概率过期了）
						// 或者我们可以选择信任 cachedUser
						setUser(cachedUser);
						// session 可能为空，但这可能导致后续请求失败
					}
				} else if (data) {
					console.log("[AuthContext] Token 刷新成功");
					setUser(data.user);
					setSession(data.session);
				}
			} else {
				console.log("[AuthContext] 没有缓存的用户");
			}

			setLoading(false);
		};

		initAuth();
	}, []);

	// 初始化用户数据（默认分组和设置）
	const initializeUserData = async (userId: string) => {
		try {
			console.log("[AuthContext] 初始化用户数据:", userId);

			// 检查是否已有分组
			const { data: existingGroups } = await select<any[]>("watch_groups", {
				columns: "id",
				filters: { user_id: `eq.${userId}` },
				limit: 1,
			});

			// 如果没有分组，创建默认分组
			if (!existingGroups || existingGroups.length === 0) {
				console.log("[AuthContext] 创建默认分组");
				await insert("watch_groups", {
					user_id: userId,
					name: "自选股",
					sort_order: 0,
					color: "#58a6ff",
				});
			}

			// 检查是否已有设置
			const { data: existingSettings } = await select<any>("user_settings", {
				columns: "user_id",
				filters: { user_id: `eq.${userId}` },
			});

			// 如果没有设置，创建默认设置
			if (!existingSettings || existingSettings.length === 0) {
				console.log("[AuthContext] 创建默认设置");
				await insert("user_settings", {
					user_id: userId,
					theme: "dark",
					color_scheme: "cn",
					alert_types: ["top_list", "block_trade", "suspend_d", "share_float"],
					refresh_interval: 5,
				});
			}

			console.log("[AuthContext] 用户数据初始化完成");
		} catch (error) {
			console.error("[AuthContext] 初始化用户数据失败:", error);
		}
	};

	// 注册
	const signUp = async (email: string, password: string, rememberMe: boolean = true) => {
		console.log("[AuthContext] 注册:", email, "记住登录:", rememberMe);
		const { data, error } = await restSignUp(email, password, rememberMe);

		if (error) {
			return { error };
		}

		if (data) {
			setUser(data.user);
			setSession(data.session);

			// 初始化用户数据
			if (data.user?.id) {
				await initializeUserData(data.user.id);
			}
		}

		return { error: null };
	};

	// 登录
	const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
		console.log("[AuthContext] 登录:", email, "记住登录:", rememberMe);
		const { data, error } = await signInWithPassword(email, password, rememberMe);

		if (error) {
			return { error };
		}

		if (data) {
			setUser(data.user);
			setSession(data.session);

			// 初始化用户数据（确保有默认分组）
			if (data.user?.id) {
				await initializeUserData(data.user.id);
			}
		}

		return { error: null };
	};

	// 登出
	const signOut = async () => {
		console.log("[AuthContext] 登出");
		restSignOut();
		setUser(null);
		setSession(null);
	};

	const value = {
		user,
		session,
		loading,
		signUp,
		signIn,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
