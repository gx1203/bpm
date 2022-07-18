const managementElements = {
  name: 'managementElements',
  path: '/managementElements',
  meta: { title: '管理要素', icon: 'el-icon-s-platform', isNav: true },
  component: resolve => require(['../views/parent'], resolve),
  redirect: { name: 'system' },
  children: [
    {
      // 流程模型中心
      name: 'system',
      path: 'system',
      meta: { title: '规章制度', isNav: true },
      redirect:  {name: 'ruleManage'},
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/managementElements/system/ruleManage',
          path: 'ruleManage',
          meta: { title: '规章制度管理', icon: 'icon-chuanyue2', isNav: true },
          component: resolve => require(['@/bpa/views/rulesCenter/newIndex/index.vue'], resolve)
        },
        // {
          //   name: '/managementElements/system/rulesIframeCenter',
          //   path: 'rulesIframeCenter',
          //   meta: { title: '制度框架', isNav: true },
          //   component: resolve => require(['@/bpa/views/rulesCenter/rulesIframeCenter/index.vue'], resolve)
          // },
          {
            name: '/managementElements/system/ruleView',
            path: 'ruleView',
            meta: { title: '规章社区', icon: 'icon-chuanyue1', isNav: true },
            component: resolve => require(['@/bpa/views/processModelCenter/rulesAndRegulations/index1.vue'], resolve)
          }
          // {
          //   name: '/managementElements/system/institution',
          //   path: 'institution',
          //   meta: { title: '已作废规章制度', icon: 'icon-huishouzhan', isNav: true },
          //   component: resolve => require(['@/bpa/views/processModelCenter/institution/index1.vue'], resolve)
          // }
      ]
    },
    {
      name: 'jobsCenter',
      path: 'jobsCenter',
      meta: { title: '岗位职责', isNav: true },
      redirect: `myPost`,
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/managementElements/jobsCenter/myPost',
          path: 'myPost', // 我的岗位
          meta: { title: '我的岗位', isNav: true },
          component: resolve => require(['@/bpa/views/jobsCenter/myPost/index.vue'], resolve)
        },
        {
          name: '/managementElements/jobsCenter/queryPost',
          path: 'queryPost', // 岗位查询
          meta: { title: '岗位查询', isNav: true },
          component: resolve => require(['@/bpa/views/jobsCenter/queryPost/index.vue'], resolve)
        }
      ]
    },
    {
      // 风险控制
      path: 'riskControl',
      name: 'riskControl',
      meta: { title: '风险控制', isNav: true },
      redirect: `matrix`,
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/managementElements/riskControl/matrix',
          path: 'matrix', // 风险控制矩阵
          meta: { title: '风险控制矩阵', isNav: true },
          component: resolve => require(['@/bpa/views/riskControlCenter/matrix/index.vue'], resolve)
        },
        {
          name: '/managementElements/riskControl/RiskLibrary',
          path: 'RiskLibrary', // 风险控制矩阵2
          meta: { title: '风险库', isNav: true },
          component: resolve => require(['@/bpa/views/riskControlCenter/RiskLibrary/index.vue'], resolve)
        }
      ]
    }
  ]
}
export default managementElements
