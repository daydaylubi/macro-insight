import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Indicator, ApiResponse } from '../../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface HistoryChartProps {
  selectedIndicator: string;
  indicators: Indicator[];
}

interface HistoricalDataResponse {
  indicator: Indicator;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  } | null;
  period: string;
}

const HistoryChart: React.FC<HistoryChartProps> = ({ selectedIndicator, indicators }) => {
  const [timeRange, setTimeRange] = useState('12m')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [historicalData, setHistoricalData] = useState<Record<string, any> | null>(null)
  
  // 从API获取历史数据
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!selectedIndicator) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/history/${selectedIndicator}?period=${timeRange}`);
        
        if (!response.ok) {
          throw new Error(`API response not ok: ${response.status}`);
        }
        
        const responseData: ApiResponse<HistoricalDataResponse> = await response.json();
        
        if (!responseData.success) {
          throw new Error(responseData.message || 'Failed to fetch historical data');
        }
        
        // 更新历史数据
        setHistoricalData(prev => ({
          ...prev,
          [timeRange]: responseData.data.chartData
        }));
        
      } catch (error) {
        console.error('获取历史数据失败:', error);
        setError(error instanceof Error ? error.message : '获取历史数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoricalData();
  }, [selectedIndicator, timeRange]);
  
  // 获取当前时间范围的数据
  const currentData = historicalData && historicalData[timeRange];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false, // 隐藏图例，因为只有一个指标数据
        onClick: () => {}, // 禁用图例点击交互
      },
      title: {
        display: true,
        text: `${selectedIndicator}历史走势`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    // 禁用图表上的点击交互，防止切换数据集
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'] as ('mousemove' | 'mouseout' | 'touchstart' | 'touchmove')[],
  }

  // 基于实际数据的简单趋势分析
  const getTrendAnalysis = () => {
    // 如果没有数据，返回默认分析
    if (!currentData || !currentData.datasets || !currentData.datasets[0] || !currentData.datasets[0].data) {
      return {
        position: '数据加载中...',
        trend: '分析中...',
        focus: '请等待数据加载完成'
      }
    }

    const data = currentData.datasets[0].data;
    const lastValue = data[data.length - 1];
    const secondLastValue = data[data.length - 2];
    
    // 计算最近变化趋势
    const recentTrend = lastValue > secondLastValue ? '上升' : lastValue < secondLastValue ? '下降' : '稳定';
    
    // 计算整体趋势（简单方法：比较第一个和最后一个值）
    const firstValue = data[0];
    const overallTrend = lastValue > firstValue ? '整体上升' : lastValue < firstValue ? '整体下降' : '整体稳定';
    
    // 计算数据在范围中的位置（简单百分比）
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const position = range === 0 ? 50 : Math.round(((lastValue - min) / range) * 100);
    
    const indicatorName = indicators.find(ind => ind.symbol === selectedIndicator)?.name || selectedIndicator;
    
    return {
      position: `当前${indicatorName}处于近期数据的${position}%分位数`,
      trend: `${recentTrend}趋势，${overallTrend}`,
      focus: `关注${indicatorName}的持续变化趋势`
    }
  }

  const trendAnalysis = getTrendAnalysis();

  // 关键节点数据（保留静态数据，未来可以从API获取）
  const keyEvents = [
    {
      date: '2022年3月',
      event: '美联储开始加息周期',
      color: 'bg-red-500'
    },
    {
      date: '2023年6月',
      event: '通胀见顶回落',
      color: 'bg-blue-500'
    },
    {
      date: '2023年12月',
      event: '就业市场保持强劲',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">历史数据与周期对比</h2>
        <div className="text-sm text-gray-600">
          当前指标: {selectedIndicator}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setTimeRange('12m')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === '12m' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            disabled={loading}
          >
            近12个月
          </button>
          <button
            onClick={() => setTimeRange('3y')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === '3y' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            disabled={loading}
          >
            近3年
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-red-500">
            <p>加载数据出错: {error}</p>
          </div>
        ) : currentData ? (
          <div className="h-64">
            <Line options={options} data={currentData} />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            {selectedIndicator ? `没有找到${selectedIndicator}的历史数据` : '请选择一个指标'}
          </div>
        )}
      </div>

      {/* 趋势分析 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">当前位置</h4>
          <p className="text-sm text-blue-700">{trendAnalysis.position}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">趋势判断</h4>
          <p className="text-sm text-green-700">{trendAnalysis.trend}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">关注要点</h4>
          <p className="text-sm text-purple-700">{trendAnalysis.focus}</p>
        </div>
      </div>

      {/* 关键节点标注 */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">关键节点</h3>
        <div className="space-y-2 text-sm">
          {keyEvents.map((event, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${event.color} rounded-full`}></div>
              <span className="text-gray-600">{event.date}：{event.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistoryChart