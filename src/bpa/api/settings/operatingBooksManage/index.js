import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getBooksList (data) {
  return fetch({
    url: '/mangercenterdoc/queryoperateCopy',
    method: 'post',
    data
  })
}
export function fileUploadStep2 (data) {
  return fetch({
    url: '/mangercenterdoc/saveoperateCopy?username=' + username,
    method: 'post',
    data
  })
}

export function deleteOperating (data) {
  return fetch({
    url: '/mangercenterdoc/deleteoperateCopy/' + data,
    method: 'post'
  })
}
