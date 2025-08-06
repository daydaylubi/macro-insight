/**
 * Mock数据管理工具
 * 
 * 这个脚本用于测试目的，可以将mock数据插入到数据库或从数据库中删除。
 * 使用方法：
 * - 导入数据: node mock-data-manager.js import
 * - 删除数据: node mock-data-manager.js delete
 * - 重置数据: node mock-data-manager.js reset
 * - 查看状态: node mock-data-manager.js status
 */

const path = require('path');
const fs = require('fs');
const { db, query, run } = require('./database');

// 读取mock数据文件
const mockDataPath = path.join(__dirname, '../../data/mock-data.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

// 生成唯一的测试数据标识符（用于后续删除）
const TEST_DATA_MARKER = 'MOCK_TEST_DATA';

/**
 * 导入mock数据到数据库
 */
async function importMockData() {
  try {
    console.log('开始导入mock数据...');
    
    // 1. 导入数据点
    if (mockData.dataPoints && mockData.dataPoints.length > 0) {
      console.log(`导入 ${mockData.dataPoints.length} 条数据点...`);
      
      for (const dataPoint of mockData.dataPoints) {
        // 获取指标ID
        const indicators = await query(
          'SELECT id FROM indicators WHERE symbol = ?', 
          [dataPoint.indicatorId]
        );
        
        if (indicators.length === 0) {
          console.warn(`找不到指标 ${dataPoint.indicatorId}，跳过相关数据点`);
          continue;
        }
        
        const indicatorId = indicators[0].id;
        
        // 插入数据点
        await run(
          `INSERT INTO data_points 
           (indicator_id, release_date, actual_value, expected_value, previous_value, 
            impact_level, change_direction, change_amount, source) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            indicatorId,
            dataPoint.releaseDate,
            dataPoint.actualValue,
            dataPoint.expectedValue,
            dataPoint.previousValue,
            dataPoint.impactLevel,
            dataPoint.changeDirection,
            dataPoint.changeAmount,
            TEST_DATA_MARKER // 标记为测试数据
          ]
        );
      }
      console.log('数据点导入完成');
    }
    
    // 2. 导入即将发布的事件
    if (mockData.upcomingEvents && mockData.upcomingEvents.length > 0) {
      console.log(`导入 ${mockData.upcomingEvents.length} 条即将发布的事件...`);
      
      // 首先创建upcoming_events表（如果不存在）
      await run(`
        CREATE TABLE IF NOT EXISTS upcoming_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          indicator_id TEXT NOT NULL,
          release_date TEXT NOT NULL,
          expected_value REAL,
          importance TEXT,
          description TEXT,
          source TEXT
        )
      `);
      
      for (const event of mockData.upcomingEvents) {
        // 插入即将发布的事件
        await run(
          `INSERT INTO upcoming_events 
           (indicator_id, release_date, expected_value, importance, description, source) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            event.indicatorId,
            event.releaseDate,
            event.expectedValue,
            event.importance,
            event.description,
            TEST_DATA_MARKER // 标记为测试数据
          ]
        );
      }
      console.log('即将发布的事件导入完成');
    }
    
    // 3. 导入历史数据
    if (mockData.historicalData && mockData.historicalData.length > 0) {
      console.log(`导入 ${mockData.historicalData.length} 条历史数据...`);
      
      // 首先创建historical_data表（如果不存在）
      await run(`
        CREATE TABLE IF NOT EXISTS historical_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          indicator_id TEXT NOT NULL,
          date TEXT NOT NULL,
          value REAL NOT NULL,
          source TEXT
        )
      `);
      
      for (const data of mockData.historicalData) {
        // 插入历史数据
        await run(
          `INSERT INTO historical_data 
           (indicator_id, date, value, source) 
           VALUES (?, ?, ?, ?)`,
          [
            data.indicatorId,
            data.date,
            data.value,
            TEST_DATA_MARKER // 标记为测试数据
          ]
        );
      }
      console.log('历史数据导入完成');
    }
    
    console.log('所有mock数据导入完成！');
  } catch (error) {
    console.error('导入mock数据时出错:', error);
    throw error;
  }
}

/**
 * 从数据库中删除mock数据
 */
async function deleteMockData() {
  try {
    console.log('开始删除mock数据...');
    
    // 1. 删除数据点
    const dataPointsResult = await run(
      'DELETE FROM data_points WHERE source = ?',
      [TEST_DATA_MARKER]
    );
    console.log(`已删除 ${dataPointsResult.changes} 条数据点`);
    
    // 2. 删除即将发布的事件（如果表存在）
    try {
      const upcomingEventsResult = await run(
        'DELETE FROM upcoming_events WHERE source = ?',
        [TEST_DATA_MARKER]
      );
      console.log(`已删除 ${upcomingEventsResult.changes} 条即将发布的事件`);
    } catch (error) {
      console.log('upcoming_events表可能不存在，跳过');
    }
    
    // 3. 删除历史数据（如果表存在）
    try {
      const historicalDataResult = await run(
        'DELETE FROM historical_data WHERE source = ?',
        [TEST_DATA_MARKER]
      );
      console.log(`已删除 ${historicalDataResult.changes} 条历史数据`);
    } catch (error) {
      console.log('historical_data表可能不存在，跳过');
    }
    
    console.log('所有mock数据删除完成！');
  } catch (error) {
    console.error('删除mock数据时出错:', error);
    throw error;
  }
}

/**
 * 重置mock数据（先删除再导入）
 */
async function resetMockData() {
  try {
    await deleteMockData();
    await importMockData();
    console.log('Mock数据重置完成！');
  } catch (error) {
    console.error('重置mock数据时出错:', error);
    throw error;
  }
}

/**
 * 显示当前mock数据状态
 */
async function showStatus() {
  try {
    console.log('当前mock数据状态:');
    
    // 1. 检查数据点
    const dataPoints = await query(
      'SELECT COUNT(*) as count FROM data_points WHERE source = ?',
      [TEST_DATA_MARKER]
    );
    console.log(`- 数据点: ${dataPoints[0].count} 条`);
    
    // 2. 检查即将发布的事件
    try {
      const upcomingEvents = await query(
        'SELECT COUNT(*) as count FROM upcoming_events WHERE source = ?',
        [TEST_DATA_MARKER]
      );
      console.log(`- 即将发布的事件: ${upcomingEvents[0].count} 条`);
    } catch (error) {
      console.log('- 即将发布的事件: 表不存在');
    }
    
    // 3. 检查历史数据
    try {
      const historicalData = await query(
        'SELECT COUNT(*) as count FROM historical_data WHERE source = ?',
        [TEST_DATA_MARKER]
      );
      console.log(`- 历史数据: ${historicalData[0].count} 条`);
    } catch (error) {
      console.log('- 历史数据: 表不存在');
    }
    
    // 4. 显示数据库中的所有表
    const tables = await query(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log('- 数据库中的表:');
    tables.forEach(table => {
      console.log(`  * ${table.name}`);
    });
    
  } catch (error) {
    console.error('获取状态时出错:', error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  const command = process.argv[2];
  
  if (!command) {
    console.log('请指定命令: import, delete, reset, 或 status');
    process.exit(1);
  }
  
  try {
    switch (command.toLowerCase()) {
      case 'import':
        await importMockData();
        break;
      case 'delete':
        await deleteMockData();
        break;
      case 'reset':
        await resetMockData();
        break;
      case 'status':
        await showStatus();
        break;
      default:
        console.log('未知命令。可用命令: import, delete, reset, 或 status');
        process.exit(1);
    }
    
    // 关闭数据库连接
    db.close();
    
  } catch (error) {
    console.error('执行命令时出错:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行main函数
if (require.main === module) {
  main();
}

// 导出函数以便其他模块使用
module.exports = {
  importMockData,
  deleteMockData,
  resetMockData,
  showStatus
};