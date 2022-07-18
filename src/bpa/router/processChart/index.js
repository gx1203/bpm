const processChart = [
  {
    // 流程模型中心
    name: 'processChart',
    path: '/processChart',
    meta: { title: 'processChart', isNav: false },
    component: resolve => require(['@/bpa/views/processChart/index.vue'], resolve),
    children: []
  }
]
export default processChart
