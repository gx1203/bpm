import { fetch } from '@/bpm/utils'
// 获取帮助文档列表
export function gethelpList (data) {
  return fetch({
    url: '/help/query',
    method: 'POST',
    data
  })
}

// 获取单个帮助文档
export function getHelpDetail (id) {
  return fetch({
    url: `/help/get/${id}`,
    method: 'GET'
  })
}

// 获取帮助文档权限
export function hasEditHelpPerm () {
  return fetch({
    url: `/help/hasEditHelpPerm`,
    method: 'GET'
  })
}

// 添加编辑帮助文档
export function saveHelp (data) {
  return fetch({
    url: '/help/save',
    method: 'POST',
    data
  })
}

// 删除帮助文档
export function deleteHelp (id) {
  return fetch({
    url: `/help/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除帮助文档
export function batchDeleteHelp (ids) {
  return fetch({
    url: `/help/batch-delete/${ids}`,
    method: 'DELETE'
  })
}

// 获取查找中心列表  快速查询
export function quickQueryHelpList (data) {
  return fetch({
    url: `/help/queryList`,
    method: 'POST',
    data
  })
}

// 产品更新
export function getProductUpdateList (data) {
  return fetch({
    url: `/bpm/productRelease/manage/getProductUpdateList`,
    method: 'POST',
    data
  })
}

// 产品更新下载
// export function ProductUpdateDownload (biz,key) {
//   return fetch({
//     url: `/bpm/productRelease/manage/batchDownloadFile?newVnumber=${biz}$curVnumber=${key}`,
//     method: 'GET',
//   })
// }

// 产品更新下载版本
export function getProductVersion () {
  return fetch({
    url: `/bpm/productRelease/manage/getProductVersion`,
    method: 'GET',
  })
}