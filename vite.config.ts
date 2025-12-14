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

				// 移除所有 export 语句
				code = code.replace(/export\s+default\s+[^;]+;?\s*$/gm, "");
				code = code.replace(/export\s*\{[^}]*\};?\s*$/gm, "");

				// 查找 IIFE 函数名（如 var u = i(() => {...})）
				const iifeMatch = code.match(/var\s+(\w+)\s*=\s*\w+\(/);
				if (iifeMatch) {
					const funcName = iifeMatch[1];
					// 在末尾添加函数调用
					code = code.trim();
					if (!code.endsWith(";")) {
						code += ";";
					}
					code += `\n${funcName}();\n`;
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
