# Mock数据管理工具使用指南

这个文档介绍了如何使用mock数据管理工具进行测试和开发。

## 概述

`mock-data-manager.js` 是一个用于管理测试数据的工具，它可以将预定义的mock数据导入到数据库中，或者从数据库中删除这些数据。这对于测试和开发非常有用，因为它允许您快速设置一个包含测试数据的环境。

## 数据来源

mock数据存储在 `backend/data/mock-data.json` 文件中，包含以下几种类型的数据：

1. **dataPoints**: 指标的历史数据点
2. **upcomingEvents**: 即将发布的指标数据事件
3. **historicalData**: 指标的历史数据序列

## 使用方法

### 前提条件

确保您已经安装了所有必要的依赖：

```bash
cd backend
npm install
```

### 命令

在backend目录下运行以下命令：

#### 导入mock数据

```bash
node src/utils/mock-data-manager.js import
```

这将把 `mock-data.json` 中的所有数据导入到数据库中。所有导入的数据都会被标记为测试数据，以便后续可以轻松删除。

#### 删除mock数据

```bash
node src/utils/mock-data-manager.js delete
```

这将从数据库中删除所有标记为测试数据的记录。

#### 重置mock数据

```bash
node src/utils/mock-data-manager.js reset
```

这将首先删除所有测试数据，然后重新导入mock数据。这对于恢复到一个干净的测试状态非常有用。

#### 查看状态

```bash
node src/utils/mock-data-manager.js status
```

这将显示当前数据库中测试数据的状态，包括每种类型的数据有多少条记录。

## 在代码中使用

您也可以在自己的代码中导入并使用这个工具：

```javascript
const mockDataManager = require('../utils/mock-data-manager');

// 导入mock数据
await mockDataManager.importMockData();

// 删除mock数据
await mockDataManager.deleteMockData();

// 重置mock数据
await mockDataManager.resetMockData();

// 查看状态
await mockDataManager.showStatus();
```

## 注意事项

1. 所有通过这个工具导入的数据都会被标记为测试数据（在数据库中有一个特殊的标记）
2. 只有被标记为测试数据的记录才会被删除命令删除
3. 这个工具会自动创建必要的表（如果它们不存在）
4. 在生产环境中，建议不要使用这个工具，因为它可能会影响真实数据