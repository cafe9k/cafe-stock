import type { PlaywrightTestConfig } from '@playwright/test'

/**
 * Playwright 配置文件
 * 用于自动化浏览器测试
 */
const config: PlaywrightTestConfig = {
    // 测试目录
    testDir: './tests',

    // 测试文件匹配模式
    testMatch: '**/*.spec.ts',

    // 完全并行运行测试
    fullyParallel: true,

    // CI 环境下禁止 test.only
    forbidOnly: !!process.env.CI,

    // 失败重试次数
    retries: process.env.CI ? 2 : 0,

    // 并行 worker 数量（减少并发避免 API 限流）
    workers: process.env.CI ? 1 : 2,

    // 报告器配置
    reporter: [
        ['html', { open: 'never' }],
        ['list']
    ],

    // 全局配置
    use: {
        // 基础 URL
        baseURL: 'http://localhost:3001',

        // 收集失败测试的 trace
        trace: 'on-first-retry',

        // 截图配置
        screenshot: 'only-on-failure',

        // 视频录制
        video: 'on-first-retry',

        // 浏览器上下文选项
        viewport: { width: 1280, height: 720 },

        // 超时设置
        actionTimeout: 15000,
        navigationTimeout: 30000,
    },

    // 全局超时（增加超时时间以适应 API 调用）
    timeout: 90000,

    // 期望超时
    expect: {
        timeout: 10000,
    },

    // 浏览器项目配置
    projects: [
        {
            name: 'chromium',
            use: { 
                browserName: 'chromium',
                viewport: { width: 1280, height: 720 },
            },
        },
    ],

    // 开发服务器配置
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3001',
        reuseExistingServer: true,
        timeout: 120000,
    },
}

export default config
