import { fetch } from '@/bpa/utils'

export function resetInterface(data) {
  return fetch({
    url: '/portal/security/pwd/reset/admin',
    method: 'PUT',
    data
  })
}

// 获取url列表
export function querylink(data) {
  return fetch({
    url: '/modelLegend/query',
    method: 'post',
    data
  })
}

export function deleteLengend(data) {
  return fetch({
    url: '/modelLegend/delete/' + data,
    method: 'get'
  })
}
