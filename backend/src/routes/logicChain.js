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
    const logicChainRows = await query(`
      SELECT lc.*, ls.id as step_id, ls.step_order, ls.title, ls.description, 
             ls.explanation, ls.analogy, ls.historical_case
      FROM logic_chains lc
      LEFT JOIN logic_steps ls ON lc.id = ls.chain_id
      WHERE lc.indicator_id = ?
      ORDER BY ls.step_order
    `, [symbol])

    // 组织逻辑链条数据结构
    let logicChainData = null
    if (logicChainRows && logicChainRows.length > 0) {
      const steps = logicChainRows
        .filter(row => row.step_id)
        .map(row => ({
          id: row.step_id,
          title: row.title,
          description: row.description,
          explanation: row.explanation,
          analogy: row.analogy,
          historicalCase: row.historical_case
        }))

      logicChainData = {
        id: logicChainRows[0].id,
        indicatorId: symbol,
        steps: steps
      }
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
