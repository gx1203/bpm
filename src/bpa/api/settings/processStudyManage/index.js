import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getStudyList (data) {
  return fetch({
    url: '/mangercenterdoc/querylearnCopy',
    method: 'post',
    data
  })
}
export function fileUploadStep2 (data) {
  return fetch({
    url: '/mangercenterdoc/savelearnCopy?username=' + username,
    method: 'post',
    data
  })
}

export function deleteStudyItem (data) {
  return fetch({
    url: '/mangercenterdoc/deletelearnCopy/' + data,
    method: 'post'
  })
}
