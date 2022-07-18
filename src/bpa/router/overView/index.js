const overViewRoutes = [
  {
    path: '/overView',
    meta: { title: '门户', isNav: true },
    component: resolve => require(['../../views/layout'], resolve),
    children: [
      {
        name: 'overView',
        path: '/overView', // 门户中心
        meta: { title: 'overView', isNav: true },
        component: resolve => require(['../../views/overView/index.vue'], resolve)
      },
    ]
  }
]
export default overViewRoutes
