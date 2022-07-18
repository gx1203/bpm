import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getTerminologyList (data) {
  return fetch({
    url: '/modelterm/queryCopy?username=' + username,
    method: 'post',
    data
  })
}

export function getSystemList (data) {
  return fetch({
    url: '/systemnode/getSystemList?username=' + username,
    method: 'post',
    data
  })
}
export function querySystemnodeList (data) {
  return fetch({
    url: '/systemnode/queryList?username=' + username,
    method: 'post',
    data
  })
}
