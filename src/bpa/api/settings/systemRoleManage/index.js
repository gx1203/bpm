import { fetch } from '@/bpa/utils'
// 系统角色管理
export function getRoleList(data) {
  return fetch({
    // url: '/roleportal/queryCopy',
    url: '/authority/role/query',
    method: 'post',
    data
  })
}
// 编辑角色
export function editRole(id) {
  return fetch({
    url: '/authority/role/get/' + id,
    method: 'get'
  })
}
// 删除角色
export function deleteRole(data) {
  return fetch({
    // url: '/roleportal/updateisdelete',
    // method: 'put',
    // data
    url: '/authority/role/delete/' + data.id,
    method: 'delete'
  })
}
// 添加保存角色
export function saveRole(data) {
  return fetch({
    // url: '/roleportal/saveCopy',
    url: '/authority/role/save',
    method: 'post',
    data
  })
}
// 员工信息查询
export function querytRoleUser(data) {
  return fetch({
    url: '/authority/user/findRoleUsers/' + data.attr.roleid,
    method: 'post',
    data
  })
}

// 获取角色成员信息
export function queryRoleInfo(data) {
  return fetch({
    url: '/authority/user/findRoleUsers/' + data.attr.roleid,
    method: 'post',
    data
  })
}

// 删除成员信息
export function delMemberInfo(data) {
  return fetch({
    url: '/roleportal/removeUsersFromRoleCopy',
    method: 'put',
    data
  })
}

// 添加成员信息
// export function addMemberInfo(data) {
//   return fetch({
//     url: '/roleportal/addUserToRoleCopy',
//     method: 'post',
//     data
//   })
// }
export function addMemberInfo(data) {
  return fetch({
    url: '/authority/user/assignUserToRole',
    method: 'post',
    data
  })
}

// 展示未添加成员信息
export function showMemberInfo(data) {
  return fetch({
    url: '/authority/user/findUnAssignedRoleUsers/' + data.attr.roleid,
    method: 'post',
    data
  })
}
