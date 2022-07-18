import {
  fetch
} from '@/bpm/utils'

// 获取链接类型配置列表
export function getlinkTypeList(data) {
  return fetch({
    url: '/bpm/linktype/query',
    method: 'POST',
    data
  })
}
// 修改保存链接类型配置链接
export function saveLinkType(data) {
  return fetch({
    url: '/bpm/linktype/save',
    method: 'POST',
    data
  })
}
// 删除链接类型配置链接
export function deleteLinkType(id) {
  return fetch({
    url: `/bpm/linktype/delete/${id}`,
    method: 'DELETE'
  })
}
// 批量删除链接类型配置链接
export function deleteAllLinkType(id) {
  return fetch({
    url: `/bpm/linktype/batch-delete/${id}`,
    method: 'DELETE'
  })
}
