import { useState, useEffect } from 'react'
import DataOverview from './components/DataOverview/DataOverview'
import LogicChain from './components/LogicChain/LogicChain'
import HistoryChart from './components/HistoryChart/HistoryChart'
import { Indicator } from './types'

function App() {
  const [selectedIndicator, setSelectedIndicator] = useState('')
  const [indicators, setIndicators] = useState<Indicator[]>([])

  // 获取指标数据
  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        console.log('Fetching indicators from backend API...');
        const response = await fetch('/api/indicators');
        
        if (!response.ok) {
          throw new Error(`API response not ok: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('Successfully fetched indicators from API:', responseData);
        const indicators = responseData.data || [];
        setIndicators(indicators);
        if (indicators.length > 0) {
          setSelectedIndicator(indicators[0].symbol);
        }
      } catch (error) {
        console.error('获取指标数据失败:', error);
        // 请求失败时，使用空数组
        setIndicators([]);
      }
    };

    fetchIndicators();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              宏观数据洞察
            </h1>
            <p className="text-sm text-gray-500">Macro Insight</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 当前分析指标模块 */}
          <section className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-medium mr-4">当前分析指标</h2>
                  <select
                    value={selectedIndicator}
                    onChange={(e) => setSelectedIndicator(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {indicators.map(indicator => (
                      <option key={indicator.symbol} value={indicator.symbol}>
                        {indicator.name} ({indicator.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 指标概念说明 */}
                {selectedIndicator && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">指标概念</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      {indicators.find(ind => ind.symbol === selectedIndicator)?.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">类别：</span>
                        <span className="text-blue-700">{indicators.find(ind => ind.symbol === selectedIndicator)?.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">重要程度：</span>
                        <span className="text-blue-700">
                          {indicators.find(ind => ind.symbol === selectedIndicator)?.importance === 3 ? '★★★' : 
                           indicators.find(ind => ind.symbol === selectedIndicator)?.importance === 2 ? '★★☆' : '★☆☆'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
            
          {/* 数据概览模块 */}
          <section>
            <DataOverview selectedIndicator={selectedIndicator} indicators={indicators} />
          </section>

          {/* 逻辑链条模块 */}
          <section>
            <LogicChain selectedIndicator={selectedIndicator} indicators={indicators} />
          </section>

          {/* 历史数据模块 */}
          <section>
            <HistoryChart selectedIndicator={selectedIndicator} indicators={indicators} />
          </section>

        </div>
      </main>
    </div>
  )
}

export default App