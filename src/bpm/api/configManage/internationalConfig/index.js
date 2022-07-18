import {
  fetch
} from '@/bpm/utils'

// 获取国际化配置列表
export function getZationList(data) {
  return fetch({
    url: '/i18n/config/queryList',
    method: 'POST',
    data
  })
}
// 保存国际化配置列表
export function saveZation(data) {
  return fetch({
    url: '/i18n/config/save',
    method: 'POST',
    data
  })
}
// 删除国际化配置列表
export function deleteZation(id) {
  return fetch({
    url: `/i18n/config/delete/${id}`,
    method: 'DELETE'
  })
}
// 批量删除国际化配置
export function deleteAllZation(data) {
  return fetch({
    url: `/i18n/config/batchDelete`,
    method: 'DELETE',
    data
  })
}
// 导出Excel
export function exportExcel(data) {
  return fetch({
    url: `/i18n/config/exportExcel`,
    method: 'POST',
    data
  })
}
// 国际化初始化
export function initSpBasSync(data) {
  return fetch({
    url: `/i18n/config/initSpBasSync`,
    method: 'POST',
    data
  })
}
