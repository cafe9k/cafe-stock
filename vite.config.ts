import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

export default defineConfig({
	plugins: [
		react(),
		electron([
			{
				// 主进程入口
				entry: "electron/main.ts",
				vite: {
					build: {
						outDir: "dist-electron",
						rollupOptions: {
							external: ["electron"],
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
					},
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
