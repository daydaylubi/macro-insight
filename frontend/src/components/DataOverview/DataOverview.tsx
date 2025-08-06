import React, { useState, useEffect } from 'react'
import { DataPoint, Indicator } from '../../types'

interface DataOverviewProps {
  selectedIndicator: string;
  indicators: Indicator[];
}

const DataOverview: React.FC<DataOverviewProps> = ({ selectedIndicator }) => {
  const [latestData, setLatestData] = useState<DataPoint[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const overviewResponse = await fetch(`/api/overview?selectedIndicator=${selectedIndicator}`)
        if (overviewResponse.ok) {
          const responseData = await overviewResponse.json()
          const latestDataPoints: DataPoint[] = responseData.data?.latestData || []
          const upcomingEventsData = responseData.data?.upcomingEvents || []
          setLatestData(latestDataPoints)
          setUpcomingEvents(upcomingEventsData)
        } else {
          console.error('API request failed:', overviewResponse.status, overviewResponse.statusText)
          setLatestData([])
          setUpcomingEvents([])
        }
        
      } catch (error) {
        console.error('Error fetching data from API:', error)
        setLatestData([])
        setUpcomingEvents([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [selectedIndicator])

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return '↗'
      case 'down': return '↘'
      case 'stable': return '→'
      default: return '→'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">数据概览</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // 使用后端API返回的下次数据信息
  const nextData = upcomingEvents.length > 0 ? upcomingEvents[0] : null

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">数据概览</h2>
        <div className="text-sm text-gray-600">
          当前指标: {selectedIndicator}
        </div>
      </div>

      {/* 最新数据 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">最新数据 <span className="text-sm text-gray-500 font-normal">（截止最近一次公布）</span></h3>
        <div className="space-y-4">
          {latestData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>暂无{selectedIndicator}指标数据</p>
            </div>
          ) : (
            latestData.map((data) => (
              <div key={data.id} className="border rounded-lg p-4">
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">实际值</p>
                    <p className="font-medium text-lg">{data.actual_value} {getDirectionIcon(data.change_direction)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">预期值</p>
                    <p className="font-medium text-lg">{data.expected_value}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">前值</p>
                    <p className="font-medium text-lg">{data.previous_value}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700 font-medium">市场影响分析：</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {data.indicator_symbol === 'PCE' && 'PCE超预期上涨，通胀压力加大，股市可能承压，债券收益率上升。'}
                    {data.indicator_symbol === 'CPI' && 'CPI同比上涨，通胀压力仍存，可能影响美联储降息节奏。'}
                  </p>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  发布日期：{new Date(data.release_date).toLocaleDateString('zh-CN')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 下次数据 */}
      {nextData && (
        <div>
          <h3 className="text-lg font-medium mb-3">下次数据</h3>
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
            <div className="flex justify-between items-start mb-2">
              <p className="text-orange-800 font-medium">{nextData.indicator_symbol}</p>
              <span className="text-orange-600 text-sm font-medium">{new Date(nextData.release_date).toLocaleDateString('zh-CN')} {nextData.release_time || ''}</span>
            </div>
            <p className="text-orange-700 text-sm">{nextData.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataOverview