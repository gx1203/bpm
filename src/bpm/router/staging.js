const stagingRoute = {
  name: 'staging',
  path: '/staging',
  meta: { title: '工作台', icon: 'icon-leixingpeizhix', isNav: true },
  component: resolve => require(['../views/parent'], resolve),
  redirect: { name: 'stagingPersonal' },
  children: [
    {
      name: 'stagingPersonal',
      path: 'personal',
      meta: { title: '个人工作台', icon: 'icon-leixingpeizhix', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'stagingPersonalApproveList' },
      children: [
        {
          name: '/staging/personal/approveList',
          path: 'approveList',
          meta: {
            title: '审批列表',
            icon: 'icon-yishenpiliebiao-',
            isNav: true
          },
          component: resolve =>
            require(['../views/staging/personal/approveList'], resolve)
        },
        {
          name: 'stagingPersonalReturnTask',
          path: 'returnTask',
          meta: { title: '退回任务', icon: 'icon-navicon-dhthd', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/returnTask'], resolve)
        },
        {
          name: '/staging/personal/applyCreate',
          path: 'applyCreate',
          meta: { title: '申请创建', icon: 'icon-shenqing', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/applyCreate'], resolve)
        },
        {
          name: '/staging/personal/collection',
          path: 'collection',
          meta: { title: '我的收藏', icon: 'icon-wodeshoucang', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/collection'], resolve)
        },
        {
          name: '/staging/personal/drafts',
          path: 'drafts',
          meta: { title: '草稿箱', icon: 'icon-caogaoxiang', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/drafts'], resolve)
        },
        {
          name: '/staging/personal/apply',
          path: 'apply',
          meta: { title: '我的申请', icon: 'icon-wodeshenqing2', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/apply'], resolve)
        },
        {
          name: '/staging/personal/myFocusTask',
          path: 'myFocusTask',
          meta: { title: '我归口的任务', icon: 'icon-renwu', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/myFocusTask'], resolve)
        },
        {
          name: '/staging/personal/processTemplate',
          path: 'processTemplate',
          meta: { title: '流程模版', icon: 'icon-moban1', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/processTemplate'], resolve)
        },
        {
          name: 'stagingPersonalProcessTrace',
          path: 'processTrace',
          meta: { title: '流程跟踪', icon: 'icon-zaitugenzong', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/processTrace'], resolve)
        },
        {
          name: 'stagingPersonalAuthorizationTasks',
          path: 'authorizationTasks',
          meta: { title: '授权任务', icon: 'icon-shouquan3', isNav: false },
          component: resolve =>
            require(['../views/staging/personal/authorizationTasks'], resolve)
        },
        {
          name: 'stagingPersonalProcessCirculated',
          path: 'processCirculated',
          meta: { title: '流程传阅', icon: 'icon-chuanyue1', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/processCirculated'], resolve)
        },
        {
          name: '/staging/personal/myCC',
          path: 'myCC',
          meta: { title: '我的抄送', icon: 'icon-chuanyue1', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/myCC'], resolve)
        },
        {
          name: '/staging/personal/ccMy',
          path: 'ccMy',
          meta: { title: '抄送到我', icon: 'icon-chuanyue1', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/myCC'], resolve)
        }
      ]
    },
    {
      name: 'stagingTool',
      path: 'tool',
      meta: { title: '应用工具', icon: 'el-icon-s-cooperation', isNav: true },
      redirect: { name: 'stagingToolQueryCenter' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/staging/tool/query_center', // stagingToolQueryCenter
          path: 'query_center',
          meta: { title: '查找中心', icon: 'icon-zhongxin', isNav: true },
          component: resolve =>
            require(['../views/staging/tool/query_center'], resolve)
        },
        {
          name: '/staging/tool/out_auth',
          path: 'out_auth',
          meta: { title: '外出授权', icon: 'icon-shouquan3', isNav: true },
          component: resolve =>
            require(['../views/staging/tool/out_auth'], resolve)
        },
        {
          name: '/staging/tool/subordinatea_out_record',
          path: 'subordinateaOutRecord',
          meta: { title: '下属授权记录', icon: 'icon-shouquan3', isNav: true },
          component: resolve =>
            require(['../views/staging/tool/subordinatea_out_record'], resolve)
        },
        {
          path: 'stagingToolOutAuthView',
          name: '/staging/tool/out_auth_view',
          meta: { title: '外出授权查询', icon: 'icon-shouquan3', isNav: true },
          component: resolve =>
            require(['../views/staging/tool/out_auth_view'], resolve)
        },
        {
          name: '/staging/tool/business_auth',
          path: 'business_auth',
          meta: { title: '业务授权', icon: 'icon-jiaoseguanli', isNav: true },
          component: resolve =>
            require(['../views/staging/tool/business_auth'], resolve)
        }
      ]
    }
  ]
}

export default stagingRoute
