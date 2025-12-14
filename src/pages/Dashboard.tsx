export function Dashboard() {
	return (
		<div>
			<h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[1, 2, 3].map((i) => (
					<div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
						<h3 className="text-lg font-semibold text-slate-700 mb-2">Metric {i}</h3>
						<div className="text-3xl font-bold text-slate-900">1,234</div>
						<div className="text-sm text-green-500 mt-2">+5.2% from last month</div>
					</div>
				))}
			</div>
		</div>
	);
}
