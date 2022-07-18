import {
  fetch
} from '@/bpm/utils'

// 获取流程详情
export function getProcessData(id) {
  return fetch({
    url: `/oa/process/get/${id}`,
    method: 'GET'
  })
}
// 获取流程节点详情
export function getProcessNodeData(id) {
  return fetch({
    url: `/oa/processNode/get/${id}`,
    method: 'GET'
  })
}
// 获取流程详情
export function saveProcessData(data) {
    return fetch({
      url: `/oa/process/save`,
      method: 'POST',
      data
    })
  }
  // 获取流程节点详情
  export function saveProcessNodeData(data) {
    return fetch({
      url: `/oa/processNode/save`,
      method: 'POST',
      data
    })
  }