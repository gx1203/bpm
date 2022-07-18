import { fetch } from '@/bpm/utils'
// 获取业务角色列表
export function getMiddleList (data) {
  return fetch({
    url: '/bpm/middledesc/query',
    method: 'POST',
    data
  })
}

export function getMiddleById (id) {
  return fetch({
    url: `/bpm/middledesc/get/${id}`,
    method: 'GET'
  })
}

// 添加编辑业务角色
export function saveMiddle (data) {
  return fetch({
    url: '/bpm/middledesc/save',
    method: 'POST',
    data
  })
}

// 删除业务角色
export function deleteMiddle (id) {
  return fetch({
    url: `/bpm/middledesc/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除业务角色
export function batchDeleteMiddle (ids) {
  return fetch({
    url: `/bpm/middledesc/batch-delete/${ids}`,
    method: 'DELETE'
  })
}
