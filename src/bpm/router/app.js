
const appRoutes = [
  // {
  //   path: '',
  //   meta: { title: '首页' },
  //   redirect: 'staging'
  // },
  {
    path: '/test',
    name: 'test',
    meta: { title: '测试' },
    component: resolve => require(['../views/test'], resolve)
  },
  {
    path: '/flow',
    name: 'flow',
    meta: { title: '流程表单' },
    component: resolve => require(['../views/flow_form'], resolve)
  },
  {
    path: '/processForm/start',
    name: 'processFormStart',
    meta: { title: '发起流程表单' },
    component: resolve => require(['../views/process_form/start'], resolve)
  },
  {
    path: '/processForm/preview',
    name: 'processFormPreview',
    meta: { title: '预览流程表单' },
    component: resolve => require(['../views/process_form/preview'], resolve)
  },
  {
    path: '/customForm',
    name: 'customForm',
    meta: { title: '配置表单' },
    component: resolve => require(['../views/customForm'], resolve)
  },
  {
    path: '/basDragForm',
    name: 'basDragForm',
    meta: { title: '配置表单' },
    component: resolve => require(['../components/basDragForm/index.vue'], resolve)
  },
  
  {
    path: '/processForm/test',
    name: 'processFormTest',
    meta: { title: '测试发起流程表单' },
    component: resolve => require(['../views/process_form/test'], resolve)
  },
  {
    path: '/processForm/approve',
    name: 'processFormApprove',
    meta: { title: '审批流程表单' },
    component: resolve => require(['../views/process_form/approve'], resolve)
  },
  {
    path: '/processForm/view',
    name: 'processFormView',
    meta: { title: '查看流程表单' },
    component: resolve => require(['../views/process_form/view'], resolve)
  },
  {
    path: '/processForm',
    name: 'processForm',
    meta: { title: '流程表单' },
    component: resolve => require(['../views/process/processBasic/processDesign/configForm'], resolve)
  },
  {
    path: '/confinBusinessRule',
    name: 'confinBusinessRule',
    meta: { title: '配置业务规则' },
    component: resolve => require(['../views/confinBusinessRule'], resolve)
  },

  {
    path: '/ruleChecking',
    name: 'ruleChecking',
    meta: { title: '业务规则检查' },
    component: resolve => require(['../views/ruleChecking'], resolve)
  },
  
  {
    path: '/processJurisdiction',
    name: 'processJurisdiction',
    meta: { title: '流程权限' },
    component: resolve => require(['../views/process/administrativeTool/processJobsPermissions/table.vue'], resolve)
  },
  {
    path: '/processRouting',
    name: 'processRouting',
    meta: { title: '流程节点路由' },
    component: resolve => require(['../views/processRouting'], resolve)
  },
  {
    path: "/formPagePreview",
    name: "formPagePreview",
    meta: { title: "表单页面预览" },
    component: resolve => require(["../views/process/administrativeTool/formPageConfig/formPagePreview.vue"], resolve)
  },
  {
    path: '/home',
    meta: { title: '首页' },
    component: resolve => require(['../views/home'], resolve)
  },
  {
    path: '/login',
    meta: { title: '登录' },
    component: resolve => require(['../views/login/index'], resolve)
  },
  {
    path: '/cron',
    name: 'cron',
    meta: { title: 'cron' },
    component: resolve => require(['../views/cron/index'], resolve)
  },
  {
    path: '/logout',
    meta: { title: '注销' },
    component: resolve => require(['../views/logout'], resolve)
  },
  {
    path: '/404',
    meta: { title: '404' },
    component: resolve => require(['../views/error_page/404'], resolve)
  },
  { path: '/*', redirect: '/404' }
]

export default appRoutes
