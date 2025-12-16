# UI 改进日志

## 2025-12-16

### 公告列表操作栏布局优化

#### 最新布局（第二次优化）
将所有筛选和操作按钮整合到更紧凑的布局：

**第一行：**
- 搜索框（股票名称或代码）

**第二行：**
- 关注按钮（切换"仅关注"模式）
- 时间选择器（下拉选择）
- 市场选择器（下拉选择）
- 刷新按钮

**优势：**
- ✅ 所有筛选控件在同一行，操作更便捷
- ✅ 搜索框独占一行，更突出
- ✅ 布局更紧凑，节省垂直空间
- ✅ 逻辑分组清晰：搜索 vs 筛选/操作

### 公告列表时间选择器改进

#### 改动内容
将公告列表的时间选择器从 **Radio 按钮组 + 日期范围选择器** 改为 **下拉选择器（Select）**。

#### 改动前
- 使用 `Radio.Group` 显示时间选项（今天、昨天、最近一周、最近一个月、最近三个月）
- 使用 `RangePicker` 支持自定义日期范围
- 占用较多水平空间

#### 改动后
- 使用 `Select` 下拉选择器显示时间选项
- 移除了 `RangePicker`（日期范围选择器）
- 界面更加简洁紧凑
- 图标使用 `ClockCircleOutlined` 表示时间选择

#### 时间选项
- **今天**：当天的公告
- **昨天**：昨天的公告
- **最近一周**：最近 7 天的公告（默认）
- **最近一个月**：最近 30 天的公告
- **最近三个月**：最近 90 天的公告

#### 修改的文件
- `src/components/AnnouncementList.tsx`
  - 移除 `DatePicker`、`Radio` 导入
  - 移除 `RangePicker`、`CalendarOutlined` 使用
  - 添加 `ClockCircleOutlined` 图标
  - 将 `Radio.Group` 改为 `Select`
  - 简化操作栏布局

#### 技术细节

**导入变化：**
```typescript
// 移除
import { DatePicker, Radio } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;

// 添加
import { ClockCircleOutlined } from "@ant-design/icons";
```

**组件变化：**
```typescript
// 改动前
<Radio.Group 
  value={filter.quickSelectValue} 
  onChange={(e) => filter.handleQuickSelect(e.target.value)} 
  buttonStyle="solid" 
  size="middle"
>
  <Radio.Button value="today">今天</Radio.Button>
  <Radio.Button value="yesterday">昨天</Radio.Button>
  <Radio.Button value="week">最近一周</Radio.Button>
  <Radio.Button value="month">最近一个月</Radio.Button>
  <Radio.Button value="quarter">最近三个月</Radio.Button>
</Radio.Group>

<RangePicker
  value={filter.dateRangeDisplay}
  onChange={filter.handleDateRangeChange}
  format="YYYY-MM-DD"
  placeholder={["开始日期", "结束日期"]}
  style={{ width: 240, minWidth: 240 }}
  allowClear
  suffixIcon={<CalendarOutlined />}
/>

// 改动后
<Select
  value={filter.quickSelectValue}
  onChange={filter.handleQuickSelect}
  style={{ width: 150 }}
  suffixIcon={<ClockCircleOutlined />}
  options={[
    { value: "today", label: "今天" },
    { value: "yesterday", label: "昨天" },
    { value: "week", label: "最近一周" },
    { value: "month", label: "最近一个月" },
    { value: "quarter", label: "最近三个月" },
  ]}
/>
```

#### 优势
1. **界面更简洁**：减少了组件数量，界面更加清爽
2. **节省空间**：下拉选择器占用空间更小
3. **操作更简单**：一个组件完成时间选择，无需在多个组件间切换
4. **保持功能**：所有原有的时间选择功能都保留

#### 注意事项
- 移除了自定义日期范围功能（`RangePicker`）
- 如果未来需要自定义日期范围，可以考虑：
  - 在 Select 中添加"自定义"选项，点击后弹出日期选择器
  - 或者保留一个独立的日期范围选择按钮

#### 相关 Hook
- `useStockFilter` Hook 保持不变，仍然支持所有时间选择逻辑
- `handleQuickSelect` 方法继续处理时间选择
- `quickSelectValue` 状态管理当前选中的时间范围

#### 测试验证
✅ 应用已成功启动
✅ 时间选择器显示正常
✅ 所有时间选项功能正常
✅ 默认选择"最近一周"
✅ 切换时间范围后数据正确刷新

