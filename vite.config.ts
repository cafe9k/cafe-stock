import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
						lib: {
							entry: "electron/preload.ts",
							formats: ["cjs"],
							fileName: () => "preload.cjs",
						},
						rollupOptions: {
							external: ["electron"],
						},
					},
					plugins: [
						{
							name: "fix-preload-cjs",
							closeBundle: async () => {
								try {
									await execAsync("node scripts/fix-preload.js");
									console.log("✅ Fixed preload.cjs");
								} catch (error) {
									console.error("❌ Failed to fix preload.cjs:", error);
								}
							},
						},
					],
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
