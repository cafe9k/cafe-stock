# Repository Interfaces - 仓储接口定义

**架构定位（3行）**:

-   职责：定义Repository的TypeScript接口规范，确保实现与契约一致
-   依赖：types（实体类型定义）
-   输出：向实现层提供接口契约，向调用方提供类型定义

⚠️ **自指声明**：一旦本文件夹有接口文件新增/删除/重命名，请立即更新本 README 的文件清单

---

## 文件清单

### IRepository.ts

-   **地位**：基础Repository接口（泛型）
-   **功能**：定义所有Repository的通用操作契约（CRUD）
-   **关键方法**：findById(), findAll(), insert(), update(), delete(), count()

### IStockRepository.ts

-   **地位**：股票Repository接口
-   **功能**：定义股票数据访问操作的契约
-   **关键方法**：upsertStocks(), getAllStocks(), searchStocks()

### IAnnouncementRepository.ts

-   **地位**：公告Repository接口
-   **功能**：定义公告数据访问操作的契约
-   **关键方法**：upsertAnnouncements(), getAnnouncementsByStock(), getGroupedAnnouncements()

### IHolderRepository.ts

-   **地位**：股东Repository接口
-   **功能**：定义股东数据访问操作的契约
-   **关键方法**：upsertTop10Holders(), getTop10HoldersByStock()

### IFavoriteRepository.ts

-   **地位**：收藏Repository接口
-   **功能**：定义收藏数据访问操作的契约
-   **关键方法**：addFavoriteStock(), removeFavoriteStock(), getAllFavoriteStocks()

### IStockDetailRepository.ts

-   **地位**：股票详情Repository接口
-   **功能**：定义股票详情数据访问操作的契约
-   **关键方法**：upsertDailyBasic(), upsertCompanyInfo(), getDailyBasicByCode()

### IClassificationRepository.ts

-   **地位**：分类Repository接口
-   **功能**：定义分类规则数据访问操作的契约
-   **关键方法**：getClassificationCategories(), getClassificationRules(), updateRule()

### index.ts

-   **功能**：统一导出所有Repository接口

---

**最后更新**：2025-12-26

