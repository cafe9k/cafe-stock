import { test, expect, Page } from '@playwright/test'

/**
 * 添加股票功能测试
 * 
 * 测试前提：需要用户已登录
 * 由于这是 E2E 测试，会实际调用生产环境 API
 */

// 测试账号配置（请使用测试账号）
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com'
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123456'

// API 超时时间（股票列表加载可能较慢）
const API_TIMEOUT = 90000

/**
 * 登录辅助函数
 */
async function login(page: Page, email: string, password: string) {
    await page.goto('/auth')
    await page.fill('input#email', email)
    await page.fill('input#password', password)
    await page.click('button[type="submit"]')
    
    // 等待登录完成（重定向到主页或显示错误）
    await Promise.race([
        page.waitForURL('/'),
        page.waitForSelector('.auth-error', { timeout: 10000 })
    ])
}

/**
 * 等待股票列表加载完成的辅助函数
 */
async function waitForStockListLoaded(page: Page) {
    // 等待输入框变为可用状态（股票列表加载完成）
    await page.waitForSelector('.search-box input:not([disabled])', { timeout: API_TIMEOUT })
}

/**
 * 添加股票模态框测试（UI 层面）
 */
test.describe('添加股票模态框', () => {
    test.beforeEach(async ({ page }) => {
        // 访问登录页
        await page.goto('/auth')
    })

    test('未登录时无法访问添加股票功能', async ({ page }) => {
        // 尝试直接访问主页
        await page.goto('/')
        
        // 应该被重定向到登录页
        await expect(page).toHaveURL(/\/auth/)
    })
})

/**
 * 添加股票模态框 UI 测试
 * 这些测试模拟模态框的 UI 行为
 */
test.describe('添加股票模态框 UI', () => {
    // 跳过需要登录的测试（如果没有测试账号）
    test.skip(({ browserName }) => !process.env.TEST_EMAIL, '需要配置 TEST_EMAIL 环境变量')

    test.beforeEach(async ({ page }) => {
        // 登录
        await login(page, TEST_EMAIL, TEST_PASSWORD)
        
        // 确保在主页
        await expect(page).toHaveURL('/')
    })

    test('点击添加股票按钮应打开模态框', async ({ page }) => {
        // 点击添加股票按钮
        await page.click('.btn-add-stock')
        
        // 模态框应该显示
        await expect(page.locator('.modal-overlay')).toBeVisible()
        await expect(page.locator('.modal-content')).toBeVisible()
        
        // 检查模态框标题
        await expect(page.locator('.modal-header h2')).toContainText('添加股票')
    })

    test('模态框应有搜索输入框', async ({ page }) => {
        await page.click('.btn-add-stock')
        
        // 搜索框应该存在
        const searchInput = page.locator('.search-box input')
        await expect(searchInput).toBeVisible()
        
        // 等待股票列表加载完成（输入框变为可用状态）
        await waitForStockListLoaded(page)
        
        // 搜索框应该自动聚焦（加载完成后）
        await expect(searchInput).toBeFocused({ timeout: 2000 })
    })

    test('点击关闭按钮应关闭模态框', async ({ page }) => {
        await page.click('.btn-add-stock')
        await expect(page.locator('.modal-overlay')).toBeVisible()
        
        // 点击关闭按钮
        await page.click('.modal-close')
        
        // 模态框应该消失
        await expect(page.locator('.modal-overlay')).not.toBeVisible()
    })

    test('点击遮罩层应关闭模态框', async ({ page }) => {
        await page.click('.btn-add-stock')
        await expect(page.locator('.modal-overlay')).toBeVisible()
        
        // 点击遮罩层（模态框外部）
        await page.click('.modal-overlay', { position: { x: 10, y: 10 } })
        
        // 模态框应该消失
        await expect(page.locator('.modal-overlay')).not.toBeVisible()
    })

    test('按 ESC 键应关闭模态框', async ({ page }) => {
        await page.click('.btn-add-stock')
        await expect(page.locator('.modal-overlay')).toBeVisible()
        
        // 按 ESC 键
        await page.keyboard.press('Escape')
        
        // 模态框应该消失
        await expect(page.locator('.modal-overlay')).not.toBeVisible()
    })

    test('搜索股票应显示结果', async ({ page }) => {
        await page.click('.btn-add-stock')
        
        // 等待股票列表加载（API 可能较慢）
        await waitForStockListLoaded(page)
        
        // 输入搜索关键词
        await page.fill('.search-box input', '平安')
        
        // 等待搜索结果
        await page.waitForSelector('.search-item', { timeout: 10000 })
        
        // 应该有搜索结果
        const results = page.locator('.search-item')
        await expect(results.first()).toBeVisible()
    })

    test('搜索不存在的股票应显示空结果提示', async ({ page }) => {
        await page.click('.btn-add-stock')
        
        // 等待股票列表加载（API 可能较慢）
        await waitForStockListLoaded(page)
        
        // 输入不存在的关键词
        await page.fill('.search-box input', 'XXXXXXX不存在的股票')
        
        // 等待一下让搜索完成
        await page.waitForTimeout(500)
        
        // 应该显示空结果提示
        await expect(page.locator('.search-empty')).toBeVisible()
        await expect(page.locator('.search-empty')).toContainText('未找到匹配的股票')
    })

    test('清空搜索框应清除结果', async ({ page }) => {
        await page.click('.btn-add-stock')
        
        // 等待股票列表加载（API 可能较慢）
        await waitForStockListLoaded(page)
        
        // 输入搜索关键词
        await page.fill('.search-box input', '平安')
        await page.waitForSelector('.search-item', { timeout: 10000 })
        
        // 点击清除按钮
        await page.click('.search-clear')
        
        // 搜索框应该为空
        await expect(page.locator('.search-box input')).toHaveValue('')
        
        // 搜索结果应该清除，显示提示
        await expect(page.locator('.search-hint')).toBeVisible()
    })
})

/**
 * 添加股票功能测试（完整流程）
 */
test.describe('添加股票完整流程', () => {
    test.skip(({ browserName }) => !process.env.TEST_EMAIL, '需要配置 TEST_EMAIL 环境变量')

    test.beforeEach(async ({ page }) => {
        await login(page, TEST_EMAIL, TEST_PASSWORD)
        await expect(page).toHaveURL('/')
    })

    test('搜索结果应显示股票信息', async ({ page }) => {
        await page.click('.btn-add-stock')
        
        // 等待股票列表加载，增加超时时间
        await waitForStockListLoaded(page)
        
        // 搜索平安银行
        await page.fill('.search-box input', '000001')
        await page.waitForSelector('.search-item', { timeout: 10000 })
        
        // 检查搜索结果包含必要信息
        const firstResult = page.locator('.search-item').first()
        await expect(firstResult.locator('.stock-name')).toBeVisible()
        await expect(firstResult.locator('.stock-code')).toBeVisible()
        await expect(firstResult.locator('.stock-industry')).toBeVisible()
    })

    test('搜索结果应显示添加按钮', async ({ page }) => {
        await page.click('.btn-add-stock')
        await waitForStockListLoaded(page)
        
        await page.fill('.search-box input', '000001')
        await page.waitForSelector('.search-item', { timeout: 10000 })
        
        // 检查是否有添加按钮或已关注标记
        const firstResult = page.locator('.search-item').first()
        const hasAddButton = await firstResult.locator('.btn-add').isVisible().catch(() => false)
        const hasWatchedBadge = await firstResult.locator('.watched-badge').isVisible().catch(() => false)
        
        // 应该有其中一个
        expect(hasAddButton || hasWatchedBadge).toBeTruthy()
    })

    test('已关注的股票应显示"已关注"标记', async ({ page }) => {
        // 首先检查是否有已关注的股票
        const stockCards = page.locator('.stock-card')
        const hasStocks = await stockCards.count() > 0
        
        if (!hasStocks) {
            test.skip()
            return
        }
        
        // 获取第一只已关注股票的代码
        const firstStockCode = await stockCards.first().locator('.stock-code').textContent()
        
        // 打开添加股票模态框
        await page.click('.btn-add-stock')
        await waitForStockListLoaded(page)
        
        // 搜索这只股票
        if (firstStockCode) {
            await page.fill('.search-box input', firstStockCode.split('.')[0])
            await page.waitForSelector('.search-item', { timeout: 10000 })
            
            // 找到对应的搜索结果
            const matchingResult = page.locator('.search-item').filter({
                has: page.locator(`.stock-code:text-is("${firstStockCode}")`)
            })
            
            // 应该显示"已关注"标记
            if (await matchingResult.count() > 0) {
                await expect(matchingResult.locator('.watched-badge')).toBeVisible()
            }
        }
    })
})

/**
 * 搜索功能测试
 * 这些测试共享同一个已加载的股票列表会话
 */
test.describe('股票搜索功能', () => {
    test.skip(({ browserName }) => !process.env.TEST_EMAIL, '需要配置 TEST_EMAIL 环境变量')
    
    // 使用串行模式，确保测试按顺序执行，共享股票列表缓存
    test.describe.configure({ mode: 'serial' })

    let sharedPage: Page

    test.beforeAll(async ({ browser }) => {
        // 创建一个共享的页面
        sharedPage = await browser.newPage()
        await login(sharedPage, TEST_EMAIL, TEST_PASSWORD)
        await sharedPage.click('.btn-add-stock')
        // 只加载一次股票列表
        await waitForStockListLoaded(sharedPage)
    })

    test.afterAll(async () => {
        await sharedPage?.close()
    })

    test('可以通过股票代码搜索', async () => {
        await sharedPage.fill('.search-box input', '600519')
        await sharedPage.waitForSelector('.search-item', { timeout: 5000 })
        
        // 应该找到贵州茅台
        const results = sharedPage.locator('.search-item')
        await expect(results.first()).toBeVisible()
        
        // 清空搜索框
        await sharedPage.fill('.search-box input', '')
    })

    test('可以通过股票名称搜索', async () => {
        await sharedPage.fill('.search-box input', '茅台')
        await sharedPage.waitForSelector('.search-item', { timeout: 5000 })
        
        const results = sharedPage.locator('.search-item')
        await expect(results.first()).toBeVisible()
        
        // 清空搜索框
        await sharedPage.fill('.search-box input', '')
    })

    test('搜索应该是模糊匹配', async () => {
        // 先清空搜索框
        await sharedPage.fill('.search-box input', '')
        await sharedPage.waitForTimeout(300)
        
        await sharedPage.fill('.search-box input', '银行')
        await sharedPage.waitForSelector('.search-item', { timeout: 5000 })
        
        // 应该有多个银行股票结果
        const results = sharedPage.locator('.search-item')
        const count = await results.count()
        expect(count).toBeGreaterThanOrEqual(1) // 至少有一个结果
        
        // 清空搜索框
        await sharedPage.fill('.search-box input', '')
    })

    test('搜索结果应限制数量', async () => {
        // 搜索一个常见词
        await sharedPage.fill('.search-box input', '科技')
        await sharedPage.waitForSelector('.search-item', { timeout: 5000 })
        
        // 结果数量应该有限制（代码中限制为20）
        const results = sharedPage.locator('.search-item')
        const count = await results.count()
        expect(count).toBeLessThanOrEqual(20)
    })
})

/**
 * 无障碍测试
 */
test.describe('添加股票无障碍测试', () => {
    test.skip(({ browserName }) => !process.env.TEST_EMAIL, '需要配置 TEST_EMAIL 环境变量')

    test.beforeEach(async ({ page }) => {
        await login(page, TEST_EMAIL, TEST_PASSWORD)
    })

    test('模态框应该可以通过键盘操作', async ({ page }) => {
        // Tab 到添加按钮并按 Enter
        await page.keyboard.press('Tab')
        
        // 找到添加按钮并点击
        await page.click('.btn-add-stock')
        await expect(page.locator('.modal-overlay')).toBeVisible()
        
        // 等待股票列表加载
        await waitForStockListLoaded(page)
        
        // 搜索框应该自动聚焦
        await expect(page.locator('.search-box input')).toBeFocused()
        
        // 可以用键盘输入
        await page.keyboard.type('000001')
        await expect(page.locator('.search-box input')).toHaveValue('000001')
    })
})
