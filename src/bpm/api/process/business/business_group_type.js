import { fetch } from '@/bpm/utils'
// 获取业务组类型列表
export function getBusinessGroupTypeList(data) {
  return fetch({
    url: '/businessrule/businessgrouptype/query',
    method: 'POST',
    data
  })
}

export function getBusinessGroupTypeById(id) {
    return fetch({
      url: `/businessrule/businessgrouptype/get/${id}`,
      method: 'GET'
    })
}


// 添加编辑业务组类型
export function saveBusinessGroupType(data) {
  return fetch({
    url: '/businessrule/businessgrouptype/save',
    method: 'POST',
    data
  })
}

// 删除业务组类型
export function deleteBusinessGroupType(id) {
  return fetch({
    url: `/businessrule/businessgrouptype/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除业务组类型
export function batchDeleteBusinessGroupType(ids) {
  return fetch({
    url: `/businessrule/businessgrouptype/batch-delete/${ids}`,
    method: 'DELETE'
  })
}