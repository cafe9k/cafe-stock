const fs = require("fs");
const path = require("path");

// 配置
const CONFIG = {
	// 需要检查的目录
	targetDirs: [
		"electron/services",
		"electron/repositories",
		"electron/ipc",
		"src/components",
		"src/hooks",
		"src/pages",
		"src/services",
		"src/types",
		"src/utils",
	],
	// 需要检查的文件扩展名
	fileExtensions: [".ts", ".tsx"],
	// 排除的文件模式
	excludePatterns: [/\.test\./, /\.spec\./, /\.d\.ts$/],
	// 必需的注释关键词
	requiredKeywords: ["依赖:", "输出:", "职责:"],
};

// 统计结果
const results = {
	totalFiles: 0,
	validFiles: 0, // 符合基本要求（包含所有必需关键词）
	filesWithUpdateReminder: 0, // 有更新提醒的文件
	invalidFiles: [],
	totalDirs: 0,
	dirsWithReadme: 0,
	dirsWithoutReadme: [],
	readmeWithoutSelfRef: [], // README缺少自指声明
	readmeWithoutArch: [], // README缺少架构定位
	errors: [],
};

/**
 * 检查文件是否应该被排除
 */
function shouldExcludeFile(filename) {
	return CONFIG.excludePatterns.some((pattern) => pattern.test(filename));
}

/**
 * 检查文件是否有标准注释头
 */
function checkFileHeader(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf-8");
		const lines = content.split("\n").slice(0, 30); // 检查前30行
		const headerText = lines.join("\n");

		// 检查是否包含所有必需的关键词
		const missingKeywords = CONFIG.requiredKeywords.filter((keyword) => !headerText.includes(keyword));

		// 检查是否包含更新提醒（可选但推荐）
		const hasUpdateReminder = headerText.includes("更新提醒") || headerText.includes("⚠️");

		return {
			valid: missingKeywords.length === 0,
			missingKeywords,
			hasUpdateReminder,
		};
	} catch (error) {
		results.errors.push({
			file: filePath,
			error: `读取文件失败: ${error.message}`,
		});
		return { valid: false, missingKeywords: CONFIG.requiredKeywords, hasUpdateReminder: false };
	}
}

/**
 * 检查README.md是否符合规范
 */
function checkReadme(readmePath) {
	try {
		const content = fs.readFileSync(readmePath, "utf-8");

		const hasSelfRef = content.includes("自指声明") || content.includes("⚠️");
		const hasArch = content.includes("架构定位") || (content.includes("职责") && content.includes("依赖") && content.includes("输出"));

		return {
			hasSelfRef,
			hasArch,
		};
	} catch (error) {
		return {
			hasSelfRef: false,
			hasArch: false,
		};
	}
}

/**
 * 递归遍历目录检查文件
 */
function scanDirectory(dirPath, relativePath = "") {
	const items = fs.readdirSync(dirPath);
	const hasReadme = items.some((item) => item === "README.md");

	// 检查目录是否有 README.md
	results.totalDirs++;
	if (hasReadme) {
		results.dirsWithReadme++;
		// 检查README.md是否符合规范
		const readmePath = path.join(dirPath, "README.md");
		const readmeCheck = checkReadme(readmePath);
		if (!readmeCheck.hasSelfRef) {
			results.readmeWithoutSelfRef.push(relativePath || dirPath);
		}
		if (!readmeCheck.hasArch) {
			results.readmeWithoutArch.push(relativePath || dirPath);
		}
	} else {
		results.dirsWithoutReadme.push(relativePath || dirPath);
	}

	for (const item of items) {
		const fullPath = path.join(dirPath, item);
		const itemRelativePath = path.join(relativePath, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			// 递归检查子目录
			scanDirectory(fullPath, itemRelativePath);
		} else if (stat.isFile()) {
			const ext = path.extname(item);

			// 检查是否是需要验证的文件类型
			if (CONFIG.fileExtensions.includes(ext) && !shouldExcludeFile(item)) {
				results.totalFiles++;

				const headerCheck = checkFileHeader(fullPath);

				if (headerCheck.valid) {
					results.validFiles++;
					// 统计有更新提醒的文件
					if (headerCheck.hasUpdateReminder) {
						results.filesWithUpdateReminder++;
					}
				} else {
					results.invalidFiles.push({
						file: itemRelativePath,
						missingKeywords: headerCheck.missingKeywords,
					});
				}
			}
		}
	}
}

/**
 * 生成报告
 */
function generateReport() {
	const report = [];

	report.push("# 分形文档结构验证报告");
	report.push("");
	report.push(`**生成时间**: ${new Date().toLocaleString("zh-CN")}`);
	report.push("");

	// 文件检查统计
	report.push("## 文件注释头检查");
	report.push("");
	const passRate = results.totalFiles > 0 ? ((results.validFiles / results.totalFiles) * 100).toFixed(2) : "0.00";
	const updateReminderRate = results.totalFiles > 0 ? ((results.filesWithUpdateReminder / results.totalFiles) * 100).toFixed(2) : "0.00";
	const invalidRate = results.totalFiles > 0 ? ((results.invalidFiles.length / results.totalFiles) * 100).toFixed(2) : "0.00";
	report.push("| 统计项 | 数量 | 占比 |");
	report.push("|--------|------|------|");
	report.push(`| 总文件数 | ${results.totalFiles} | 100% |`);
	report.push(`| **符合基本要求**（包含所有必需关键词） | ${results.validFiles} | ${passRate}% |`);
	report.push(`| **完全符合要求**（包含更新提醒） | ${results.filesWithUpdateReminder} | ${updateReminderRate}% |`);
	report.push(`| 无效文件 | ${results.invalidFiles.length} | ${invalidRate}% |`);
	report.push("");
	report.push("> **说明**：");
	report.push("> - **符合基本要求**：文件注释头包含所有必需关键词（依赖、输出、职责）");
	report.push("> - **完全符合要求**：在符合基本要求的基础上，还包含更新提醒（⚠️ 或 更新提醒）");
	report.push("");

	if (results.invalidFiles.length > 0) {
		report.push("### 缺少标准注释头的文件");
		report.push("");
		results.invalidFiles.forEach(({ file, missingKeywords }) => {
			report.push(`- ❌ **${file}**`);
			report.push(`  - 缺少关键词: \`${missingKeywords.join("`, `")}\``);
		});
		report.push("");
	} else {
		report.push("✅ **所有文件都有标准注释头！**");
		report.push("");
	}

	// 目录 README 检查统计
	report.push("## 目录 README.md 检查");
	report.push("");
	const coverageRate = results.totalDirs > 0 ? ((results.dirsWithReadme / results.totalDirs) * 100).toFixed(2) : "0.00";
	report.push("| 统计项 | 数量 |");
	report.push("|--------|------|");
	report.push(`| 总目录数 | ${results.totalDirs} |`);
	report.push(`| 有 README 的目录 | ${results.dirsWithReadme} |`);
	report.push(`| 缺少 README 的目录 | ${results.dirsWithoutReadme.length} |`);
	report.push(`| 覆盖率 | ${coverageRate}% |`);
	report.push("");

	if (results.dirsWithoutReadme.length > 0) {
		report.push("### 缺少 README.md 的目录");
		report.push("");
		results.dirsWithoutReadme.forEach((dir) => {
			report.push(`- ❌ \`${dir}\``);
		});
		report.push("");
	} else {
		report.push("✅ **所有目录都有 README.md！**");
		report.push("");
	}

	// README质量检查
	if (results.readmeWithoutSelfRef.length > 0 || results.readmeWithoutArch.length > 0) {
		report.push("## README.md 质量检查");
		report.push("");

		if (results.readmeWithoutSelfRef.length > 0) {
			report.push(`### 缺少自指声明的 README (${results.readmeWithoutSelfRef.length} 个)`);
			report.push("");
			results.readmeWithoutSelfRef.forEach((dir) => {
				report.push(`- ⚠️ \`${dir}\``);
			});
			report.push("");
		}

		if (results.readmeWithoutArch.length > 0) {
			report.push(`### 缺少架构定位的 README (${results.readmeWithoutArch.length} 个)`);
			report.push("");
			results.readmeWithoutArch.forEach((dir) => {
				report.push(`- ⚠️ \`${dir}\``);
			});
			report.push("");
		}
	}

	// 错误信息
	if (results.errors.length > 0) {
		report.push("## 错误信息");
		report.push("");
		results.errors.forEach(({ file, error }) => {
			report.push(`- ⚠️ **${file}**: ${error}`);
		});
		report.push("");
	}

	// 总结
	report.push("---");
	report.push("");
	const allValid =
		results.invalidFiles.length === 0 &&
		results.dirsWithoutReadme.length === 0 &&
		results.readmeWithoutSelfRef.length === 0 &&
		results.readmeWithoutArch.length === 0 &&
		results.errors.length === 0;

	if (allValid) {
		report.push("## ✅ 验证通过");
		report.push("");
		report.push("🎉 所有检查项都符合分形文档结构规范。");
	} else {
		report.push("## ⚠️ 验证未通过");
		report.push("");
		report.push("请根据上述报告修复问题。");
	}
	report.push("");

	return report.join("\n");
}

/**
 * 生成修复建议
 */
function generateFixSuggestions() {
	if (results.invalidFiles.length === 0 && results.dirsWithoutReadme.length === 0) {
		return "";
	}

	const suggestions = [];
	suggestions.push("");
	suggestions.push("## 修复建议");
	suggestions.push("");

	if (results.invalidFiles.length > 0) {
		suggestions.push("### 为缺少注释头的文件添加标准注释");
		suggestions.push("");
		suggestions.push("标准注释模板：");
		suggestions.push("");
		suggestions.push("```typescript");
		suggestions.push("/**");
		suggestions.push(" * 依赖: [依赖的外部模块/API/数据源]");
		suggestions.push(" * 输出: [对外提供的函数/类/接口]");
		suggestions.push(" * 职责: [在系统中的角色定位]");
		suggestions.push(" * ");
		suggestions.push(" * ⚠️ 更新提醒：修改此文件后，请同步更新：");
		suggestions.push(" *    1. 本文件开头的 INPUT/OUTPUT/POS 注释");
		suggestions.push(" *    2. 所在目录的 README.md 中的文件列表");
		suggestions.push(" *    3. 如影响架构，更新根目录文档");
		suggestions.push(" */");
		suggestions.push("```");
		suggestions.push("");
		suggestions.push("需要添加注释的文件：");
		suggestions.push("");
		results.invalidFiles.forEach(({ file }) => {
			suggestions.push(`- \`${file}\``);
		});
		suggestions.push("");
	}

	if (results.dirsWithoutReadme.length > 0) {
		suggestions.push("### 为缺少 README.md 的目录创建文档");
		suggestions.push("");
		suggestions.push("每个目录的 README.md 应包含：");
		suggestions.push("");
		suggestions.push("1. **架构定位**（3行：职责、依赖、输出）");
		suggestions.push("2. **自指声明**（文件夹变化时更新提醒）");
		suggestions.push("3. **文件清单**（列出所有文件及功能说明）");
		suggestions.push("4. **依赖关系图**（使用 Mermaid）");
		suggestions.push("5. **扩展指南**（如何添加新文件）");
		suggestions.push("");
		suggestions.push("需要创建 README.md 的目录：");
		suggestions.push("");
		results.dirsWithoutReadme.forEach((dir) => {
			suggestions.push(`- \`${dir}\``);
		});
		suggestions.push("");
	}

	return suggestions.join("\n");
}

/**
 * 主函数
 */
function main() {
	const projectRoot = process.cwd();

	console.log("开始验证分形文档结构...\n");
	console.log(`检查目录: ${CONFIG.targetDirs.join(", ")}\n`);

	// 扫描所有目标目录
	CONFIG.targetDirs.forEach((dir) => {
		const fullPath = path.join(projectRoot, dir);
		if (fs.existsSync(fullPath)) {
			scanDirectory(fullPath, dir);
		} else {
			results.errors.push({
				file: dir,
				error: "目录不存在",
			});
		}
	});

	// 生成并输出报告
	const report = generateReport();
	console.log(report);

	// 生成修复建议
	const suggestions = generateFixSuggestions();
	if (suggestions) {
		console.log(suggestions);
	}

	// 保存报告到文件
	const docsDir = path.join(projectRoot, "docs");
	// 确保 docs 目录存在
	if (!fs.existsSync(docsDir)) {
		fs.mkdirSync(docsDir, { recursive: true });
	}
	const reportPath = path.join(docsDir, "fractal-docs-validation-report.md");
	fs.writeFileSync(reportPath, report + suggestions, "utf-8");
	console.log(`\n报告已保存到: ${reportPath}`);

	// 返回退出码
	const hasIssues =
		results.invalidFiles.length > 0 ||
		results.dirsWithoutReadme.length > 0 ||
		results.readmeWithoutSelfRef.length > 0 ||
		results.readmeWithoutArch.length > 0 ||
		results.errors.length > 0;

	process.exit(hasIssues ? 1 : 0);
}

// 运行验证
main();
