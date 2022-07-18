import { routerPath } from '@/bpm/utils'

const disparkRoutes = [
  {
    path: '/approveList',
    name: 'approveList',
    meta: { title: '审批列表' },
    component: resolve => require(['../views/staging/personal/approveList'], resolve)
  },{
    path: '/returnTask',
    name: 'returnTask',
    meta: { title: '退回任务' },
    component: resolve => require(['../views/staging/personal/returnTask'], resolve)
  },{
    path: '/applyCreate',
    name: 'applyCreate',
    meta: { title: '申请创建' },
    component: resolve => require(['../views/staging/personal/applyCreate'], resolve)
  },{
    path: '/collection',
    name: 'collection',
    meta: { title: '我的收藏' },
    component: resolve => require(['../views/staging/personal/collection'], resolve)
  },{
    path: '/drafts',
    name: 'drafts',
    meta: { title: '草稿箱' },
    component: resolve => require(['../views/staging/personal/drafts'], resolve)
  },{
    path: '/apply',
    name: 'apply',
    meta: { title: '我的申请' },
    component: resolve => require(['../views/staging/personal/apply'], resolve)
  },{
    path: '/myFocusTask',
    name: 'myFocusTask',
    meta: { title: '我归口的任务' },
    component: resolve => require(['../views/staging/personal/myFocusTask'], resolve)
  },{
    path: '/processTemplate',
    name: 'processTemplate',
    meta: { title: '流程模板' },
    component: resolve => require(['../views/staging/personal/processTemplate'], resolve)
  },{
    path: '/processTrace',
    name: 'processTrace',
    meta: { title: '流程跟踪' },
    component: resolve => require(['../views/staging/personal/processTrace'], resolve)
  },{
    path: '/processCirculated',
    name: 'processCirculated',
    meta: { title: '流程传阅' },
    component: resolve => require(['../views/staging/personal/processCirculated'], resolve)
  },{
    path: '/query_center',
    name: 'query_center',
    meta: { title: '查找中心' },
    component: resolve => require(['../views/staging/tool/query_center'], resolve)
  },{
    path: '/out_auth',
    name: 'out_auth',
    meta: { title: '外出授权' },
    component: resolve => require(['../views/staging/tool/out_auth'], resolve)
  }
  
]

export default disparkRoutes
