/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SUPABASE_URL: string;
	readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	electronAPI?: {
		showNotification: (title: string, body: string) => Promise<void>;
		getAppVersion: () => Promise<string>;
		tushareRequest: (
			url: string,
			body: any
		) => Promise<{
			ok: boolean;
			status: number;
			statusText?: string;
			data: any;
		}>;
		refreshData: () => void;
		onRefreshData: (callback: () => void) => () => void;
	};
}
