const processHandlerIframeCenter = [
  {
    // 流程处理中心
    path: '/processHandlerIframeCenter',
    meta: { title: '流程处理中心', isNav: true },
    redirect: `/processHandlerIframeCenter`,
    component: resolve => require(['../../views/layout-nofooter'], resolve),
    children: [
      {
        name: 'newIndex',
        path: '',
        meta: { title: 'newIndex', isNav: true },
        component: resolve => require(['../../views/processHandlerIframeCenter/iframe.vue'], resolve)
      }
    ]
    // 个人工作台
    // children: [
    //   {
    //     name: 'personalWorkbench',
    //     path: '/processHandlerIframeCenter/personalWorkbench',
    //     redirect: '/processHandlerIframeCenter/personalWorkbench/approvalList',
    //     meta: { title: 'personalWorkbench', isNav: true },
    //     component: resolve => require(['../../views/processHandlerIframeCenter/personalWorkbench/index.vue'], resolve),
    //     children: [
    //       {
    //         name: 'approvalList',
    //         path: '/processHandlerIframeCenter/personalWorkbench/approvalList',
    //         meta: { title: 'approvalList', isNav: true },
    //         component: resolve => require(['../../views/processHandlerIframeCenter/personalWorkbench/approvalList/index.vue'], resolve)
    //       },
    //       {
    //         name: 'backTask',
    //         path: '/processHandlerIframeCenter/personalWorkbench/backTask',
    //         meta: { title: 'backTask', isNav: true },
    //         component: resolve => require(['../../views/processHandlerIframeCenter/personalWorkbench/backTask/index.vue'], resolve)
    //       },
    //       {
    //         name: 'applyCreate',
    //         path: '/processHandlerIframeCenter/personalWorkbench/applyCreate',
    //         meta: { title: 'applyCreate', isNav: true },
    //         component: resolve => require(['../../views/processHandlerIframeCenter/personalWorkbench/applyCreate/index.vue'], resolve)
    //       }
    //     ]
    //   },
    //   // 应用工具
    //   {
    //     name: 'applicationTools',
    //     path: '/processHandlerIframeCenter/applicationTools',
    //     meta: { title: 'applicationTools', isNav: true },
    //     redirect: '/processHandlerIframeCenter/applicationTools/findCenter',
    //     component: resolve => require(['../../views/processHandlerIframeCenter/applicationTools/index.vue'], resolve),
    //     children: [
    //       {
    //         name: 'findCenter',
    //         path: '/processHandlerIframeCenter/applicationTools/findCenter',
    //         meta: { title: 'findCenter', isNav: true },
    //         component: resolve => require(['../../views/processHandlerIframeCenter/applicationTools/findCenter/index.vue'], resolve)
    //       },
    //       {
    //         name: 'outAuthorization',
    //         path: '/processHandlerIframeCenter/applicationTools/outAuthorization',
    //         meta: { title: 'outAuthorization', isNav: true },
    //         component: resolve => require(['../../views/processHandlerIframeCenter/applicationTools/outAuthorization/index.vue'], resolve)
    //       }
    //     ]
    //   }
    // ]
  }
]
export default processHandlerIframeCenter
