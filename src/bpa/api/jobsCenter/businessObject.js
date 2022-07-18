import { fetch } from '@/bpa/utils'

// 获取业务对象顶级id
export function queryRepositoryBoFolderTreeId(data) {
  return fetch({
    url: '/service/queryRepositoryBoFolderTreeId',
    method: 'get'
  })
}

// 业务对象-树
export function getRepositoryboFolder(id) {
  return fetch({
    url: `/repositorybo/getRepositoryboFolder/${id}`,
    method: 'get'
  })
}

// 业务对象-流程list
export function getRepositoryboProcess(data) {
  return fetch({
    url: `/repositorybo/getRepositoryboProcess`,
    method: 'post',
    data
  })
}

// 文档-业务对象-点击关联数据
export function getDocBoRelation(boid, docid) {
  return fetch({
    url: `/repositorybo/getDocBoRelation/${boid}/${docid}`,
    method: 'get'
  })
}

// 业务对象-工具点击关联节点数据
export function getToolNodeRelation(toolid) {
  return fetch({
    url: `/repositorybo/getToolNodeRelation/${toolid}`,
    method: 'get'
  })
}

// 业务对象-工具点击关联节点数据
export function getNodeRelation(listid, keyid) {
  return fetch({
    url: `/repositorybo/getNodeRelation/${listid}/${keyid}`,
    method: 'get'
  })
}
