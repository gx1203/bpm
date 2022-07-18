import { fetch } from '@/bpm/utils'

// 保存及修改关系信息
export function saveProcessToRole (data) {
  return fetch({
    url: '/bpm/empaccount/save',
    method: 'POST',
    data
  })
}
// 根据ID获取关系信息
export function empaccountGet (id) {
  return fetch({
    url: `/bpm/empaccount/get/${id}`,
    method: 'GET'
  })
}
// 根据id刪除关系
export function empaccountDelete (id) {
  return fetch({
    url: `/bpm/empaccount/delete/${id}`,
    method: 'DELETE'
  })
}
// 获取关系列表
export function empaccountQuery (data) {
  return fetch({
    url: '/bpm/empaccount/query',
    method: 'POST',
    data
  })
}
// ------------------owneraccount----------------
// 获取关系列表
export function owneraccountQuery (data) {
  return fetch({
    url: '/bpm/owneraccount/query',
    method: 'POST',
    data
  })
}
// ------------------ownersystem------------------------
// 获取owner system列表
export function ownersystemQuery (data) {
  return fetch({
    url: '/bpm/ownersystem/query',
    method: 'POST',
    data
  })
}
