/**
 * 数据库性能测试脚本
 * 用于验证公告列表查询优化效果
 */

const Database = require("better-sqlite3");
const path = require("path");
const { app } = require("electron");

// 注意：此脚本需要在 Electron 环境中运行
// 或者手动指定数据库路径

const dbPath = process.env.DB_PATH || path.join(__dirname, "cafe_stock.db");

console.log("📊 数据库性能测试");
console.log("数据库路径:", dbPath);
console.log("---");

try {
	const db = new Database(dbPath, { readonly: true });

	// 测试 1: 检查索引
	console.log("\n✅ 索引检查:");
	const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='announcements'").all();
	indexes.forEach((idx) => {
		console.log(`  - ${idx.name}`);
	});

	// 测试 2: 数据统计
	console.log("\n✅ 数据统计:");
	const stockCount = db.prepare("SELECT COUNT(*) as count FROM stocks").get();
	const annCount = db.prepare("SELECT COUNT(*) as count FROM announcements").get();
	console.log(`  - 股票数量: ${stockCount.count.toLocaleString()}`);
	console.log(`  - 公告数量: ${annCount.count.toLocaleString()}`);

	// 测试 3: 性能测试
	console.log("\n✅ 性能测试:");

	// 测试分组查询
	const t1 = Date.now();
	const result1 = db
		.prepare(
			`
    WITH aggregated_data AS (
      SELECT
        s.ts_code,
        s.name as stock_name,
        COUNT(a.id) as announcement_count,
        MAX(a.ann_date) as latest_ann_date
      FROM stocks s
      INNER JOIN announcements a ON s.ts_code = a.ts_code
      GROUP BY s.ts_code, s.name
      LIMIT 20
    )
    SELECT * FROM aggregated_data
  `
		)
		.all();
	const t2 = Date.now();
	console.log(`  - 分组查询 (20条): ${t2 - t1}ms`);

	// 测试 COUNT 查询
	const t3 = Date.now();
	const result2 = db
		.prepare(
			`
    SELECT COUNT(*) as count
    FROM stocks s
    WHERE EXISTS (
      SELECT 1 FROM announcements a WHERE a.ts_code = s.ts_code
    )
  `
		)
		.get();
	const t4 = Date.now();
	console.log(`  - COUNT 查询: ${t4 - t3}ms (结果: ${result2.count})`);

	// 测试日期范围查询
	const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, "");

	const t5 = Date.now();
	const result3 = db
		.prepare(
			`
    SELECT COUNT(*) as count
    FROM stocks s
    WHERE EXISTS (
      SELECT 1 FROM announcements a 
      WHERE a.ts_code = s.ts_code 
      AND a.ann_date BETWEEN ? AND ?
    )
  `
		)
		.get(lastMonth, today);
	const t6 = Date.now();
	console.log(`  - 日期过滤查询: ${t6 - t5}ms (结果: ${result3.count})`);

	// 测试 4: 查询计划分析
	console.log("\n✅ 查询计划分析:");
	const plan = db
		.prepare(
			`
    EXPLAIN QUERY PLAN
    SELECT s.ts_code, COUNT(a.id) as count
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
    GROUP BY s.ts_code
    LIMIT 20
  `
		)
		.all();

	plan.forEach((step, i) => {
		console.log(`  ${i + 1}. ${step.detail}`);
	});

	db.close();

	console.log("\n✅ 测试完成！");
	console.log("\n💡 性能优化建议:");
	console.log("  - 如果查询时间 > 200ms，考虑增加缓存");
	console.log("  - 定期执行 ANALYZE 更新统计信息");
	console.log("  - 监控索引使用情况");
} catch (error) {
	console.error("\n❌ 测试失败:", error.message);
	console.log("\n提示:");
	console.log("  1. 确保数据库文件存在");
	console.log("  2. 使用环境变量指定路径: DB_PATH=/path/to/cafe_stock.db node test-db-performance.js");
	process.exit(1);
}

