import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid

// 获取评估报告list
export function getDeptJuridictionList (data) {
  return fetch({
    url: '/deptJuridictionManger/page?username=' + username,
    method: 'post',
    data
  })
}

export function getFolderAll () {
  return fetch({
    url: '/regulation/getFolderAll?username=' + username,
    method: 'get'
  })
}
export function updateStatusById (id) {
  return fetch({
    url: '/deptJuridictionManger/updateStatusById/' + id,
    method: 'get'
  })
}

// 获取保存评估报告
export function saveDeptJuridiction (data) {
  return fetch({
    url: '/deptJuridictionManger/save',
    method: 'post',
    data
  })
}

export function deleteDeptJuridiction (id) {
  return fetch({
    url: `/deptJuridictionManger/delete/${id}`,
    method: 'delete'
  })
}
export function getDetails (id) {
  return fetch({
    url: '/deptJuridictionManger/get/' + id,
    method: 'get'
  })
}
// 下发
export function updateStatus (id, userid) {
  return fetch({
    url: `/deptJuridictionManger/updateStatusByIdAndUserId/${id}/${userid || ''}`,
    method: 'GET'
  })
}
