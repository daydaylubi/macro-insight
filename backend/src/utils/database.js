const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// 数据库文件路径
const dbPath = path.join(__dirname, '../database.sqlite')

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to SQLite database')
    initDatabase()
  }
})

// 初始化数据库表
function initDatabase() {
  // 创建指标表
  db.run(`
    CREATE TABLE IF NOT EXISTS indicators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      importance INTEGER NOT NULL,
      description TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating indicators table:', err.message)
    } else {
      console.log('Indicators table created or already exists')
      insertDefaultIndicators()
    }
  })

  // 创建数据点表
  db.run(`
    CREATE TABLE IF NOT EXISTS data_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      indicator_id INTEGER NOT NULL,
      release_date TEXT NOT NULL,
      actual_value REAL NOT NULL,
      expected_value REAL,
      previous_value REAL,
      impact_level TEXT NOT NULL,
      change_direction TEXT NOT NULL,
      change_amount REAL NOT NULL,
      FOREIGN KEY (indicator_id) REFERENCES indicators (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating data_points table:', err.message)
    } else {
      console.log('Data_points table created or already exists')
    }
  })

  // 创建逻辑链条表
  db.run(`
    CREATE TABLE IF NOT EXISTS logic_chains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      indicator_id INTEGER NOT NULL,
      chain_data TEXT NOT NULL,
      FOREIGN KEY (indicator_id) REFERENCES indicators (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating logic_chains table:', err.message)
    } else {
      console.log('Logic_chains table created or already exists')
      insertDefaultLogicChains()
    }
  })
  
  // 创建逻辑步骤表
  db.run(`
    CREATE TABLE IF NOT EXISTS logic_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chain_id INTEGER NOT NULL,
      step_order INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      explanation TEXT,
      analogy TEXT,
      historical_case TEXT,
      FOREIGN KEY (chain_id) REFERENCES logic_chains (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating logic_steps table:', err.message)
    } else {
      console.log('Logic_steps table created or already exists')
    }
  })
}

// 插入默认指标数据
const defaultIndicators = require('./default-indicators')
const defaultLogicChains = require('./default-logic-chains')

function insertDefaultIndicators() {
  const indicators = defaultIndicators;

  indicators.forEach(indicator => {
    db.run(
      `INSERT OR IGNORE INTO indicators (symbol, name, category, importance, description)
       VALUES (?, ?, ?, ?, ?)`,
      [indicator.symbol, indicator.name, indicator.category, indicator.importance, indicator.description]
    );
  });
}

// 插入默认逻辑链条数据
function insertDefaultLogicChains() {
  const logicChains = defaultLogicChains;

  logicChains.forEach(chain => {
    // 先获取指标ID
    db.get(`SELECT id FROM indicators WHERE symbol = ?`, [chain.indicatorId], (err, indicator) => {
      if (err) {
        console.error(`Error finding indicator ${chain.indicatorId}:`, err.message);
        return;
      }
      
      if (!indicator) {
        console.error(`Indicator ${chain.indicatorId} not found, cannot insert logic chain`);
        return;
      }
      
      // 插入逻辑链条
      const chainData = JSON.stringify(chain);
      db.run(
        `INSERT OR IGNORE INTO logic_chains (indicator_id, chain_data) 
         VALUES (?, ?)`,
        [indicator.id, chainData],
        function(err) {
          if (err) {
            console.error(`Error inserting logic chain for ${chain.indicatorId}:`, err.message);
            return;
          }
          
          const chainId = this.lastID;
          console.log(`Logic chain for ${chain.indicatorId} inserted with ID ${chainId}`);
          
          // 插入逻辑步骤
          chain.steps.forEach(step => {
            db.run(
              `INSERT OR IGNORE INTO logic_steps 
               (chain_id, step_order, title, description, explanation, analogy, historical_case)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                chainId, 
                step.stepOrder, 
                step.title, 
                step.description, 
                step.explanation, 
                step.analogy, 
                step.historicalCase
              ],
              (err) => {
                if (err) {
                  console.error(`Error inserting logic step for chain ${chainId}:`, err.message);
                }
              }
            );
          });
        }
      );
    });
  });
}


// 数据库查询工具函数
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ id: this.lastID, changes: this.changes })
      }
    })
  })
}

module.exports = {
  db,
  query,
  run
} 