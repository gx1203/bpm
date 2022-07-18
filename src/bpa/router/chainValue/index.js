const chainValue = [
  {
    // 流程模型中心
    path: '/chainValue',
    meta: { title: '价值链', isNav: true },
    redirect: `/chainValue`,
    component: resolve => require(['../../views/layout-conNoPad'], resolve),
    children: [
      {
        name: 'module2Child1Value',
        path: '',
        meta: { title: 'module2Child1Value', isNav: true },
        component: resolve => require(['../../views/chainValue/index.vue'], resolve)
      }
    ]
  }
]
export default chainValue
