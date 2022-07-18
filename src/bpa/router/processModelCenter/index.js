const processModelCenter = [
  {
    // 流程模型中心
    path: '/processModelCenter',
    meta: { title: '流程中心', isNav: true },
    redirect: `/processModelCenter/processDesignCenter`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'processCommunity',
        path: '/processModelCenter/processCommunity',
        meta: { title: '流程与社区', icon: 'icon-chuanyue2', isNav: true },
        component: resolve => require(['../../views/processModelCenter/processCommunity/index.vue'], resolve)
      },
      {
        name: 'processManage',
        path: '/processModelCenter/processManage',
        meta: { title: 'processManage', isNav: true },
        component: resolve => require(['../../views/processModelCenter/processManage'], resolve)
      },
      // 流程附件
      {
        name: 'processFile',
        path: '/processModelCenter/processFile',
        meta: { title: 'processFile', isNav: true },
        component: resolve => require(['../../views/processModelCenter/processFile'], resolve)
      },
      {
        name: 'module2Child1',
        path: '/processModelCenter/processDesignCenter',
        meta: { title: '流程中心', icon: 'icon-leixingpeizhi', isNav: true },
        component: resolve => require(['../../views/processDesignCenter/child1/index.vue'], resolve)
      },
      // {
      //   // 规章制度
      //   name: 'rulesAndRegulations',
      //   path: '/processModelCenter/rulesAndRegulations',
      //   meta: { title: '规章制度', icon: 'icon-moban', isNav: true },
      //   component: resolve => require(['../../views/processModelCenter/rulesAndRegulations/index1.vue'], resolve)
      // },
      // {
      //   name: 'rulesAndRegulations',
      //   path: '/processModelCenter/rulesAndRegulations',
      //   redirect: '/processModelCenter/rulesAndRegulations/responsibilities',
      //   meta: { title: 'rulesAndRegulations', isNav: true },
      //   component: resolve => require(['../../views/processModelCenter/rulesAndRegulations/index.vue'], resolve),
      //   children: [
      //     {
      //       name: 'responsibilities',
      //       path: '/processModelCenter/rulesAndRegulations/responsibilities',
      //       meta: { title: 'responsibilities', isNav: true },
      //       component: resolve => require(['../../views/processModelCenter/rulesAndRegulations/responsibilities/index.vue'], resolve)
      //     },
      //     {
      //       name: 'handbook',
      //       path: '/processModelCenter/rulesAndRegulations/handbook',
      //       meta: { title: 'handbook', isNav: true },
      //       component: resolve => require(['../../views/processModelCenter/rulesAndRegulations/handbook/index.vue'], resolve)
      //     }
      //   ]
      // },
      {
        name: 'processIframeCenter',
        path: '/processModelCenter/processIframeCenter',
        meta: { title: '流程框架', icon: 'icon-jiedianleixing-', isNav: true },
        component: resolve => require(['../../views/processModelCenter/processIframeCenter/index.vue'], resolve)
      },
      // {
      //   name: 'valueChainFather',
      //   path: '/processModelCenter/valueChain',
      //   redirect: '/processModelCenter/valueChain/valueChain',
      //   meta: { title: '价值链', icon: 'icon-tubiao', isNav: true },
      //   component: resolve => require(['../../views/processModelCenter/valueChain/index.vue'], resolve),
      //   children: [
      //     {
      //       name: 'valueChain',
      //       path: '/processModelCenter/valueChain/valueChain',
      //       meta: { title: '价值链', icon: 'icon-liucheng', isNav: true },
      //       component: resolve => require(['../../views/processModelCenter/valueChain/valueChain/index.vue'], resolve)
      //     },
      //     {
      //       name: 'edgeToEdge',
      //       path: '/processModelCenter/valueChain/edgeToEdge',
      //       meta: { title: '端到端模型', icon: 'icon-leixingpeizhix', isNav: true },
      //       component: resolve => require(['../../views/processModelCenter/valueChain/edgeToEdge/index.vue'], resolve)
      //     }
      //   ]
      // },
      {
        name: 'document',
        path: '/processModelCenter/document',
        meta: { title: '文档', icon: 'icon-yewubaobiao', isNav: true },
        redirect: '/processModelCenter/document/systemClassify',
        component: resolve => require(['../../views/processModelCenter/document/index.vue'], resolve),
        children: [
          {
            name: 'systemClassify',
            path: '/processModelCenter/document/systemClassify',
            meta: { title: '体系分类', icon: 'icon-fenzu', isNav: true },
            component: resolve => require(['../../views/processModelCenter/document/systemClassify/index.vue'], resolve)
          },
          {
            name: 'processOutput',
            path: '/processModelCenter/document/processOutput',
            meta: { title: '流程输出', icon: 'icon-jiedianguanli', isNav: true },
            component: resolve => require(['../../views/processModelCenter/document/processOutput/index.vue'], resolve)
          },
          {
            name: 'processInput',
            path: '/processModelCenter/document/processInput',
            meta: { title: '流程输入', icon: 'icon-leixingpeizhix', isNav: true },
            component: resolve => require(['../../views/processModelCenter/document/processInput/index.vue'], resolve)
          },
          {
            name: 'infoForm',
            path: '/processModelCenter/document/infoForm',
            meta: { title: '信息表单', icon: 'icon-shuzishunxu', isNav: true },
            component: resolve => require(['../../views/processModelCenter/document/infoForm/index.vue'], resolve)
          },
          {
            name: 'infoDoc',
            path: '/processModelCenter/document/infoDoc',
            meta: { title: '信息文档', icon: 'icon-yewubaobiao', isNav: true },
            component: resolve => require(['../../views/processModelCenter/document/infoDoc/index.vue'], resolve)
          },
          {
            name: 'elseProcess',
            path: '/processModelCenter/document/elseProcess',
            meta: { title: '其他流程相关', icon: 'icon-liebiao', isNav: true },
            component: resolve => require(['../../views/processModelCenter/document/elseProcess/index.vue'], resolve)
          }
        ]
      },

      {
        name: 'terminology', // 术语
        path: '/processModelCenter/terminology',
        meta: { title: '术语', icon: 'icon-shujuzidian', isNav: true },
        component: resolve => require(['../../views/processModelCenter/terminology/index.vue'], resolve)
      },
      {
        name: 'trainRecords', // 培训记录
        path: '/processModelCenter/trainRecords',
        meta: { title: '培训记录', icon: 'icon-shenpi', isNav: true },
        component: resolve => require(['../../views/processModelCenter/trainRecords/index.vue'], resolve)
      },
      {
        name: 'correlationSystem', // 相关系统
        path: '/processModelCenter/correlationSystem',
        meta: { title: '相关系统', icon: 'icon-shenpi', isNav: true },
        component: resolve => require(['../../views/processModelCenter/correlationSystem/index.vue'], resolve)
      },
      {
        name: 'processHasBeenDestoryed', // 已作废流程
        path: '/processModelCenter/processHasBeenDestoryed',
        meta: { title: '已作废流程', icon: 'icon-zuzhijiagou', isNav: true },
        component: resolve => require(['../../views/processModelCenter/processHasBeenDestoryed/index.vue'], resolve)
      },
      // {
      //   // 规章制度
      //   name: 'institution',
      //   path: '/processModelCenter/institution',
      //   meta: { title: '已作废规章制度', icon: 'icon-huishouzhan', isNav: true },
      //   component: resolve => require(['../../views/processModelCenter/institution/index1.vue'], resolve)
      // },
      // {
      //   name: 'institution', // 已作废规章制度
      //   path: '/processModelCenter/institution',
      //   meta: { title: 'institution', isNav: true },
      //   redirect: '/processModelCenter/institution/responsibilities',
      //   component: resolve => require(['../../views/processModelCenter/institution/index.vue'], resolve),
      //   children: [
      //     {
      //       name: 'institutionResponsibilities',
      //       path: '/processModelCenter/institution/responsibilities',
      //       meta: { title: 'institutionResponsibilities', isNav: true },
      //       component: resolve => require(['../../views/processModelCenter/institution/responsibilities/index.vue'], resolve)
      //     },
      //     {
      //       name: 'institutionHandbook',
      //       path: '/processModelCenter/institution/handbook',
      //       meta: { title: 'institutionHandbook', isNav: true },
      //       component: resolve => require(['../../views/processModelCenter/institution/handbook/index.vue'], resolve)
      //     }
      //   ]
      // }
      // 制度流程内容快速查询
      // {
      //   path: '/processModelCenter/ruleContentCheck',
      //   meta: { title: '制度流程内容快速查询', icon: 'icon-chazhao2', isNav: false },
      //   component: resolve => require(['../../views/processModelCenter/ruleContentCheck/index.vue'], resolve)
      // }
    ]
  },
  {
    path: '/processDetails/:id',
    meta: { title: 'processDetails', isNav: false },
    component: resolve => require(['../../views/layout'], resolve),
    children: [
      {
        name: 'processDetails',
        path: '',
        meta: { title: 'processDetails', icon: 'icon-leixingpeizhix', isNav: false },
        component: resolve => require(['../../views/processModelCenter/processCommunity/ProcessDetailsModify.vue'], resolve)
      }
    ]
  },
  {
    path: '/processDetailsDestroy/:id',
    meta: { title: 'processDetailsDestroy', icon: 'icon-leixingpeizhix', isNav: false },
    component: resolve => require(['../../views/layout'], resolve),
    children: [
      {
        name: 'processDetailsDestroy',
        path: '',
        meta: { title: 'processDetailsDestroy', isNav: false },
        component: resolve => require(['../../views/processModelCenter/processHasBeenDestoryed/ProcessDetails.vue'], resolve)
      }
    ]
  },
  {
    path: '/rulesDetail/:docid/:revId',
    meta: { title: 'rulesDetail', isNav: false },
    component: resolve => require(['../../views/layout'], resolve),
    children: [
      {
        name: 'rulesDetail',
        path: '',
        meta: { title: 'rulesDetail', icon: 'icon-leixingpeizhix', isNav: false },
        component: resolve => require(['../../views/processModelCenter/rulesAndRegulations/detail.vue'], resolve)
      }
    ]
  },
  {
    path: '/rulesAbolishDetail/:docid/:revId',
    meta: { title: 'rulesAbolishDetail', icon: 'icon-leixingpeizhix', isNav: false },
    component: resolve => require(['../../views/layout'], resolve),
    children: [
      {
        name: 'rulesAbolishDetail',
        path: '',
        meta: { title: 'rulesAbolishDetail', icon: 'icon-leixingpeizhix', isNav: false },
        component: resolve => require(['../../views/processModelCenter/institution/detail.vue'], resolve)
      }
    ]
  },
  {
    path: '/ruleDoc/:id',
    meta: { title: 'ruleDoc', icon: 'icon-leixingpeizhix', isNav: false },
    component: resolve => require(['../../views/layout'], resolve),
    children: [
      {
        name: 'ruleDoc',
        path: '',
        meta: { title: 'ruleDoc', icon: 'icon-leixingpeizhix', isNav: false },
        component: resolve => require(['../../views/processModelCenter/ruleContentCheck/document.vue'], resolve)
      }
    ]
  }
]
export default processModelCenter
