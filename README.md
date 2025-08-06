# 宏观数据洞察（Macro Insight）

专为投资新人设计的宏观经济数据解读工具。核心价值在于，在核心宏观数据公布后，不仅能提供数据概览，更能深度解析数据背后的逻辑链条和对市场的潜在影响。

## 项目结构

```
macro_insight/
├── frontend/           # 前端应用 (React + TypeScript + Vite)
├── backend/            # 后端服务 (Node.js + Express + SQLite)
├── data/               # 配置数据
├── scripts/            # 部署脚本
├── prd.md             # 产品需求文档
├── tdd.md             # 技术架构设计文档
└── README.md          # 项目说明
```

## 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式框架)
- Chart.js (图表库)
- React Context API (状态管理)

### 后端
- Node.js + Express
- SQLite (数据库)
- CORS (跨域处理)

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 2. 启动开发服务器

```bash
# 启动后端服务 (端口 3001)
cd backend
npm run dev

# 启动前端服务 (端口 3000)
cd ../frontend
npm run dev
```

### 3. 访问应用

打开浏览器访问: http://localhost:3000

## 核心功能

### 1. 数据概览与即时解读
- 实时跟踪核心宏观经济数据发布情况
- 提供投资小白易懂的解读
- 数据对比：实际值 | 预期值 | 前值
- 视觉反馈：绿色(超预期) | 红色(不及预期) | 黄色(符合预期)

### 2. 逻辑链条深度解析
- 针对每个核心数据提供完整的逻辑推演
- 采用横向流程图展示因果关系
- 标准逻辑链模板：数据变化 → 经济含义 → 政策预期 → 市场影响 → 投资建议
- 多维度影响分析：股票市场、债券市场、汇率市场

### 3. 历史数据与周期对比
- 提供历史数据走势图表
- 帮助理解当前数据在宏观周期中的位置
- 趋势分析和关键节点标注

### 4. 基础概念速查
- 为投资小白提供常用概念的通俗解释
- 右侧固定悬浮窗口
- 支持搜索和收藏功能

## 核心指标

| 优先级 | 指标名称 | 英文缩写 | 发布频率 | 重要程度 |
|--------|---------|---------|----------|----------|
| 1 | 个人消费支出价格指数 | PCE | 月度 | ★★★ |
| 2 | 非农就业数据 | NFP | 月度 | ★★★ |
| 3 | 消费者物价指数 | CPI | 月度 | ★★☆ |
| 4 | 失业率 | Unemployment Rate | 月度 | ★★☆ |
| 5 | 国内生产总值 | GDP | 季度 | ★★☆ |

## 开发指南

### 前端开发
```bash
cd frontend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产版本
```

### 后端开发
```bash
cd backend
npm run dev          # 启动开发服务器
npm start            # 启动生产服务器
```

### 数据库
项目使用SQLite作为数据库。数据库文件会在首次启动后端服务时自动创建。

#### 数据库初始化
数据库文件不包含在代码仓库中，需要在本地初始化：
```bash
# 方法1：启动后端服务（推荐）
cd backend
npm run dev  # 或 npm start

# 方法2：单独初始化数据库
cd backend
node -e "require('./src/utils/database')"
```

#### Mock数据管理
项目提供了mock数据管理工具，可用于导入测试数据：
```bash
cd backend
node src/utils/mock-data-manager.js import  # 导入mock数据
node src/utils/mock-data-manager.js status  # 查看数据状态
```
更多信息请参考 [Mock数据使用指南](backend/docs/mock-data-usage.md)。

## API文档

### 数据概览
- `GET /api/overview?selectedIndicator=:symbol` - 获取指定指标的数据概览

### 指标数据
- `GET /api/indicators` - 获取所有指标列表

### 逻辑链条
- `GET /api/logic-chain/:symbol` - 获取指定指标的逻辑链条

### 历史数据
- `GET /api/history/:symbol?period=:period` - 获取指定指标的历史数据
  - `period` 参数：`12m`（近12个月）或 `3y`（近3年），默认为 `12m`

### 系统状态
- `GET /api/health` - 健康检查接口

### 待实现的API
以下API在产品规划中，但尚未实现：
- `GET /api/concepts` - 获取所有概念解释
- `GET /api/concepts/search?q=关键词` - 搜索概念
- `GET /api/indicators/:symbol` - 获取指定指标详情

## 部署

### 本地部署
```bash
# 构建前端
cd frontend
npm run build

# 启动后端
cd ../backend
npm start
```

### 生产环境
建议使用PM2进行进程管理：
```bash
npm install -g pm2
pm2 start backend/src/index.js --name macro-insight-api
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。 