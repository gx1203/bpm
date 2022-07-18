import { fetch } from '@/bpm/utils'

// 保存流程角色权限
export function saveProcessToRole (data) {
  return fetch({
    url: '/processrolepermissions/saveProcessToRole',
    method: 'POST',
    data
  })
}
// 获取所有的角色
export function getAllRole (params) {
  return fetch({
    url: '/bpm/authrole/getAllRole',
    method: 'GET',
    params
  })
}
// 获取角色权限
export function getProcessConfigNode (id) {
  return fetch({
    url: `/processrolepermissions/getProcessConfigNode/${id}`,
    method: 'GET'
  })
}
// 根据流程获取角色
export function getProcessRole (data) {
  return fetch({
    url: '/processrolepermissions/getProcessRole',
    method: 'POST',
    data
  })
}
// 获取角色权限
export function delProcessRole (roleId, processId) {
  return fetch({
    url: `/processrolepermissions/delProcessRole/${roleId}/${processId}`,
    method: 'DELETE'
  })
}
// 保存角色流程权限
export function saveRoleToProcess (data) {
  return fetch({
    url: '/processrolepermissions/saveRoleToProcess',
    method: 'POST',
    data
  })
}
// 删除单个流程岗位发起权限
export function deletePost (id) {
  return fetch({
    url: `/processPermissions/delete/${id}`,
    method: 'DELETE'
  })
}
// 保存流程岗位发起权限
export function savePost (data) {
  return fetch({
    url: `/processPermissions/save`,
    method: 'POST',
    data
  })
}
// 批量删除流程岗位发起权限
export function deleteList (data) {
  return fetch({
    url: '/processPermissions/deleteList',
    method: 'POST',
    data
  })
}
// 获取流程岗位权限列表
export function getPostRole (data) {
  return fetch({
    url: '/processPermissions/query',
    method: 'POST',
    data
  })
}


// 获取发起权限
export function getPermissionByProcessid (processId) {
  return fetch({
    url: `/processPermissions/get-permission-by-processid/${processId}`,
    method: 'GET'
  })
}




