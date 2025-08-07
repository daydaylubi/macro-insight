const express = require('express')
const router = express.Router()
const { query } = require('../utils/database')

// 获取指定指标的历史数据
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const { period = '12m' } = req.query

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

    // 根据时间范围计算起始日期
    const now = new Date();
    let startDate = '';
    if (period === '3y') {
      // 创建新的Date对象，避免修改原始now对象
      const threeYearsAgo = new Date(now);
      threeYearsAgo.setFullYear(now.getFullYear() - 3);
      startDate = threeYearsAgo.toISOString().split('T')[0];
    } else { // 默认 '12m'
      // 创建新的Date对象，避免修改原始now对象
      const twelveMonthsAgo = new Date(now);
      twelveMonthsAgo.setMonth(now.getMonth() - 12);
      startDate = twelveMonthsAgo.toISOString().split('T')[0];
    }

    // 获取历史数据
    const historicalData = await query(`
      SELECT release_date, actual_value FROM data_points 
      WHERE indicator_id = ? AND release_date >= ?
      ORDER BY release_date ASC
    `, [indicator[0].id, startDate])

    // 组织图表数据格式
    let chartData = null
    if (historicalData && historicalData.length > 0) {
      const labels = historicalData.map(row => row.release_date)
      const values = historicalData.map(row => row.actual_value)
      
      chartData = {
        labels: labels,
        datasets: [{
          label: indicator[0].name,
          data: values,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        }]
      }
    }

    res.json({
      success: true,
      data: {
        indicator: indicator[0],
        chartData: chartData,
        period: period
      },
      message: 'Historical data retrieved successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching historical data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data',
      timestamp: new Date().toISOString()
    })
  }
})

module.exports = router
