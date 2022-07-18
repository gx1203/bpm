import { fetch } from '@/bpm/utils'
import store from '@/store'

// 获取我得审批列表
export function getApproveList(data) {
  return fetch({
    url: '/bpm/todo/query',
    method: 'POST',
    data
  })
}

// 判断任务是否存在
export function taskExists(taskId, index) {
  return fetch({
    url: `/bpm/processquery/v2/taskExists/${taskId}/${index}`,
    method: 'GET'
  })
}

// 获取我得审批列表 快速查询
export function quickQueryApproveList(data) {
  return fetch({
    url: '/bpm/processquery/v2/todo',
    method: 'POST',
    data
  })
}

// 获取我得审批列表
export function getApproveCount() {
  return fetch({
    url: `/bpm/todo/count/${store.state.basuser.user.id}`,
    method: 'GET'
  })
}

// 获取草稿箱详情
export function getDraftDetail(id) {
  return fetch({
    url: `/bpm/draft-box/get/${id}`,
    method: 'GET'
  })
}

// 批量审批
export function approvedList(data) {
  return fetch({
    url: '/bpm/process/v2/approvedList',
    method: 'POST',
    data
  })
}

// 更新星标状态
export function updateStarMarkStatus(data) {
  return fetch({
    url: '/bpm/process/v2/updateTodoStarmark',
    method: 'POST',
    data
  })
}
