#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.clear();
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║                                                              ║');
console.log('║   ☕ Supabase 自动配置向导                                    ║');
console.log('║                                                              ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');

if (fs.existsSync('.env.local')) {
    console.log('⚠️  检测到已存在的 .env.local 文件');
    console.log('');
    rl.question('是否要覆盖现有配置? (y/N): ', (answer) => {
        if (answer.toLowerCase() !== 'y') {
            console.log('❌ 配置已取消');
            rl.close();
            process.exit(0);
        }
        console.log('');
        startSetup();
    });
} else {
    startSetup();
}

function startSetup() {
    console.log('📋 请准备好以下信息:');
    console.log('   1. Supabase Project URL');
    console.log('   2. Supabase Anon Key');
    console.log('');
    console.log('💡 获取方式:');
    console.log('   1. 访问 https://supabase.com/dashboard');
    console.log('   2. 选择你的项目');
    console.log('   3. 进入 Settings → API');
    console.log('   4. 复制 Project URL 和 anon/public key');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    rl.question('请输入 Supabase Project URL: ', (url) => {
        if (!url) {
            console.log('❌ URL 不能为空');
            rl.close();
            process.exit(1);
        }

        if (!url.match(/^https:\/\/.*\.supabase\.co$/)) {
            console.log('⚠️  警告: URL 格式可能不正确');
            console.log('   正确格式: https://xxxxx.supabase.co');
        }
        
        console.log('');
        rl.question('请输入 Supabase Anon Key: ', (key) => {
            if (!key) {
                console.log('❌ Key 不能为空');
                rl.close();
                process.exit(1);
            }

            if (!key.startsWith('eyJ')) {
                console.log('⚠️  警告: Key 格式可能不正确');
                console.log('   正确格式: 以 eyJ 开头的长字符串');
            }
            
            console.log('');
            saveConfig(url, key);
        });
    });
}

function saveConfig(url, key) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    const config = `# Supabase 配置
# 自动生成于: ${new Date().toLocaleString('zh-CN')}

VITE_SUPABASE_URL=${url}
VITE_SUPABASE_ANON_KEY=${key}
`;

    fs.writeFileSync('.env.local', config);
    console.log('✅ 配置文件已创建: .env.local');
    console.log('');
    console.log('📋 配置摘要:');
    console.log(`   URL: ${url}`);
    console.log(`   Key: ${key.substring(0, 20)}...${key.slice(-10)}`);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🎯 下一步:');
    console.log('');
    console.log('   1. 初始化数据库');
    console.log('      → 打开 Supabase SQL Editor');
    console.log('      → 运行 database/init.sql');
    console.log('');
    console.log('   2. 重启开发服务器');
    console.log('      → Ctrl+C 停止当前服务器');
    console.log('      → npm run dev 重新启动');
    console.log('');
    console.log('   3. 刷新浏览器');
    console.log('      → http://localhost:3000');
    console.log('      → 应该看到 "✓ 数据库已连接"');
    console.log('');
    console.log('📚 详细说明: START-HERE.md');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    rl.close();
}
