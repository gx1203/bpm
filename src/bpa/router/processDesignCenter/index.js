const processDesignCenter = [
  {
    // 流程模型中心
    path: '/processDesignCenter',
    meta: { title: '流程设计中心', isNav: false },
    redirect: `/processDesignCenter`,
    component: resolve => require(['../../views/layout-nofooter'], resolve),
    children: [
      {
        name: 'module2Child1',
        path: '',
        meta: { title: 'module2Child1', isNav: false },
        component: resolve => require(['../../views/processDesignCenter/child1/index.vue'], resolve)
      }
    ]
  }
]
export default processDesignCenter
