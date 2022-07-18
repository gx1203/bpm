// const rulesCenter = [
//   {
//     // 规章制度中心
//     path: '/rulesCenter',
//     meta: { title: 'rulesCenter', isNav: true },
//     redirect: `/rulesCenter/handbookFiles`,
//     component: resolve => require(['../../views/layout2'], resolve),
//     children: [
//       {
//         // 手册体系文件
//         name: 'handbookFiles',
//         path: '/rulesCenter/handbookFiles',
//         meta: { title: 'handbookFiles', isNav: true },
//         component: resolve => require(['../../views/rulesCenter/handbookFiles/index.vue'], resolve)
//       },
//       {
//         // 部门职责、其它
//         name: 'deptResponsibilities',
//         path: '/rulesCenter/deptResponsibilities',
//         meta: { title: 'deptResponsibilities', isNav: true },
//         component: resolve => require(['../../views/rulesCenter/deptResponsibilities/index.vue'], resolve)
//       },
//       {
//         // 公共组件查看页面
//         name: 'protalZYT',
//         path: '/rulesCenter/protalZYT',
//         meta: { title: 'protalZYT', isNav: true },
//         component: resolve => require(['../../views/rulesCenter/protalZYT/index.vue'], resolve)
//       },
//       {
//         // 公共组件查看页面
//         name: 'protalYZY',
//         path: '/rulesCenter/protalYZY',
//         meta: { title: 'protalYZY', isNav: true },
//         component: resolve => require(['../../views/rulesCenter/protalYZY/index.vue'], resolve)
//       },
//       {
//         // 公共组件查看页面
//         name: 'protalDX',
//         path: '/rulesCenter/protalDX',
//         meta: { title: 'protalDX', isNav: true },
//         component: resolve => require(['../../views/rulesCenter/protalDX/index.vue'], resolve)
//       }
//     ]
//   }
// ]

// const rulesCenter = [
//   {
//     // 规章制度中心
//     path: '/rulesCenter',
//     meta: { title: 'rulesCenter', isNav: true },
//     redirect: `/rulesCenter`,
//     component: resolve => require(['../../views/layout-nofooter'], resolve),
//     children: [
//       {
//         name: 'newIndex',
//         path: '',
//         meta: { title: 'newIndex', isNav: true },
//         component: resolve => require(['../../views/rulesCenter/newIndex/index.vue'], resolve)
//       }
//     ]
//   }
// ]

const rulesCenter = [
  {
    // 规章制度中心
    path: '/rulesCenter',
    meta: { title: '规章制度中心', isNav: true },
    redirect: `/rulesCenter/ruleView`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'ruleManage',
        path: '/rulesCenter/ruleManage',
        meta: { title: '规章制度管理', icon: 'icon-moban', isNav: true },
        component: resolve => require(['../../views/rulesCenter/newIndex/index.vue'], resolve)
      },
      {
        name: 'rulesIframeCenter',
        path: '/rulesCenter/rulesIframeCenter',
        meta: { title: '制度框架', isNav: true },
        component: resolve => require(['../../views/rulesCenter/rulesIframeCenter/index.vue'], resolve)
      },
      {
        // 规章制度
        name: 'ruleView',
        path: '/rulesCenter/ruleView',
        meta: { title: '规章制度查看', icon: 'icon-chuanyue1', isNav: true },
        component: resolve => require(['../../views/processModelCenter/rulesAndRegulations/index1.vue'], resolve)
      },
      {
        // 规章制度
        name: 'institution',
        path: '/rulesCenter/institution',
        meta: { title: '已作废规章制度', icon: 'icon-huishouzhan', isNav: true },
        component: resolve => require(['../../views/processModelCenter/institution/index1.vue'], resolve)
      },
      // {
      //   // 公共组件查看页面
      //   name: 'protalZYT',
      //   path: '/rulesCenter/protalZYT',
      //   meta: { title: 'protalZYT', isNav: true },
      //   component: resolve => require(['../../views/rulesCenter/protalZYT/index.vue'], resolve)
      // },
      // {
      //   // 公共组件查看页面
      //   name: 'protalYZY',
      //   path: '/rulesCenter/protalYZY',
      //   meta: { title: 'protalYZY', isNav: true },
      //   component: resolve => require(['../../views/rulesCenter/protalYZY/index.vue'], resolve)
      // },
      // {
      //   // 公共组件查看页面
      //   name: 'protalDX',
      //   path: '/rulesCenter/protalDX',
      //   meta: { title: 'protalDX', isNav: true },
      //   component: resolve => require(['../../views/rulesCenter/protalDX/index.vue'], resolve)
      // }
    ]
  },
  {
    //制度计划管理
    path:'/rulesPlanManage',
    meta:{title:'制度计划管理',isNav: true},
    redirect: `/rulesCenter/rulesPlanManage`,
    component: resolve => require(['../../views/layout2'], resolve),
    children:[
      {
        name:'rulesWorkBench',
        path:'/rulesCenter/rulesWorkBench',
        meta:{title:'制度工作台',isNav: true},
        component: resolve => require(['../../views/rulesCenter/rulesPlanManage/rulesWorkBench.vue'], resolve)
      },
      {
        name:'noticeManage',
        path:'/rulesCenter/noticeManage',
        meta:{title:'通知管理',isNav: true},
        component: resolve => require(['../../views/rulesCenter/rulesPlanManage/noticeManage.vue'], resolve)
      },
      {
        name:'rulesProcessEvaluation',
        path:'/rulesCenter/rulesProcessEvaluation',
        meta:{title:'制度流程评估',isNav: true},
        component: resolve => require(['../../views/rulesCenter/rulesPlanManage/rulesProcessEvaluation.vue'], resolve)
      },
      {
        name:'rulesProcessPlan',
        path:'/rulesCenter/rulesProcessPlan',
        meta:{title:'计划制定',isNav: true},
        component: resolve => require(['../../views/rulesCenter/rulesPlanManage/rulesProcessPlan.vue'], resolve)
      },
      {
        name:'commentManage',
        path:'/rulesCenter/commentManage',
        meta:{title:'评论管理',isNav: true},
        component: resolve => require(['../../views/rulesCenter/rulesPlanManage/commentManage.vue'], resolve)
      },
      {
        name:'rulesPlanSummary',
        path:'/rulesCenter/rulesPlanSummary',
        meta:{title:'计划汇总',isNav: true},
        component: resolve => require(['../../views/rulesCenter/rulesPlanManage/rulesPlanSummary.vue'], resolve)
      },
      {
        name:'rulesPlanTracking',
        path:'/rulesCenter/rulesPlanTracking',
        meta:{title:'计划跟踪',isNav: true},
        component: resolve => require(['../../views/rulesCenter/rulesPlanManage/rulesPlanTracking.vue'], resolve)
      },
    ]

  }
]
export default rulesCenter
