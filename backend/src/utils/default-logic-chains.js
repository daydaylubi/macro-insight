// 默认逻辑链条数据
// 包含各个宏观经济指标的固定逻辑链条

module.exports = [
  {
    indicatorId: "PCE",
    steps: [
      {
        stepOrder: 1,
        title: "PCE超预期上涨",
        description: "个人消费支出价格指数环比上涨0.3%",
        explanation: "PCE是美联储最看重的通胀指标，比CPI更全面，包含了消费者实际支出的价格变化。",
        analogy: "就像菜市场的菜突然都涨价了，而且涨得比预想的快。",
        historicalCase: "2022年PCE持续走高，美联储连续加息应对。"
      },
      {
        stepOrder: 2,
        title: "通胀压力加大",
        description: "核心通胀率维持在4.7%高位",
        explanation: "通胀持续高于美联储2%的目标，表明经济过热，需要政策干预。",
        analogy: "就像体温持续发烧，需要降温治疗。",
        historicalCase: "类似1980年代沃尔克时期的高通胀环境。"
      },
      {
        stepOrder: 3,
        title: "美联储政策转向",
        description: "通胀数据影响美联储货币政策决策",
        explanation: "高通胀迫使美联储采取更加鹰派的立场，可能推迟降息或重新考虑加息。",
        analogy: "就像医生看到病情加重，需要调整治疗方案。",
        historicalCase: "美联储历史上多次因通胀数据调整政策路径。"
      }
    ]
  },
  {
    indicatorId: "CPI",
    steps: [
      {
        stepOrder: 1,
        title: "CPI大幅超预期",
        description: "消费者物价指数同比上涨3.4%，远超预期3.2%",
        explanation: "CPI反映消费者购买商品和服务的价格变化，是衡量通胀的重要指标。",
        analogy: "就像超市里的商品价格普遍上涨，比预想的涨得更多。",
        historicalCase: "2021-2022年CPI快速上升，推动美联储激进加息。"
      },
      {
        stepOrder: 2,
        title: "核心通胀顽固",
        description: "核心CPI环比上涨0.4%，显示通胀粘性",
        explanation: "核心CPI剔除食品和能源价格，更能反映潜在通胀趋势。",
        analogy: "就像发烧的根本原因没有消除，体温难以降下来。",
        historicalCase: "1970年代核心通胀持续高企，需要长期政策应对。"
      },
      {
        stepOrder: 3,
        title: "市场预期调整",
        description: "通胀数据推动市场重新评估美联储政策路径",
        explanation: "高通胀数据降低了市场对美联储降息的预期，影响资产价格。",
        analogy: "就像天气预报说会下雨，大家都准备雨伞。",
        historicalCase: "每次重要通胀数据发布都会引发市场波动。"
      }
    ]
  },
  {
    indicatorId: "NFP",
    steps: [
      {
        stepOrder: 1,
        title: "就业市场强劲",
        description: "非农就业人数大幅增加，超出市场预期",
        explanation: "非农就业数据是衡量美国就业市场健康状况的关键指标，直接反映经济活力。",
        analogy: "就像一家公司不断扩张，持续招聘新员工。",
        historicalCase: "2023年美国就业市场持续韧性，每月新增就业保持在20万以上。"
      },
      {
        stepOrder: 2,
        title: "工资增长压力",
        description: "就业市场紧俏推动工资上涨",
        explanation: "就业市场强劲导致企业竞争人才，推高工资水平，可能加剧通胀压力。",
        analogy: "就像餐厅为了留住厨师不得不提高薪水，最终可能反映在菜价上。",
        historicalCase: "2022-2023年美国工资增长率维持在4-5%，高于历史平均水平。"
      },
      {
        stepOrder: 3,
        title: "货币政策影响",
        description: "就业数据影响美联储政策决策",
        explanation: "强劲就业数据可能使美联储维持紧缩政策，延迟降息时间表。",
        analogy: "就像医生看到病人体力充沛，认为可以继续用强药。",
        historicalCase: "2023年美联储多次引用就业市场韧性作为维持高利率的理由。"
      }
    ]
  },
  {
    indicatorId: "UNRATE",
    steps: [
      {
        stepOrder: 1,
        title: "失业率变动",
        description: "失业率数据发生显著变化",
        explanation: "失业率是劳动力市场健康状况的重要指标，反映经济整体状况。",
        analogy: "就像测量社会的'经济体温'，直观反映经济健康状况。",
        historicalCase: "2020年疫情期间失业率从3.5%飙升至14.8%，创历史新高。"
      },
      {
        stepOrder: 2,
        title: "劳动力参与",
        description: "失业率变化与劳动参与率关联",
        explanation: "失业率下降可能是就业增加，也可能是劳动力退出市场，需结合参与率分析。",
        analogy: "就像班级出勤率，不仅要看到课人数，还要看总人数变化。",
        historicalCase: "疫情后美国劳动参与率长期低于疫情前水平，影响失业率解读。"
      },
      {
        stepOrder: 3,
        title: "经济政策调整",
        description: "失业率变化引发政策反应",
        explanation: "失业率上升可能促使政府和央行采取刺激措施，下降则可能导致紧缩政策。",
        analogy: "就像温度计读数决定是否开空调或暖气。",
        historicalCase: "2008年金融危机后，高失业率促使美联储实施多轮量化宽松政策。"
      }
    ]
  },
  {
    indicatorId: "GDP",
    steps: [
      {
        stepOrder: 1,
        title: "经济增长状况",
        description: "GDP数据反映经济整体表现",
        explanation: "GDP是衡量经济活动总量的最全面指标，直接反映经济扩张或收缩。",
        analogy: "就像公司的总营收，反映整体业务规模和增长情况。",
        historicalCase: "2020年疫情导致美国GDP萎缩3.5%，为二战以来最大年度降幅。"
      },
      {
        stepOrder: 2,
        title: "增长构成分析",
        description: "分析GDP增长的驱动因素",
        explanation: "GDP增长可能来自消费、投资、政府支出或净出口，不同来源意味着不同经济状况。",
        analogy: "就像分析公司收入来源，是主营业务增长还是一次性收益。",
        historicalCase: "2021年美国GDP复苏主要由消费支出驱动，反映家庭部门强劲。"
      },
      {
        stepOrder: 3,
        title: "政策与市场反应",
        description: "GDP数据影响政策和市场预期",
        explanation: "GDP数据直接影响央行政策、政府财政决策和市场投资情绪。",
        analogy: "就像公司财报影响投资者决策和管理层战略调整。",
        historicalCase: "2022年连续两季度GDP负增长引发衰退担忧，影响美联储政策路径。"
      }
    ]
  }
];