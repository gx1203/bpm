import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getNoticeList (data) {
  return fetch({
    url: '/mangercenterdoc/querynotifyCopy',
    method: 'post',
    data
  })
}
export function deleteNoticeItem (id) {
  return fetch({
    url: '/mangercenterdoc/deletenotifyCopy/' + id,
    method: 'post'
  })
}
export function fileUploadStep2 (data) {
  return fetch({
    url: '/mangercenterdoc/savenotifyCopy?username=' + username,
    method: 'post',
    data
  })
}
