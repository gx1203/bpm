import { fetch } from '@/bpa/utils'
export function requireProcess (data) {
  return fetch({
    url: '/modelapprove/query',
    method: 'post',
    data
  })
}

export function saveProcess (data) {
  return fetch({
    url: '/modelapprove/save',
    method: 'post',
    data
  })
}
