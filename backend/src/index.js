const express = require('express')
const cors = require('cors')
const path = require('path')

// 导入路由
const overviewRoutes = require('./routes/overview')
const indicatorRoutes = require('./routes/indicator')
const logicChainRoutes = require('./routes/logicChain')
const historyRoutes = require('./routes/history')

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// API路由
app.use('/api/overview', overviewRoutes)
app.use('/api/indicators', indicatorRoutes)  // 修复为复数形式
app.use('/api/logic-chain', logicChainRoutes)
app.use('/api/history', historyRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Macro Insight API is running',
    timestamp: new Date().toISOString()
  })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    timestamp: new Date().toISOString()
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`Macro Insight API server running on port ${PORT}`)
})