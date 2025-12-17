# 关注功能文档

## 1. 功能概述

关注功能允许用户标记感兴趣的股票，方便快速查看和筛选。用户可以通过点击股票列表中的关注按钮来添加或取消关注，也可以筛选仅显示已关注的股票。

### 1.1 核心功能

-   ✅ 添加关注：点击关注按钮将股票标记为已关注
-   ✅ 取消关注：再次点击关注按钮取消关注状态
-   ✅ 关注筛选：在公告列表中筛选仅显示已关注股票的公告
-   ✅ 关注状态显示：在股票列表中显示关注状态（星标图标）
-   ✅ 关注列表查询：获取所有已关注股票的代码列表
-   ✅ 关注数量统计：统计已关注股票的数量

## 2. 架构设计

关注功能采用分层架构设计，从数据库到前端组件共分为以下层次：

```
前端组件层 (React)
    ↓
前端服务层 (Services)
    ↓
IPC 通信层 (Preload + IPC Handlers)
    ↓
业务服务层 (Services)
    ↓
数据访问层 (Repositories)
    ↓
数据库层 (SQLite)
```

### 2.1 数据流向

```
用户操作 → FavoriteButton 组件
    ↓
调用 window.electronAPI.addFavoriteStock/removeFavoriteStock
    ↓
IPC 通信 (preload.ts)
    ↓
IPC Handler (electron/ipc/favorite.ts)
    ↓
业务服务 (electron/services/favorite.ts)
    ↓
数据仓储 (electron/repositories/FavoriteRepository.ts)
    ↓
数据库更新 (stocks.is_favorite 字段)
```

## 3. 数据库设计

### 3.1 表结构

关注功能使用 `stocks` 表的 `is_favorite` 字段来存储关注状态：

```sql
-- stocks 表结构（部分字段）
CREATE TABLE stocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts_code TEXT NOT NULL UNIQUE,
  -- ... 其他字段 ...
  is_favorite INTEGER DEFAULT 0,  -- 是否关注：0=未关注，1=已关注
  updated_at TEXT NOT NULL
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_stock_is_favorite ON stocks (is_favorite);
```

### 3.2 字段说明

-   **is_favorite**: INTEGER 类型，默认值为 0
    -   `0`: 未关注
    -   `1`: 已关注

### 3.3 数据库迁移

`is_favorite` 字段通过数据库迁移自动添加：

```typescript
// electron/database/migrations.ts
function migrateStocksTable(db: Database.Database): void {
	const tableInfo = db.prepare("PRAGMA table_info(stocks)").all();
	const columns = new Set(tableInfo.map((col) => col.name));

	if (!columns.has("is_favorite")) {
		db.exec("ALTER TABLE stocks ADD COLUMN is_favorite INTEGER DEFAULT 0");
		db.exec("CREATE INDEX IF NOT EXISTS idx_stock_is_favorite ON stocks (is_favorite)");
	}
}
```

#### 3.3.1 迁移触发时机

数据库迁移在**应用启动时自动触发**，具体流程如下：

1. **模块加载时触发**

    - 当任何模块首次导入 `electron/db.ts` 时，模块顶层的代码会立即执行
    - `electron/db.ts` 在模块顶层执行了以下操作：

        ```typescript
        // 初始化数据库
        const db = initializeDatabase();

        // 创建表结构
        createTables(db);

        // 执行数据库迁移
        runMigrations(db);
        ```

2. **触发时机**

    - **应用启动时**：主进程启动时，各种服务模块（如 `stock.ts`、`favorite.ts`、`announcement.ts` 等）会导入 `db.ts`，从而触发迁移
    - **首次导入时**：由于 Node.js 模块缓存机制，迁移只会在第一次导入时执行一次
    - **每次应用启动**：每次应用启动都会检查并执行必要的迁移

3. **迁移执行逻辑**

    - `migrateDatabase()` 函数会检查每个表的结构
    - 如果发现缺少 `is_favorite` 字段，会自动添加
    - 如果字段已存在，则跳过（幂等操作）
    - 迁移是**安全的**，不会影响现有数据

4. **迁移日志**
    - 所有迁移操作都会记录到日志中
    - 可以通过日志查看迁移执行情况：
        ```
        [DB] 开始数据库迁移...
        [DB] 添加 stocks.is_favorite 列
        [DB] stocks.is_favorite 列添加成功
        [DB] stocks.is_favorite 索引创建成功
        [DB] 数据库迁移完成
        ```

#### 3.3.2 兼容性说明

-   ✅ **向后兼容**：迁移会自动检测字段是否存在，不会重复添加
-   ✅ **数据安全**：迁移不会删除或修改现有数据
-   ✅ **零停机**：迁移在应用启动时自动执行，无需手动操作
-   ✅ **幂等性**：多次执行迁移是安全的，不会产生副作用

## 4. API 接口

### 4.1 Electron API 接口

所有关注相关的 API 通过 `window.electronAPI` 暴露：

#### 4.1.1 添加关注

```typescript
addFavoriteStock(tsCode: string): Promise<{ success: boolean; message?: string }>
```

**参数**:

-   `tsCode`: string - 股票代码（Tushare 格式，如 "000001.SZ"）

**返回值**:

```json
{
	"success": true,
	"message": "关注成功"
}
```

**示例**:

```typescript
const result = await window.electronAPI.addFavoriteStock("000001.SZ");
if (result.success) {
	console.log("关注成功");
}
```

#### 4.1.2 取消关注

```typescript
removeFavoriteStock(tsCode: string): Promise<{ success: boolean; message?: string }>
```

**参数**:

-   `tsCode`: string - 股票代码

**返回值**:

```json
{
	"success": true,
	"message": "已取消关注"
}
```

#### 4.1.3 检查是否已关注

```typescript
isFavoriteStock(tsCode: string): Promise<boolean>
```

**参数**:

-   `tsCode`: string - 股票代码

**返回值**: boolean - true 表示已关注，false 表示未关注

**示例**:

```typescript
const isFavorite = await window.electronAPI.isFavoriteStock("000001.SZ");
console.log(isFavorite ? "已关注" : "未关注");
```

#### 4.1.4 获取所有关注股票

```typescript
getAllFavoriteStocks(): Promise<string[]>
```

**返回值**: string[] - 已关注股票的代码数组

**示例**:

```typescript
const favoriteCodes = await window.electronAPI.getAllFavoriteStocks();
console.log(`已关注 ${favoriteCodes.length} 只股票`);
```

#### 4.1.5 统计关注数量

```typescript
countFavoriteStocks(): Promise<number>
```

**返回值**: number - 已关注股票的数量

**示例**:

```typescript
const count = await window.electronAPI.countFavoriteStocks();
console.log(`共关注 ${count} 只股票`);
```

#### 4.1.6 获取关注股票的公告聚合列表

```typescript
getFavoriteStocksAnnouncementsGrouped(
  page: number,
  pageSize: number,
  startDate?: string,
  endDate?: string
): Promise<{
  items: StockGroup[];
  total: number;
  page: number;
  pageSize: number;
}>
```

**参数**:

-   `page`: number - 页码（从 1 开始）
-   `pageSize`: number - 每页数量
-   `startDate`: string (可选) - 开始日期，格式 "YYYYMMDD"
-   `endDate`: string (可选) - 结束日期，格式 "YYYYMMDD"

**返回值**:

```json
{
	"items": [
		{
			"ts_code": "000001.SZ",
			"stock_name": "平安银行",
			"industry": "银行",
			"market": "主板",
			"announcement_count": 10,
			"latest_ann_date": "20240101",
			"isFavorite": true
		}
	],
	"total": 50,
	"page": 1,
	"pageSize": 20
}
```

### 4.2 IPC 通道

IPC 通道定义在 `electron/ipc/favorite.ts`：

-   `add-favorite-stock`: 添加关注
-   `remove-favorite-stock`: 取消关注
-   `is-favorite-stock`: 检查是否已关注
-   `get-all-favorite-stocks`: 获取所有关注股票
-   `count-favorite-stocks`: 统计关注数量

## 5. 前端组件

### 5.1 FavoriteButton 组件

关注按钮组件，用于切换股票的关注状态。

**位置**: `src/components/FavoriteButton.tsx`

**Props**:

```typescript
interface FavoriteButtonProps {
	tsCode: string; // 股票代码（必需）
	isFavorite?: boolean; // 是否已关注（可选，默认 false）
	onChange?: (tsCode: string, isFavorite: boolean) => void; // 状态变化回调
	size?: "small" | "middle" | "large"; // 按钮大小（可选，默认 "small"）
}
```

**使用示例**:

```typescript
import { FavoriteButton } from "@/components/FavoriteButton";

<FavoriteButton
	tsCode="000001.SZ"
	isFavorite={true}
	onChange={(tsCode, isFavorite) => {
		console.log(`${tsCode} 关注状态: ${isFavorite}`);
	}}
	size="small"
/>;
```

**特性**:

-   ✅ 自动显示加载状态
-   ✅ 阻止事件冒泡，避免触发行点击事件
-   ✅ 使用 memo 优化性能
-   ✅ 显示成功/失败提示消息

### 5.2 useFavoriteStocks Hook

管理关注股票状态的 React Hook。

**位置**: `src/hooks/useFavoriteStocks.ts`

**返回值**:

```typescript
{
  favoriteCodes: string[];           // 已关注股票代码列表
  loading: boolean;                  // 加载状态
  toggleFavorite: (tsCode: string, stockName?: string) => Promise<void>;  // 切换关注状态
  isFavorite: (tsCode: string) => boolean;  // 检查是否已关注
  refresh: () => Promise<void>;      // 刷新关注列表
}
```

**使用示例**:

```typescript
import { useFavoriteStocks } from "@/hooks/useFavoriteStocks";

function MyComponent() {
	const { favoriteCodes, toggleFavorite, isFavorite } = useFavoriteStocks();

	return (
		<div>
			<p>已关注 {favoriteCodes.length} 只股票</p>
			<button onClick={() => toggleFavorite("000001.SZ", "平安银行")}>{isFavorite("000001.SZ") ? "取消关注" : "关注"}</button>
		</div>
	);
}
```

### 5.3 markFavoriteStatus 服务

为股票列表标记关注状态的服务函数。

**位置**: `src/services/favoriteStockService.ts`

**函数签名**:

```typescript
function markFavoriteStatus<T extends Stock | StockGroup>(items: T[]): Promise<T[]>;
```

**功能**: 批量查询并标记股票列表的关注状态

**使用示例**:

```typescript
import { markFavoriteStatus } from "@/services/favoriteStockService";

const stocks = await searchStocks("平安");
const stocksWithFavorite = await markFavoriteStatus(stocks);
// stocksWithFavorite 中每个股票都有 isFavorite 属性
```

## 6. 后端实现

### 6.1 FavoriteRepository

数据访问层，负责关注数据的数据库操作。

**位置**: `electron/repositories/implementations/FavoriteRepository.ts`

**主要方法**:

```typescript
class FavoriteRepository {
	// 添加关注
	addFavoriteStock(tsCode: string): boolean {
		const stmt = this.db.prepare("UPDATE stocks SET is_favorite = 1 WHERE ts_code = ?");
		const result = stmt.run(tsCode);
		return result.changes > 0;
	}

	// 取消关注
	removeFavoriteStock(tsCode: string): boolean {
		const stmt = this.db.prepare("UPDATE stocks SET is_favorite = 0 WHERE ts_code = ?");
		const result = stmt.run(tsCode);
		return result.changes > 0;
	}

	// 检查是否已关注
	isFavoriteStock(tsCode: string): boolean {
		const stmt = this.db.prepare("SELECT is_favorite FROM stocks WHERE ts_code = ?");
		const result = stmt.get(tsCode);
		return result?.is_favorite === 1;
	}

	// 获取所有关注股票
	getAllFavoriteStocks(): string[] {
		const stmt = this.db.prepare("SELECT ts_code FROM stocks WHERE is_favorite = 1 ORDER BY ts_code");
		const results = stmt.all();
		return results.map((r) => r.ts_code);
	}

	// 统计关注数量
	countFavoriteStocks(): number {
		const stmt = this.db.prepare("SELECT COUNT(*) as count FROM stocks WHERE is_favorite = 1");
		const result = stmt.get();
		return result?.count || 0;
	}
}
```

### 6.2 FavoriteService

业务服务层，封装关注相关的业务逻辑。

**位置**: `electron/services/favorite.ts`

**主要方法**:

-   `addFavoriteStock(tsCode: string): boolean`
-   `removeFavoriteStock(tsCode: string): boolean`
-   `isFavoriteStock(tsCode: string): boolean`
-   `getAllFavoriteStocks(): string[]`
-   `countFavoriteStocks(): number`

## 7. 使用场景

### 7.1 股票列表中的关注按钮

在 `StockList` 组件中显示关注按钮：

```typescript
<StockList
	data={stocks}
	columnConfig={{
		showFavoriteButton: true, // 显示关注按钮
		// ... 其他配置
	}}
	onFavoriteChange={(tsCode, isFavorite) => {
		console.log(`${tsCode} 关注状态变化: ${isFavorite}`);
	}}
/>
```

### 7.2 公告列表中的关注筛选

在 `AnnouncementList` 组件中使用关注筛选：

```typescript
const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);

// 切换关注筛选
const handleToggleFavoriteFilter = () => {
	setShowFavoriteOnly(!showFavoriteOnly);
};

// 在筛选条件中使用
const filter = {
	showFavoriteOnly: showFavoriteOnly,
	// ... 其他筛选条件
};
```

### 7.3 获取关注股票的公告

使用 `getFavoriteStocksAnnouncementsGrouped` API：

```typescript
const result = await window.electronAPI.getFavoriteStocksAnnouncementsGrouped(
	1, // 页码
	20, // 每页数量
	"20240101", // 开始日期
	"20241231" // 结束日期
);

console.log(`共 ${result.total} 只关注股票，当前页 ${result.items.length} 只`);
```

## 8. 代码检查结果

### 8.1 已修复的问题

✅ **IPC 返回类型不一致**

-   **问题**: `isFavoriteStock` 和 `countFavoriteStocks` IPC 处理器返回对象，但类型定义期望原始值
-   **修复**: 修改 IPC 处理器返回原始值（boolean 和 number）
-   **文件**: `electron/ipc/favorite.ts`

### 8.2 代码质量检查

✅ **数据库设计**

-   `stocks` 表包含 `is_favorite` 字段
-   已创建索引 `idx_stock_is_favorite` 提高查询性能
-   通过数据库迁移自动添加字段，兼容旧数据库

✅ **数据访问层**

-   `FavoriteRepository` 正确实现所有接口方法
-   使用参数化查询防止 SQL 注入
-   错误处理完善

✅ **业务服务层**

-   `FavoriteService` 封装了所有业务逻辑
-   代码简洁清晰

✅ **IPC 通信层**

-   所有 IPC 通道正确注册
-   错误处理完善
-   返回类型与类型定义一致

✅ **前端组件**

-   `FavoriteButton` 组件功能完整
-   使用 memo 优化性能
-   错误处理和用户反馈完善
-   `useFavoriteStocks` Hook 提供便捷的状态管理

✅ **类型定义**

-   `electron.d.ts` 中类型定义完整
-   与实现保持一致

### 8.3 潜在改进建议

1. **性能优化**

    - 批量标记关注状态时，可以考虑批量查询优化

2. **用户体验**
    - 可以添加关注列表的快捷入口
    - 可以添加关注股票的批量操作功能

### 8.4 数据库清理

✅ **已删除未使用的表**

-   `favorite_stocks` 表已被删除
-   关注功能现在完全使用 `stocks.is_favorite` 字段
-   迁移函数会自动删除已存在的 `favorite_stocks` 表（如果存在）

## 9. 测试建议

### 9.1 功能测试

-   [ ] 添加关注：点击关注按钮，验证数据库更新和 UI 状态
-   [ ] 取消关注：点击已关注按钮，验证数据库更新和 UI 状态
-   [ ] 关注筛选：切换关注筛选，验证列表正确过滤
-   [ ] 关注状态同步：验证多个组件中的关注状态保持一致
-   [ ] 错误处理：验证网络错误、数据库错误等情况下的处理

### 9.2 性能测试

-   [ ] 大量股票（1000+）的关注状态查询性能
-   [ ] 批量标记关注状态的性能
-   [ ] 关注筛选在大数据量下的性能

### 9.3 边界情况测试

-   [ ] 不存在的股票代码
-   [ ] 重复添加关注
-   [ ] 重复取消关注
-   [ ] 数据库连接失败
-   [ ] Electron API 不可用

## 10. 相关文件清单

### 10.1 前端文件

-   `src/components/FavoriteButton.tsx` - 关注按钮组件
-   `src/hooks/useFavoriteStocks.ts` - 关注状态管理 Hook
-   `src/services/favoriteStockService.ts` - 关注状态标记服务
-   `src/services/stockService.ts` - 股票服务（使用关注功能）
-   `src/components/StockList/StockList.tsx` - 股票列表组件（集成关注按钮）
-   `src/components/AnnouncementList.tsx` - 公告列表组件（使用关注筛选）
-   `src/types/stock.ts` - 股票类型定义（包含 isFavorite 字段）
-   `src/electron.d.ts` - Electron API 类型定义

### 10.2 后端文件

-   `electron/repositories/interfaces/IFavoriteRepository.ts` - 关注仓储接口
-   `electron/repositories/implementations/FavoriteRepository.ts` - 关注仓储实现
-   `electron/services/favorite.ts` - 关注业务服务
-   `electron/ipc/favorite.ts` - 关注 IPC 处理器
-   `electron/preload.ts` - Preload 脚本（暴露 API）
-   `electron/database/migrations.ts` - 数据库迁移（添加 is_favorite 字段）

## 11. 更新日志

### 2024-01-XX

-   ✅ 修复 IPC 返回类型不一致问题
-   ✅ 完善错误处理
-   ✅ 添加关注功能文档
