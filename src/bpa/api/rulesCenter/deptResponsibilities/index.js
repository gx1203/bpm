import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getDeptRegularList (data) {
  return fetch({
    url: '/regulation/queryCopy?username=' + username,
    method: 'post',
    data
  })
}
