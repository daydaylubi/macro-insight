import React, { useState, useEffect } from 'react'
import { LogicChain as LogicChainType, Indicator } from '../../types'

interface LogicChainProps {
  selectedIndicator: string;
  indicators: Indicator[];
}

const LogicChain: React.FC<LogicChainProps> = ({ selectedIndicator }) => {
  const [logicChainData, setLogicChainData] = useState<LogicChainType | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLogicChain = async () => {
      if (!selectedIndicator) return
      
      try {
        setLoading(true)
        console.log(`Fetching logic chain for ${selectedIndicator} from backend API...`)
        
        const response = await fetch(`/api/logic-chain/${selectedIndicator}`)
        if (response.ok) {
          const responseData = await response.json()
          console.log('Successfully fetched logic chain from API:', responseData)
          // 从API响应中提取logicChain数据
          const logicChain = responseData.data?.logicChain
          if (logicChain) {
            setLogicChainData(logicChain)
          } else {
            console.warn('No logic chain data found in API response')
            setLogicChainData(null)
          }
        } else {
          console.error('API request failed:', response.status, response.statusText)
          setLogicChainData(null)
        }
      } catch (error) {
        console.error('Error fetching logic chain data:', error)
        setLogicChainData(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLogicChain()
  }, [selectedIndicator])

  const currentChain = logicChainData

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">逻辑链条深度解析</h2>
        <div className="text-sm text-gray-600">
          当前指标: {selectedIndicator}
        </div>
      </div>

      {currentChain && (
        <div>
          {/* 逻辑链条流程图 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">逻辑链条</h3>
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {currentChain.steps?.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg min-w-[200px]">
                    <h4 className="font-medium text-blue-800">{step.title}</h4>
                    <p className="text-sm text-blue-600 mt-1">{step.description}</p>
                  </div>
                  {index < currentChain.steps.length - 1 && (
                    <div className="mx-2 text-blue-400">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 详细解读 */}
          <div>
            <h3 className="text-lg font-medium mb-4">详细解读</h3>
            <div className="space-y-4">
              {currentChain.steps?.map((step) => (
                <div key={step.id} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">为什么：</span>
                      <span className="text-gray-600">{step.explanation}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">类比说明：</span>
                      <span className="text-gray-600">{step.analogy}</span>
                    </div>
                    {step.historicalCase && (
                      <div>
                        <span className="font-medium text-gray-700">历史佐证：</span>
                        <span className="text-gray-600">{step.historicalCase}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 市场影响分析 */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">市场影响分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">股票市场</h4>
                <p className="text-sm text-green-700">
                  {selectedIndicator === 'PCE' 
                    ? '通胀压力加大，科技股可能承压，价值股相对抗跌'
                    : '就业强劲利好消费股，科技股受益于经济前景改善'
                  }
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">债券市场</h4>
                <p className="text-sm text-blue-700">
                  {selectedIndicator === 'PCE' 
                    ? '加息预期推动收益率上升，债券价格下跌'
                    : '经济强劲支撑收益率，但通胀预期温和'
                  }
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">汇率市场</h4>
                <p className="text-sm text-purple-700">
                  {selectedIndicator === 'PCE' 
                    ? '加息预期支撑美元走强，避险需求增加'
                    : '经济强劲支撑美元，风险偏好提升'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogicChain