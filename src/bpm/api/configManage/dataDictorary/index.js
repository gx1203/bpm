import {
  fetch
} from '@/bpm/utils'

// 获取数据字典列表
export function getDictoraryList (data) {
  return fetch({
    url: '/datadictionary/query',
    method: 'POST',
    data
  })
}
// 保存数据字典列表
export function saveDictorary (data) {
  return fetch({
    url: '/datadictionary/save',
    method: 'POST',
    data
  })
}
// 删除数据字典列表
export function deleteDictorary (id) {
  return fetch({
    url: `/datadictionary/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除数据字典
export function deleteAllDictorary (id) {
  return fetch({
    url: `/datadictionary/batch-delete/${id}`,
    method: 'DELETE'
  })
}
// 获取配置信息
export function getOptionListById (id) {
  return fetch({
    url: `/datadictionary/getOptionListById/${id}`,
    method: 'GET'
  })
}
// 保存配置信息
export function saveOptionList (data) {
  return fetch({
    url: `/datadictionary/saveoption`,
    method: 'POST',
    data
  })
}
// 删除配置信息
export function deleteOptionList (id) {
  return fetch({
    url: `/datadictionary/deleteoption/${id}`,
    method: 'DELETE'
  })
}
// 验证sql是否合理
export function validateSearchModelSQL (data) {
  return fetch({
    url: `/datadictionary/validateSearchModelSQL`,
    method: 'POST',
    data
  })
}
