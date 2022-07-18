import { fetch } from '@/bpm/utils'
// 获取业务组列表
export function getBusinessGroupList(data) {
  return fetch({
    url: '/businessrule/businessgroup/query',
    method: 'POST',
    data
  })
}

export function getBusinessGroupById(id) {
    return fetch({
      url: `/businessrule/businessgroup/get/${id}`,
      method: 'GET'
    })
}


// 添加编辑业务组
export function saveBusinessGroup(data) {
  return fetch({
    url: '/businessrule/businessgroup/save',
    method: 'POST',
    data
  })
}

// 删除业务组
export function deleteBusinessGroup(id) {
  return fetch({
    url: `/businessrule/businessgroup/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除业务组
export function batchDeleteBusinessGroup(ids) {
  return fetch({
    url: `/businessrule/businessgroup/batch-delete/${ids}`,
    method: 'DELETE'
  })
}