import { fetch } from '@/bpm/utils'
// 获取移动设备组列表
export function getMobileList(data) {
  return fetch({
    url: '/mobile/devices/query',
    method: 'POST',
    data
  })
}
// 添加编辑移动设备组
export function saveMobile(data) {
  return fetch({
    url: '/mobile/devices/save',
    method: 'POST',
    data
  })
}

// 删除移动设备组
export function deleteMobile(id) {
  return fetch({
    url: `/mobile/devices/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除移动设备组
export function batchDeleteMobile(ids) {
  return fetch({
    url: `/mobile/devices/batch-delete/${ids}`,
    method: 'DELETE'
  })
}