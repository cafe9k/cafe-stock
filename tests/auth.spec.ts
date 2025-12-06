import { test, expect } from '@playwright/test'

/**
 * 认证页面测试
 */
test.describe('认证页面', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth')
    })

    test('页面应正确加载', async ({ page }) => {
        // 检查页面标题
        await expect(page.locator('h1')).toContainText('股票关注面板')

        // 检查登录表单存在
        await expect(page.locator('input#email')).toBeVisible()
        await expect(page.locator('input#password')).toBeVisible()

        // 检查登录按钮
        await expect(page.locator('button[type="submit"]')).toContainText('登录')
    })

    test('可以切换登录/注册标签', async ({ page }) => {
        // 默认是登录状态
        await expect(page.locator('.auth-tab.active')).toContainText('登录')

        // 点击注册标签
        await page.click('text=注册')
        await expect(page.locator('.auth-tab.active')).toContainText('注册')

        // 注册时应该显示确认密码字段
        await expect(page.locator('input#confirmPassword')).toBeVisible()

        // 切换回登录
        await page.click('.auth-tabs button:first-child')
        await expect(page.locator('input#confirmPassword')).not.toBeVisible()
    })

    test('空表单提交应显示错误', async ({ page }) => {
        // 点击提交按钮
        await page.click('button[type="submit"]')

        // 应该显示错误信息
        await expect(page.locator('.auth-error')).toContainText('请填写邮箱和密码')
    })

    test('密码太短应显示错误', async ({ page }) => {
        // 填写邮箱和短密码
        await page.fill('input#email', 'test@example.com')
        await page.fill('input#password', '123')

        // 提交
        await page.click('button[type="submit"]')

        // 应该显示错误
        await expect(page.locator('.auth-error')).toContainText('密码长度至少6位')
    })

    test('注册时密码不一致应显示错误', async ({ page }) => {
        // 切换到注册
        await page.click('text=注册')

        // 填写表单
        await page.fill('input#email', 'test@example.com')
        await page.fill('input#password', '123456')
        await page.fill('input#confirmPassword', '654321')

        // 提交
        await page.click('button[type="submit"]')

        // 应该显示错误
        await expect(page.locator('.auth-error')).toContainText('两次输入的密码不一致')
    })

    test('功能特性区域应正确显示', async ({ page }) => {
        // 检查三个功能特性
        await expect(page.locator('.feature-item')).toHaveCount(3)
        await expect(page.locator('text=实时行情')).toBeVisible()
        await expect(page.locator('text=重要消息')).toBeVisible()
        await expect(page.locator('text=云端同步')).toBeVisible()
    })

    test('底部切换链接应工作', async ({ page }) => {
        // 检查"立即注册"链接
        await expect(page.locator('.auth-switch')).toContainText('立即注册')

        // 点击切换
        await page.click('.auth-switch')

        // 应该切换到注册模式
        await expect(page.locator('.auth-switch')).toContainText('立即登录')
    })
})

/**
 * 登录流程测试（需要真实账号）
 * 注意：这些测试依赖于生产环境的 Supabase
 */
test.describe('登录流程', () => {
    test('错误的凭据应显示错误', async ({ page }) => {
        await page.goto('/auth')

        // 填写错误的凭据
        await page.fill('input#email', 'wrong@example.com')
        await page.fill('input#password', 'wrongpassword')

        // 提交
        await page.click('button[type="submit"]')

        // 等待响应并检查错误
        await expect(page.locator('.auth-error')).toBeVisible({ timeout: 10000 })
    })
})

