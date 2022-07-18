import { fetch } from '@/bpm/utils'
// 授权规则列表
export function getMiddleList (data) {
  return fetch({
    url: '/workAuthorisationSet/queryList',
    method: 'POST',
    data
  })
}

// 保存与修改业务授权规则
export function saveOrUpdate (data) {
  return fetch({
    url: '/workAuthorisationSet/saveOrUpdate',
    method: 'POST',
    data
  })
}

// 根据ID获取授权规则
export function getRule (id) {
  return fetch({
    url: `/workAuthorisationSet/get/${id}`,
    method: 'GET'
  })
}

// 根据ID获取授权规则
export function deleteRule (id) {
  return fetch({
    url: `/workAuthorisationSet/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除授权规则
export function batchDelete (data) {
  return fetch({
    url: '/workAuthorisationSet/batchDelete',
    method: 'POST',
    data
  })
}
