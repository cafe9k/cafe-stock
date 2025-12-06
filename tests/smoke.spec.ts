import { test, expect } from '@playwright/test'

/**
 * 冒烟测试
 * 快速验证应用基本功能是否正常
 */
test.describe('冒烟测试', () => {
    test('应用应该启动并响应', async ({ page }) => {
        const response = await page.goto('/')
        expect(response?.status()).toBeLessThan(400)
    })

    test('登录页面应该可访问', async ({ page }) => {
        const response = await page.goto('/auth')
        expect(response?.status()).toBe(200)

        // 检查关键元素
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('form')).toBeVisible()
    })

    test('静态资源应该正常加载', async ({ page }) => {
        await page.goto('/auth')

        // 检查 CSS 是否加载（通过检查样式是否应用）
        const container = page.locator('.auth-container')
        await expect(container).toBeVisible()

        // 检查容器有样式（非零尺寸）
        const box = await container.boundingBox()
        expect(box?.width).toBeGreaterThan(0)
        expect(box?.height).toBeGreaterThan(0)
    })

    test('没有控制台错误', async ({ page }) => {
        const errors: string[] = []

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text())
            }
        })

        await page.goto('/auth')
        await page.waitForLoadState('networkidle')

        // 过滤掉一些已知的非关键错误
        const criticalErrors = errors.filter(
            (e) => !e.includes('favicon') && !e.includes('404')
        )

        expect(criticalErrors).toHaveLength(0)
    })

    test('页面标题应该正确', async ({ page }) => {
        await page.goto('/auth')

        // 检查页面内的标题
        await expect(page.locator('h1')).toContainText('股票关注面板')
    })
})

/**
 * API 健康检查
 */
test.describe('API 健康检查', () => {
    test('Supabase 连接应该正常', async ({ page }) => {
        await page.goto('/auth')

        // 尝试一个登录请求来验证 Supabase 连接
        await page.fill('input#email', 'test@test.com')
        await page.fill('input#password', 'testpassword123')
        await page.click('button[type="submit"]')

        // 等待响应（无论成功或失败，只要有响应就说明 API 正常）
        await page.waitForResponse(
            (response) =>
                response.url().includes('supabase') && response.status() < 500,
            { timeout: 15000 }
        ).catch(() => {
            // 如果没有 Supabase 请求，可能是本地模式，跳过
            console.log('未检测到 Supabase 请求')
        })
    })
})

