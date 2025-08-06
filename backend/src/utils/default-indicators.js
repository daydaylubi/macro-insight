// 默认宏观经济指标列表
// 任何需要初始指标的模块都应引用此文件以避免数据重复

module.exports = [
  {
    symbol: 'PCE',
    name: '个人消费支出价格指数',
    category: '通胀',
    importance: 5,
    description: '美联储最看重的通胀指标，比CPI更全面，直接影响货币政策决策'
  },
  {
    symbol: 'NFP',
    name: '非农就业数据',
    category: '就业',
    importance: 4,
    description: '反映美国非农部门就业人数变化，是经济健康状况的重要指标'
  },
  {
    symbol: 'CPI',
    name: '消费者物价指数',
    category: '通胀',
    importance: 5,
    description: '衡量一篮子消费品和服务的价格变动，是老百姓感受最直接的通胀指标'
  },
  {
    symbol: 'UNRATE',
    name: '失业率',
    category: '就业',
    importance: 4,
    description: '失业人口占劳动人口的比例，反映就业市场健康度'
  },
  {
    symbol: 'GDP',
    name: '国内生产总值',
    category: '经济增长',
    importance: 3,
    description: '衡量一个国家所有最终商品和服务的市场价值，是经济增长的最终衡量标准'
  }
];
