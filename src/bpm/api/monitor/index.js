import { fetch } from '@/bpm/utils'
// 运行分析树结构
export function getMonitorTree (id) {
  return fetch({
    url: `/monitor/getMonitorTree/${id}`,
    method: 'GET'
  })
}
// 运行分析流程流转数
export function getProcessCirculation (id) {
  return fetch({
    url: `/monitor/getProcessCirculation/${id}`,
    method: 'GET'
  })
}
// 运行分析流程流转时间
export function getProcessCirculationDate (id) {
  return fetch({
    url: `/monitor/getProcessCirculationDate/${id}`,
    method: 'GET'
  })
}
// 运行分析流程逾期数据
export function getProcessCirculationDead (id, isapproval) {
  return fetch({
    url: `/monitor/getProcessCirculationDead/${id}/${isapproval}`,
    method: 'GET'
  })
}
// 实例分析
export function getExampleAnalysis (data) {
  return fetch({
    url: `/monitor/getExampleAnalysis`,
    method: 'POST',
    data
  })
}
// 同期分析
export function getSyncAnalysis (data) {
  return fetch({
    url: `/monitor/getSyncAnalysis`,
    method: 'POST',
    data
  })
}
// 异常分析
export function getMonitorWiAnalysis (data) {
  return fetch({
    url: `/monitor/getMonitorWiAnalysis`,
    method: 'GET',
    data
  })
}

// 异常处理
export function getProcessWiFault (data) {
  return fetch({
    url: `/monitor/getProcessWiFault`,
    method: 'POST',
    data
  })
}
// 获取模型下和子级下所有已分配的流程

export function getProcessInfo (id) {
  return fetch({
    url: `/model/getProcessChildInfo/${id}`,
    method: 'GET'
  })
}

// 获取运行效率的数据

export function getProcessEfficiency (data) {
  return fetch({
    url: `/monitor/getProcessEfficiency`,
    method: 'POST',
    data
  })
}

// 获取运行效率的数据

export function getProcessEfficiencyList (data) {
  return fetch({
    url: `/monitor/getProcessEfficiencyList`,
    method: 'POST',
    data
  })
}