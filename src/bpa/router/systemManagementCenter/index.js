const systemManagementCenter = [
  {
    // 体系管理中心
    path: '/systemManagementCenter',
    meta: { title: 'systemManagementCenter', isNav: true },
    redirect: `/systemManagementCenter/systemList`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'systemManagement',
        path: '/systemManagementCenter/systemList',
        meta: { title: 'ruleManage', isNav: true },
        component: resolve => require(['../../views/systemManagementCenter/systemList/index.vue'], resolve)
      },
      {
        name: 'systemAuditplan',
        path: '/systemManagementCenter/systemAuditplan',
        meta: { title: 'ruleManage', isNav: true },
        component: resolve => require(['../../views/systemManagementCenter/systemAuditplan/index.vue'], resolve)
      },
      {
        name: 'fileManagement',
        path: '/systemManagementCenter/fileManagement',
        meta: { title: 'ruleManage', isNav: true },
        component: resolve => require(['../../views/systemManagementCenter/fileManagement/index.vue'], resolve)
      },
      // 体系运行审核
      {
        name: 'systemExamine',
        path: '/systemManagementCenter/systemExamine',
        meta: { title: 'ruleManage', isNav: true },
        component: resolve => require(['../../views/systemManagementCenter/systemExamine/index.vue'], resolve)
      },
      // 体系关联
      {
        name: 'systemConnection',
        path: '/systemManagementCenter/systemConnection',
        meta: { title: 'ruleManage', isNav: true },
        component: resolve => require(['../../views/systemManagementCenter/systemConnection/index.vue'], resolve)
      },
      // 体系流程
      {
        name: 'systemFlow',
        path: '/systemManagementCenter/systemFlow',
        meta: { title: 'ruleManage', isNav: true },
        component: resolve => require(['../../views/systemManagementCenter/systemFlow/index.vue'], resolve)
      },
      // 运行记录
      {
        name: 'operationRecord',
        path: '/systemManagementCenter/operationRecord',
        meta: { title: 'ruleManage', isNav: true },
        component: resolve => require(['../../views/systemManagementCenter/operationRecord/index.vue'], resolve)
      }
    ]
  }
]
export default systemManagementCenter
