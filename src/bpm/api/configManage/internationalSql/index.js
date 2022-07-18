import {
  fetch
} from '@/bpm/utils'

// 获取国际化sql配置列表
export function getManagmentList(data) {
  return fetch({
    url: '/i18n/sql/queryList',
    method: 'POST',
    data
  })
}
// 保存国际化sql配置列表
export function saveManagment(data) {
  return fetch({
    url: '/i18n/sql/save',
    method: 'POST',
    data
  })
}
// 删除国际化sql配置列表
export function deleteManagment(id) {
  return fetch({
    url: `/i18n/sql/delete/${id}`,
    method: 'DELETE'
  })
}
// 批量删除国际化sql配置
export function deleteAllManagment(data) {
  return fetch({
    url: `/i18n/sql/batchDelete`,
    method: 'DELETE',
    data
  })
}
// 测试sql语句
export function validateSearchModelSQL(data) {
  return fetch({
    url: '/i18n/sql/validateSearchModelSQL',
    method: 'POST',
    data
  })
}
