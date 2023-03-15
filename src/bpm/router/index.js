import appRoutes from './app'
import printPage from './printPage'
import stagingRoute from './staging'
import processRoute from './process'
import monitorRoute from './monitor'
import configRoute from './configManage'
import helpRoute from './help'
import disparkRoutes from './dispark'
import aloneProcessRoutes from './aloneProcess'
import analyseWatchCenter from './analyseWatchCenter'
import processCenter from './processCenter'
import managementElements from './managementElements'
import VueRouter from 'vue-router'
import bpmHomeRouter from './bpmHome'
// import settingsRoutes from './settings'// 管理中心
import store from '../store'
import dataOverview from './dataOverview'

// 解决ie拒绝访问问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const businessRoutes = [
  stagingRoute,
  processRoute,
  monitorRoute,
  configRoute,
  helpRoute,
  bpmHomeRouter,
  processCenter,
  managementElements,
  dataOverview
]

const bpmRoutes = [
  {
    path: '/bpmhome',
    name: 'bpmhome',
    component: () => import('@/bpm/App.vue'),
    children: [
      ...businessRoutes,
      ...disparkRoutes,
      ...printPage,
      ...aloneProcessRoutes,
      ...analyseWatchCenter,
      ...appRoutes
    ]
  }
]

export default bpmRoutes
