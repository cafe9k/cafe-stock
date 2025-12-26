# IPC Middleware - IPC中间件

**架构定位（3行）**:

-   职责：提供IPC通信层的中间件功能（错误处理、日志记录等）
-   依赖：Electron IPC API、types（错误类型定义）
-   输出：向IPC处理器提供可复用的中间件函数

⚠️ **自指声明**：一旦本文件夹有文件新增/删除/重命名，请立即更新本 README 的文件清单

---

## 文件清单

### errorHandler.ts

-   **地位**：错误处理中间件
-   **功能**：统一处理IPC调用中的错误，提供标准响应格式
-   **关键函数**：
    -   `withErrorHandler()` - 错误处理包装函数
    -   自动捕获异常并转换为标准错误响应格式

### index.ts

-   **功能**：统一导出所有中间件

---

## 使用示例

```typescript
import { withErrorHandler } from "./middleware/errorHandler.js";

ipcMain.handle(
  "some-channel",
  withErrorHandler(async (_event, ...args) => {
    // 业务逻辑
    return result;
  }, "some-channel")
);
```

---

**最后更新**：2025-12-26

