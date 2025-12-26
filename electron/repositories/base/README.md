# Base Repository - 基础仓储类

**架构定位（3行）**:

-   职责：提供所有Repository的公共功能（事务、日期格式化、时间戳等）
-   依赖：better-sqlite3（SQLite数据库）
-   输出：BaseRepository抽象类，供所有Repository实现继承

⚠️ **自指声明**：一旦本文件夹有文件新增/删除/重命名，请立即更新本 README 的文件清单

---

## 文件清单

### BaseRepository.ts

-   **地位**：数据访问层基类
-   **功能**：封装通用数据库操作方法
-   **关键方法**：
    -   `transaction()` - 执行事务
    -   `getCurrentTimestamp()` - 获取当前时间戳（ISO格式）
    -   `formatDateToYYYYMMDD()` - 日期格式化
    -   `getPreviousDay()` / `getNextDay()` - 日期计算

---

**最后更新**：2025-12-26

