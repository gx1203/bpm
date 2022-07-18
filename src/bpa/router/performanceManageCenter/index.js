const performCenter = [
  {
    path: '/performCenter',
    meta: { title: '绩效管理中心', isNav: true },
    redirect: `/performCenter/targetStore`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'targetStore',
        path: '/performCenter/targetStore',
        meta: { title: '指标库', isNav: true },
        component: resolve => require(['../../views/performanceManageCenter/targetStore/index.vue'], resolve)
      }
    ]
  }
]
export default performCenter
