import { fetch } from '@/bpa/utils'
export function getCardlist (data) {
  return fetch({
    url: '/dictionary/query',
    method: 'post',
    data
  })
}
export function saveField (data) {
  return fetch({
    url: '/dictionary/save',
    method: 'post',
    data
  })
}
export function deleteField (id) {
  return fetch({
    url: '/dictionary/delete/' + id,
    method: 'get'
  })
}
// 流程清单台账管理
export function getAllListMessage (data) {
  return fetch({
    url: '/modeltree/getAllListMessage',
    method: 'post',
    data
  })
}
// 批量修改sheet页自定报表导出字段接口
export function dictionarySaveList (data) {
  return fetch({
    url: '/dictionary/saveList',
    method: 'post',
    data
  })
}
