import { fetch } from '@/bpa/utils'
export function getModellistjsonname (data) {
    return fetch({
      url: '/modellistjsonname/query',
      method: 'post',
      data
    })
  }
export function getZCGetJson (id) {
  return fetch({
    url: '/modellistjson/ZCGetJson/'+id+'/N',
    method: 'get',
  })
}
export function getZCGetJsonTwo () {
  return fetch({
    url: '/modellistjson/ZCGetJson/N',
    method: 'get',
  })
}
