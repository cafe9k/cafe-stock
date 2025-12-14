// Electron API 类型定义
export interface ElectronAPI {
    showNotification: (title: string, body: string) => Promise<void>
    getAppVersion: () => Promise<string>
    refreshData: () => void
    onRefreshData: (callback: () => void) => () => void
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}

export {}
