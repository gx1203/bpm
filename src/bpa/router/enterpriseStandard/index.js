const enterpriseStandard = [
  {
    // 企业标准
    path: '/enterpriseStandard',
    meta: { title: 'enterpriseStandard', isNav: true },
    redirect: `/enterpriseStandard/enterpriseManage`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      // 企业标准管理
      {
        name: 'enterpriseManage',
        path: '/enterpriseStandard/enterpriseManage',
        meta: { title: 'enterpriseManage', isNav: true },
        component: resolve => require(['../../views/enterpriseStandard/newIndex/index.vue'], resolve)
      },
      // 企业标准架构
      {
        name: 'enterpriseArch',
        path: '/enterpriseStandard/enterpriseArch',
        meta: { title: 'enterpriseArch', isNav: true },
        component: resolve => require(['../../views/enterpriseStandard/enterpriseArch/index.vue'], resolve)
      },
      // 企业标准作废
      {
        name: 'enterpriseArch',
        path: '/enterpriseStandard/enterpriseVoid',
        meta: { title: 'enterpriseVoid', isNav: true },
        component: resolve => require(['../../views/enterpriseStandard/enterpriseVoid/index.vue'], resolve)
      },
      // 技术标准地图
      {
        name: 'technicalStandardMap',
        path: '/enterpriseStandard/technicalStandardMap',
        meta: { title: 'technicalStandardMap', isNav: true },
        component: resolve => require(['../../views/enterpriseStandard/technicalStandardMap/index.vue'], resolve)
      }
    ]
  }
]
export default enterpriseStandard
