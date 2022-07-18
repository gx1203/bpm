
const aloneProcessRoutes = [
  // ----------------资产申请填报-------------
  {
    path: '/AssertFilingProcess/start',
    name: 'AssertFilingProcessStart',
    meta: { title: '发起流程表单' },
    component: resolve => require(['../views/alone_process/AssertFilingProcess/start'], resolve)
  },
  {
    path: '/AssertFilingProcess/approve',
    name: 'AssertFilingProcessApprove',
    meta: { title: '审批流程表单' },
    component: resolve => require(['../views/alone_process/AssertFilingProcess/approve'], resolve)
  },
  {
    path: '/AssertFilingProcess/view',
    name: 'AssertFilingProcessView',
    meta: { title: '查看流程表单' },
    component: resolve => require(['../views/alone_process/AssertFilingProcess/view'], resolve)
  },
  // ----------------资产申请汇总-------------
  {
    path: '/AssertSummaryProcess/start',
    name: 'AssertSummaryProcessStart',
    meta: { title: '发起流程表单' },
    component: resolve => require(['../views/alone_process/AssertSummaryProcess/start'], resolve)
  },
  {
    path: '/AssertSummaryProcess/approve',
    name: 'AssertSummaryProcessApprove',
    meta: { title: '审批流程表单' },
    component: resolve => require(['../views/alone_process/AssertSummaryProcess/approve'], resolve)
  },
  {
    path: '/AssertSummaryProcess/view',
    name: 'AssertSummaryProcessView',
    meta: { title: '查看流程表单' },
    component: resolve => require(['../views/alone_process/AssertSummaryProcess/view'], resolve)
  }
]

export default aloneProcessRoutes
