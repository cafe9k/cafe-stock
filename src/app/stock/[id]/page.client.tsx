'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import StockDetailClient from './StockDetailClient';

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

export default function StockDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [historicalData] = useState(generateHistoricalData());

  useEffect(() => {
    // 在实际应用中，这里应该从API获取股票详情
    const stockDetail = stocksData.find(s => s.id === id);
    setStock(stockDetail);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen p-6">
        <Link 
          href="/"
          className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all inline-block"
        >
          ← 返回
        </Link>
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold">未找到股票信息</h2>
          <p className="mt-2 opacity-70">请检查股票ID是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 transition-opacity duration-500 opacity-100">
      <Link 
        href="/"
        className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all inline-block"
      >
        ← 返回
      </Link>
      
      {/* 使用客户端组件处理交互功能 */}
      <StockDetailClient stock={stock} historicalData={historicalData} />
    </div>
  );
}