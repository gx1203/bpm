import { fetch } from '@/bpm/utils'

// 流程列表
export function getProcessList (data) {
  return fetch({
    url: `/bpm/processquery/v2/processManage`,
    method: 'POST',
    data
  })
}

// 获取流程路由信息
export function routingInfoDetail (instanceId) {
  return fetch({
    url: `/processRouting/routingInfoDetail/${instanceId}`,
    method: 'GET'
  })
}

// 流程路由
export function routed (data) {
  return fetch({
    url: `/processRouting/routed`,
    method: 'POST',
    data
  })
}

// 终止流程实例
export function cancelinstance (instanceId) {
  return fetch({
    url: `/bpm/process/cancelinstance/${instanceId}`,
    method: 'GET'
  })
}

// 流程暂停与启用
export function executeProcessInstance (data) {
  return fetch({
    url: `/bpm/process/executeProcessInstance`,
    method: 'POST',
    data
  })
}
