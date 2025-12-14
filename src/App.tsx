import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Announcements } from "./pages/Announcements";
import { News } from "./pages/News";
import DataInsights from "./pages/DataInsights";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Navigate to="/announcements" replace />} />
				<Route path="announcements" element={<Announcements />} />
				<Route path="news" element={<News />} />
				<Route path="data-insights" element={<DataInsights />} />
				<Route path="*" element={<Navigate to="/announcements" replace />} />
			</Route>
		</Routes>
	);
}

export default App;
