import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getTrainList(data, type) {
  return fetch({
    url: `/listrelease/queryCopy/${type}?username=` + username,
    method: 'post',
    data
  })
}
// 保存培训记录
export function uploadRecords(data) {
  return fetch({
    url: '/modellistdoc/savepxjlCopy',
    method: 'post',
    data
  })
}
// 删除培训记录
export function delRecords(id) {
  return fetch({
    url: '/modellistdoc/deleteCopy/' + id + '?username=' + username,
    method: 'post'
  })
}

// 根据当前登录人获取对应的岗位
export function getstation(data) {
  return fetch({
    url: '/modelResponsibility/getPosts/' + data,
    method: 'GET'
  })
}
