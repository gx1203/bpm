const jobsCenter = [
  {
    path: '/jobsCenter',
    meta: { title: '岗位中心', isNav: true },
    redirect: `/jobsCenter/myPost`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'myPost',
        path: '/jobsCenter/myPost', // 我的岗位
        meta: { title: '我的岗位', isNav: true },
        component: resolve => require(['../../views/jobsCenter/myPost/index.vue'], resolve)
      },
      {
        name: 'queryPost',
        path: '/jobsCenter/queryPost', // 岗位查询
        meta: { title: '岗位查询', isNav: true },
        component: resolve => require(['../../views/jobsCenter/queryPost/index.vue'], resolve)
      },
      {
        name: 'businessObject',
        path: '/resourceLibrary/businessObject', // 业务对象
        meta: { title: '业务对象', isNav: true },
        component: resolve => require(['../../views/jobsCenter/businessObject/index.vue'], resolve)
      },
      {
        name: 'businessRelation',
        path: '/resourceLibrary/businessRelation', // 业务关系
        meta: { title: '业务关系', isNav: false },
        component: resolve => require(['../../views/jobsCenter/businessRelation/index.vue'], resolve)
      }
    ]
  }
]
export default jobsCenter
