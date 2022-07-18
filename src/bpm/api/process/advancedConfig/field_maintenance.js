import {
  fetch
} from '@/bpm/utils'

// 产品发布流程列表
export function getProcessVersionList (data) {
  return fetch({
    url: '/bpm/productRelease/manage/getProductReleaseList',
    method: 'POST',
    data
  })
}
// 产品发布删除接口
export function deleteProductReleaseInfo (id) {
  return fetch({
    url: `/bpm/productRelease/manage/deleteProductReleaseInfo/${id}`,
    method: 'DELETE',
  })
}

// 获取字段库列表
export function getFieldLibraryList(data) {
  return fetch({
    url: '/fieldLibrary/query',
    method: 'POST',
    data
  })
}
// 删除字段库列表
export function deleteFieldLibraryList(id) {
  return fetch({
    url: `/fieldLibrary/delete/${id}`,
    method: 'DELETE'
  })
}
// 批量删除字段库列表
export function deleteAllFieldLibraryList(id) {
  return fetch({
    url: `/fieldLibrary/batch-delete/${id}`,
    method: 'DELETE'
  })
}

// 保存字段库列表
export function saveFieldLibraryList(data) {
  return fetch({
    url: '/fieldLibrary/save',
    method: 'POST',
    data
  })
}
