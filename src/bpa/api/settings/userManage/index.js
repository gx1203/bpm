import { fetch } from '@/bpa/utils'
// 用户管理
export function getUserList (data) {
  return fetch({
    url: '/user/info/queryCopy',
    method: 'post',
    data
  })
}
// 保存接口
export function saveUserInfo (data) {
  return fetch({
    url: '/user/info/saveCopy',
    method: 'post',
    data
  })
}
// 删除接口
export function delUserInfo (data) {
  return fetch({
    url: '/user/info/delete/' + data,
    method: 'get'
  })
}

// 工作职责
export function queryduty (data) {
  return fetch({
    url: '/authority/duty/query/',
    method: 'post',
    data
  })
}