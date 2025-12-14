import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preloadPath = path.join(__dirname, "../dist-electron/preload.cjs");

try {
	let content = fs.readFileSync(preloadPath, "utf8");

	// 移除 export default 语句
	content = content.replace(/export\s+default\s+.+;?\s*$/gm, "");

	// 确保末尾调用 require_preload()
	if (!content.includes("require_preload();")) {
		content += "\nrequire_preload();\n";
	}

	fs.writeFileSync(preloadPath, content, "utf8");
	console.log("✅ Fixed preload.cjs - removed ESM export");
} catch (error) {
	console.error("❌ Failed to fix preload.cjs:", error.message);
	process.exit(1);
}
