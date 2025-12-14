# PDF 预览功能集成说明

## 功能概述

已成功集成 React-PDF 组件，实现公告 PDF 点击预览功能。

## 已完成的工作

### 1. 安装依赖

```bash
npm install react-pdf pdfjs-dist
```

### 2. 创建 PDFViewer 组件

-   文件位置: `src/components/PDFViewer.tsx`
-   功能特性:
    -   ✅ PDF 文档加载和渲染
    -   ✅ 页面翻页（上一页/下一页）
    -   ✅ 缩放控制（放大/缩小）
    -   ✅ PDF 下载功能
    -   ✅ 响应式布局
    -   ✅ 加载状态提示

### 3. 集成到公告列表

-   文件位置: `src/components/AnnouncementList.tsx`
-   修改内容:
    -   在嵌套表格的标题列添加 PDF 图标和预览按钮
    -   点击标题或预览按钮触发 PDF 预览
    -   使用 Modal 弹窗展示 PDF

### 4. 数据库扩展

-   在 `announcements` 表添加 `file_path` 字段
-   实现数据库自动迁移功能

### 5. API 接口

-   Electron IPC: `get-announcement-pdf`
-   类型定义: `src/electron.d.ts`
-   Preload 暴露: `electron/preload.ts`

## PDF 数据源配置

### ✅ 已配置 Tushare 接口

**好消息！** 已成功配置 Tushare 的公告原文接口 `anns_d`，可以直接获取 PDF 链接。

**接口信息**:

-   接口名: `anns_d`
-   文档: https://tushare.pro/document/2?doc_id=176
-   返回字段: `url` - PDF 原文下载链接
-   限量: 单次最大 2000 条
-   权限: 需要单独权限（请检查你的 Tushare 账户）

### 备用 PDF 数据源（如果 Tushare 权限不足）

#### 方案 1: 巨潮资讯网

巨潮资讯网是中国证监会指定的信息披露网站。

```typescript
// 示例 URL 格式
const pdfUrl = `http://static.cninfo.com.cn/${announcementId}.PDF`;
```

**优点**:

-   官方权威数据源
-   覆盖所有上市公司公告
-   免费访问

**缺点**:

-   需要找到公告 ID 与 PDF 的映射关系
-   可能需要处理跨域问题

#### 方案 2: 交易所官网

-   上交所: http://www.sse.com.cn/
-   深交所: http://www.szse.cn/

#### 方案 3: ~~Tushare Pro~~（已实现）

✅ **已实现**：使用 `anns_d` 接口，代码已完成，只需确保你的账户有相应权限。

#### 方案 4: 第三方数据服务

-   AKShare
-   JoinQuant
-   其他金融数据 API

## 功能已就绪！

### ✅ PDF 功能已完全启用

代码已经完成，使用 Tushare 的 `anns_d` 接口获取 PDF URL。

**实现细节**:

1. ✅ API 调用: `TushareClient.getAnnouncementFiles(tsCode, annDate)`
2. ✅ 标题匹配: 支持精确匹配和模糊匹配
3. ✅ 错误处理: 完整的异常捕获和提示

### 如何使用

直接使用即可！点击公告的"预览"按钮，系统会自动：

1. 调用 Tushare API 获取该日期该股票的所有公告
2. 匹配标题找到对应的 PDF URL
3. 在模态窗口中展示 PDF

### 权限检查

如果点击预览后提示权限不足，请：

**步骤 1**: 登录 Tushare 账户

-   访问: https://tushare.pro/

**步骤 2**: 检查积分和权限

-   查看"我的积分"
-   确认是否有 `anns_d` 接口权限

**步骤 3**: 如需权限

-   参与社区贡献获取积分
-   或联系 Tushare 客服

### ~~（已废弃）手动配置步骤~~

以下内容仅供参考，当前实现已无需手动配置：

~~### 步骤 2: 修改 `electron/main.ts`~~

~~在 `get-announcement-pdf` 的 IPC 处理函数中，替换临时实现：~~

```typescript
ipcMain.handle("get-announcement-pdf", async (_event, tsCode: string, annDate: string, title: string) => {
	try {
		// 实现你的 PDF URL 获取逻辑
		const pdfUrl = await yourPdfUrlFunction(tsCode, annDate, title);

		if (pdfUrl) {
			return {
				success: true,
				url: pdfUrl,
			};
		}

		return {
			success: false,
			message: "该公告暂无 PDF 文件",
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || "获取 PDF 失败",
		};
	}
});
```

### 步骤 3: 处理 CORS（如果需要）

如果 PDF 文件来自外部域名，可能需要配置代理或在 Electron 中禁用 CORS：

```typescript
// 在 createWindow 函数中
session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
	callback({ requestHeaders: { ...details.requestHeaders, Origin: "*" } });
});

session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
	callback({
		responseHeaders: {
			...details.responseHeaders,
			"Access-Control-Allow-Origin": ["*"],
		},
	});
});
```

## 测试 PDF 功能

### 使用测试 PDF

可以使用在线 PDF 进行测试：

```typescript
// 在 electron/main.ts 中临时使用测试 URL
return {
	success: true,
	url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
};
```

### 界面操作

1. 打开应用，进入"公告"页面
2. 点击任意股票展开公告列表
3. 点击公告标题或"预览"按钮
4. 在弹出的模态框中查看 PDF
5. 使用工具栏进行翻页、缩放、下载等操作

## 组件使用示例

如果需要在其他地方使用 PDFViewer 组件：

```tsx
import { PDFViewer } from "@/components/PDFViewer";

function MyComponent() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(true)}>打开 PDF</Button>

			<PDFViewer open={open} onClose={() => setOpen(false)} pdfUrl="https://example.com/file.pdf" title="示例文档" />
		</>
	);
}
```

## 性能优化建议

1. **懒加载**: PDF.js worker 使用 CDN 加载
2. **缓存**: 考虑缓存已加载的 PDF
3. **预加载**: 可以预加载下一页的内容
4. **限制大小**: 对于特别大的 PDF，考虑分页加载

## 故障排查

### PDF 无法加载

-   检查 URL 是否正确
-   检查 CORS 配置
-   检查网络连接
-   查看控制台错误信息

### CSS 样式问题

确保正确导入了 react-pdf 的 CSS：

```tsx
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
```

### Worker 加载失败

检查 worker 路径配置：

```tsx
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
```

## 相关文件

-   `src/components/PDFViewer.tsx` - PDF 预览组件
-   `src/components/AnnouncementList.tsx` - 公告列表（集成预览功能）
-   `electron/main.ts` - IPC 处理（`get-announcement-pdf`）
-   `electron/tushare.ts` - Tushare API 客户端
-   `electron/db.ts` - 数据库操作
-   `src/electron.d.ts` - 类型定义

## 下一步

1. 确定合适的 PDF 数据源
2. 实现 PDF URL 获取逻辑
3. 测试并优化用户体验
4. 考虑添加 PDF 缓存机制
5. 添加更多 PDF 操作功能（打印、搜索等）
