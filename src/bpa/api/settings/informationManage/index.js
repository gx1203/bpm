import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid

// 获取制度信息库list
export function getInformationManageList (data) {
  return fetch({
    url: '/informationManagement/page?username=' + username,
    method: 'post',
    data
  })
}

// 获取保存制度信息库
export function saveInformationManage (data) {
  return fetch({
    url: '/informationManagement/save',
    method: 'post',
    data
  })
}

export function deleteInformationManage (id) {
  return fetch({
    url: `/informationManagement/delete/${id}`,
    method: 'delete'
  })
}
export function getDetails (id) {
  return fetch({
    url: '/informationManagement/get/' + id,
    method: 'get'
  })
}

export function voidById (id) {
  return fetch({
    url: '/informationManagement/voidById/' + id,
    method: 'get'
  })
}

// 下发
export function updateStatus (id, userid) {
  return fetch({
    url: `/informationManagement/updateStatus/${id}/${userid}`,
    method: 'GET'
  })
}
