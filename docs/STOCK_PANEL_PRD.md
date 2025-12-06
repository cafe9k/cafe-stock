# 📊 个人股票关注面板 - 产品需求文档（PRD）

## 一、项目概述

### 1.1 项目信息
- **项目名称**：Stock Watchlist Panel（股票关注面板）
- **技术栈**：React + TypeScript + Vite + Supabase
- **数据源**：Tushare Pro API（5000 积分，全功能可用）
- **数据类型**：盘后数据（非实时）

### 1.2 核心价值
为个人投资者提供一站式的股票关注列表管理和重要信息聚合面板，帮助用户：
- 集中管理自选股
- 快速获取关注股票的行情概览
- 及时发现重要市场信号（龙虎榜、大宗交易、股东变动等）
- 跨设备同步，随时随地查看

---

## 二、用户故事

### 2.1 核心场景
1. **作为投资者**，我想要添加关注的股票，以便集中追踪
2. **作为投资者**，我想要看到关注股票的最新行情，以便了解持仓表现
3. **作为投资者**，我想要收到重要消息提醒（龙虎榜、大宗交易等），以便及时做出决策
4. **作为投资者**，我想要在手机和电脑上都能访问我的关注列表

---

## 三、功能规格

### 3.1 用户认证模块

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 邮箱注册/登录 | 支持邮箱 + 密码注册登录 | P0 |
| 第三方登录 | GitHub OAuth 登录（可选） | P2 |
| 会话管理 | 自动刷新 Token，保持登录状态 | P0 |
| 登出 | 安全退出登录 | P0 |

### 3.2 自选股管理模块

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 搜索添加 | 输入代码或名称模糊搜索，选择添加 | P0 |
| 删除关注 | 从列表中移除股票 | P0 |
| 分组管理 | 创建/编辑/删除分组（如：重仓、观察、短线） | P1 |
| 排序 | 按涨跌幅、成交量、自定义顺序排序 | P1 |
| 批量操作 | 批量添加/删除/移动分组 | P2 |
| 关注上限 | 最多 100 只股票 | - |

### 3.3 行情概览模块

每只关注股票显示：

| 数据项 | 来源接口 | 优先级 |
|--------|----------|--------|
| 股票代码/名称 | stock_basic | P0 |
| 最新收盘价 | daily | P0 |
| 涨跌幅/涨跌额 | daily | P0 |
| 成交量/成交额 | daily | P0 |
| 换手率 | daily_basic | P0 |
| 市盈率(PE) | daily_basic | P1 |
| 市净率(PB) | daily_basic | P1 |
| 总市值 | daily_basic | P1 |
| 52周最高/最低 | 计算或 stk_factor | P2 |
| 年初至今涨幅 | 计算 | P2 |

### 3.4 重要消息模块

#### 🔴 高优先级消息（P0）

| 消息类型 | 来源接口 | 触发条件 | 积分要求 |
|----------|----------|----------|----------|
| **龙虎榜** | top_list | 关注股上榜 | 300 |
| **大宗交易** | block_trade | 发生大宗交易 | 300 |
| **股东增减持** | stk_holdertrade | 重要股东买卖 | 300 |
| **限售股解禁** | share_float | 7天内有解禁 | 120 |
| **停复牌** | suspend_d | 股票停牌 | 120 |
| **涨跌停** | stk_limit / limit_list_d | 触及涨跌停 | 120 |

#### 🟡 中优先级消息（P1）

| 消息类型 | 来源接口 | 触发条件 | 积分要求 |
|----------|----------|----------|----------|
| **业绩预告** | forecast | 发布业绩预告 | 120 |
| **业绩快报** | express | 发布业绩快报 | 120 |
| **分红送股** | dividend | 公布分红方案 | 120 |
| **资金流向** | moneyflow | 主力大幅流入/流出 | 2000 |
| **融资融券** | margin | 融资余额大幅变化 | 120 |

#### 🟢 低优先级消息（P2）

| 消息类型 | 来源接口 | 触发条件 | 积分要求 |
|----------|----------|----------|----------|
| **股东人数** | stk_holdernumber | 股东人数大幅变化 | 120 |
| **十大股东变动** | top10_holders | 机构进出 | 120 |
| **股权质押** | pledge_stat | 质押比例变化 | 120 |
| **概念题材** | concept_detail | 所属概念异动 | 120 |

### 3.5 数据仪表盘模块（P1）

| 功能 | 描述 |
|------|------|
| 关注股涨跌统计 | 今日上涨/下跌/平盘数量 |
| 行业分布 | 关注股的行业分布饼图 |
| 消息统计 | 近7天重要消息数量趋势 |
| 市场情绪 | 涨跌停家数、龙虎榜统计 |

### 3.6 技术指标模块（P2）

| 指标 | 来源接口 | 积分要求 |
|------|----------|----------|
| MACD | stk_factor / 自行计算 | 2000 |
| KDJ | stk_factor / 自行计算 | 2000 |
| RSI | stk_factor / 自行计算 | 2000 |
| 布林带 | stk_factor / 自行计算 | 2000 |

---

## 四、数据库设计

### 4.1 ER 图

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   users     │       │  watch_groups   │       │  watch_stocks   │
│  (Supabase  │──────<│                 │>──────│                 │
│   Auth)     │       │                 │       │                 │
└─────────────┘       └─────────────────┘       └─────────────────┘
                                                        │
                                                        │
                                               ┌────────┴────────┐
                                               │  stock_alerts   │
                                               │   (消息记录)     │
                                               └─────────────────┘
```

### 4.2 表结构设计

#### 表1: watch_groups（关注分组）

```sql
CREATE TABLE watch_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    sort_order INT DEFAULT 0,
    color VARCHAR(7),  -- 分组颜色，如 #FF5733
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, name)
);

-- 默认分组
-- 每个用户注册时自动创建 "默认分组"
```

#### 表2: watch_stocks（关注股票）

```sql
CREATE TABLE watch_stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES watch_groups(id) ON DELETE SET NULL,
    ts_code VARCHAR(20) NOT NULL,      -- 股票代码，如 000001.SZ
    name VARCHAR(50),                   -- 股票名称（冗余，方便查询）
    sort_order INT DEFAULT 0,
    notes TEXT,                         -- 用户备注
    target_price DECIMAL(10,2),         -- 目标价（可选）
    cost_price DECIMAL(10,2),           -- 成本价（可选）
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, ts_code)
);

-- 索引
CREATE INDEX idx_watch_stocks_user_id ON watch_stocks(user_id);
CREATE INDEX idx_watch_stocks_ts_code ON watch_stocks(ts_code);
```

#### 表3: stock_alerts（消息记录/已读状态）

```sql
CREATE TABLE stock_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ts_code VARCHAR(20) NOT NULL,
    alert_type VARCHAR(30) NOT NULL,   -- 消息类型：top_list, block_trade, etc.
    alert_date DATE NOT NULL,          -- 消息日期
    title VARCHAR(200) NOT NULL,       -- 消息标题
    content JSONB,                     -- 消息详情（JSON 格式）
    priority INT DEFAULT 2,            -- 1:高 2:中 3:低
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, ts_code, alert_type, alert_date)
);

-- 索引
CREATE INDEX idx_stock_alerts_user_date ON stock_alerts(user_id, alert_date DESC);
CREATE INDEX idx_stock_alerts_unread ON stock_alerts(user_id, is_read) WHERE is_read = FALSE;
```

#### 表4: user_settings（用户设置）

```sql
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme VARCHAR(10) DEFAULT 'dark',           -- dark / light
    color_scheme VARCHAR(10) DEFAULT 'cn',      -- cn(涨红跌绿) / us(涨绿跌红)
    alert_types JSONB DEFAULT '["top_list", "block_trade", "suspend_d"]',  -- 开启的消息类型
    refresh_interval INT DEFAULT 5,             -- 刷新间隔（分钟）
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 RLS 策略（行级安全）

```sql
-- 启用 RLS
ALTER TABLE watch_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- watch_groups 策略
CREATE POLICY "Users can CRUD own groups" ON watch_groups
    FOR ALL USING (auth.uid() = user_id);

-- watch_stocks 策略
CREATE POLICY "Users can CRUD own stocks" ON watch_stocks
    FOR ALL USING (auth.uid() = user_id);

-- stock_alerts 策略
CREATE POLICY "Users can read own alerts" ON stock_alerts
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON stock_alerts
    FOR UPDATE USING (auth.uid() = user_id);

-- user_settings 策略
CREATE POLICY "Users can CRUD own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);
```

---

## 五、API 设计

### 5.1 数据获取策略

```typescript
// 批量获取关注股票行情
// 1. 获取用户关注的股票列表
// 2. 批量调用 daily + daily_basic 接口
// 3. 合并数据返回

interface StockQuote {
    ts_code: string
    name: string
    close: number         // 收盘价
    change: number        // 涨跌额
    pct_chg: number       // 涨跌幅
    vol: number           // 成交量（手）
    amount: number        // 成交额（千元）
    turnover_rate: number // 换手率
    pe: number            // 市盈率
    pb: number            // 市净率
    total_mv: number      // 总市值（万元）
    trade_date: string    // 交易日期
}
```

### 5.2 消息扫描策略

```typescript
// 每日盘后执行一次消息扫描
// 1. 获取用户关注股票列表
// 2. 批量查询各类消息接口
// 3. 筛选匹配的消息
// 4. 写入 stock_alerts 表

async function scanAlerts(userId: string, watchList: string[]) {
    const today = formatDate(new Date()) // YYYYMMDD
    
    // 并行查询多个消息源
    const [topList, blockTrade, suspend, ...] = await Promise.all([
        tushareClient.query('top_list', { trade_date: today }),
        tushareClient.query('block_trade', { trade_date: today }),
        tushareClient.query('suspend_d', { suspend_type: 'S', trade_date: today }),
        // ...其他接口
    ])
    
    // 筛选关注股票的消息
    const alerts = filterAlerts(watchList, { topList, blockTrade, suspend })
    
    // 批量写入数据库
    await saveAlerts(userId, alerts)
}
```

---

## 六、UI 设计规范

### 6.1 整体布局

```
┌────────────────────────────────────────────────────────────────┐
│  HEADER: Logo + 用户头像 + 设置                                 │
├────────────────────────────────────────────────────────────────┤
│  📢 重要消息横幅（未读消息滚动展示）                              │
├─────────────────┬──────────────────────────────────────────────┤
│                 │                                              │
│   📂 分组列表    │   📊 股票卡片网格                             │
│   ├─ 全部 (15)  │   ┌──────┐ ┌──────┐ ┌──────┐               │
│   ├─ 重仓 (5)   │   │000001│ │600519│ │300750│               │
│   ├─ 观察 (8)   │   │平安银行│ │贵州茅台│ │宁德时代│             │
│   └─ 短线 (2)   │   │+2.35%│ │-1.28%│ │+0.56%│               │
│                 │   └──────┘ └──────┘ └──────┘               │
│   [+ 新建分组]  │                                              │
│                 │   点击卡片展开详情 ↓                          │
│                 ├──────────────────────────────────────────────┤
│                 │   📈 详情面板                                 │
│                 │   • 行情数据表格                              │
│                 │   • K线缩略图                                 │
│                 │   • 相关消息时间线                            │
│                 │   • 技术指标信号                              │
└─────────────────┴──────────────────────────────────────────────┘
```

### 6.2 配色方案（深色主题）

```css
:root {
    /* 背景色 */
    --bg-primary: #0d1117;      /* 主背景 */
    --bg-secondary: #161b22;    /* 卡片背景 */
    --bg-tertiary: #21262d;     /* 悬浮/选中背景 */
    
    /* 文字色 */
    --text-primary: #e6edf3;    /* 主文字 */
    --text-secondary: #8b949e;  /* 次要文字 */
    --text-muted: #484f58;      /* 弱化文字 */
    
    /* 涨跌色（中国市场风格） */
    --color-up: #f85149;        /* 上涨 - 红色 */
    --color-down: #3fb950;      /* 下跌 - 绿色 */
    --color-flat: #8b949e;      /* 平盘 - 灰色 */
    
    /* 强调色 */
    --accent-primary: #58a6ff;  /* 主强调色 */
    --accent-warning: #d29922;  /* 警告色 */
    --accent-danger: #f85149;   /* 危险色 */
    
    /* 消息优先级颜色 */
    --alert-high: #f85149;      /* 高优先级 */
    --alert-medium: #d29922;    /* 中优先级 */
    --alert-low: #8b949e;       /* 低优先级 */
}
```

### 6.3 字体规范

```css
/* 主字体 - 数字显示 */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* 正文字体 */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* 中文字体 */
--font-cn: 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

### 6.4 股票卡片设计

```
┌─────────────────────────────────┐
│  000001.SZ          📌 重仓     │  ← 代码 + 分组标签
│  平安银行                        │  ← 股票名称
│                                 │
│  ¥12.35            +0.28       │  ← 价格 + 涨跌额
│  +2.32%            ████▓░░░░   │  ← 涨跌幅 + 成交量柱
│                                 │
│  量:125万  额:1.5亿  换:0.85%   │  ← 关键指标
│─────────────────────────────────│
│  🔴 今日上龙虎榜                 │  ← 重要消息提示
└─────────────────────────────────┘
```

### 6.5 响应式断点

```css
/* 移动端 */
@media (max-width: 640px) {
    /* 单列卡片布局 */
}

/* 平板 */
@media (min-width: 641px) and (max-width: 1024px) {
    /* 2列卡片布局，侧边栏可收起 */
}

/* 桌面 */
@media (min-width: 1025px) {
    /* 3-4列卡片布局，侧边栏常驻 */
}
```

---

## 七、开发计划

### Phase 1: 基础框架（预计 2 天）

- [ ] 配置 Supabase Auth（邮箱登录）
- [ ] 创建数据库表和 RLS 策略
- [ ] 登录/注册页面
- [ ] 基础布局组件

### Phase 2: 自选股管理（预计 2 天）

- [ ] 股票搜索组件（调用 stock_basic）
- [ ] 添加/删除关注股票
- [ ] 分组管理 CRUD
- [ ] 关注列表展示

### Phase 3: 行情展示（预计 2 天）

- [ ] 股票卡片组件
- [ ] 批量行情数据获取
- [ ] 数据自动刷新
- [ ] 排序和筛选

### Phase 4: 消息系统（预计 3 天）

- [ ] 消息扫描服务
- [ ] 消息列表展示
- [ ] 未读消息提示
- [ ] 消息详情面板

### Phase 5: 优化完善（预计 2 天）

- [ ] 详情面板（K线、技术指标）
- [ ] 用户设置页面
- [ ] 性能优化（缓存、懒加载）
- [ ] 移动端适配

---

## 八、技术实现要点

### 8.1 Tushare API 调用优化

```typescript
// 使用 Promise.all 并行请求
// 合并同类型请求，减少 API 调用次数

// 示例：批量获取多只股票的日线数据
// 方式1（低效）：每只股票单独请求
// 方式2（高效）：使用 trade_date 参数一次获取所有股票当日数据

const dailyData = await tushareClient.query('daily', {
    trade_date: today  // 获取当日所有股票数据
}, ['ts_code', 'close', 'change', 'pct_chg', 'vol', 'amount'])

// 然后在前端筛选关注的股票
const watchListData = dailyData.filter(d => watchCodes.includes(d.ts_code))
```

### 8.2 数据缓存策略

```typescript
// 使用 React Query 或 SWR 进行数据缓存
// 盘后数据可以缓存较长时间

const { data, isLoading } = useQuery({
    queryKey: ['daily', today],
    queryFn: () => fetchDailyData(today),
    staleTime: 1000 * 60 * 30,  // 30分钟内不重新请求
    cacheTime: 1000 * 60 * 60,  // 缓存1小时
})
```

### 8.3 消息扫描时机

```typescript
// 推荐在以下时机执行消息扫描：
// 1. 用户登录时
// 2. 用户主动刷新时
// 3. 盘后自动扫描（通过 Supabase Edge Function 定时任务）

// Edge Function 定时任务（每日 17:00 执行）
// 遍历所有用户的关注列表，生成消息
```

---

## 九、验收标准

### 9.1 功能验收

- [ ] 用户可以注册、登录、登出
- [ ] 用户可以添加、删除关注股票
- [ ] 用户可以创建、编辑、删除分组
- [ ] 股票卡片正确显示行情数据
- [ ] 消息系统正确识别并展示重要消息
- [ ] 跨设备数据同步正常

### 9.2 性能验收

- [ ] 首屏加载 < 3秒
- [ ] 行情刷新 < 2秒
- [ ] 支持 100 只关注股票不卡顿

### 9.3 兼容性验收

- [ ] Chrome/Safari/Firefox 最新版
- [ ] iOS Safari / Android Chrome
- [ ] 响应式布局正常

---

## 十、附录

### A. Tushare 接口积分要求速查

| 接口 | 积分 | 用途 |
|------|------|------|
| stock_basic | 120 | 股票列表/搜索 |
| daily | 120 | 日线行情 |
| daily_basic | 120 | 每日指标 |
| top_list | 300 | 龙虎榜 |
| block_trade | 300 | 大宗交易 |
| stk_holdertrade | 300 | 股东增减持 |
| moneyflow | 2000 | 资金流向 |
| stk_factor | 2000 | 技术因子 |
| stk_mins | 5000 | 分钟行情 |

### B. 日期格式规范

- Tushare API：`YYYYMMDD`（如 `20231231`）
- 数据库存储：`DATE` 或 `TIMESTAMPTZ`
- 前端显示：`YYYY-MM-DD` 或 `MM月DD日`

### C. 股票代码格式

| 交易所 | 后缀 | 示例 |
|--------|------|------|
| 上海 | .SH | 600000.SH |
| 深圳 | .SZ | 000001.SZ |
| 北京 | .BJ | 430047.BJ |

---

*文档版本：v1.0*  
*创建日期：2024-12-06*  
*最后更新：2024-12-06*

