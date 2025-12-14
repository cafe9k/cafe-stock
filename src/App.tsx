import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Announcements } from "./pages/Announcements";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Announcements />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}

export default App;
