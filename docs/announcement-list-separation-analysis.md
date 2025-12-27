# 公告列表页关注点分离分析

## 📊 当前状态评估

### ✅ 已遵守关注点分离的部分

1. **数据加载逻辑** ✅
   - 使用 `useStockList` Hook 管理数据加载和分页
   - 使用 `useStockFilter` Hook 管理基础筛选条件

2. **组件复用** ✅
   - 使用 `StockList` 组件渲染表格，避免重复代码

3. **类型定义** ✅
   - `Announcement` 接口定义清晰
   - 使用 TypeScript 类型系统

---

## ❌ 违反关注点分离的问题

### 🔴 问题 1: 搜索历史管理逻辑混在组件中

**位置**: `AnnouncementList.tsx` 第 59-68, 199-244 行

**问题代码**:
```typescript
// 搜索历史状态
const [searchHistory, setSearchHistory] = useState<string[]>(() => {
  // 从 localStorage 加载搜索历史
  try {
    const saved = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

// 搜索功能（立即执行，用于回车或点击搜索按钮）
const handleSearch = async (value: string) => {
  // ... 保存到搜索历史（非空且不重复）
  if (trimmedValue && !searchHistory.includes(trimmedValue)) {
    const newHistory = [trimmedValue, ...searchHistory].slice(0, MAX_SEARCH_HISTORY);
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  }
};
```

**问题**:
- ❌ localStorage 操作直接写在组件中
- ❌ 搜索历史逻辑与 UI 渲染耦合
- ❌ 无法在其他组件复用

**改进方案**: 提取到 `useSearchHistory` Hook

---

### 🔴 问题 2: 防抖逻辑混在组件中

**位置**: `AnnouncementList.tsx` 第 44-46, 178-196 行

**问题代码**:
```typescript
const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

// 搜索防抖：输入停止 500ms 后执行搜索
useEffect(() => {
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }
  debounceTimerRef.current = setTimeout(() => {
    setDebouncedSearchKeyword(searchKeyword);
  }, 500);
  return () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };
}, [searchKeyword]);
```

**问题**:
- ❌ 防抖逻辑与组件耦合
- ❌ 硬编码 500ms 延迟
- ❌ 无法在其他搜索场景复用

**改进方案**: 提取到 `useDebounce` Hook

---

### 🔴 问题 3: 市值筛选逻辑未整合到 Hook

**位置**: `AnnouncementList.tsx` 第 54-57, 88-113 行

**问题代码**:
```typescript
// 市值筛选状态
const [marketCapFilter, setMarketCapFilter] = useState<string>("all");
const [customMarketCapMin, setCustomMarketCapMin] = useState<number | null>(null);
const [customMarketCapMax, setCustomMarketCapMax] = useState<number | null>(null);

// 构建完整的筛选条件
const currentFilter = useMemo<StockFilter>(() => {
  const baseFilter = filter.getFilter();
  
  // 构建市值筛选范围
  let marketCapRange: { min?: number; max?: number } | undefined;
  if (marketCapFilter === "< 30") {
    marketCapRange = { max: 30 };
  } else if (marketCapFilter === "< 50") {
    marketCapRange = { max: 50 };
  } // ...
  
  return {
    ...baseFilter,
    marketCapRange,
    // ...
  };
}, [filter, marketCapFilter, customMarketCapMin, customMarketCapMax]);
```

**问题**:
- ❌ 市值筛选状态分散在组件中
- ❌ 市值范围转换逻辑在组件中
- ❌ `useStockFilter` Hook 不包含市值筛选

**改进方案**: 将市值筛选整合到 `useStockFilter` Hook

---

### 🔴 问题 4: 分类筛选状态未整合到 Hook

**位置**: `AnnouncementList.tsx` 第 52, 111, 364-367 行

**问题代码**:
```typescript
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

// 在筛选条件中
categories: selectedCategories.length > 0 ? selectedCategories : undefined,

// 在展开行中应用分类过滤
const filteredAnnouncements =
  selectedCategories.length > 0
    ? allAnnouncements.filter((ann) => ann.category && selectedCategories.includes(ann.category))
    : allAnnouncements;
```

**问题**:
- ❌ 分类筛选状态在组件中
- ❌ 前端和后端都有分类筛选逻辑，职责不清
- ❌ 展开行的分类筛选逻辑重复

**改进方案**: 将分类筛选整合到 `useStockFilter` Hook

---

### 🔴 问题 5: 展开行状态管理逻辑复杂

**位置**: `AnnouncementList.tsx` 第 47-50, 148-176, 357-465 行

**问题代码**:
```typescript
const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
const [expandedData, setExpandedData] = useState<Record<string, Announcement[]>>({});
const [companyInfoData, setCompanyInfoData] = useState<Record<string, any>>({});
const [loadingExpanded, setLoadingExpanded] = useState<Record<string, boolean>>({});
const [expandedPageMap, setExpandedPageMap] = useState<Record<string, number>>({});

// 展开行时加载该股票的公告
const onExpand = async (expanded: boolean, record: StockGroup) => {
  if (expanded && !expandedData[record.ts_code]) {
    setLoadingExpanded((prev) => ({ ...prev, [record.ts_code]: true }));
    try {
      const announcements = await window.electronAPI.getStockAnnouncements(/* ... */);
      setExpandedData((prev) => ({ ...prev, [record.ts_code]: announcements }));
      setExpandedPageMap((prev) => ({ ...prev, [record.ts_code]: 1 }));
    } catch (err: any) {
      message.error("加载公告失败");
    } finally {
      setLoadingExpanded((prev) => ({ ...prev, [record.ts_code]: false }));
    }
  }
};
```

**问题**:
- ❌ 展开行状态管理复杂（5 个状态）
- ❌ 数据加载逻辑在组件中
- ❌ IPC 调用直接写在组件中
- ❌ 错误处理在组件中

**改进方案**: 提取到 `useExpandedRows` Hook

---

### 🔴 问题 6: PDF 预览逻辑在组件中

**位置**: `AnnouncementList.tsx` 第 264-299 行

**问题代码**:
```typescript
const handlePdfPreview = async (announcement: Announcement) => {
  try {
    message.loading({ content: "正在获取公告链接...", key: "pdf-loading" });
    
    // 调用 Electron API 获取 PDF URL
    const result = await window.electronAPI.getAnnouncementPdf(/* ... */);
    
    message.destroy("pdf-loading");
    
    if (result.success && result.url) {
      const openResult = await window.electronAPI.openExternal(result.url);
      if (openResult.success) {
        message.success("已在浏览器中打开公告");
      } else {
        message.error((openResult as any).error || "打开浏览器失败");
      }
    } else {
      message.warning(result.message || "该公告暂无 PDF 文件");
    }
  } catch (error: any) {
    message.destroy("pdf-loading");
    message.error("打开公告失败，请稍后重试");
  }
};
```

**问题**:
- ❌ IPC 调用直接写在组件中
- ❌ 错误处理和消息提示在组件中
- ❌ 业务逻辑与 UI 耦合

**改进方案**: 提取到 Service 层或 Hook

---

### 🔴 问题 7: 筛选条件构建逻辑在组件中

**位置**: `AnnouncementList.tsx` 第 88-113 行

**问题代码**:
```typescript
const currentFilter = useMemo<StockFilter>(() => {
  const baseFilter = filter.getFilter();
  
  // 构建市值筛选范围
  let marketCapRange: { min?: number; max?: number } | undefined;
  if (marketCapFilter === "< 30") {
    marketCapRange = { max: 30 };
  } // ...
  
  return {
    ...baseFilter,
    searchKeyword: debouncedSearchKeyword.trim() || undefined,
    showFavoriteOnly,
    marketCapRange,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
  };
}, [filter, debouncedSearchKeyword, showFavoriteOnly, marketCapFilter, ...]);
```

**问题**:
- ❌ 筛选条件构建逻辑分散
- ❌ 多个状态需要手动合并
- ❌ 职责不清：组件负责构建筛选条件

**改进方案**: 创建一个统一的筛选条件管理 Hook

---

### 🔴 问题 8: 数据更新监听逻辑在组件中

**位置**: `AnnouncementList.tsx` 第 301-320 行

**问题代码**:
```typescript
useEffect(() => {
  const unsubscribe = window.electronAPI.onDataUpdated((data) => {
    if (data.type === "incremental") {
      if (page === 1 && !searchKeyword) {
        refresh();
      }
    } else if (data.type === "historical") {
      setLoadingHistory(true);
    }
  });
  
  return () => {
    unsubscribe();
  };
}, [page, searchKeyword, refresh]);
```

**问题**:
- ❌ 数据更新监听逻辑在组件中
- ❌ 业务规则（何时刷新）在组件中
- ❌ 无法在其他组件复用

**改进方案**: 提取到 `useDataUpdateListener` Hook

---

### 🔴 问题 9: 样式定义混在组件中

**位置**: `AnnouncementList.tsx` 第 475-490 行

**问题代码**:
```typescript
<style>
  {`
    .favorite-stock-row > td {
      background-color: #e6f7ff !important;
    }
    // ... 更多样式
  `}
</style>
```

**问题**:
- ❌ CSS 样式写在 JSX 中
- ❌ 样式与逻辑耦合
- ❌ 难以维护和复用

**改进方案**: 提取到独立的 CSS 模块或 styled-components

---

### 🔴 问题 10: 展开行渲染逻辑复杂

**位置**: `AnnouncementList.tsx` 第 357-465 行

**问题代码**:
```typescript
const expandedRowRender = (record: StockGroup) => {
  const allAnnouncements = expandedData[record.ts_code] || [];
  const companyInfo = companyInfoData[record.ts_code];
  const loading = loadingExpanded[record.ts_code] || false;
  const currentPage = expandedPageMap[record.ts_code] || 1;
  
  // 应用分类过滤
  const filteredAnnouncements = /* ... */;
  
  return (
    <div>
      {/* 100+ 行的 JSX */}
    </div>
  );
};
```

**问题**:
- ❌ 展开行渲染逻辑超过 100 行
- ❌ 数据过滤逻辑在渲染函数中
- ❌ 应该拆分为独立组件

**改进方案**: 提取到 `ExpandedRowContent` 组件

---

## 🎯 改进方案总结

### 优先级 P0（高优先级 - 立即改进）

1. **提取搜索历史管理** → `useSearchHistory` Hook
2. **提取防抖逻辑** → `useDebounce` Hook
3. **提取展开行管理** → `useExpandedRows` Hook
4. **提取 PDF 预览** → `useAnnouncementPdf` Hook 或 Service

### 优先级 P1（中优先级 - 近期改进）

5. **整合市值筛选** → 扩展 `useStockFilter` Hook
6. **整合分类筛选** → 扩展 `useStockFilter` Hook
7. **统一筛选条件构建** → 创建 `useAnnouncementFilter` Hook
8. **提取数据更新监听** → `useDataUpdateListener` Hook

### 优先级 P2（低优先级 - 长期优化）

9. **拆分展开行组件** → `ExpandedRowContent` 组件
10. **提取样式** → CSS 模块或 styled-components

---

## 📋 改进后的架构

```
AnnouncementList.tsx (UI 层)
  ├── useStockList (数据加载)
  ├── useAnnouncementFilter (统一筛选条件管理)
  │   ├── useStockFilter (基础筛选)
  │   ├── useMarketCapFilter (市值筛选)
  │   └── useCategoryFilter (分类筛选)
  ├── useSearchHistory (搜索历史)
  ├── useDebounce (防抖)
  ├── useExpandedRows (展开行管理)
  ├── useAnnouncementPdf (PDF 预览)
  ├── useDataUpdateListener (数据更新监听)
  └── ExpandedRowContent (展开行组件)
```

---

## 💡 改进收益

### 代码质量提升

- ✅ **组件代码减少 60%+**：从 784 行减少到约 300 行
- ✅ **可测试性提升**：每个 Hook 可独立测试
- ✅ **可复用性提升**：Hook 可在其他组件复用
- ✅ **可维护性提升**：职责清晰，修改影响范围小

### 开发效率提升

- ✅ **新功能开发更快**：复用现有 Hook
- ✅ **Bug 定位更快**：职责清晰，问题定位准确
- ✅ **代码审查更容易**：结构清晰，易于理解

---

## 🚀 实施建议

### 阶段 1: 提取独立功能（1-2 天）
1. 提取 `useSearchHistory` Hook
2. 提取 `useDebounce` Hook
3. 提取 `useAnnouncementPdf` Hook

### 阶段 2: 整合筛选逻辑（2-3 天）
4. 扩展 `useStockFilter` 支持市值和分类
5. 创建 `useAnnouncementFilter` 统一管理

### 阶段 3: 优化展开行（1-2 天）
6. 提取 `useExpandedRows` Hook
7. 拆分 `ExpandedRowContent` 组件

### 阶段 4: 样式和监听（1 天）
8. 提取样式到 CSS 模块
9. 提取数据更新监听

**总计**: 约 5-8 天工作量

---

## 📝 总结

当前 `AnnouncementList.tsx` 组件虽然已经使用了 `useStockList` 和 `useStockFilter`，但仍有大量业务逻辑混在组件中，**违反了关注点分离原则**。

主要问题：
- 🔴 **10 个违反关注点分离的问题**
- 🔴 **组件代码 784 行，过于庞大**
- 🔴 **业务逻辑与 UI 耦合严重**

通过系统性的重构，可以将组件代码减少到约 300 行，大幅提升代码质量和可维护性。

