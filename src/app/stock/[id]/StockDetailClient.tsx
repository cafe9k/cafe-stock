'use client';

import { useState } from 'react';

type StockData = {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

type HistoricalDataPoint = {
  date: string;
  price: number;
  volume: number;
};

type StockDetailClientProps = {
  stock: StockData;
  historicalData: HistoricalDataPoint[];
};

export default function StockDetailClient({ stock, historicalData }: StockDetailClientProps) {
  // 客户端状态和交互逻辑
  const [activeTab, setActiveTab] = useState<'chart' | 'history' | 'news'>('chart');
  
  return (
    <>
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

      {/* 标签切换 */}
      <div className="mt-8 flex space-x-2 border-b border-white/10 pb-2">
        <button 
          onClick={() => setActiveTab('chart')}
          className={`px-4 py-2 rounded-t-lg transition-all ${activeTab === 'chart' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
        >
          价格走势
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-t-lg transition-all ${activeTab === 'history' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
        >
          历史数据
        </button>
        <button 
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-t-lg transition-all ${activeTab === 'news' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
        >
          相关新闻
        </button>
      </div>

      {/* 内容区域 */}
      <div className="mt-4">
        {activeTab === 'chart' && (
          <div className="p-6 bg-white/5 rounded-xl backdrop-blur-lg">
            <div className="h-80 bg-gray-800/50 rounded-lg">
              <div className="h-full flex items-center justify-center">
                <p className="text-center opacity-70">图表区域 - 实际应用中应集成图表库</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6 bg-white/5 rounded-xl backdrop-blur-lg">
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
        )}

        {activeTab === 'news' && (
          <div className="p-6 bg-white/5 rounded-xl backdrop-blur-lg">
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
        )}
      </div>
    </>
  );
}