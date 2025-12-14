import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Announcements } from "./pages/Announcements";
import Stocks from "./pages/Stocks";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Navigate to="/stocks" replace />} />
				<Route path="stocks" element={<Stocks />} />
				<Route path="announcements" element={<Announcements />} />
				<Route path="*" element={<Navigate to="/stocks" replace />} />
			</Route>
		</Routes>
	);
}

export default App;
