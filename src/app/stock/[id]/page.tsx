'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 模拟股票数据 - 实际应用中应该从API获取
const stocksData = [
  { id: '1', code: 'AAPL', name: '苹果', price: 182.52, change: +1.25, changePercent: +0.69 },
  { id: '2', code: 'MSFT', name: '微软', price: 425.22, change: +2.80, changePercent: +0.66 },
  { id: '3', code: 'GOOGL', name: '谷歌', price: 175.98, change: -0.58, changePercent: -0.33 },
  { id: '4', code: 'AMZN', name: '亚马逊', price: 178.75, change: +1.32, changePercent: +0.74 },
  { id: '5', code: 'TSLA', name: '特斯拉', price: 248.42, change: -3.25, changePercent: -1.29 },
  { id: '6', code: 'NVDA', name: '英伟达', price: 950.02, change: +15.40, changePercent: +1.65 },
];

// 模拟历史数据
const generateHistoricalData = () => {
  const data = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.random() * 100 + 150,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }
  return data;
};

type StockDetailProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StockDetail({ params: paramsPromise, searchParams: searchParamsPromise }: StockDetailProps) {
  const params = await paramsPromise;
  const searchParams = searchParamsPromise ? await searchParamsPromise : undefined;
  const [stock, setStock] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [historicalData] = useState(generateHistoricalData());
  const router = useRouter();

  useEffect(() => {
    // 在实际应用中，这里应该从API获取股票详情
    const stockDetail = stocksData.find(s => s.id === params.id);
    setStock(stockDetail);
    setLoaded(true);
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen p-6">
        <button 
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
        >
          ← 返回
        </button>
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold">未找到股票信息</h2>
          <p className="mt-2 opacity-70">请检查股票ID是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 transition-opacity duration-500 opacity-100">
      <button 
        onClick={handleBack}
        className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
      >
        ← 返回
      </button>
      
      {/* 股票基本信息 */}
      <div className="p-6 bg-white/5 rounded-xl backdrop-blur-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{stock.name}</h1>
            <p className="text-lg opacity-70">{stock.code}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono font-semibold">${stock.price.toFixed(2)}</p>
            <p className={`text-lg font-mono ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="mt-8 p-6 bg-white/5 rounded-xl backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4">价格走势</h2>
        <div className="h-80 bg-gray-800/50 rounded-lg">
          {/* 这里应该集成实际的图表库，如Chart.js或Recharts */}
          <div className="h-full flex items-center justify-center">
            <p className="text-center opacity-70">图表区域 - 实际应用中应集成图表库</p>
          </div>
        </div>
      </div>

      {/* 历史数据表格 */}
      <div className="mt-8 p-6 bg-white/5 rounded-xl backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4">历史数据</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 text-left">日期</th>
                <th className="py-2 text-right">价格</th>
                <th className="py-2 text-right">成交量</th>
              </tr>
            </thead>
            <tbody>
              {historicalData.slice(0, 10).map((data, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 text-left">{data.date}</td>
                  <td className="py-3 text-right font-mono">${data.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-mono">{data.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 相关新闻 */}
      <div className="mt-8 p-6 bg-white/5 rounded-xl backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4">相关新闻</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
              <h3 className="text-lg font-semibold">关于{stock.name}的最新动态</h3>
              <p className="mt-1 opacity-70">这是一条关于{stock.name}的模拟新闻内容，实际应用中应从API获取...</p>
              <p className="mt-2 text-sm opacity-50">2023-06-{10 + item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}