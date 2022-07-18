const analyseWatchCenter = [
  {
    // 流程模型中心
    name: 'AnalyseWatchCenter',
    path: '/analyseWatchCenter',
    meta: { title: '流程分析', isNav: true },
    // redirect: '/analyseWatchCenter/bpa/All',
    redirect: `/analyseWatchCenter/bpa/All`,
    component: resolve => require(['@/bpa/views/layout-full'], resolve),
    children: [
      // bpa
      {
        name: '/processPerformance/processPerformance',
        path: '/processPerformance/processPerformance',
        meta: { title: '流程绩效', isNav: true },
        component: resolve => require(['@/bpa/views/processPerformance/processPerformance/index'], resolve)
      },
      {
        name: '/analyseWatchCenter/bpa/All',
        path: '/analyseWatchCenter/bpa/All',
        meta: { title: '制度流程总览', isNav: true },
        component: resolve => require(['@/bpa/views/analyseWatchCenter/bpaAll'], resolve)
      },
      {
        name: '/analyseWatchCenter/bpa/systemKanBan',
        path: '/analyseWatchCenter/bpa/systemKanBan',
        meta: { title: '制度看板', isNav: true },
        component: resolve => require(['@/bpa/views/analyseWatchCenter/systemKanBan'], resolve)
      },
      {
        name: 'systemKanBanDetails',
        path: '/analyseWatchCenter/bpa/systemKanBan/SystemDetails',
        meta: { title: '制度接收阅读情况详情', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/systemKanBan/SystemDetails'], resolve)
      },
      {
        name: 'systemKanBanReadDetails',
        path: '/analyseWatchCenter/bpa/systemKanBan/SystemDetails/systemKanBanReadDetails',
        meta: { title: '制度接收阅读情况详情-明细', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/systemKanBan/SystemDetailsdetailed'], resolve)
      },
      {
        name: 'SystemLinesDetails',
        path: '/analyseWatchCenter/bpa/systemKanBan/SystemLinesDetails',
        meta: { title: '制度条线阅读情况详情', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/systemKanBan/SystemLinesDetails'], resolve)
      },
      {
        name: 'SystemUnmatchedDetails',
        path: '/analyseWatchCenter/bpa/systemKanBan/SystemUnmatchedDetails',
        meta: { title: '未关联流程制度详情', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/systemKanBan/SystemUnmatchedDetails'], resolve)
      },
      {
        name: '/analyseWatchCenter/bpa/Analysis',
        path: '/analyseWatchCenter/bpa/Analysis',
        meta: { title: '画板', isNav: true },
        component: resolve => require(['@/bpa/views/analyseWatchCenter/bpaAnalysis'], resolve)
      },
      {
        name: 'Details',
        path: '/analyseWatchCenter/bpa/Details',
        meta: { title: '画板详情', isNav: false },
        component: resolve => require(['@/bpa/views/analyseWatchCenter/bpaDetails'], resolve)
      },
      // bpm
      {
        name: 'instance',
        path: '/analyseWatchCenter/bpm/instance',
        meta: { title: '运行实例', isNav: true },
        component: resolve => require(['@/bpa/views/analyseWatchCenter/operationExample'], resolve)
      },
      {
        name: 'JobAnalysis',
        path: '/analyseWatchCenter/bpm/jobAnalysis',
        meta: { title: '岗位分析', isNav: true },
        component: resolve => require(['@/bpa/views/analyseWatchCenter/positionAnalysis'], resolve)
      },
      {
        name: 'TaskDepartment',
        path: '/analyseWatchCenter/bpm/TaskDepartment',
        meta: { title: '任务效率分析(按部门)', isNav: true },
        component: resolve => require(['@/bpa/views/analyseWatchCenter/bpmTaskDepartment'], resolve)
      },
      {
        name: 'TaskProcess',
        path: '/analyseWatchCenter/bpm/TaskProcess',
        meta: { title: '任务效率分析(按流程)', isNav: true },
        component: resolve => require(['@/bpa/views/analyseWatchCenter/bpmTaskProcess'], resolve)
      },
      // 运营监控
      {
        name: 'home2',
        path: '/analyseWatchCenter/monitoring',
        meta: { title: 'home2', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/home2/index.vue'], resolve)
      },
      // 指标库
      {
        name: 'databaseList',
        path: '/analyseWatchCenter/databaseList',
        meta: { title: 'databaseList', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/databaseList/index.vue'], resolve)
      },
      // 报告分析
      {
        name: 'analysisReport',
        path: '/analyseWatchCenter/analysisReport',
        meta: { title: 'analysisReport', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/analysisReport/index.vue'], resolve)
      },
      // {
      //   name: 'module2Child3',
      //   path: '/analyseWatchCenter/child3',
      //   meta: { title: 'module2Child3', isNav: true },
      //   component: resolve => require(['../../views/analyseWatchCenter/child3/index.vue'], resolve)
      // },
      // {
      //   name: 'positionAnalysis',
      //   path: '/analyseWatchCenter/positionAnalysis',
      //   meta: { title: '岗位分析', isNav: true },
      //   component: resolve => require(['../../views/analyseWatchCenter/positionAnalysis/index.vue'], resolve)
      // },
      // 流程发布详情
      {
        name: ' bpaDetails',
        path: '/analyseWatchCenter/bpaDetails',
        meta: { title: 'module2Child3', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/bpaDetails/index.vue'], resolve)
      },
      // 岗位参与详情
      {
        name: ' bpaPostDetails',
        path: '/analyseWatchCenter/bpaPostDetails',
        meta: { title: 'module2Child3', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/bpaPostDetails/index.vue'], resolve)
      },
      // 任务效率分析详情 按流程
      {
        name: ' bpmTaskProcessDetails',
        path: '/analyseWatchCenter/bpmTaskProcessDetails',
        meta: { title: 'module2Child3', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/bpmTaskProcessDetails/index.vue'], resolve)
      },
      // 任务效率分析详情 按部门
      {
        name: ' bpmTaskDepartmentDetails',
        path: '/analyseWatchCenter/bpmTaskDepartmentDetails',
        meta: { title: 'module2Child3', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/bpmTaskDepartmentDetails/index.vue'], resolve)
      },
      // 流程发起数排名更多
      {
        name: 'ProcessInitiationRanking',
        path: '/analyseWatchCenter/ProcessInitiationRanking',
        meta: { title: '流程发起数排名', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/bpmProcessNumRanking/index.vue'], resolve)
      },
      // 流程发起数排名更多
      {
        name: 'bpmPostProcessRanking',
        path: '/analyseWatchCenter/bpmPostProcessRanking',
        meta: { title: '流程发起数排名', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/bpmPostProcessRanking/index.vue'], resolve)
      },
      // 流程发起数排名更多
      {
        name: 'bpmAverageProcessRanking',
        path: '/analyseWatchCenter/bpmAverageProcessRanking',
        meta: { title: '流程发起数排名', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/bpmAverageProcessRanking/index.vue'], resolve)
      },
      // 流程还原
      {
        name: 'bpmProcessBack',
        path: '/analyseWatchCenter/bpmProcessBack',
        meta: { title: '流程发起数排名', isNav: true },
        component: resolve => require(['../../views/analyseWatchCenter/bpmProcessBack/index.vue'], resolve)
      },
      // 新流程还原
      {
        name: 'bpmProcessBackNew',
        path: '/analyseWatchCenter/bpm/ProcessBackNew',
        meta: { title: '新流程发起数排名', isNav: true },
        component: resolve => require(['../../views/analyseWatchCenter/bpmProcessBackNew/index.vue'], resolve)
      },
      // 月核销单
      {
        name: 'bpmMonthVerificationSheet',
        path: '/analyseWatchCenter/bpmMonthVerificationSheet',
        meta: { title: '月核销单', isNav: true },
        component: resolve => require(['../../views/analyseWatchCenter/bpmMonthVerificationSheet/index.vue'], resolve)
      },
      {
        name: 'valueChain',
        path: '/analyseWatchCenter/valueChain',
        meta: { title: 'valueChain', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/valueChain/index.vue'], resolve)
      },
      {
        name: 'lineChart',
        path: '/analyseWatchCenter/lineChart',
        meta: { title: 'lineChart', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/lineChart/index.vue'], resolve)
      },
      {
        name: 'processList',
        path: '/analyseWatchCenter/processList',
        meta: { title: 'processList', isNav: false },
        component: resolve => require(['../../views/analyseWatchCenter/processList/index.vue'], resolve)
      },
      // {
      //   name: 'fullMonitorView',
      //   path: '/monitorFull',
      //   component:resolve => require(['../../../bpm/views/monitor/full'],resolve),
      //   children:[
          //运行分析
          {
            name: '/monitorFull/runningAnalysis',
            path: '/monitorFull/runningAnalysis',
            meta: { title: '运行分析', icon: 'icon-shujufenxi1', isNav: false },
            component: resolve => require(['../../../bpm/views/monitor/processMonitoring/runningAnalysis/indexFull'], resolve)
          },
          {
            name: '/monitorFull/solidColumnAnalysis',
            path: '/monitorFull/solidColumnAnalysis',
            meta: { title: '实例分析', icon: 'icon-yichangtiaojianshezhi', isNav: false },
            component: resolve => require(['../../../bpm/views/monitor/processMonitoring/solidColumnAnalysis/indexFull'], resolve)
          },
          {
            name: '/monitorFull/operationefficiency',
            path: '/monitorFull/operationefficiency',
            meta: { title: '运行效率', icon: 'icon-tubiaozhuzhuangtu', isNav: false },
            component: resolve => require(['../../../bpm/views/monitor/processMonitoring/operationefficiency/indexFull'], resolve)
          },
          {
            name: '/monitorFull/correspondingPeriod',
            path: '/monitorFull/correspondingPeriod',
            meta: { title: '同期分析', icon: 'icon-tubiaozhuzhuangtu', isNav: false },
            component: resolve => require(['../../../bpm/views/monitor/processMonitoring/correspondingPeriod/indexFull'], resolve)
          }
        // ]
      // },
    ]
  }
]
export default analyseWatchCenter
