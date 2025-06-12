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
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">☕️</h1>
    </div>
  );
}
