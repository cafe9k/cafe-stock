# 公告分类规则动态配置功能实现总结

## 实施日期
2025-12-16

## 功能概述

将公告打标规则从硬编码改为可动态配置，规则存储在 SQLite 数据库中，用户可以在设置页面通过高级编辑器界面管理规则，并支持按新规则重新批处理所有公告。

## 核心功能

### 1. 数据库层改造

#### 新增表结构

**分类定义表 (classification_categories)**
- 存储所有公告分类的基本信息
- 字段：id, category_key, category_name, color, icon, priority, enabled, created_at, updated_at
- 支持启用/禁用分类
- 支持调整分类优先级

**分类规则表 (classification_rules)**
- 存储每个分类的关键词规则
- 字段：id, category_key, keyword, enabled, created_at, updated_at
- 与分类表通过 category_key 关联
- 支持启用/禁用单个规则

#### 数据库迁移
- 应用启动时自动检查并创建新表
- 首次启动时自动导入默认规则
- 保留现有 announcements 表的 category 字段

#### 新增数据库函数

**规则管理函数：**
- `initializeDefaultClassificationRules()`: 初始化默认规则
- `getClassificationCategories()`: 获取所有分类
- `getClassificationRules()`: 获取所有规则
- `getClassificationRulesByCategory()`: 获取指定分类的规则
- `updateClassificationCategory()`: 更新分类信息
- `addClassificationRule()`: 添加规则
- `updateClassificationRule()`: 更新规则
- `deleteClassificationRule()`: 删除规则
- `resetClassificationRules()`: 重置为默认规则
- `loadClassificationRulesFromDb()`: 从数据库加载规则

**批量打标增强：**
- `tagAnnouncementsBatch()` 新增参数：
  - `reprocessAll`: 是否重新处理所有公告（默认 false）
  - `useDbRules`: 是否使用数据库规则（默认 true）

### 2. 分类引擎重构

#### 文件：`src/utils/announcementClassifier.ts`

**新增导出：**
- `ClassificationRule` 接口（导出为 public）
- `DEFAULT_CLASSIFICATION_RULES` 常量（默认规则）
- `classifyAnnouncementWithRules()` 函数（支持自定义规则）

**保留兼容性：**
- 原有 `classifyAnnouncement()` 函数保持不变
- 内部调用新的 `classifyAnnouncementWithRules()` 函数

### 3. IPC 通信接口

#### 主进程 (electron/main.ts)

**新增 IPC 处理器：**
- `get-classification-categories`: 获取所有分类
- `get-classification-rules`: 获取所有规则
- `get-classification-rules-by-category`: 获取指定分类的规则
- `update-classification-category`: 更新分类信息
- `add-classification-rule`: 添加规则
- `update-classification-rule`: 更新规则
- `delete-classification-rule`: 删除规则
- `reset-classification-rules`: 重置为默认规则
- `reprocess-all-announcements`: 重新处理所有公告

**修改现有处理器：**
- `tag-all-announcements`: 新增 `reprocessAll` 参数

#### 预加载脚本 (electron/preload.ts)

暴露所有新增的 IPC 接口到渲染进程。

### 4. TypeScript 类型定义

#### 文件：`src/electron.d.ts`

**新增类型：**
```typescript
interface ClassificationCategory {
  id: number;
  category_key: string;
  category_name: string;
  color: string;
  icon: string;
  priority: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface ClassificationRuleItem {
  id: number;
  category_key: string;
  keyword: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}
```

**更新 ElectronAPI 接口：**
添加所有规则管理相关的方法定义。

### 5. 规则编辑器组件

#### 文件：`src/components/ClassificationRuleEditor.tsx`

**功能特性：**

1. **分类列表展示**
   - 使用 Collapse 组件展示所有分类
   - 每个分类显示：图标、名称、关键词数量、优先级
   - 支持折叠/展开查看详情

2. **分类管理**
   - 启用/禁用分类（Switch 开关）
   - 调整优先级（上移/下移按钮）
   - 显示分类统计信息

3. **关键词管理**
   - 以 Tag 形式展示所有关键词
   - 支持添加新关键词（输入框 + 添加按钮）
   - 支持删除关键词（Tag 的关闭按钮）
   - 支持回车快捷添加

4. **批量操作**
   - 刷新规则列表
   - 重置为默认规则（带确认提示）
   - 重新打标所有公告（带确认提示和进度显示）

5. **进度反馈**
   - 实时显示重新打标进度
   - 显示已处理/总数/百分比

### 6. 设置页面集成

#### 文件：`src/pages/Settings.tsx`

**新增卡片：**
- "公告分类规则配置" 卡片
- 集成 ClassificationRuleEditor 组件
- 位于页面底部，占据整行宽度

**UI 布局：**
```
设置页面
├── 第一行
│   ├── 公告分类管理（现有）
│   └── 数据库远程访问（现有）
├── 第二行
│   └── 数据库管理（现有）
└── 第三行（新增）
    └── 公告分类规则配置
        └── ClassificationRuleEditor 组件
```

## 数据流程

```
用户操作 → 设置页面 → ClassificationRuleEditor 组件
                              ↓
                         IPC 通信
                              ↓
                         主进程处理
                              ↓
                      数据库 CRUD 操作
                              ↓
                         更新规则表
                              ↓
                    （可选）重新打标公告
                              ↓
                      使用新规则分类
                              ↓
                    更新 announcements 表
```

## 技术亮点

### 1. 规则加载机制
- 首次启动自动导入默认规则
- 规则从数据库动态加载
- 支持实时更新，无需重启应用

### 2. 性能优化
- 批量打标使用事务处理
- 分批处理（每批 1000 条）
- 实时进度反馈

### 3. 用户体验
- 直观的可视化编辑界面
- 实时预览关键词数量
- 操作前确认提示
- 进度实时显示

### 4. 数据安全
- 支持重置为默认规则
- 所有修改操作可逆
- 数据库事务保证一致性

## 兼容性

### 向后兼容
- 保留原有 `classifyAnnouncement()` 函数
- 保留 `AnnouncementCategory` 枚举
- 现有公告的分类字段不受影响

### 数据迁移
- 自动检测并创建新表
- 不影响现有数据
- 用户无感知升级

## 使用说明

### 管理分类规则

1. 打开应用，进入"设置"页面
2. 滚动到"公告分类规则配置"卡片
3. 点击分类名称展开，查看该分类的所有关键词
4. 可以进行以下操作：
   - 添加新关键词：输入关键词后点击"添加"或按回车
   - 删除关键词：点击关键词标签的关闭图标
   - 启用/禁用分类：切换分类右侧的开关
   - 调整优先级：点击上移/下移按钮

### 重新打标所有公告

1. 修改规则后，点击"重新打标所有公告"按钮
2. 确认操作提示
3. 等待处理完成（会显示实时进度）
4. 完成后所有公告将使用新规则重新分类

### 重置为默认规则

1. 点击"重置为默认"按钮
2. 确认操作提示
3. 所有自定义规则将被删除，恢复为系统默认配置

## 测试建议

1. **功能测试**
   - 添加/删除关键词
   - 启用/禁用分类
   - 调整优先级
   - 重置为默认规则
   - 重新打标所有公告

2. **性能测试**
   - 大量公告的批量打标性能
   - 规则加载速度
   - UI 响应速度

3. **边界测试**
   - 空关键词输入
   - 重复关键词
   - 并发操作
   - 数据库异常情况

## 后续优化建议

1. **功能增强**
   - 支持正则表达式规则
   - 支持规则导入/导出
   - 支持批量编辑关键词
   - 添加规则测试功能（输入标题预览分类结果）

2. **性能优化**
   - 规则缓存机制
   - 增量更新策略
   - 后台异步处理

3. **用户体验**
   - 添加规则使用统计
   - 显示每个规则的匹配数量
   - 提供规则推荐功能

## 总结

本次实现成功将公告分类规则从硬编码改为数据库动态配置，提供了完整的可视化管理界面，支持规则的增删改查和批量重新打标功能。整个实现保持了良好的向后兼容性，用户可以无缝升级使用新功能。

