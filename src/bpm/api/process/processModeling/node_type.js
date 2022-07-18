import { fetch } from '@/bpm/utils'
// 获取审批类型列表
export function getNodeTypeList(data) {
  return fetch({
    url: '/bpm/processnodetype/query',
    method: 'POST',
    data
  })
}


// // 获取审批类型快速列表
// export function getApproveQuickQuery(data) {
//   return fetch({
//     url: '/oa/approvetype/quickQuery',
//     method: 'POST',
//     data
//   })
// }

// 添加编辑审批类型
export function saveNodeType(data) {
  return fetch({
    url: '/bpm/processnodetype/save',
    method: 'POST',
    data
  })
}

// 删除审批类型
export function deleteNodeType(id) {
  return fetch({
    url: `/bpm/processnodetype/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除审批类型
export function batchDeleteNodeType(ids) {
  return fetch({
    url: `/bpm/processnodetype/batch-delete/${ids}`,
    method: 'DELETE'
  })
}