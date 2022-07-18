import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getResponsibilitiesList (data) {
  return fetch({
    // url: '/regulation/queryCopy?username=' + username,
    url: '/regulation/queryReleasedCopy?username=' + username,
    method: 'post',
    data
  })
}
