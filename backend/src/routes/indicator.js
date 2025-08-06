const express = require('express')
const router = express.Router()
const { query } = require('../utils/database')

// 获取所有指标列表
router.get('/', async (req, res) => {
  try {
    const indicators = await query(`
      SELECT * FROM indicators ORDER BY importance DESC, symbol ASC
    `)
    
    // 打印查询结果，用于调试
    console.log('查询到的指标数据（按importance降序，symbol升序）：');
    indicators.forEach((indicator, index) => {
      console.log(`[${index + 1}] ${indicator.name} (${indicator.symbol}): 重要性=${indicator.importance}`);
    });

    res.json({
      success: true,
      data: indicators || [],
      message: 'Indicators list retrieved successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching indicators:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch indicators',
      timestamp: new Date().toISOString()
    })
  }
})



module.exports = router 