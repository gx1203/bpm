const processHandlerCenter = [
  {
    // 流程处理中心
    path: '/processHandlerCenter',
    meta: { title: '流程处理中心', isNav: true },
    redirect: `/processHandlerCenter/willBeDone`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'willBeDone',
        path: '/processHandlerCenter/willBeDone',
        meta: { title: 'willBeDone', isNav: true },
        component: resolve => require(['../../views/processHandlerCenter/willBeDone/index.vue'], resolve)
      },
      {
        name: 'hasBeenDone',
        path: '/processHandlerCenter/hasBeenDone',
        meta: { title: 'hasBeenDone', isNav: true },
        component: resolve => require(['../../views/processHandlerCenter/hasBeenDone/index.vue'], resolve)
      },
      {
        name: 'myApplication',
        path: '/processHandlerCenter/myApplication',
        meta: { title: 'myApplication', isNav: true },
        component: resolve => require(['../../views/processHandlerCenter/myApplication/index.vue'], resolve)
      },
      {
        name: 'workAuthorize',
        path: '/processHandlerCenter/workAuthorize',
        meta: { title: 'workAuthorize', isNav: true },
        component: resolve => require(['../../views/processHandlerCenter/workAuthorize/index.vue'], resolve)
      },
      {
        name: 'processFollow',
        path: '/processHandlerCenter/processFollow',
        meta: { title: 'processFollow', isNav: true },
        component: resolve => require(['../../views/processHandlerCenter/processFollow/index.vue'], resolve)
      }
    ]
  }
]
export default processHandlerCenter
