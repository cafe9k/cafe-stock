export function Settings() {
	return (
		<div>
			<h1 className="text-3xl font-bold text-slate-800 mb-6">Settings</h1>
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
				<h2 className="text-xl font-semibold mb-4">General Settings</h2>
				<div className="space-y-4">
					<div className="flex items-center justify-between py-3 border-b border-slate-50">
						<div>
							<div className="font-medium text-slate-700">Dark Mode</div>
							<div className="text-sm text-slate-400">Enable dark appearance</div>
						</div>
						<div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer">
							<div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
						</div>
					</div>
					<div className="flex items-center justify-between py-3 border-b border-slate-50">
						<div>
							<div className="font-medium text-slate-700">Notifications</div>
							<div className="text-sm text-slate-400">Receive daily updates</div>
						</div>
						<div className="w-11 h-6 bg-purple-500 rounded-full relative cursor-pointer">
							<div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
