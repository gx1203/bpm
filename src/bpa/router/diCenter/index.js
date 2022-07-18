const diRoutes = [
  {
    // 流程模型中心
    path: '/diCenter',
    meta: { title: '运营监控', isNav: false },
    redirect: `/diCenter/home`,
    component: resolve => require(['../../views/layout-full-second'], resolve),
    children: [
      {
        name: 'home',
        path: '/diCenter/home',
        meta: { title: 'home', isNav: false },
        component: resolve => require(['../../views/diCenter/home/index.vue'], resolve)
      },
      {
        name: 'databaselist',
        path: '/diCenter/databaseList',
        meta: { title: 'database', isNav: false },
        component: resolve => require(['../../views/diCenter/databaseList/index.vue'], resolve)
      },
      {
        name: 'detaillist',
        path: '/diCenter/detailList',
        meta: { title: 'detaillist', isNav: false },
        component: resolve => require(['../../views/diCenter/homeList/index.vue'], resolve)
      }
    ]
  }
]
export default diRoutes
