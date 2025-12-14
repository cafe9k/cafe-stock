import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  // 显示系统通知
  showNotification: (title, body) => {
    return ipcRenderer.invoke("show-notification", title, body);
  },
  // 获取应用版本
  getAppVersion: () => {
    return ipcRenderer.invoke("get-app-version");
  },
  // 代理 Tushare 请求
  tushareRequest: (url, body) => {
    return ipcRenderer.invoke("tushare-request", url, body);
  },
  // 触发刷新数据
  refreshData: () => {
    ipcRenderer.send("refresh-data");
  },
  // 监听刷新数据事件（从主进程发送）
  onRefreshData: (callback) => {
    const subscription = (_event) => callback();
    ipcRenderer.on("refresh-data", subscription);
    return () => {
      ipcRenderer.removeListener("refresh-data", subscription);
    };
  }
});
