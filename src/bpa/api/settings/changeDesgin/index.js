import { fetch } from '@/bpa/utils'

export function requireLegend (data) {
  return fetch({
    url: '/modelLegend/get/' + data,
    method: 'get'
  })
}
export function saveLegend (data) {
  return fetch({
    url: '/modelLegend/save',
    method: 'post',
    data
  })
}
