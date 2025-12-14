import { useState } from "react";
import "./App.css";
import { TushareClient } from "./services/TushareClient";

function App() {
	const [count, setCount] = useState(0);
	const [stockData, setStockData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");

	const testTushare = async () => {
		setLoading(true);
		setError("");
		try {
			// 获取上交所的主板股票，只取前5条用于测试
			const data = await TushareClient.request(
				"stock_basic",
				{ exchange: "SSE", list_status: "L", limit: 5 },
				"ts_code,symbol,name,area,industry,market"
			);
			setStockData(data);
		} catch (err: any) {
			setError(err.message || "Request failed");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container">
			<h1>Electron Shell</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
				<button onClick={testTushare} disabled={loading} style={{ marginLeft: "10px" }}>
					{loading ? "Testing..." : "Test Tushare Connection"}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>

			{error && <p style={{ color: "red" }}>Error: {error}</p>}

			{stockData.length > 0 && (
				<div
					style={{
						textAlign: "left",
						marginTop: "20px",
						maxHeight: "300px",
						overflow: "auto",
						background: "#f5f5f5",
						padding: "10px",
						borderRadius: "5px",
					}}
				>
					<h3>Tushare Data (Top 5):</h3>
					<pre style={{ fontSize: "12px", color: "#333" }}>{JSON.stringify(stockData, null, 2)}</pre>
				</div>
			)}

			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</div>
	);
}

export default App;
