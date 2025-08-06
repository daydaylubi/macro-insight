import React, { useState } from 'react'
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
import { Indicator } from '../../types'

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

const HistoryChart: React.FC<HistoryChartProps> = ({ selectedIndicator, indicators }) => {
  const [timeRange, setTimeRange] = useState('12m')

  // 模拟历史数据
  const getHistoricalData = () => {
    // 根据选中的指标返回对应的历史数据
    const data: Record<string, Record<string, any>> = {
      PCE: {
        '12m': {
          labels: ['2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12', '2024-01'],
          datasets: [
            {
              label: 'PCE同比',
              data: [5.1, 4.9, 4.7, 4.5, 4.3, 4.1, 3.9, 3.7, 3.5, 3.3, 3.1, 3.2],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.1
            }
          ]
        },
        '3y': {
          labels: ['2021-Q1', '2021-Q2', '2021-Q3', '2021-Q4', '2022-Q1', '2022-Q2', '2022-Q3', '2022-Q4', '2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4'],
          datasets: [
            {
              label: 'PCE同比',
              data: [2.1, 2.3, 2.5, 2.8, 3.2, 3.8, 4.2, 4.7, 4.9, 4.5, 4.1, 3.7],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.1
            }
          ]
        }
      },

      CPI: {
        '12m': {
          labels: ['2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12', '2024-01'],
          datasets: [
            {
              label: 'CPI同比',
              data: [6.0, 5.8, 5.5, 5.2, 4.9, 4.6, 4.3, 4.0, 3.8, 3.6, 3.4, 3.4],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.1
            }
          ]
        },
        '3y': {
          labels: ['2021-Q1', '2021-Q2', '2021-Q3', '2021-Q4', '2022-Q1', '2022-Q2', '2022-Q3', '2022-Q4', '2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4'],
          datasets: [
            {
              label: 'CPI同比',
              data: [2.5, 2.8, 3.0, 3.5, 4.0, 4.8, 5.5, 6.0, 6.2, 5.8, 5.0, 4.2],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.1
            }
          ]
        }
      },


    }
    
    // 如果没有选中指标或者没有对应的数据，返回空对象
    if (!selectedIndicator || !data[selectedIndicator]) {
      return null
    }
    
    return data[selectedIndicator]
  }
  
  const historicalData = getHistoricalData()

  // 确保只有当historicalData存在时才获取currentData
  let currentData = historicalData ? historicalData[timeRange as keyof typeof historicalData] : null
  
  // 确保数据集有正确的标签
  if (currentData && currentData.datasets) {
    // 深拷贝数据，避免修改原始数据
    currentData = {
      ...currentData,
      datasets: currentData.datasets.map((dataset: { label?: string; [key: string]: any }) => ({
        ...dataset,
        // 确保每个数据集都有标签
        label: dataset.label || `${indicators.find(ind => ind.symbol === selectedIndicator)?.name || selectedIndicator}数据`
      }))
    }
  }

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

  const getTrendAnalysis = () => {
    switch (selectedIndicator) {
      case 'PCE':
        return {
          position: '当前PCE处于近1年的75%分位数，属于偏高水平',
          trend: '下降趋势',
          focus: '关注通胀回落速度，预计未来1-2个月继续回落'
        }

      case 'CPI':
        return {
          position: '当前CPI处于中等水平，通胀压力温和',
          trend: '缓慢下降趋势',
          focus: '关注核心通胀表现，预计继续回落至目标区间'
        }


      default:
        return {
          position: '数据加载中...',
          trend: '分析中...',
          focus: '请选择指标查看分析'
        }
    }
  }

  const trendAnalysis = getTrendAnalysis()

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
          >
            近3年
          </button>
        </div>

        {currentData ? (
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
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">2022年3月：美联储开始加息周期</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">2023年6月：通胀见顶回落</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">2023年12月：就业市场保持强劲</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryChart