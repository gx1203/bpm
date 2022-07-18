import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getGroupList (data) {
  return fetch({
    url: '/approverole/getApproveByEnnameCopy/oragizer',
    method: 'post',
    data
  })
}
export function deleteGroup (id) {
  return fetch({
    url: '/approverole/batchDeleteApproveCopy/' + id,
    method: 'post'
  })
}
export function addGroup (data) {
  return fetch({
    url: '/approverole/addApproveCopy',
    method: 'post',
    data
  })
}
