const module1Routes = [
  {
    path: '/doorCenter',
    meta: { title: '门户', isNav: true },
    component: resolve => require(['../../views/layout'], resolve),
    children: [
      {
        name: '/doorCenter',
        path: '/doorCenter', // 门户中心
        meta: { title: 'doorCenter', isNav: false },
        component: resolve =>
          require(['../../views/doorCenter/index.vue'], resolve)
      },
      {
        name: 'noticeManageTop',
        path: '/doorCenter/noticeManage', // 公告管理
        meta: { title: 'noticeManageTop', isNav: false },
        component: resolve =>
          require(['../../views/doorCenter/noticeManage/index.vue'], resolve)
      },
      {
        name: 'newsManage',
        path: '/doorCenter/newsManage', // 流程学习管理
        meta: { title: 'newsManage', isNav: false },
        component: resolve =>
          require(['../../views/doorCenter/newsManage/index.vue'], resolve)
      },
      {
        name: 'operateBook',
        path: '/doorCenter/operateBook', // 操作手册
        meta: { title: 'operateBook', isNav: false },
        component: resolve =>
          require(['../../views/doorCenter/operateBook/index.vue'], resolve)
      },
      {
        name: 'processManagementSpecificationTop',
        path: '/doorCenter/processManagementSpecification', // 流程管理规范
        meta: { title: 'processManagementSpecification', isNav: false },
        component: resolve =>
          require([
            '../../views/doorCenter/processManagementSpecification/index.vue'
          ], resolve)
      },
      {
        name: 'processTemplateManageTop',
        path: '/doorCenter/processTemplateManage', // 流程模板
        meta: { title: 'processTemplateManage', isNav: false },
        component: resolve =>
          require([
            '../../views/doorCenter/processTemplateManage/index.vue'
          ], resolve)
      },
      {
        name: 'modelProcess',
        path: '/doorCenter/modelProcess', // 系统模板
        meta: { title: 'modelProcess', isNav: false },
        component: resolve =>
          require(['../../views/doorCenter/modelProcess/index.vue'], resolve)
      },
      {
        name: 'rulesShow',
        path: '/doorCenter/rulesShow', // 规章制度详情
        meta: { title: 'rulesShow', isNav: false },
        component: resolve =>
          require(['../../views/doorCenter/rulesShow/index.vue'], resolve)
      },
      {
        name: 'rulesShow1',
        path: '/doorCenter/rulesShow1', // 规章制度详情
        meta: { title: 'rulesShow1', isNav: false },
        component: resolve =>
          require(['../../views/doorCenter/rulesShow1/index.vue'], resolve)
      },
      {
        name: 'TheProcessIsv',
        path: '/doorCenter/TheProcessIsv', // 流程器编辑
        meta: { title: 'TheProcessIsv', isNav: false },
        component: resolve =>
          require(['../../views/doorCenter/TheProcessIsv/index.vue'], resolve)
      }
    ]
  },
  {
    name: 'globalSearch',
    path: '/globalSearch', // 全局检索
    meta: { title: 'globalSearch', isNav: false },
    component: resolve => require(['../../views/globalSearch'], resolve)
  },
  {
    name: 'operationSystem',
    path: '/operationSystem', // 运营体系管理
    meta: { title: '运营体系管理', isNav: false },
    component: resolve => require(['../../views/operationSystem'], resolve)
  }
]
export default module1Routes
