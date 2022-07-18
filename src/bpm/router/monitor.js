const monitorRoute = {
    name: 'monitor',
    path: '/monitor',
    meta: { title: '分析监控中心', icon: 'el-icon-s-platform', isNav: true },
    component: resolve => require(['../views/parent'], resolve),
    redirect: { name: 'processMonitoring' },
    children: [
      {
        name: 'processMonitoring',
        path: 'processMonitoring',
        meta: {title: '流程监控', icon: 'el-icon-s-custom', isNav: true},
        component: resolve => require(['../views/layout'], resolve),
        redirect: { name: 'runningAnalysis' },
        children: [
          {
            name: '/monitor/processMonitoring/runningAnalysis',
            path: 'runningAnalysis',
            meta: { title: '运行分析', icon: 'icon-shujufenxi1', isNav: true },
            component: resolve => require(['../views/monitor/processMonitoring/runningAnalysis'], resolve)
          },
          {
            name: '/monitor/processMonitoring/solidColumnAnalysis',
            path: 'solidColumnAnalysis',
            meta: { title: '实例分析', icon: 'icon-yichangtiaojianshezhi', isNav: true },
            component: resolve => require(['../views/monitor/processMonitoring/solidColumnAnalysis'], resolve)
          },
          {
            name: '/monitor/processMonitoring/correspondingPeriod',
            path: 'correspondingPeriod',
            meta: { title: '同期分析', icon: 'icon-tubiaozhuzhuangtu', isNav: true },
            component: resolve => require(['../views/monitor/processMonitoring/correspondingPeriod'], resolve)
          },
          {
            name: '/monitor/processMonitoring/operationefficiency',
            path: 'operationefficiency',
            meta: { title: '运行效率', icon: 'icon-tubiaozhuzhuangtu', isNav: true },
            component: resolve => require(['../views/monitor/processMonitoring/operationefficiency'], resolve)
          },
          {
            name: 'exceptionAnalysis',
            path: 'exceptionAnalysis',
            meta: { title: '异常分析', icon: 'icon-tubiao', isNav: true },
            component: resolve => require(['../views/monitor/processMonitoring/exceptionAnalysis'], resolve)
          },
          {
            name: 'exceptionHandling',
            path: 'exceptionHandling',
            meta: { title: '异常处理', icon: 'icon-yichangguanli', isNav: true },
            component: resolve => require(['../views/monitor/processMonitoring/exceptionHandling/index.vue'], resolve)
          },
          {
            name: 'mobileLoginEchart',
            path: 'mobileLoginEchart',
            meta: { title: '移动登录图表', icon: 'icon-tubiaoshangshengqushi', isNav: false },
            component: resolve => require(['../views/monitor/processMonitoring/mobileLoginEchart'], resolve)
          },
          {
            name: 'mobileApprovalEchart',
            path: 'mobileApprovalEchart',
            meta: { title: '移动审批图表', icon: 'icon-icon1', isNav: false },
            component: resolve => require(['../views/monitor/processMonitoring/mobileLoginEchart'], resolve)
          },
          {
            name: 'mobileLoginList',
            path: 'mobileLoginList',
            meta: { title: '移动登录列表', icon: 'icon-denglurizhi-', isNav: false },
            component: resolve => require(['../views/monitor/processMonitoring/mobileLoginList'], resolve)
          },
          

        ]
      },
      {
        name: 'reportMonitoring',
        path: 'reportMonitoring',
        meta: {title: '报表中心', icon: 'el-icon-s-custom', isNav: true},
        component: resolve => require(['../views/layout'], resolve),
        children: [
          {
            name: 'projectApproval',
            path: 'projectApproval/report',
            meta: { title: '公用报表', icon: 'icon-shujufenxi1', isNav: true },
            component: resolve => require(['../views/monitor/report/projectApproval'], resolve)
          },
        ]
      },
      {
        name: 'chartMonitoring',
        path: 'chartMonitoring',
        meta: {title: '报表中心', icon: 'el-icon-s-custom', isNav: true},
        component: resolve => require(['../views/layout'], resolve),
        children: [
          {
            name: 'customChart',
            path: 'customChart',
            meta: { title: '公用图表', icon: 'icon-shujufenxi1', isNav: true },
            component: resolve => require(['../views/monitor/chartMonitoring/customChart'], resolve)
          }
        ]
      }
    ]
  }
  export default monitorRoute
  