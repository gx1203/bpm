import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getRegulationList (data) {
  return fetch({
    url: '/regulation/queryReleasedel?username=' + username,
    method: 'post',
    data
  })
}
