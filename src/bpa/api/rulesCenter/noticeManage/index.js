import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid

//获取评估报告list
export function getReportList (data) {
  return fetch({
    url: '/assessmentNotice/page?username=' + username,
    method: 'post',
    data
  })
}

//获取保存评估报告
export function saveNotice (data) {
  return fetch({
    url: '/assessmentNotice/save',
    method: 'post',
    data
  })
}

export function deleteReport (id) {
  return fetch({
    url: `/assessmentNotice/delete/${id}`,
    method: 'delete',
  })
}
export function getDetails (id) {
  return fetch({
    url: '/assessmentNotice/get/'+ id,
    method: 'get'
  })
}
// 下发
export function updateStatus (id) {
  return fetch({
    url: `/assessmentNotice/updateStatus/${id}`,
    method: 'GET'
  })
}