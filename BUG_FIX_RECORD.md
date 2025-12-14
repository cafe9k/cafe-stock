# 数据库查询 Bug 修复记录

## 修复日期
2024-12-14

## 发现的问题

### 🐛 Bug #1: 参数绑定错误
**位置**: `getAnnouncementsGroupedByStock()`, `searchAnnouncementsGroupedByStock()`, `getFavoriteStocksAnnouncementsGrouped()`

**问题描述**:
在使用 CTE (Common Table Expression) 优化查询时，两个子查询使用了相同的 `whereClause`，但 SQL 中有多个 `?` 占位符，而参数只传入了一次，导致参数不匹配。

**原始代码问题**:
```typescript
// 第一个 CTE
WITH aggregated_data AS (
  SELECT ... FROM stocks s
  INNER JOIN announcements a ON s.ts_code = a.ts_code
  WHERE a.ann_date BETWEEN ? AND ? AND s.market = ?  -- 需要 3 个参数
)
// 第二个 CTE  
latest_announcements AS (
  SELECT ... FROM announcements a
  WHERE a.ann_date BETWEEN ? AND ?  -- 又需要 2 个参数
)
```

但参数数组只有: `[startDate, endDate, market, limit, offset]`  
实际需要: `[startDate, endDate, market, startDate, endDate, limit, offset]`

### 🐛 Bug #2: 字段不存在错误
**位置**: `getAnnouncementsGroupedByStock()` 原始使用 `whereClause.replace(/s\./g, 'a.')`

**问题描述**:
当市场过滤条件存在时 `s.market = ?`，通过 replace 替换成 `a.market = ?`，但 `announcements` 表中没有 `market` 字段，会导致 SQL 错误。

## 修复方案

### ✅ 解决方案 1: 分离条件构建
为不同的查询构建独立的条件字符串：

```typescript
const annConditions: string[] = []; // 仅包含适用于 announcements 表的条件

// 添加日期范围条件（适用于两个查询）
if (startDate && endDate) {
  conditions.push(`a.ann_date BETWEEN ? AND ?`);
  annConditions.push(`a.ann_date BETWEEN ? AND ?`);
  params.push(startDate, endDate);
}

// 添加市场条件（仅适用于第一个查询）
if (market && market !== "all") {
  conditions.push(`s.market = ?`);
  params.push(market);
}

const whereClause = conditions.length > 0 ? ` WHERE ` + conditions.join(" AND ") : "";
const annWhereClause = annConditions.length > 0 ? ` WHERE ` + annConditions.join(" AND ") : "";
```

### ✅ 解决方案 2: 重复添加参数
对于 CTE 中重复使用的参数，需要再次添加到参数数组：

```typescript
// 为第二个 CTE 再次添加日期参数
if (startDate && endDate) {
  params.push(startDate, endDate);
}

params.push(limit, offset);
```

## 修复的函数

### 1. `getAnnouncementsGroupedByStock()`
- ✅ 分离 `whereClause` 和 `annWhereClause`
- ✅ 正确传递参数

### 2. `searchAnnouncementsGroupedByStock()`
- ✅ 构建独立的 `annConditions`
- ✅ 重复添加日期参数用于第二个 CTE

### 3. `getFavoriteStocksAnnouncementsGrouped()`
- ✅ 在添加 `limit, offset` 前先添加第二次日期参数

## 测试验证

### ✅ 测试场景 1: 无过滤条件
```sql
-- 参数: [limit, offset]
-- 预期: 正常返回数据 ✓
```

### ✅ 测试场景 2: 仅日期过滤
```sql
-- 参数: [startDate, endDate, startDate, endDate, limit, offset]
-- 预期: 正常返回数据 ✓
```

### ✅ 测试场景 3: 日期 + 市场过滤
```sql
-- 参数: [startDate, endDate, market, startDate, endDate, limit, offset]
-- 预期: 正常返回数据 ✓
```

### ✅ 测试场景 4: 搜索功能
```sql
-- 参数: [keyword, keyword, keyword, startDate?, endDate?, market?, startDate?, endDate?, limit, offset]
-- 预期: 正常返回数据 ✓
```

## 影响范围

### 修复前可能出现的错误:
1. ❌ `SQLITE_RANGE: column index out of range` - 参数数量不匹配
2. ❌ `SQLITE_ERROR: no such column: a.market` - 字段不存在
3. ❌ 查询返回空结果或错误数据

### 修复后:
1. ✅ 所有查询场景正常工作
2. ✅ 参数绑定正确
3. ✅ SQL 语法正确
4. ✅ 性能优化保持有效

## 代码审查要点

### ⚠️ 使用 CTE 时的注意事项:
1. **参数重复**: 如果 SQL 中多次使用相同的占位符 `?`，必须多次添加对应参数
2. **条件分离**: 不同的子查询可能需要不同的 WHERE 条件
3. **字段检查**: 确保 WHERE 条件中的字段在对应的表中存在
4. **参数顺序**: 参数必须按照 SQL 中 `?` 的出现顺序添加

### ✅ 最佳实践:
```typescript
// ✅ 好的做法
const params: any[] = [];
if (condition1) {
  params.push(value1);
}
// ... SQL with first ?
if (sameConditionInAnotherCTE) {
  params.push(value1); // 再次添加
}

// ❌ 错误做法
const params = [value1];
// ... SQL with ? used twice
// 参数不够，会出错！
```

## 相关文件

- `electron/db.ts` - 修复的数据库查询函数
- `ANNOUNCEMENT_OPTIMIZATION.md` - 性能优化文档
- `BUG_FIX_RECORD.md` - 本文档

## 版本历史

### v1.0.1 (2024-12-14)
- 🐛 修复 CTE 查询参数绑定错误
- 🐛 修复字段不存在错误
- ✅ 所有测试场景通过
- ✅ 应用运行正常

---

**修复工程师**: AI Assistant  
**验证状态**: ✅ 已验证  
**测试状态**: ✅ 已通过
