import { fetch } from '@/bpm/utils'
// 获取业务组属性列表
export function getBusinessAttributeList(data) {
  return fetch({
    url: '/businessrule/attribute/quickquery',
    method: 'POST',
    data
  })
}

// 添加编辑业务组属性
export function saveBusinessAttribute(data) {
  return fetch({
    url: '/businessrule/attribute/save',
    method: 'POST',
    data
  })
}

// 删除业务组属性
export function deleteBusinessAttribute(id) {
  return fetch({
    url: `/businessrule/attribute/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除业务组属性
export function batchDeleteBusinessAttribute(ids) {
  return fetch({
    url: `/businessrule/attribute/batch-delete/${ids}`,
    method: 'DELETE'
  })
}