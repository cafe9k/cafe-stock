import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,  // 不自动打开系统浏览器,使用 Cursor 内置浏览器
    proxy: {
      '/api/tushare': {
        target: 'http://api.tushare.pro',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tushare/, '')
      }
    }
  }
})
