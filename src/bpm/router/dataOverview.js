const dataOverview = {
  name: 'staging',
  path: '/staging',
  meta: { title: '工作台', icon: 'icon-leixingpeizhix', isNav: true },
  component: resolve => require(['../views/parent'], resolve),
  redirect: { name: 'stagingPersonal' },
  children: [
    {
      name: 'stagingPersonal',
      path: 'personal',
      meta: { title: '个人工作台', icon: 'icon-leixingpeizhix', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'stagingPersonalApproveList' },
      children: [
        {
          name: '/dataOverview/data/ExitPermit',
          path: '/dataOverview/data/ExitPermit',
          meta: {
            title: '项目主数据',
            icon: 'icon-navicon-dhthd',
            isNav: true
          },
          component: resolve =>
            require(['../views/dataOverview/ExitPermit'], resolve)
        },
        {
          name: '/dataOverview/data/ExitPermit',
          path: '/dataOverview/data/',
          meta: {
            title: '出门证明细',
            icon: 'icon-navicon-dhthd',
            isNav: true
          },
          component: resolve =>
            require(['../views/dataOverview/ExitPermit'], resolve)
        },
        {
          name: '/dataOverview/data/BorrowThing',
          path: '/dataOverview/data/',
          meta: {
            title: '外借物资明细',
            icon: 'icon-navicon-dhthd',
            isNav: true
          },
          component: resolve =>
            require(['../views/dataOverview/BorrowThing'], resolve)
        }
      ]
    }
  ]
}

export default dataOverview
