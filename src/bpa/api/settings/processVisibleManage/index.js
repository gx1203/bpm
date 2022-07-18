import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getTableList (data) {
  return fetch({
    url: '/modellistauthdetail/queryCopy?username=' + username,
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
export function getViewableSelectList (data) {
  return fetch({
    url: '/modellistauthority/queryAuthorityCopy',
    method: 'post',
    data
  })
}
export function getOrgidAndName (param) {
  return fetch({
    url: `/modellistauthority/getOrgidAndNameCopy/${param.listId}/${param.typeId}`,
    method: 'post'
  })

}
export function saveAuthority (data) {
  return fetch({
    url: '/modellistauthdetail/saveAuthorityCopy',
    method: 'post',
    data
  })
}
export function getTotalOrg (data) {
  return fetch({
    url: '/select/user/cqp/getTotalOrg1Copy',
    method: 'POST',
    data
  })
}