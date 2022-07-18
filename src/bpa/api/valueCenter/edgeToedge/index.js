import { fetch } from '@/bpa/utils'

// 查询一级价值链
export function getChainone (data) {
  return fetch({
    url: '/modellistjsonname/get/' + data,
    method: 'get',
    data
  })
}

// 查询一级价值链
export function getChainlist (data) {
  return fetch({
    url: '/modellistjsonname/query',
    method: 'post',
    data
  })
}

// 增加一级价值链
export function newChain (data) {
  return fetch({
    url: '/modellistjsonname/save',
    method: 'post',
    data
  })
}

// 删除一级价值链
export function deleteChain(data) {
  return fetch({
    url: '/modellistjsonname/delete/' + data,
    method: 'get'
  })
}
// 查询一级价值链下的画图数据
export function getProcessChart (data) {
  return fetch({
    url: '/modellistjson/ZCGetJson/' + data.id + '/' + data.state,
    method: 'get'
  })
}

// 保存一级价值链下的画图数据
export function saveStageProcess (data) {
  return fetch({
    url: '/modellistjson/ZCSave',
    method: 'post',
    data
  })
}

// 发布画图数据
export function publishChain (data) {
  return fetch({
    url: '/modellistjson/ZCRelease/' + data,
    method: 'get'
  })
}
// 获取模型管理组织树
export function getModelManagementTree (data) {
  return fetch({
    url: '/modellistjsonname/queryNameTrees/' + data,
    method: 'get'
  })
}
// 获取模型查看组织树
export function getModelModelViewTree (data) {
  return fetch({
    url: '/modellistjsonname/queryNameTrees/' + data + '/Y',
    method: 'get'
  })
}