const analyseWatchCenter = [
  {
    // 流程模型中心
    name: 'analyseWatchCenter',
    path: '/analyseWatchCenter',
    meta: { title: 'analyseWatchCenter', isNav: true },
    redirect: `/analyseWatchCenter/bpa/Analysis`,
    component: resolve => require(['@/bpm/views/layout-full'], resolve),
    children: [
      // bpa
      {
        name: 'Analysis',
        path: '/analyseWatchCenter/bpa/Analysis',
        meta: { title: '流程监控', isNav: true },
        component: resolve => require(['@/bpm/views/analyseWatchCenter/bpaAnalysis'], resolve)
      },
      {
        name: 'Details',
        path: '/analyseWatchCenter/bpa/Details',
        meta: { title: '流程监控', isNav: true },
        component: resolve => require(['@/bpm/views/analyseWatchCenter/bpaDetails'], resolve)
      },
      // bpm
      {
        name: 'instance',
        path: '/analyseWatchCenter/bpm/instance',
        meta: { title: '运行实例', isNav: true },
        component: resolve => require(['@/bpm/views/analyseWatchCenter/operationExample'], resolve)
      },
      {
        name: 'JobAnalysis',
        path: '/analyseWatchCenter/bpm/jobAnalysis',
        meta: { title: '岗位分析', isNav: true },
        component: resolve => require(['@/bpm/views/analyseWatchCenter/positionAnalysis'], resolve)
      },
      {
        name: 'TaskDepartment',
        path: '/analyseWatchCenter/bpm/TaskDepartment',
        meta: { title: '任务效率分析(按部门)', isNav: true },
        component: resolve => require(['@/bpm/views/analyseWatchCenter/bpmTaskDepartment'], resolve)
      },
      {
        name: 'TaskProcess',
        path: '/analyseWatchCenter/bpm/TaskProcess',
        meta: { title: '任务效率分析(按流程)', isNav: true },
        component: resolve => require(['@/bpm/views/analyseWatchCenter/bpmTaskProcess'], resolve)
      },
      // {
      //   name: 'module2Child1',
      //   path: '',
      //   meta: { title: 'module2Child1', isNav: true },
      //   component: resolve => require(['../../views/analyseWatchCenter/home/index.vue'], resolve)
      // },
      // {
      //   name: 'module2Child2',
      //   path: '/analyseWatchCenter/timedata',
      //   meta: { title: 'module2Child2', isNav: true },
      //   component: resolve => require(['../../views/analyseWatchCenter/child2/index.vue'], resolve)
      // },
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
        meta: { title: 'module2Child3', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/bpaDetails/index.vue'], resolve)
      },
      // 岗位参与详情
      {
        name: ' bpaPostDetails',
        path: '/analyseWatchCenter/bpaPostDetails',
        meta: { title: 'module2Child3', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/bpaPostDetails/index.vue'], resolve)
      },
      // 任务效率分析详情 按流程
      {
        name: ' bpmTaskProcessDetails',
        path: '/analyseWatchCenter/bpmTaskProcessDetails',
        meta: { title: 'module2Child3', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/bpmTaskProcessDetails/index.vue'], resolve)
      },
      // 任务效率分析详情 按部门
      {
        name: ' bpmTaskDepartmentDetails',
        path: '/analyseWatchCenter/bpmTaskDepartmentDetails',
        meta: { title: 'module2Child3', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/bpmTaskDepartmentDetails/index.vue'], resolve)
      },
      // 流程发起数排名更多
      {
        name: 'ProcessInitiationRanking',
        path: '/analyseWatchCenter/ProcessInitiationRanking',
        meta: { title: '流程发起数排名', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/bpmProcessNumRanking/index.vue'], resolve)
      },
      // 流程发起数排名更多
      {
        name: 'bpmPostProcessRanking',
        path: '/analyseWatchCenter/bpmPostProcessRanking',
        meta: { title: '流程发起数排名', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/bpmPostProcessRanking/index.vue'], resolve)
      },
      // 流程发起数排名更多
      {
        name: 'bpmAverageProcessRanking',
        path: '/analyseWatchCenter/bpmAverageProcessRanking',
        meta: { title: '流程发起数排名', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/bpmAverageProcessRanking/index.vue'], resolve)
      },
      // 流程还原
      {
        name: 'bpmProcessBack',
        path: '/analyseWatchCenter/bpmProcessBack',
        meta: { title: '流程发起数排名', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/bpmProcessBack/index.vue'], resolve)
      },
      {
        name: 'valueChain',
        path: '/analyseWatchCenter/valueChain',
        meta: { title: 'valueChain', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/valueChain/index.vue'], resolve)
      },
      {
        name: 'lineChart',
        path: '/analyseWatchCenter/lineChart',
        meta: { title: 'lineChart', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/lineChart/index.vue'], resolve)
      },
      {
        name: 'processList',
        path: '/analyseWatchCenter/processList',
        meta: { title: 'processList', isNav: true },
        component: resolve => require(['../views/analyseWatchCenter/processList/index.vue'], resolve)
      }
    ]
  }
]
export default analyseWatchCenter
