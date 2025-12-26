# 分形文档结构使用指南

本文档说明如何使用和维护项目的分形文档结构。

---

## 快速开始

### 验证文档完整性

运行验证工具检查所有模块的文档完整性：

```bash
node scripts/validate-fractal-docs.cjs
```

### 安装 Git Hooks

安装 Git hooks 后，每次提交前会自动验证文档：

```bash
bash scripts/install-git-hooks.sh
```

---

## 文档结构规范

### 文件层注释头

每个 `.ts/.tsx` 文件开头应包含标准注释：

```typescript
/**
 * INPUT: [依赖的外部模块/API/数据源]
 * OUTPUT: [对外提供的函数/类/接口]
 * POS: [在系统中的角色定位]
 * 
 * ⚠️ 更新提醒：修改此文件后，请同步更新：
 *    1. 本文件开头的 INPUT/OUTPUT/POS 注释
 *    2. 所在目录的 README.md 中的文件列表
 *    3. 如影响架构，更新 README.md 和 docs/architecture-fractal.md
 */
```

### 目录层 README.md

每个代码目录应包含 `README.md`，至少包含：

1. **架构定位（3行）**：
   - 职责：[模块的核心职责]
   - 依赖：[依赖的其他模块]
   - 输出：[对外提供的能力]

2. **自指声明**：
   ```
   ⚠️ **自指声明**：一旦本文件夹有文件新增/删除/重命名，请立即更新本 README
   ```

3. **文件清单**：列出所有文件及功能说明

4. **依赖关系图**：使用 Mermaid 图表

5. **扩展指南**：如何添加新文件

---

## 开发工作流

### 修改文件时

1. 完成代码修改
2. 更新文件开头的 INPUT/OUTPUT/POS 注释（如依赖或功能有变化）
3. 如有架构影响，更新所在目录的 README.md
4. 运行验证工具确认：`node scripts/validate-fractal-docs.cjs`

### 添加新文件时

1. 创建文件时立即添加 INPUT/OUTPUT/POS 注释头
2. 更新所在目录的 README.md 文件清单
3. 运行验证工具确认

### 重构模块时

1. 更新所有相关文件的注释
2. 更新目录 README.md
3. 更新 `docs/architecture-fractal.md`
4. 运行验证工具确认

---

## Git Hooks 使用

### 安装

```bash
bash scripts/install-git-hooks.sh
```

### 工作原理

- 每次 `git commit` 前自动运行验证工具
- 如果文档不符合规范，提交会被阻止
- 查看详细报告：`cat fractal-docs-validation-report.txt`

### 跳过检查

紧急情况下可以跳过检查：

```bash
git commit --no-verify -m "紧急修复"
```

**注意**：跳过检查后，请尽快修复文档问题。

### 卸载

```bash
rm .git/hooks/pre-commit
```

---

## 验证工具功能

### 检查项

1. **文件注释头检查**：
   - 检查所有 `.ts/.tsx` 文件是否包含 INPUT/OUTPUT/POS
   - 检查是否包含更新提醒

2. **目录 README 检查**：
   - 检查每个目录是否有 README.md
   - 检查 README.md 是否包含自指声明
   - 检查 README.md 是否包含架构定位

3. **错误处理**：
   - 捕获文件读取错误
   - 生成详细的错误报告

### 报告格式

验证工具会生成：
- 控制台输出（实时反馈）
- `fractal-docs-validation-report.txt`（详细报告）

---

## 已实施模块

### Electron 主进程

- ✅ `electron/services/` - 业务逻辑层
- ✅ `electron/repositories/` - 数据访问层
- ✅ `electron/ipc/` - IPC通信层

### React 渲染进程

- ✅ `src/components/` - UI组件层
- ✅ `src/hooks/` - Hook层
- ✅ `src/pages/` - 页面层
- ✅ `src/services/` - IPC通信封装层
- ✅ `src/types/` - 类型定义层
- ✅ `src/utils/` - 工具函数层

---

## 常见问题

### Q: 验证失败怎么办？

A: 查看 `fractal-docs-validation-report.txt` 获取详细错误信息，按照修复建议更新文档。

### Q: 可以跳过 Git hooks 检查吗？

A: 可以，使用 `git commit --no-verify`，但请尽快修复文档问题。

### Q: 如何为新模块添加分形结构？

A: 参考已实施模块的 README.md，按照相同的格式创建文档。

### Q: 验证工具检查哪些目录？

A: 查看 `scripts/validate-fractal-docs.cjs` 中的 `targetDirs` 配置。

---

## 最佳实践

1. **及时更新**：修改代码时同步更新文档
2. **保持简洁**：注释和文档保持简洁明了
3. **使用工具**：定期运行验证工具检查
4. **遵循规范**：严格按照分形结构规范编写文档

---

**最后更新**：2025-12-26

