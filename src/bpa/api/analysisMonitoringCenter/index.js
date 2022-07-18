import { fetch } from '@/bpa/utils'
// 培训统计部分
export function getTrained (data) {
  return fetch({
    url: '/listrelease/trainFlowCountCopy',
    method: 'post',
    data
  })
}
export function exportTrained (data) {
  return fetch({
    url: '/analytical/exportAnalyticTrainDetailData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 培训统计-流程列表
export function getTrainedprocess (data) {
  return fetch({
    url: 'http://180.101.125.105/tmportal/analytical/analyticTrainDetailDataCopy',
    method: 'post',
    data
  })
}


// 超期部分
export function getExceed (data) {
  return fetch({
    url: '/analytical/analyticTimeDataCopy',
    method: 'post',
    data
  })
}

export function exportExceed (data) {
  return fetch({
    url: '/analytical/exportAnalyticTimeData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 最近发布流程
export function getPblish (data) {
  return fetch({
    url: '/analytical/analyticalDataCopy',
    method: 'post',
    data
  })
}

export function exportpblish (data) {
  return fetch({
    url: '/analytical/exportAnalyticalData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function exportpblishnode (data) {
  return fetch({
    url: '/analytical/exportAnalyticalNodeData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 审批效率
export function getRate (data) {
  return fetch({
    url: '/analytical/analyticEfficiencyDataCopy',
    method: 'post',
    data
  })
}
export function getRatedetail (data) {
  return fetch({
    url: '/analytical/analyticEfficiencyDetailDataCopy',
    method: 'post',
    data
  })
}

export function exportRate (data) {
  return fetch({
    url: '/analytical/exportAnalyticEfficiencyData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
