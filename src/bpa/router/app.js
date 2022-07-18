const appRoutes = [
  {
    path: '/',
    redirect: '/login',
    component: resolve => require(['../views/layout'], resolve)
  },
  {
    path: '/login',
    meta: { title: '登录' },
    component: resolve => require(['../views/login/index'], resolve)
  },
  {
    path: '/404',
    meta: { title: '404' },
    component: resolve => require(['../views/error_page/404'], resolve)
  },
  {
    path: '/sysbuild',
    meta: { title: 'sysbuild' },
    component: resolve => require(['../views/error_page/systemBuilding'], resolve)
  }
]
export default appRoutes
