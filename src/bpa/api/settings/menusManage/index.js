import { fetch } from '@/bpa/utils'
// export function getMenuList (data) {
//   return fetch({
//     url: '/portalmenu/getAllMenuCopy',
//     method: 'post',
//     data
//   })
// }
export function getMenuList(data) {
  return fetch({
    url: '/portalmenu/getAllMenuCopy',
    method: 'post',
    data
  })
}
// 选中的权限
export function getMenuAndButton(data) {
  return fetch({
    url: '/portalmenu/getMenuAndButton',
    method: 'post',
    data
  })
}
// 获取单个菜单的信息
export function singleMenusInfo(id) {
  return fetch({
    url: `/portalmenu/getMenuInfoCopy/${id}`,
    method: 'get'
  })
}
// 保存修改后的信息
export function saveMenu(data) {
  return fetch({
    url: '/portalmenu/saveCopy',
    method: 'post',
    data
  })
}
// 删除菜单信息
export function deleteMenu(id, data) {
  return fetch({
    url: `/portalmenu/deleteCopy/${id}`,
    method: 'delete',
    data
  })
}
// 获取菜单组织信息
export function menuOrg(data) {
  return fetch({
    url: '/portalmenu/queryRelatedOrgTreeCopy',
    method: 'post',
    data
  })
}
// 获取菜单角色信息
export function menuRole(data) {
  return fetch({
    url: '/portalmenu/queryRelatedRoleCopy',
    method: 'post',
    data
  })
}

// 选中组织保存数据
export function saveOrgMenu(data) {
  return fetch({
    url: '/portalmenu/addAuthorityCopy',
    method: 'post',
    data
  })
}
// 删除菜单配置的权限
// export function deleteOrgMenu(data) {
//   return fetch({
//     url: '/portalmenu/deleteAuthorityCopy',
//     method: 'post',
//     data
//   })
// }
export function deleteOrgMenu(data) {
  return fetch({
    url: '/org/manager/removePermissions',
    method: 'delete',
    data
  })
}

// 删除角色组织保存的数据
export function deleteRoleMenu(data) {
  return fetch({
    url: '/portalmenu/queryRelatedRoleCopy',
    method: 'post',
    data
  })
}

// 组织 角色菜单获取按钮
export function getButtonOrgMenu(id) {
  return fetch({
    url: '/button/get/' + id,
    method: 'get'
  })
}

// 组织 菜单按钮保存
export function addAuthorityToOrg(data) {
  return fetch({
    url: '/portalorg/addAuthorityToOrg',
    method: 'post',
    data
  })
}

// 角色 菜单按钮保存
// export function addAuthorityToRole(data) {
//   return fetch({
//     url: '/roleportal/addAuthorityToRole',
//     method: 'post',
//     data
//   })
// }
export function addAuthorityToRole(data) {
  return fetch({
    url: '/authority/role/reAssignPermissions',
    method: 'post',
    data
  })
}

// 给组织添加按钮权限
export function addButtonAuthorityToOrg(data) {
  return fetch({
    url: '/portalorg/addButtonAuthorityToOrg',
    method: 'post',
    data
  })
}

// 删除给组织添加的按钮权限
export function deleteButtonAuthorityFromOrg(data) {
  return fetch({
    url: '/portalorg/deleteButtonAuthorityFromOrg',
    method: 'post',
    data
  })
}

// 给角色添加按钮权限
export function addButtonAuthorityToRole(data) {
  return fetch({
    url: '/roleportal/addButtonAuthorityToRole',
    method: 'post',
    data
  })
}

// 删除给角色添加的按钮权限
export function deleteButtonAuthorityFromRole(data) {
  return fetch({
    url: '/roleportal/deleteButtonAuthorityFromRole',
    method: 'post',
    data
  })
}
