import { fetch } from '@/bpm/utils'
// 获取组织属性列表
export function getOrgattributeList(data) {
  return fetch({
    url: '/oa/orgattribute/query',
    method: 'POST',
    data
  })
}

// 获取组织属性快速列表
export function getOrgattributeQuickQuery(data) {
  return fetch({
    url: '/oa/orgattribute/quickQuery',
    method: 'POST',
    data
  })
}

// 添加编辑组织属性
export function saveOrgattribute(data) {
  return fetch({
    url: '/oa/orgattribute/save',
    method: 'POST',
    data
  })
}

// 删除组织属性
export function deleteOrgattribute(id) {
  return fetch({
    url: `/oa/orgattribute/delete/${id}`,
    method: 'GET'
  })
}

// 批量删除组织属性
export function batchDeleteOrgattribute(ids) {
  return fetch({
    url: `/oa/orgattribute/batch-delete/${ids}`,
    method: 'DELETE'
  })
}