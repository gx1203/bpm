import {
  fetch
} from '@/bpm/utils'

  // 获取角色列表
export function getAuthroleList (data) {
  return fetch({
    url: '/authority/role/query',
    method: 'POST',
    data
  })
}
// 保存角色信息
export function saveRole (data) {
  return fetch({
    url: '/authority/role/save',
    method: 'POST',
    data
  })
}
// 删除角色
export function deleteRole (id) {
  return fetch({
    url: `/authority/role/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除角色
export function batchDeleteRole (data) {
  return fetch({
    url: `/authority/role/batchDelete`,
    method: 'DELETE',
    data
  })
}
// 移除角色的权限
export function removePermissions (data) {
  return fetch({
    url: `/authority/role/removePermissions`,
    method: 'DELETE',
    data
  })
}
// 根据ID查询角色信息
export function getRoleMsg (id) {
  return fetch({
    url: `/authority/role/get/${id}/`,
    method: 'GET'
  })
}
// 根据ID查询角色信息
export function assignPermissions (data) {
  return fetch({
    url: `/authority/role/assignPermissions`,
    method: 'POST',
    data
  })
}

// 根据
export function reAssignPermissions (data) {
  return fetch({
    url: `/authority/role/reAssignPermissions`,
    method: 'POST',
    data
  })
}

// 根据角色ID以及指定类型，获取角色所拥有的该组件的相关权限
export function findPermissions (id) {
  return fetch({
    url: `/authority/role/findPermissions/${id}/nav`,
    method: 'GET'
  })
}
// 返回被授予指定角色的用户
export function findRoleUsers (id, data) {
  return fetch({
    url: `/authority/user/findRoleUsers/${id}`,
    method: 'POST',
    data
  })
}
// 移除用户已授予的角色
export function removeUserFromRole (data) {
  return fetch({
    url: `/authority/user/removeUserFromRole`,
    method: 'DELETE',
    data
  })
}

// 授予用户角色
export function userAutoToRole (data) {
  return fetch({
    url: `/userModel/userAutoToRole`,
    method: 'POST',
    data
  })
}
// 批量移除角色中的用户
export function removeRoleUser (data) {
  return fetch({
    url: `/userModel/removeRoleUser`,
    method: 'POST',
    data
  })
}
