import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取申请列表
export function getApplyList (data) {
  return fetch({
    url: '/bpm/apply/query',
    method: 'POST',
    data
  })
}

// 获取申请列表  快速查询
export function quickQueryApplyList (data) {
  return fetch({
    url: '/bpm/processquery/v2/mySponsor',
    method: 'POST',
    data
  })
}

// 撤单-将流程路由的申请节点
export function cancelorder (data) {
  return fetch({
    // url: `/bpm/process/cancelorder/${instanceId}`,
    url: `/bpm/process/manage/withDrawInstance`,
    method: 'POST',
    data
  })
}

// 流程催办
export function urge (instanceId) {
  return fetch({
    url: `/bpm/urge/${instanceId}`,
    method: 'GET'
  })
}
// 获取申请列表  快速查询
export function getProgressNode (data) {
  return fetch({
    url: '/bpm/process/progressNode',
    method: 'POST',
    data
  })
}

// 获取流程图类型
export function processshowtype (data) {
  return fetch({
    url: '/bpm/process/processshowtype',
    method: 'GET'
  })
}
