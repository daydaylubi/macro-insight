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
    }
  })
}

// 插入默认指标数据
const defaultIndicators = require('./default-indicators')
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