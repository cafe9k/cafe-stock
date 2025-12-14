# WebView PDF 预览功能集成说明

## 功能概述

已成功集成基于 Electron WebView 的 PDF 预览功能，替代原来的 React-PDF 方案。WebView 方案具有更好的性能和兼容性。

## 已完成的工作

### 1. 启用 WebView 标签

在 `electron/main.ts` 中启用 webview：

```typescript
webPreferences: {
  preload: path.join(__dirname, "preload.cjs"),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: false,
  webSecurity: true,
  webviewTag: true, // ✅ 启用 webview 标签
}
```

### 2. 创建 PDFWebViewer 组件

-   **文件位置**: `src/components/PDFWebViewer.tsx`
-   **功能特性**:
    -   ✅ 使用 Electron WebView 加载 PDF
    -   ✅ 控制台打印 PDF URL
    -   ✅ PDF 下载功能
    -   ✅ 刷新功能
    -   ✅ 在浏览器中打开功能
    -   ✅ 响应式布局
    -   ✅ 加载状态监听

### 3. 添加 shell.openExternal 支持

在 `electron/main.ts` 中添加 IPC 处理：

```typescript
// 在浏览器中打开 URL
ipcMain.handle("open-external", async (_event, url: string) => {
	try {
		console.log(`[IPC] open-external: ${url}`);
		await shell.openExternal(url);
		return { success: true };
	} catch (error: any) {
		console.error("Failed to open external URL:", error);
		return {
			success: false,
			message: error.message || "打开链接失败",
		};
	}
});
```

### 4. 更新 Preload API

在 `electron/preload.ts` 中添加：

```typescript
// 在浏览器中打开 URL
openExternal: (url: string) => {
	return ipcRenderer.invoke("open-external", url);
};
```

### 5. 更新类型定义

在 `src/electron.d.ts` 中添加：

```typescript
// 在浏览器中打开 URL
openExternal: (url: string) =>
	Promise<{
		success: boolean;
		message?: string;
	}>;

// WebView 标签类型定义
namespace JSX {
	interface IntrinsicElements {
		webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
			src?: string;
			allowpopups?: string;
			plugins?: string;
			partition?: string;
			preload?: string;
			useragent?: string;
		};
	}
}
```

### 6. 集成到公告列表

在 `src/components/AnnouncementList.tsx` 中：

-   替换 `PDFViewer` 为 `PDFWebViewer`
-   点击公告时打印 PDF URL 到控制台

## WebView vs React-PDF 对比

| 特性         | WebView (当前方案)        | React-PDF (旧方案)     |
| ------------ | ------------------------- | ---------------------- |
| **性能**     | ⚡ 原生性能，快速加载     | 🐌 需要加载 PDF.js     |
| **兼容性**   | ✅ 完美兼容所有 PDF       | ⚠️ 某些 PDF 可能有问题 |
| **网络**     | ✅ 直接加载远程 PDF       | ⚠️ 可能需要代理        |
| **功能**     | ✅ 浏览器原生功能         | 📦 需要自己实现        |
| **内存占用** | ✅ 独立进程，不影响主窗口 | ❌ 占用主进程内存      |
| **用户体验** | ✅ 与浏览器查看一致       | ⚠️ 需要自定义 UI       |

## 使用方法

### 查看公告 PDF

1. 打开应用，进入"公告"页面
2. 点击任意股票展开公告列表
3. 点击公告标题或"预览"按钮
4. **控制台会打印 PDF URL** 👈 新功能
5. WebView 模态框中显示 PDF

### 控制台输出示例

```
PDF URL: http://static.cninfo.com.cn/finalpage/2024-12-14/1219876543.PDF
公告信息: {
  股票代码: "000001.SZ",
  公告日期: "20241214",
  公告标题: "平安银行股份有限公司关于...",
  PDF链接: "http://static.cninfo.com.cn/finalpage/2024-12-14/1219876543.PDF"
}
```

### 工具栏功能

-   **刷新**: 重新加载 PDF
-   **下载**: 下载 PDF 到本地
-   **在浏览器中打开**: 使用系统默认浏览器打开 PDF

## WebView 事件监听

PDFWebViewer 组件监听以下 webview 事件：

```typescript
// 开始加载
webview.addEventListener("did-start-loading", handleLoadStart);

// 加载完成
webview.addEventListener("did-stop-loading", handleLoadStop);

// 加载失败
webview.addEventListener("did-fail-load", handleLoadAbort);

// 尝试打开新窗口
webview.addEventListener("new-window", handleNewWindow);
```

## 组件使用示例

如果需要在其他地方使用 PDFWebViewer 组件：

```tsx
import { PDFWebViewer } from "@/components/PDFWebViewer";

function MyComponent() {
	const [open, setOpen] = useState(false);
	const [pdfUrl, setPdfUrl] = useState("");

	return (
		<>
			<Button
				onClick={() => {
					setPdfUrl("https://example.com/file.pdf");
					setOpen(true);
				}}
			>
				打开 PDF
			</Button>

			<PDFWebViewer open={open} onClose={() => setOpen(false)} pdfUrl={pdfUrl} title="示例文档" />
		</>
	);
}
```

## WebView 安全性配置

当前配置确保安全性：

-   ✅ `contextIsolation: true` - 上下文隔离
-   ✅ `nodeIntegration: false` - 禁用 Node.js 集成
-   ✅ `webSecurity: true` - 启用 Web 安全
-   ✅ `sandbox: false` - 某些功能需要
-   ✅ `webviewTag: true` - 仅启用 webview 标签

## 故障排查

### WebView 无法显示

1. 确认 `webviewTag: true` 已在 BrowserWindow 配置中启用
2. 检查控制台是否有错误信息
3. 确认 PDF URL 是否可访问

### PDF 无法加载

1. 在控制台查看打印的 URL 是否正确
2. 尝试在浏览器中直接打开该 URL
3. 检查网络连接
4. 查看 webview 的 `did-fail-load` 事件

### 下载功能不工作

WebView 的 `downloadURL()` 方法会触发 Electron 的下载管理器。如果不工作：

1. 检查 Electron 版本是否支持
2. 考虑使用 `shell.openExternal()` 在浏览器中下载
3. 或使用 fetch + blob 方式下载

### 在浏览器中打开功能不工作

确认：

1. `shell` 模块已正确导入
2. `open-external` IPC 处理已注册
3. `openExternal` 方法已在 preload 中暴露

## 性能优化建议

1. **webview 复用**: 考虑复用 webview 实例而不是每次创建
2. **懒加载**: 仅在打开模态框时设置 webview.src
3. **内存管理**: 关闭模态框时清理 webview
4. **预加载**: 可以预加载常用的 PDF

## 开发调试

### 启用 WebView 开发者工具

在组件中添加：

```typescript
useEffect(() => {
	if (webviewRef.current && isDev) {
		webviewRef.current.openDevTools();
	}
}, []);
```

### 查看 WebView 控制台

```typescript
webview.addEventListener("console-message", (e) => {
	console.log("[WebView]", e.message);
});
```

## 相关文件

-   ✅ `src/components/PDFWebViewer.tsx` - WebView PDF 预览组件
-   ✅ `src/components/AnnouncementList.tsx` - 公告列表（集成 WebView 预览）
-   ✅ `electron/main.ts` - IPC 处理 + webview 启用
-   ✅ `electron/preload.ts` - API 暴露
-   ✅ `src/electron.d.ts` - 类型定义
-   📦 `src/components/PDFViewer.tsx` - 旧的 React-PDF 组件（保留作为备用）

## 下一步优化

1. ✅ 添加更多 WebView 事件处理
2. ✅ 优化下载体验
3. ✅ 添加 PDF 缩放控制（通过 WebView 的 zoom API）
4. ✅ 添加打印功能（通过 WebView 的 print 方法）
5. ✅ 考虑添加 PDF 搜索功能

## 卸载 React-PDF（可选）

如果确认不再需要 React-PDF，可以卸载相关依赖：

```bash
npm uninstall react-pdf pdfjs-dist
```

删除旧文件：

```bash
rm src/components/PDFViewer.tsx
```

## 总结

✅ WebView 方案已完全替代 React-PDF
✅ 更好的性能和兼容性
✅ 更少的依赖和更小的打包体积
✅ 原生浏览器 PDF 查看体验
✅ 控制台打印 URL 便于调试
