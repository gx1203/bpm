import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取收藏列表
export function getCollectionList(data) {
  return fetch({
    url: '/bpm/collection/query',
    method: 'POST',
    data
  })
}

// 获取收藏列表  快速查询
export function quickQueryCollectionList(data) {
  return fetch({
    url: '/bpm/collection/quick-query',
    method: 'POST',
    data
  })
}

// 删除我得收藏
export function deleteCollection(id) {
  return fetch({
    url: `/bpm/collection/delete/${id}`,
    method: 'DELETE'
  })
}
// 获取收藏一级分类
export function getCollectionTree() {
  return fetch({
    url: `/bpm/collection/getPCollectionInfo`,
    method: 'GET'
  })
}
// 获取收藏子分类
export function getSubTree(id) {
  return fetch({
    url: `/bpm/collection/getSubTree/${id}`,
    method: 'GET'
  })
}


// 获取收藏子分类
export function saveTree(data) {
  return fetch({
    url: `/bpm/collection/save`,
    method: 'POST',
    data
  })
}


