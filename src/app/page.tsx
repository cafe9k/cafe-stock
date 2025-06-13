'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 定义交易日历数据类型
interface TradeCal {
  exchange: string;
  cal_date: string;
  is_open: number;
  pretrade_date: string;
}

// 定义API响应类型
interface TushareResponse {
  request_id: string;
  code: number;
  msg: string;
  data: {
    fields: string[];
    items: any[][];
  };
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [tradeCalData, setTradeCalData] = useState<TradeCal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  // 调用Tushare API获取交易日历数据
  const fetchTradeCalendar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const requestData = {
        api_name: "trade_cal",
        // Token is now handled by the backend API route
        params: {
          exchange: "",
          start_date: "20250501",
          end_date: "20250601",
          is_open: "0"
        },
        fields: "exchange,cal_date,is_open,pretrade_date"
      };

      const response = await fetch('/api/tushare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TushareResponse = await response.json();
      
      if (result.code !== 0) {
        throw new Error(result.msg || '接口调用失败');
      }

      // 转换数据格式
      const formattedData: TradeCal[] = result.data.items.map(item => ({
        exchange: item[0],
        cal_date: item[1],
        is_open: item[2],
        pretrade_date: item[3]
      }));

      setTradeCalData(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
      console.error('获取交易日历数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'} p-6`}>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        ☕️ 股票交易日历
      </h1>
      
      {/* 操作按钮 */}
      <div className="mb-6">
        <button
          onClick={fetchTradeCalendar}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '获取中...' : '获取交易日历数据'}
        </button>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>错误:</strong> {error}
        </div>
      )}

      {/* 数据展示 */}
      {tradeCalData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">交易日历数据</h2>
            <p className="text-sm text-gray-600 mt-1">共 {tradeCalData.length} 条记录</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    交易所
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    是否开市
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    前一交易日
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tradeCalData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.exchange || 'SSE'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.cal_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.is_open === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.is_open === 1 ? '开市' : '休市'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.pretrade_date || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API调用说明 */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">API调用说明</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>接口:</strong> http://api.tushare.pro</p>
          <p><strong>方法:</strong> POST</p>
          <p><strong>参数:</strong></p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{JSON.stringify({
  "api_name": "trade_cal",
  // Token is now handled by the backend API route
  "params": {
    "exchange": "",
    "start_date": "20240901",
    "end_date": "20241001",
    "is_open": "0"
  },
  "fields": "exchange,cal_date,is_open,pretrade_date"
}, null, 2)}
          </pre>
          <p className="text-orange-600">
            <strong>注意:</strong> Tushare API token 现在由后端处理。请确保在服务器环境变量中设置了 `TUSHARE_TOKEN`。
          </p>
        </div>
      </div>
    </div>
  );
}
