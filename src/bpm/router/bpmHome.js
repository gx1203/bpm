const bpmHomeRouter = {
  name: 'bpmHome',
  path: '/bpmHome',
  meta: { title: '首页', icon: 'icon-leixingpeizhix', isNav: true },
  component: resolve => require(['../views/parent'], resolve),
  redirect: { name: 'businessAdminHome' },
  children: [
    {
      name: 'businessAdminHome',
      path: 'businessAdminHome',
      meta: { title: '首页', icon: 'icon-yishenpiliebiao-', isNav: true },
      component: resolve => require(['../views/bpmHome/businessAdminHome'], resolve)
    }
  ]
}
export default bpmHomeRouter
