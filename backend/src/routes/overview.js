const express = require('express')
const router = express.Router()
const { query } = require('../utils/database')

// 获取数据概览
router.get('/', async (req, res) => {
  try {
    const { selectedIndicator } = req.query

    if (!selectedIndicator) {
      return res.status(400).json({
        success: false,
        message: 'selectedIndicator parameter is required',
        timestamp: new Date().toISOString()
      })
    }

    // 获取指定指标的最新数据点（只返回一条）
    console.log('Querying for selectedIndicator:', selectedIndicator)
    const latestData = await query(`
      SELECT dp.*, i.name as indicator_name, i.symbol as indicator_symbol
      FROM data_points dp
      JOIN indicators i ON dp.indicator_id = i.id
      WHERE i.symbol = ?
      ORDER BY dp.release_date DESC
      LIMIT 1
    `, [selectedIndicator])
    
    console.log('Query result:', latestData)
    console.log('Query result length:', latestData ? latestData.length : 'null')

    // 获取指定指标的下次发布事件
    const upcomingEvents = await query(`
      SELECT ue.*, i.name as indicator_name, i.symbol as indicator_symbol
      FROM upcoming_events ue
      JOIN indicators i ON ue.indicator_id = i.symbol
      WHERE i.symbol = ?
      ORDER BY ue.release_date ASC
      LIMIT 1
    `, [selectedIndicator])
    
    console.log('Upcoming events result:', upcomingEvents)

    res.json({
      success: true,
      data: {
        latestData: latestData || [],
        upcomingEvents: upcomingEvents || []
      },
      message: 'Overview data retrieved successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching overview data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview data',
      timestamp: new Date().toISOString()
    })
  }
})

module.exports = router