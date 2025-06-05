'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 模拟股票数据
const stocksData = [
  { id: '1', code: 'AAPL', name: '苹果', price: 182.52, change: +1.25, changePercent: +0.69 },
  { id: '2', code: 'MSFT', name: '微软', price: 425.22, change: +2.80, changePercent: +0.66 },
  { id: '3', code: 'GOOGL', name: '谷歌', price: 175.98, change: -0.58, changePercent: -0.33 },
  { id: '4', code: 'AMZN', name: '亚马逊', price: 178.75, change: +1.32, changePercent: +0.74 },
  { id: '5', code: 'TSLA', name: '特斯拉', price: 248.42, change: -3.25, changePercent: -1.29 },
  { id: '6', code: 'NVDA', name: '英伟达', price: 950.02, change: +15.40, changePercent: +1.65 },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  // 处理股票点击，跳转到详情页
  const handleStockClick = (stockId: string) => {
    router.push(`/stock/${stockId}`);
  };

  return (
    <div className={`min-h-screen transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'} p-6`}>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">热门股票</h1>
      
      {/* 股票列表 */}
      <section className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocksData.map((stock) => (
          <div 
            key={stock.id}
            onClick={() => handleStockClick(stock.id)}
            className="p-4 bg-white/5 rounded-xl backdrop-blur-lg hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{stock.name}</h3>
                <p className="text-sm opacity-70">{stock.code}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono font-semibold">${stock.price.toFixed(2)}</p>
                <p className={`text-sm font-mono ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 实时行情图表 */}
      <div className="mt-12 p-6 bg-white/5 rounded-xl backdrop-blur-lg hover:shadow-2xl transition-all">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
          实时行情走势
        </h3>
        <div className="mt-4 h-64 bg-gray-800/50 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
