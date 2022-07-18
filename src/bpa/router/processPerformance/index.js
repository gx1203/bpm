const processPerformance = [
  {
    // 流程绩效
    name: 'processPerformance',
    path: '/processPerformance',
    meta: { title: 'KPI指标', isNav: true },
    redirect: `/processPerformance/processPerformance`,
    component: resolve => require(['@/bpa/views/processPerformance/index.vue'], resolve),
    children: [
      {
        name: 'processPerformance',
        path: '/processPerformance/processPerformance',
        meta: { title: '采购流程', isNav: true },
        component: resolve => require(['@/bpa/views/processPerformance/processPerformance/index'], resolve)
      },
      {
        name: 'home',
        path: '/processPerformance/home',
        meta: { title: '首页', isNav: true },
        component: resolve => require(['@/bpa/views/processPerformance/home/index'], resolve)
      }
    ]
  }
]
export default processPerformance
