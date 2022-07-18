import { fetch } from '@/bpa/utils'

// 查询一级价值链
export function getChainlist(data) {
  return fetch({
    url: '/modellistzcvaluechain/query',
    method: 'post',
    data
  })
}

// 增加一级价值链
export function newChain(data) {
  return fetch({
    url: '/modellistzcvaluechain/save',
    method: 'post',
    data
  })
}

// 发布流程图
export function publishProcess(data) {
  return fetch({
    url: '/modellistzcvaluechain/release/' + data,
    method: 'get'
  })
}

// 删除一级价值链
export function deleteChain(data) {
  return fetch({
    url: '/modellistzcvaluechain/delete/' + data,
    method: 'get'
  })
}
