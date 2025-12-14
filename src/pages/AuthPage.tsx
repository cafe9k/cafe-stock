import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(true);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const { signIn, signUp } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setMessage("");

		// 表单验证
		if (!email || !password) {
			setError("请填写邮箱和密码");
			return;
		}

		if (!isLogin && password !== confirmPassword) {
			setError("两次输入的密码不一致");
			return;
		}

		if (password.length < 6) {
			setError("密码长度至少6位");
			return;
		}

		setLoading(true);

		try {
			if (isLogin) {
				const { error } = await signIn(email, password, rememberMe);
				if (error) {
					if (error.message.includes("Invalid login credentials")) {
						setError("邮箱或密码错误");
					} else {
						setError(error.message);
					}
				} else {
					navigate("/");
				}
			} else {
				const { error } = await signUp(email, password, rememberMe);
				if (error) {
					if (error.message.includes("already registered")) {
						setError("该邮箱已注册");
					} else {
						setError(error.message);
					}
				} else {
					setMessage("注册成功！请查收验证邮件，验证后即可登录。");
					setIsLogin(true);
				}
			}
		} catch (err) {
			setError("操作失败，请稍后重试");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-container">
				<div className="auth-header">
					<div className="auth-logo">📊</div>
					<h1>股票关注面板</h1>
					<p>追踪您关注的股票，掌握市场动态</p>
				</div>

				<div className="auth-tabs">
					<button
						className={`auth-tab ${isLogin ? "active" : ""}`}
						onClick={() => {
							setIsLogin(true);
							setError("");
							setMessage("");
						}}
					>
						登录
					</button>
					<button
						className={`auth-tab ${!isLogin ? "active" : ""}`}
						onClick={() => {
							setIsLogin(false);
							setError("");
							setMessage("");
						}}
					>
						注册
					</button>
				</div>

				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">邮箱</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="请输入邮箱"
							autoComplete="email"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">密码</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="请输入密码"
							autoComplete={isLogin ? "current-password" : "new-password"}
						/>
					</div>

					{!isLogin && (
						<div className="form-group">
							<label htmlFor="confirmPassword">确认密码</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="请再次输入密码"
								autoComplete="new-password"
							/>
						</div>
					)}

					<div className="form-group remember-me">
						<label className="checkbox-label">
							<input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
							<span>记住登录状态</span>
						</label>
						<p className="remember-me-hint">{rememberMe ? "下次打开自动登录" : "仅本次会话有效"}</p>
					</div>

					{error && <div className="auth-error">{error}</div>}
					{message && <div className="auth-message">{message}</div>}

					<button type="submit" className="auth-submit" disabled={loading}>
						{loading ? "处理中..." : isLogin ? "登录" : "注册"}
					</button>
				</form>

				<div className="auth-footer">
					<p>
						{isLogin ? "还没有账号？" : "已有账号？"}
						<button
							className="auth-switch"
							onClick={() => {
								setIsLogin(!isLogin);
								setError("");
								setMessage("");
							}}
						>
							{isLogin ? "立即注册" : "立即登录"}
						</button>
					</p>
				</div>
			</div>

			<div className="auth-features">
				<div className="feature-item">
					<span className="feature-icon">📈</span>
					<div>
						<h3>实时行情</h3>
						<p>盘后数据及时更新，掌握市场动态</p>
					</div>
				</div>
				<div className="feature-item">
					<span className="feature-icon">🔔</span>
					<div>
						<h3>重要消息</h3>
						<p>龙虎榜、大宗交易、股东变动一目了然</p>
					</div>
				</div>
				<div className="feature-item">
					<span className="feature-icon">☁️</span>
					<div>
						<h3>云端同步</h3>
						<p>多设备数据同步，随时随地查看</p>
					</div>
				</div>
			</div>
		</div>
	);
}
