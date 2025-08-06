const express = require('express')
const router = express.Router()
const { query } = require('../utils/database')

// 获取指定指标的逻辑链条
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params

    // 获取指标信息
    const indicator = await query(`
      SELECT * FROM indicators WHERE symbol = ?
    `, [symbol])

    if (indicator.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Indicator not found',
        timestamp: new Date().toISOString()
      })
    }

    // 获取逻辑链条数据
    const logicChains = await query(`
      SELECT lc.* FROM logic_chains lc
      JOIN indicators i ON lc.indicator_id = i.id
      WHERE i.symbol = ?
    `, [symbol])

    if (logicChains.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Logic chain not found for this indicator',
        timestamp: new Date().toISOString()
      })
    }

    // 获取逻辑步骤数据
    const steps = await query(`
      SELECT ls.* FROM logic_steps ls
      JOIN logic_chains lc ON ls.chain_id = lc.id
      JOIN indicators i ON lc.indicator_id = i.id
      WHERE i.symbol = ?
      ORDER BY ls.step_order
    `, [symbol])

    // 组织逻辑链条数据结构
    const logicChainData = {
      id: logicChains[0].id,
      indicatorId: symbol,
      steps: steps.map(step => ({
        id: step.id,
        stepOrder: step.step_order,
        title: step.title,
        description: step.description,
        explanation: step.explanation,
        analogy: step.analogy,
        historicalCase: step.historical_case
      }))
    }

    res.json({
      success: true,
      data: {
        indicator: indicator[0],
        logicChain: logicChainData
      },
      message: 'Logic chain retrieved successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching logic chain:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logic chain data',
      timestamp: new Date().toISOString()
    })
  }
})

module.exports = router
