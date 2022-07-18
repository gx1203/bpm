import Vue from 'vue'
import Router from 'vue-router'
import appRoutes from './app'
import doorCenterRoutes from './doorCenter'// 门户中心
import overViewRoutes from './overView'// 门户中心
import processModelCenter from './processModelCenter'// 流程模型中心
import processDesignCenter from './processDesignCenter'// 流程设计中心
import processHandlerCenter from './processHandlerCenter'// 流程处理中心
import processPerformance from './processPerformance' // 流程绩效
// import processHandlerIframeCenter from './processHandlerIframeCenter' // iframe形式的流程处理
import analyseWatchCenter from './analyseWatchCenter'// 流程分析
import analysisMonitoringCenter from './analysisMonitoringCenter'// 分析监控中心
import rulesCenter from './rulesCenter'// 规章制度中心
import enterpriseStandard from './enterpriseStandard'// 企业标准
import settingsRoutes from './settings'// 管理中心
import valueRoutes from './valueCenter'// 管理中心
import diRoutes from './diCenter'// 流程绩效中心
import knowRoutes from './knowledgeCenter'// 内容管理中心
import chainValue from './chainValue'
import jobsCenter from './jobsCenter'// 岗位中心
import onlineExam from './onlineExam' // 考试系统
import systemManagementCenter from './systemManagementCenter' // 体系管理中心
import processChart from './processChart'
import performCenter from './performanceManageCenter'
import dataBank from './dataBank'
import riskControlCenter from './riskControlCenter'
import store from './../store/index'
import { Base64, clearCookies } from '@/bpa/utils/common'
import cookie from 'js-cookie'

Vue.use(Router)

export const businessRoutes = [
  ...overViewRoutes,
  ...doorCenterRoutes,
  ...processModelCenter,
  ...valueRoutes,
  ...processDesignCenter,
  ...analyseWatchCenter,
  ...analysisMonitoringCenter,
  ...diRoutes,
  ...knowRoutes,
  ...rulesCenter,
  ...enterpriseStandard,
  ...settingsRoutes,
  ...chainValue,
  ...jobsCenter,
  ...onlineExam,
  ...performCenter,
  ...processPerformance,
  ...dataBank,
  ...riskControlCenter,
  ...processChart,
  ...systemManagementCenter
]
const bpaRoutes = [
  {
    path: '/bpahome',
    component: () => import('@/bpa/App.vue'),
    children: [
      ...appRoutes,
      ...businessRoutes
    ]
  }
]

export default bpaRoutes
