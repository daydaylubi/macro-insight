# 宏观数据洞察（Macro Insight）技术架构设计文档

## 1. 架构概述

### 1.1 系统定位
本系统为宏观数据洞察产品的 MVP 版本，采用本地部署架构，面向投资新手提供宏观经济数据解读服务。

### 1.2 架构原则
- **简单性**：MVP 阶段优先考虑实现速度和维护简便性
- **本地化**：完全本地部署，无外部服务依赖
- **可扩展**：架构设计便于后续云端迁移
- **成本控制**：零运行成本，最小化技术复杂度

### 1.3 整体架构
采用经典的前后端分离架构：
```
前端层 (React SPA)
       ↓
API 网关层 (Express Router)
       ↓  
业务逻辑层 (Node.js Services)
       ↓
数据存储层 (SQLite + JSON Files)
       ↓
数据源层 (FRED API + Mock Data)
```

## 2. 技术栈选择

### 2.1 前端技术栈

| 技术组件 | 选择方案 | 选择理由 |
|---------|---------|---------|
| 前端框架 | React 18 + TypeScript | 生态成熟，开发效率高，类型安全 |
| 状态管理 | React Context API | MVP 阶段足够，避免过度工程化 |
| UI 框架 | Tailwind CSS | 快速开发，bundle 体积小 |
| 图表库 | Chart.js | 轻量级，适合经济数据可视化 |
| 构建工具 | Vite | 开发体验佳，构建速度快 |
| HTTP 客户端 | Fetch API | 原生支持，无额外依赖 |

### 2.2 后端技术栈

| 技术组件 | 选择方案 | 选择理由 |
|---------|---------|---------|
| 运行时 | Node.js 16+ | 前后端统一语言，生态丰富 |
| Web 框架 | Express.js | 轻量级，文档完善 |
| 数据库 | SQLite | 零配置，文件数据库，适合本地部署 |
| 数据库访问 | sqlite3 (原生) | 避免 ORM 复杂性，直接 SQL 操作 |
| 任务调度 | setTimeout/setInterval | 简单定时任务足够 MVP 需求 |
| 日志管理 | console + 文件输出 | MVP 阶段的简单日志方案 |

### 2.3 数据存储策略

| 数据类型 | 存储方案 | 说明 |
|---------|---------|------|
| 经济数据 | SQLite 表 | 结构化数据，支持查询和关联 |
| 指标配置 | JSON 文件 | 静态配置，便于修改 |
| 逻辑链条 | JSON 文件 | 模板化内容，支持快速调整 |
| 概念解释 | JSON 文件 | 教育内容，便于维护 |

## 3. 系统架构设计

### 3.1 模块划分

**前端模块架构**
```
src/
├── components/          # UI 组件层
│   ├── DataOverview/   # 数据概览模块
│   ├── LogicChain/     # 逻辑链条模块  
│   ├── HistoryChart/   # 历史数据图表模块
│   └── ConceptSidebar/ # 概念速查模块
├── services/           # 数据服务层
├── hooks/              # 业务逻辑层
├── types/              # 类型定义层
└── utils/              # 工具函数层
```

**后端模块架构**
```
src/
├── routes/             # API 路由层
├── services/           # 业务逻辑层
│   ├── DataService/    # 数据获取服务
│   ├── AnalysisService/# 分析逻辑服务
│   └── CacheService/   # 缓存服务
├── models/             # 数据模型层
├── utils/              # 工具函数层
└── config/             # 配置管理层
```

### 3.2 数据流设计

**请求处理流程**
1. 前端发起 API 请求
2. Express 路由分发到对应 Service
3. Service 层处理业务逻辑
4. 查询 SQLite 数据库或读取 JSON 配置
5. 数据处理和格式化
6. 返回标准化 JSON 响应

**数据更新流程**
1. 定时任务触发数据获取
2. 调用外部 API（FRED）或使用模拟数据
3. 数据清洗和标准化处理
4. 存储到 SQLite 数据库
5. 更新相关缓存

### 3.3 API 设计规范

**RESTful API 设计**
```
GET /api/overview           # 获取数据概览
GET /api/indicator/:symbol  # 获取指定指标详情
GET /api/logic-chain/:symbol # 获取逻辑链条
GET /api/history/:symbol    # 获取历史数据
GET /api/concepts          # 获取概念解释
POST /api/data/refresh     # 手动刷新数据
```

**响应格式标准**
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "timestamp": string
}
```

## 4. 数据库设计

### 4.1 表结构设计

**核心数据表**

*indicators* - 经济指标基础信息
- id (主键)
- symbol (指标代码，唯一)
- name (指标名称)
- category (分类)
- importance (重要程度 1-3)
- description (描述)

*data_points* - 经济数据点
- id (主键)
- indicator_id (外键)
- release_date (发布日期)
- actual_value (实际值)
- expected_value (预期值)
- previous_value (前值)
- impact_level (影响程度)

*logic_chains* - 逻辑链条存储
- id (主键)
- indicator_id (外键)
- chain_data (JSON 格式逻辑链条)

### 4.2 JSON 配置文件结构

**指标配置** (data/indicators.json)
- 指标基础信息
- FRED API 映射关系
- 显示优先级配置

**逻辑链条模板** (data/logic-chains.json)
- 指标对应的逻辑推演步骤
- 市场影响分析模板
- 投资建议模板

**概念解释** (data/concepts.json)
- 专业术语解释
- 小白友好的说明
- 记忆口诀

## 5. 接口设计

### 5.1 外部接口依赖

**FRED API 集成**
- 用途：获取美国经济数据
- 备选方案：本地模拟数据
- 限制：免费额度 1000 次/天
- 容错：API 失败时自动切换到模拟数据

### 5.2 内部接口规范

**数据服务接口**
- getLatestData(): 获取最新数据概览
- getHistoricalData(symbol, period): 获取历史数据
- refreshData(symbol): 刷新指定指标数据

**分析服务接口**
- generateLogicChain(symbol, dataPoint): 生成逻辑链条
- calculateImpact(dataPoint): 计算市场影响
- getAnalysisTemplate(symbol): 获取分析模板

## 6. 部署架构

### 6.1 本地部署方案

**单机部署架构**
- 前端：开发服务器 (localhost:3000)
- 后端：Express 服务器 (localhost:3001)
- 数据库：SQLite 文件
- 静态资源：本地文件系统

**目录结构**
```
macro-insight/
├── frontend/           # 前端应用
├── backend/            # 后端服务
├── data/               # 配置数据
├── database.sqlite     # SQLite 数据库
└── scripts/            # 部署脚本
```


*本文档基于 MVP 本地部署需求设计，后续可根据业务发展需要调整架构方案。*