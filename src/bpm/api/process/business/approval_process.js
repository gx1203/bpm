import { fetch } from '@/bpm/utils'
// 获取审批顺序列表
export function getOrderApprovalList(data) {
  return fetch({
    url: '/businessrule/orderApproval/query',
    method: 'POST',
    data
  })
}
// 添加编辑审批顺序
export function saveOrderApproval(data) {
  return fetch({
    url: '/businessrule/orderApproval/save',
    method: 'POST',
    data
  })
}
// 删除审批顺序
export function getOrderApproval(id) {
  return fetch({
    url: `/businessrule/orderApproval/get/${id}`,
    method: 'GET'
  })
}

// 删除审批顺序
export function deleteOrderApproval(id) {
  return fetch({
    url: `/businessrule/orderApproval/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除审批顺序
export function batchDeleteOrderApproval(ids) {
  return fetch({
    url: `/businessrule/orderApproval/batch-delete/${ids}`,
    method: 'DELETE'
  })
}