// 测试生产环境边缘函数
import https from 'https';

const data = JSON.stringify({
  api_name: 'stock_basic',
  params: {
    list_status: 'L',
    fields: 'ts_code,symbol,name,area,industry,list_date'
  }
});

const options = {
  hostname: 'fmbqlwagajrrktcycnxu.supabase.co',
  port: 443,
  path: '/functions/v1/tushare-proxy',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('正在测试边缘函数...');
console.log('URL:', `https://${options.hostname}${options.path}`);
console.log('请求数据:', data);
console.log('---');

const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头:`, JSON.stringify(res.headers, null, 2));
  console.log('---');

  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('响应数据:');
    try {
      const parsed = JSON.parse(responseData);
      console.log(JSON.stringify(parsed, null, 2));
      
      // 验证响应
      if (parsed.code === 0 && parsed.data && parsed.data.items) {
        console.log('\n✅ 测试成功!');
        console.log(`获取到 ${parsed.data.items.length} 条股票数据`);
        console.log('前 3 条数据:');
        console.log(JSON.stringify(parsed.data.items.slice(0, 3), null, 2));
      } else {
        console.log('\n❌ 测试失败: 响应格式不正确');
      }
    } catch (e) {
      console.log(responseData);
      console.log('\n❌ 解析 JSON 失败:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求失败:', error.message);
  process.exit(1);
});

req.write(data);
req.end();

