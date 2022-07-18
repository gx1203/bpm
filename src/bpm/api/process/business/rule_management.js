import { fetch } from '@/bpm/utils'
// 获取数列表
export function queryList (data) {
  return fetch({
    url: '/businessRuleControl/queryList',
    method: 'POST',
    data
  })
}
// 保存与修改控制类型
export function saveOrUpdate (data) {
  return fetch({
    url: '/businessRuleControl/saveOrUpdate',
    method: 'POST',
    data
  })
}
// 根据ID删除控制类型
export function deleteControl (id) {
  return fetch({
    url: `/businessRuleControl/delete/${id}`,
    method: 'DELETE'
  })
}
// 批量删除控制类型
export function batchDelete (data) {
  return fetch({
    url: '/businessRuleControl/batchDelete',
    method: 'POST',
    data
  })
}
