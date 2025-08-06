// 经济指标类型
export interface Indicator {
  id: string
  symbol: string
  name: string
  category: string
  importance: 1 | 2 | 3
  description: string
}

// 数据点类型（匹配后端API响应格式）
export interface DataPoint {
  id: number
  indicator_id: number
  release_date: string
  actual_value: number
  expected_value: number
  previous_value: number
  impact_level: 'low' | 'medium' | 'high'
  change_direction: 'up' | 'down' | 'stable'
  change_amount: number
  indicator_name: string
  indicator_symbol: string
}

// 逻辑链条类型
export interface LogicChain {
  id: string
  indicatorId: string
  steps: LogicStep[]
}

export interface LogicStep {
  id: string
  title: string
  description: string
  explanation: string
  analogy: string
  historicalCase?: string
}

// 市场影响类型
export interface MarketImpact {
  stocks: {
    sectors: string[]
    impact: 'positive' | 'negative' | 'neutral'
    explanation: string
  }
  bonds: {
    yieldChange: string
    explanation: string
  }
  forex: {
    dollarStrength: 'stronger' | 'weaker' | 'stable'
    explanation: string
  }
}

// 概念解释类型
export interface Concept {
  id: string
  term: string
  definition: string
  importance: string
  interpretation: string
  mnemonic: string
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  timestamp: string
} 