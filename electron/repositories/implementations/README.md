# Repository Implementations - 仓储实现

**架构定位（3行）**:

-   职责：实现具体的Repository类，封装各业务实体的数据库操作
-   依赖：BaseRepository（基类）、interfaces（接口定义）、types（实体类型）
-   输出：向services层提供数据访问实现类

⚠️ **自指声明**：一旦本文件夹有文件新增/删除/重命名，请立即更新本 README 的文件清单

---

## 文件清单

### StockRepository.ts

-   **地位**：股票数据访问实现
-   **功能**：股票表的CRUD操作、搜索、统计
-   **关键方法**：upsertStocks(), getAllStocks(), searchStocks(), countStocks()

### AnnouncementRepository.ts

-   **地位**：公告数据访问实现
-   **功能**：公告表的CRUD操作、智能分类、聚合查询
-   **关键方法**：upsertAnnouncements(), getAnnouncementsByStock(), getGroupedAnnouncements()

### HolderRepository.ts

-   **地位**：股东数据访问实现
-   **功能**：十大股东表的CRUD操作、查询
-   **关键方法**：upsertTop10Holders(), getTop10HoldersByStock()

### FavoriteRepository.ts

-   **地位**：收藏数据访问实现
-   **功能**：收藏表的CRUD操作
-   **关键方法**：addFavoriteStock(), removeFavoriteStock(), getAllFavoriteStocks()

### StockDetailRepository.ts

-   **地位**：股票详情数据访问实现
-   **功能**：股票日线指标和公司信息的CRUD操作
-   **关键方法**：upsertDailyBasic(), upsertCompanyInfo(), getDailyBasicByCode()

### ClassificationRepository.ts

-   **地位**：分类规则数据访问实现
-   **功能**：分类规则表的CRUD操作
-   **关键方法**：getClassificationCategories(), getClassificationRules(), updateRule()

### index.ts

-   **功能**：统一导出所有Repository实现类

---

**最后更新**：2025-12-26

