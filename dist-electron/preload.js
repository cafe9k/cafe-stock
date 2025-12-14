import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  // 显示系统通知
  showNotification: (title, body) => {
    return ipcRenderer.invoke("show-notification", title, body);
  },
  // 获取应用版本
  getAppVersion: () => {
    return ipcRenderer.invoke("get-app-version");
  }
});
