import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getDocumentList (data) {
  return fetch({
    url: '/modellistdoc/querydocCopy?username=' + username,
    method: 'post',
    data
  })
}
