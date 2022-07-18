import { fetch } from '@/bpa/utils'
// 保存规章制度
export function saveTreeInfo (data) {
  return fetch({
    url: '/foldertree/saveCopy',
    method: 'post',
    data
  })
}
// 删除组织
export function delTreeInfo (data) {
  return fetch({
    url: '/foldertree/deleteCopy/' + data,
    method: 'delete'
  })
}

// 获取组织树的编码
export function getNodeCode (data) {
  return fetch({
    url: '/foldertree/getOrderCode/' + data,
    method: 'GET'
  })
}
// 获取组织树的编码
export function getCopy(data) {
  return fetch({
    url: '/foldertree/getCopy/' + data,
    method: 'GET'
  })
}
// 获取组织树的编码
export function getOrderCode(data) {
  return fetch({
    url: '/foldertree/getOrderCode/' + data,
    method: 'GET'
  })
}

// 统计所属分类数据量
export function getCountByfolderid(folderId) {
  return fetch({
    url: `/repositorySpec/getCountByfolderid/${folderId}`,
    method: 'GET'
  })
}

// 统计所属分类数据量
export function updateStateByFolder(folderId,state) {
  return fetch({
    url: `/repositorySpec/updateStateByFolder/${folderId}/${state}`,
    method: 'POST'
  })
}
