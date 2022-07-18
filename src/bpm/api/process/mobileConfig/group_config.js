import { fetch } from '@/bpm/utils'
// 获取移动模块组列表
export function getMobileGroupList(data) {
  return fetch({
    url: '/bpm/group/query',
    method: 'POST',
    data
  })
}
// 添加编辑移动模块组
export function saveMobileGroup(data) {
  return fetch({
    url: '/bpm/group/save',
    method: 'POST',
    data
  })
}

// 删除移动模块组
export function deleteMobileGroup(id) {
  return fetch({
    url: `/bpm/group/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除移动模块组
export function batchDeleteMobileGroup(ids) {
  return fetch({
    url: `/bpm/group/batch-delete/${ids}`,
    method: 'DELETE'
  })
}