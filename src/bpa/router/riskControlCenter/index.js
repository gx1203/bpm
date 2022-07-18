const riskControlCenter = [
  {
    // 风险控制
    path: '/riskControlCenter',
    meta: { title: '风险控制', isNav: true },
    redirect: `/riskControlCenter/matrix`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'matrix',
        path: '/riskControlCenter/matrix', // 风险控制矩阵
        meta: { title: '风险控制矩阵', isNav: true },
        component: resolve => require(['../../views/riskControlCenter/matrix/index.vue'], resolve)
      },
      {
        name: 'RiskLibrary',
        path: '/riskControlCenter/RiskLibrary', // 风险控制矩阵2
        meta: { title: '风险库', isNav: true },
        component: resolve => require(['../../views/riskControlCenter/RiskLibrary/index.vue'], resolve)
      }
    ]
  }
]
export default riskControlCenter
