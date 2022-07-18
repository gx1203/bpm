import { fetch } from '@/bpm/utils'
// 获取固定审批列表
export function getApproveFixedList(data) {
  return fetch({
    url: '/oa/approvefixed/query',
    method: 'POST',
    data
  })
}

// 获取固定审批快速列表
export function getApproveFixedQuickQuery(data) {
  return fetch({
    url: '/oa/approvefixed/quickQuery',
    method: 'POST',
    data
  })
}

// 添加编辑固定审批
export function saveApproveFixed(data) {
  return fetch({
    url: '/oa/approvefixed/save',
    method: 'POST',
    data
  })
}

// 删除固定审批
export function deleteApproveFixed(id) {
  return fetch({
    url: `/oa/approvefixed/delete/${id}`,
    method: 'GET'
  })
}

// 批量删除固定审批
export function batchDeleteApproveFixed(ids) {
  return fetch({
    url: `/oa/approvefixed/batch-delete/${ids}`,
    method: 'DELETE'
  })
}