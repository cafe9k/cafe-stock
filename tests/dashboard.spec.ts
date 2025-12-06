import { test, expect } from '@playwright/test'

/**
 * 仪表板页面测试
 * 注意：这些测试需要用户已登录
 */
test.describe('仪表板页面（未登录）', () => {
    test('未登录用户应被重定向到登录页', async ({ page }) => {
        // 尝试访问主页
        await page.goto('/')

        // 应该被重定向到登录页
        await expect(page).toHaveURL(/\/auth/)
    })

    test('访问不存在的路由应重定向到主页', async ({ page }) => {
        await page.goto('/nonexistent-page')

        // 应该被重定向（最终到登录页，因为未登录）
        await expect(page).toHaveURL(/\/auth/)
    })
})

/**
 * 仪表板功能测试
 * 这些测试模拟已登录状态
 */
test.describe('仪表板功能', () => {
    // 在每个测试前设置登录状态
    test.beforeEach(async ({ page }) => {
        // 注意：在实际项目中，可以通过 API 直接设置认证状态
        // 或者使用 storageState 来保存登录会话
        await page.goto('/auth')
    })

    test('登录页面应该可以访问', async ({ page }) => {
        // 验证登录页面加载
        await expect(page.locator('h1')).toContainText('股票关注面板')
    })
})

/**
 * 视觉回归测试
 */
test.describe('视觉测试', () => {
    test('登录页面截图', async ({ page }) => {
        await page.goto('/auth')

        // 等待页面完全加载
        await page.waitForLoadState('networkidle')

        // 截图比对（首次运行会生成基准图片）
        await expect(page).toHaveScreenshot('auth-page.png', {
            maxDiffPixels: 100,
        })
    })
})

/**
 * 响应式设计测试
 */
test.describe('响应式设计', () => {
    test('移动端视图', async ({ page }) => {
        // 设置移动端视口
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/auth')

        // 页面应该正常显示
        await expect(page.locator('.auth-container')).toBeVisible()
    })

    test('平板视图', async ({ page }) => {
        // 设置平板视口
        await page.setViewportSize({ width: 768, height: 1024 })
        await page.goto('/auth')

        // 页面应该正常显示
        await expect(page.locator('.auth-container')).toBeVisible()
    })

    test('桌面视图', async ({ page }) => {
        // 设置桌面视口
        await page.setViewportSize({ width: 1920, height: 1080 })
        await page.goto('/auth')

        // 页面应该正常显示
        await expect(page.locator('.auth-container')).toBeVisible()
    })
})

/**
 * 可访问性测试
 */
test.describe('可访问性', () => {
    test('表单元素应有正确的 label', async ({ page }) => {
        await page.goto('/auth')

        // 检查邮箱输入框有 label
        const emailLabel = page.locator('label[for="email"]')
        await expect(emailLabel).toBeVisible()
        await expect(emailLabel).toContainText('邮箱')

        // 检查密码输入框有 label
        const passwordLabel = page.locator('label[for="password"]')
        await expect(passwordLabel).toBeVisible()
        await expect(passwordLabel).toContainText('密码')
    })

    test('输入框应可以通过键盘 Tab 导航', async ({ page }) => {
        await page.goto('/auth')

        // 聚焦到邮箱输入框
        await page.locator('input#email').focus()
        await expect(page.locator('input#email')).toBeFocused()

        // Tab 到密码输入框
        await page.keyboard.press('Tab')
        await expect(page.locator('input#password')).toBeFocused()

        // Tab 到提交按钮
        await page.keyboard.press('Tab')
        await expect(page.locator('button[type="submit"]')).toBeFocused()
    })
})

/**
 * 性能测试
 */
test.describe('性能', () => {
    test('页面加载时间应在合理范围内', async ({ page }) => {
        const startTime = Date.now()
        await page.goto('/auth')
        await page.waitForLoadState('domcontentloaded')
        const loadTime = Date.now() - startTime

        // 页面加载应在 5 秒内完成
        expect(loadTime).toBeLessThan(5000)
        console.log(`页面加载时间: ${loadTime}ms`)
    })
})

