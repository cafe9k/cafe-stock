const fs = require("fs");
const path = require("path");

// 配置
const CONFIG = {
	// 需要扫描的根目录
	rootDirs: ["electron", "src"],
	// 需要检查的文件扩展名
	fileExtensions: [".ts", ".tsx"],
	// 排除的文件模式
	excludePatterns: [/\.test\./, /\.spec\./, /\.d\.ts$/, /node_modules/, /dist/],
	// 输出文件路径
	outputPath: "src/assets/cytoscape-data.json",
};

// 结果数据
const graphData = {
	nodes: [],
	edges: [],
};

// 用于存储文件依赖关系（第一遍扫描收集，第二遍生成边）
const fileDependencies = [];

// 用于生成唯一ID
function generateId(filePath) {
	return filePath.replace(/[\/\\]/g, "-").replace(/\.(ts|tsx)$/, "");
}

// 检查文件是否应该被排除
function shouldExcludeFile(filename) {
	return CONFIG.excludePatterns.some((pattern) => pattern.test(filename));
}

// 从文件注释头提取信息
function extractFileHeader(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf-8");
		const lines = content.split("\n").slice(0, 30); // 检查前30行
		const headerText = lines.join("\n");

		// 提取依赖、输出、职责
		const depMatch = headerText.match(/\*\s*依赖[:：]\s*(.+?)(?:\n|\*)/);
		const outputMatch = headerText.match(/\*\s*输出[:：]\s*(.+?)(?:\n|\*)/);
		const respMatch = headerText.match(/\*\s*职责[:：]\s*(.+?)(?:\n|\*)/);

		// 提取依赖字段中的文件路径列表
		let dependencyFiles = [];
		if (depMatch) {
			const depText = depMatch[1].trim();
			// 匹配方括号中的内容: [path1, path2, ...]
			const fileListMatch = depText.match(/\[([^\]]+)\]/);
			if (fileListMatch) {
				// 分割路径并清理空格
				dependencyFiles = fileListMatch[1]
					.split(",")
					.map((p) => p.trim())
					.filter((p) => p.length > 0);
			}
		}

		return {
			dependencies: depMatch ? depMatch[1].trim() : "",
			outputs: outputMatch ? outputMatch[1].trim() : "",
			responsibilities: respMatch ? respMatch[1].trim() : "",
			dependencyFiles: dependencyFiles,
		};
	} catch (error) {
		console.warn(`读取文件失败: ${filePath}`, error.message);
		return {
			dependencies: "",
			outputs: "",
			responsibilities: "",
			dependencyFiles: [],
		};
	}
}

// 解析相对路径为项目内的绝对路径
function resolveFileDependency(currentFilePath, relativePath) {
	try {
		// 获取当前文件所在目录
		const currentDir = path.dirname(currentFilePath);
		// 解析相对路径
		const absolutePath = path.resolve(currentDir, relativePath);
		// 转换为相对于项目根目录的路径
		const projectRelativePath = path.relative(process.cwd(), absolutePath);
		return projectRelativePath;
	} catch (error) {
		console.warn(`路径解析失败: ${currentFilePath} -> ${relativePath}`, error.message);
		return null;
	}
}

// 从README.md提取目录架构定位
function extractReadmeInfo(readmePath) {
	try {
		const content = fs.readFileSync(readmePath, "utf-8");

		// 提取架构定位部分
		const respMatch = content.match(/[-*]\s*职责[:：]\s*(.+?)(?:\n|$)/);
		const depMatch = content.match(/[-*]\s*依赖[:：]\s*(.+?)(?:\n|$)/);
		const outputMatch = content.match(/[-*]\s*输出[:：]\s*(.+?)(?:\n|$)/);

		// 提取标题
		const titleMatch = content.match(/^#\s+(.+?)(?:\n|$)/m);

		return {
			label: titleMatch ? titleMatch[1].trim() : "",
			dependencies: depMatch ? depMatch[1].trim() : "",
			outputs: outputMatch ? outputMatch[1].trim() : "",
			responsibilities: respMatch ? respMatch[1].trim() : "",
		};
	} catch (error) {
		return {
			label: "",
			dependencies: "",
			outputs: "",
			responsibilities: "",
		};
	}
}

// 递归扫描目录
function scanDirectory(dirPath, parentId = null, isRoot = false) {
	const items = fs.readdirSync(dirPath);
	const relativePath = path.relative(process.cwd(), dirPath);
	const dirId = isRoot ? parentId : generateId(relativePath);

	// 检查是否有README.md
	const readmePath = path.join(dirPath, "README.md");
	const hasReadme = fs.existsSync(readmePath);

	// 创建目录节点（非根目录）
	if (!isRoot && parentId !== null) {
		const readmeInfo = hasReadme ? extractReadmeInfo(readmePath) : {};
		const dirName = path.basename(dirPath);

		graphData.nodes.push({
			data: {
				id: dirId,
				label: readmeInfo.label || dirName,
				type: "directory",
				// 不使用 parent 属性，改用边来表示关系
				dependencies: readmeInfo.dependencies || "",
				outputs: readmeInfo.outputs || "",
				responsibilities: readmeInfo.responsibilities || "",
				path: relativePath,
			},
		});

		// 创建父子关系边
		graphData.edges.push({
			data: {
				id: `hierarchy-${parentId}-${dirId}`,
				source: parentId,
				target: dirId,
				type: "hierarchy",
			},
		});
	}

	// 遍历目录中的项
	for (const item of items) {
		const fullPath = path.join(dirPath, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			// 递归扫描子目录
			scanDirectory(fullPath, dirId, false);
		} else if (stat.isFile()) {
			const ext = path.extname(item);

			// 检查是否是需要处理的文件类型
			if (CONFIG.fileExtensions.includes(ext) && !shouldExcludeFile(item)) {
				const fileRelativePath = path.relative(process.cwd(), fullPath);
				const fileId = generateId(fileRelativePath);
				const fileInfo = extractFileHeader(fullPath);

				// 创建文件节点
				graphData.nodes.push({
					data: {
						id: fileId,
						label: item,
						type: "file",
						// 不使用 parent 属性
						dependencies: fileInfo.dependencies,
						outputs: fileInfo.outputs,
						responsibilities: fileInfo.responsibilities,
						path: fileRelativePath,
					},
				});

				// 创建父子关系边
				graphData.edges.push({
					data: {
						id: `hierarchy-${dirId}-${fileId}`,
						source: dirId,
						target: fileId,
						type: "hierarchy",
					},
				});

				// 收集文件依赖关系（稍后处理）
				if (fileInfo.dependencyFiles && fileInfo.dependencyFiles.length > 0) {
					fileDependencies.push({
						sourceFile: fileRelativePath,
						sourceId: fileId,
						dependencies: fileInfo.dependencyFiles,
					});
				}
			}
		}
	}
}

// 主函数
function main() {
	console.log("开始生成 Cytoscape.js 数据...\n");

	const projectRoot = process.cwd();

	// 为每个根目录创建顶层节点
	CONFIG.rootDirs.forEach((rootDir) => {
		const fullPath = path.join(projectRoot, rootDir);
		if (fs.existsSync(fullPath)) {
			const rootId = generateId(rootDir);

			// 创建根节点
			graphData.nodes.push({
				data: {
					id: rootId,
					label: rootDir === "electron" ? "Electron 主进程" : "React 渲染进程",
					type: "root",
					dependencies: "",
					outputs: "",
					responsibilities: rootDir === "electron" ? "主进程业务逻辑和数据管理" : "渲染进程UI和交互",
					path: rootDir,
				},
			});

			// 扫描目录（标记为根目录）
			scanDirectory(fullPath, rootId, true);
		} else {
			console.warn(`目录不存在: ${rootDir}`);
		}
	});

	// 生成依赖关系边
	console.log(`\n处理文件依赖关系...`);
	let dependencyEdgeCount = 0;
	let skippedDependencies = 0;

	fileDependencies.forEach((dep) => {
		dep.dependencies.forEach((relativePath) => {
			// 解析相对路径为项目内的绝对路径
			const resolvedPath = resolveFileDependency(dep.sourceFile, relativePath);
			if (!resolvedPath) {
				skippedDependencies++;
				return;
			}

			// 生成目标文件的 ID
			const targetId = generateId(resolvedPath);

			// 检查目标节点是否存在
			const targetExists = graphData.nodes.some((node) => node.data.id === targetId);
			if (!targetExists) {
				console.warn(`  ⚠️  依赖目标不存在: ${dep.sourceFile} -> ${resolvedPath}`);
				skippedDependencies++;
				return;
			}

			// 创建依赖关系边
			const edgeId = `dependency-${dep.sourceId}-${targetId}`;
			// 避免重复边
			if (!graphData.edges.some((edge) => edge.data.id === edgeId)) {
				graphData.edges.push({
					data: {
						id: edgeId,
						source: dep.sourceId,
						target: targetId,
						type: "dependency",
					},
				});
				dependencyEdgeCount++;
			}
		});
	});

	console.log(`  ✓ 生成依赖边: ${dependencyEdgeCount} 条`);
	if (skippedDependencies > 0) {
		console.log(`  ⚠️  跳过无效依赖: ${skippedDependencies} 个`);
	}

	// 确保输出目录存在
	const outputDir = path.dirname(CONFIG.outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// 写入JSON文件
	fs.writeFileSync(CONFIG.outputPath, JSON.stringify(graphData, null, 2), "utf-8");

	console.log(`✓ 生成完成！`);
	console.log(`  节点数: ${graphData.nodes.length}`);
	console.log(`  边数: ${graphData.edges.length}`);
	console.log(`  输出文件: ${CONFIG.outputPath}\n`);
}

// 运行生成
main();
