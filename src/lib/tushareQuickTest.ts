/**
 * Tushare 客户端快速测试
 * 用于验证 Token 配置和 API 连接
 */

import { tushareClient, TushareError } from './tushareClient'

/**
 * 测试 Token 配置
 */
export function testTokenConfig(): boolean {
    const token = tushareClient.getToken()
    
    if (!token) {
        console.error('❌ Token 未配置')
        return false
    }
    
    console.log('✅ Token 已配置:', token.substring(0, 10) + '...')
    return true
}

/**
 * 测试 API 连接 - 获取股票基本信息（仅获取前5条）
 */
export async function testApiConnection(): Promise<boolean> {
    try {
        console.log('🔄 正在测试 API 连接...')
        
        const response = await tushareClient.queryRaw('stock_basic', {
            list_status: 'L'
        }, ['ts_code', 'name', 'area', 'industry', 'list_date'])
        
        if (response.data.items.length > 0) {
            console.log('✅ API 连接成功')
            console.log('📊 返回数据示例（前3条）:')
            response.data.items.slice(0, 3).forEach((item, index) => {
                const obj: any = {}
                response.data.fields.forEach((field, i) => {
                    obj[field] = item[i]
                })
                console.log(`  ${index + 1}.`, obj)
            })
            return true
        } else {
            console.warn('⚠️  API 返回数据为空')
            return false
        }
    } catch (error) {
        if (error instanceof TushareError) {
            console.error('❌ API 调用失败')
            console.error('   错误码:', error.code)
            console.error('   错误信息:', error.message)
            
            if (error.code === 2002) {
                console.error('   提示: 权限不足，请检查 Token 是否有效或积分是否充足')
            }
        } else {
            console.error('❌ 未知错误:', error)
        }
        return false
    }
}

/**
 * 运行所有测试
 */
export async function runAllTests(): Promise<void> {
    console.log('='.repeat(50))
    console.log('🚀 开始测试 Tushare 客户端')
    console.log('='.repeat(50))
    console.log()
    
    // 测试1: Token 配置
    console.log('【测试 1】检查 Token 配置')
    const tokenOk = testTokenConfig()
    console.log()
    
    if (!tokenOk) {
        console.log('❌ 测试失败: Token 未配置')
        return
    }
    
    // 测试2: API 连接
    console.log('【测试 2】测试 API 连接')
    const apiOk = await testApiConnection()
    console.log()
    
    // 总结
    console.log('='.repeat(50))
    if (tokenOk && apiOk) {
        console.log('✅ 所有测试通过！Tushare 客户端配置正确')
    } else {
        console.log('❌ 部分测试失败，请检查配置')
    }
    console.log('='.repeat(50))
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(console.error)
}

