import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
// 获取主页列表数据
export function getSystemList(data) {
  return fetch({
    url: '/systemClassify/query',
    method: 'post',
    data
  })
}
// 点击修改（获取弹框表格数据）
export function getSystem(id) {
  return fetch({
    url: '/systemClassify/get?id=' + id,
    method: 'get'
  })
}
// 确认修改编辑
export function editSystem(data) {
  return fetch({
    url: '/systemClassify/update',
    method: 'post',
    data
  })
}
// 删除接口
export function deleteSystem(params) {
  return fetch({
    url: '/systemClassify/delete',
    method: 'get',
    params
  })
}
// 添加接口
export function addSystem(data) {
  return fetch({
    url: '/systemClassify/save',
    method: 'post',
    data
  })
}
// 附件上传
export function fileUploadStep2 (data) {
  return fetch({
    url: '/mangercenterdoc/savelearnCopy?username=' + username,
    method: 'post',
    data
  })
}
// 搜索
export function searchSystem (data) {
  return fetch({
    url: '/systemClassify/query',
    method: 'post',
    data
  })
}
