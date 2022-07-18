import { fetch } from '@/bpa/utils'

export function getProcessTree (data) {
  return fetch({
    url: '/listhistory/getAllTreeCopy',
    method: 'post',
    data
  })
}

export function getProcessCount (data) {
  return fetch({
    url: '/listhistory/getNumCopy',
    method: 'post',
    data
  })
}
// 新展示的流程框架树
export function newProcessFrmwrk (data) {
  return fetch({
    url: '/modeltree/getModelListTree/' + data,
    method: 'get'
  })
}
