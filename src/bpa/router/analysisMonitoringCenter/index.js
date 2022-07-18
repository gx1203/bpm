const analysisMonitoringCenter = [
  {
    // 流程模型中心
    path: '/analysisMonitoringCenter',
    meta: { title: '监控中心', isNav: true },
    redirect: `/analysisMonitoringCenter`,
    component: resolve => require(['../../views/layout-noshadow'], resolve),
    children: [
      {
        name: 'module2Child1',
        path: '',
        meta: { title: 'module2Child1', isNav: true },
        component: resolve => require(['../../views/analysisMonitoringCenter/child1/index.vue'], resolve)
      },
      {
        name: 'module2Child2',
        path: '/analysisMonitoringCenter/timedata',
        meta: { title: 'module2Child2', isNav: true },
        component: resolve => require(['../../views/analysisMonitoringCenter/child2/index.vue'], resolve)
      },
      {
        name: 'module2Child3',
        path: '/analysisMonitoringCenter/child3',
        meta: { title: 'module2Child3', isNav: true },
        component: resolve => require(['../../views/analysisMonitoringCenter/child3/index.vue'], resolve)
      }
    ]
  }
]
export default analysisMonitoringCenter
