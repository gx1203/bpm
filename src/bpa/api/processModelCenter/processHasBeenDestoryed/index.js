import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getProcessList (data) {
  return fetch({
    url: '/listrelease/queryReleasedelCopy?username=' + username,
    method: 'post',
    data
  })
}
export function queryReleasedelRev (data) {
  return fetch({
    url: '/listrelease/queryReleasedelRevCopy',
    method: 'post',
    data
  })
}
export function queryReleasedel (data) {
  return fetch({
    url: '/listrelease/queryReleasedelCopy',
    method: 'post',
    data
  })
}
