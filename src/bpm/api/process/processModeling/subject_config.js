import { fetch } from '@/bpm/utils'

// 获取流程配置
export function getFieldList (id, params) {
  return fetch({
    url: `/oa/process/field-list/${id}`,
    method: 'GET',
    params
  })
}
export function getFieldLists (id, params) {
  return fetch({
    url: `/oa/process/field-list-not-include-apply-info/${id}`,
    method: 'GET',
    params
  })
}
// 保存
export function batchSave (data) {
  return fetch({
    url: `/subjectrule/batchsave`,
    method: 'POST',
    data
  })
}

// 获取
export function getSubjectrule (data) {
  return fetch({
    url: `/subjectrule/query`,
    method: 'POST',
    data
  })
}

// 删除并保存
export function deletesubjectrule (id) {
  return fetch({
    url: `/subjectrule/delete/${id}`,
    method: 'DELETE'
  })
}
