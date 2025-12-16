# 文件组织说明

## 📁 文档目录结构

本项目所有文档已统一整理到 `docs/` 目录中，便于管理和查阅。

### 当前文档列表

```
docs/
├── README.md                          # 文档索引（主入口）
├── overview.md                        # 项目概览
├── CLASSIFICATION_SUMMARY.md          # 公告分类方案总结
├── FEATURE_IMPLEMENTATION.md          # 功能实现文档
├── announcement-classification.md     # 公告分类详细文档
└── README-ANALYSIS.md                 # 分析工具使用说明
```

### 根目录

项目根目录只保留 `README.md` 作为项目主说明文档。

## 📝 文档规范

所有新建的 Markdown 文档必须遵循以下规范：

1. **存放位置**: 必须在 `docs/` 目录中创建
2. **命名规范**: 使用小写字母和连字符（如 `feature-name.md`）
3. **文档索引**: 重要文档需在 `docs/README.md` 中添加链接

详细规范请参考：`.cursor/rules/documentation.mdc`

## 🔄 文件移动记录

### 2025-12-16
- ✅ 将 `CLASSIFICATION_SUMMARY.md` 移至 `docs/`
- ✅ 将 `FEATURE_IMPLEMENTATION.md` 移至 `docs/`
- ✅ 将 `scripts/README-ANALYSIS.md` 移至 `docs/`
- ✅ 创建 `.cursor/rules/documentation.mdc` 规范文件
- ✅ 更新 `docs/README.md` 文档索引

## 🎯 规则约束

已在 `.cursor/rules/documentation.mdc` 中设置规则，AI 助手在后续工作中会：

- ✅ 自动将新文档创建在 `docs/` 目录
- ✅ 遵循文档命名规范
- ✅ 保持文档结构清晰

## 📚 查看文档

访问 [docs/README.md](./README.md) 查看完整的文档导航。

---

**最后更新**: 2025-12-16  
**维护者**: 项目团队

