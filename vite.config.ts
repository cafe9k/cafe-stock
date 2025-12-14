import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

// 修复 preload.cjs 的 Rollup 插件
function fixPreloadPlugin(): Plugin {
	return {
		name: "fix-preload-cjs",
		// 在生成阶段处理输出
		generateBundle(_options, bundle) {
			const preloadFile = bundle["preload.cjs"];
			if (preloadFile && preloadFile.type === "chunk") {
				let code = preloadFile.code;
				
				// 移除 export default 语句
				code = code.replace(/export\s+default\s+require_preload\(\);?/g, "");
				code = code.replace(/export\s*\{[^}]*\};?/g, "");
				
				// 确保在末尾调用 require_preload()
				if (code.includes("var require_preload =") && !code.endsWith("require_preload();\n")) {
					code = code.trim();
					if (!code.endsWith(";")) {
						code += ";";
					}
					code += "\nrequire_preload();\n";
				}
				
				preloadFile.code = code;
			}
		},
	};
}

export default defineConfig({
	plugins: [
		react(),
		electron([
			{
				// 主进程入口
				entry: "electron/main.ts",
				onstart(options) {
					// Vite 插件会自动启动 Electron，无需手动运行 electron:dev
					options.startup();
				},
				vite: {
					build: {
						outDir: "dist-electron",
						rollupOptions: {
							external: ["electron", "better-sqlite3"],
						},
					},
				},
			},
			{
				// 预加载脚本
				entry: "electron/preload.ts",
				onstart(options) {
					// 通知渲染进程重新加载页面
					options.reload();
				},
				vite: {
					build: {
						outDir: "dist-electron",
						emptyOutDir: false,
						rollupOptions: {
							external: ["electron"],
							output: {
								format: "cjs",
								entryFileNames: "preload.cjs",
							},
						},
					},
					plugins: [fixPreloadPlugin()],
				},
			},
		]),
		renderer(),
	],
	base: "./",
	build: {
		outDir: "dist",
	},
});
