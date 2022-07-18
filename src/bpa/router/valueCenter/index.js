const valueCenter = [
  {
    // 流程模型中心
    path: '/valueCenter',
    meta: { title: '价值链', isNav: true },
    // redirect: `/valueCenter/folders`,
    redirect: `/valueCenter/edgeToedgeMagane`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      // 设计图草稿箱
      {
        name: 'folders',
        path: '/valueCenter/folders',
        meta: { title: '设计图草稿箱', isNav: true },
        component: resolve => require(['../../views/valueCenter/folders/index.vue'], resolve)
      },
      // 定时设计图
      {
        name: 'timedata',
        path: '/valueCenter/timedata',
        meta: { title: '定时设计图', isNav: true },
        component: resolve => require(['../../views/valueCenter/timedata/index.vue'], resolve)
      },
      // 端到端模型
      {
        name: 'edgeToedge',
        path: '/valueCenter/edgeToedgeMagane',
        meta: { title: '端到端模型管理', isNav: true },
        component: resolve => require(['../../views/valueCenter/edgeToedge/index.vue'], resolve)
      },
      {
        name: 'valueChain',
        path: '/valueCenter/valueChain',
        meta: { title: '价值链', isNav: true },
        component: resolve => require(['../../views/processModelCenter/valueChain/valueChain/index.vue'], resolve)
      },
      {
        name: 'edgeToEdge',
        path: '/valueCenter/edgeToEdge',
        meta: { title: '端到端模型查看', isNav: true },
        component: resolve => require(['../../views/processModelCenter/valueChain/edgeToEdge/index.vue'], resolve)
      }
    ]
  }
]
export default valueCenter
