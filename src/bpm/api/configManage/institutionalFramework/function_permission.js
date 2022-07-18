import {
  fetch
} from '@/bpm/utils'

//职务树
export function getAllRootTreeJob () {
  return fetch({
    url: '/org/job/getAllRootTree',
    method: 'GET'
  })
}
export function getChildrenJob (id) {
  return fetch({
    url: `/org/job/getChildren/${id}`,
    method: 'GET'
  })
}

//组织机构

// 获取所有的根树
export function getAllRootTreeOr () {
  return fetch({
    url: `/org/tree/getAllRootTree`,
    method: 'GET'
  })
}

//系统组
export function authorityGroup (data) {
  return fetch({
    url: `/authority/group/query`,
    method: 'POST',
    data
  })
}

// 获取角色列表
export function getAuthroleList (data) {
  return fetch({
    url: '/authority/role/query',
    method: 'POST',
    data
  })
}

// 根据组织ID，获取组织的直属权限
export function queryNavigationPermission (type, groupId, data) {
  return fetch({
    url: `/authority/permission/queryDirectPermission/${type}/${groupId}`,
    method: 'POST',
    data
  })
}

// 移除组织的权限
export function deleteNavigationPermission (data) {
  return fetch({
    url: '/authority/permission/removePermissions',
    method: 'POST',
    data
  })
}

// 保存对象导航权限-导航-增量
export function saveNavigationPermissionByNavigation (data) {
  return fetch({
    url: '/fbc/navigation/saveNavigationPermissionByNavigation',
    method: 'POST',
    data
  })
}

// 保存对象导航权限-导航-全量
export function saveNavigationPermissionByNavigationFull (data) {
  return fetch({
    url: '/fbc/navigation/saveNavigationPermissionByNavigationFull',
    method: 'POST',
    data
  })
}

// 保存对象导航权限-对象-增量
export function saveNavigationPermissionByRelated (data) {
  return fetch({
    url: '/fbc/navigation/saveNavigationPermissionByRelated',
    method: 'POST',
    data
  })
}

// 保存对象导航权限-对象-全量
export function saveNavigationPermissionByRelatedFull (data) {
  return fetch({
    url: '/fbc/navigation/saveNavigationPermissionByRelatedFull',
    method: 'POST',
    data
  })
}

// 保存对象导航权限-对象-全量
export function reAssignPermForRes (data) {
  return fetch({
    url: '/authority/permission/reAssignPermForRes',
    method: 'POST',
    data
  })
}

// 重新分配权限给组织
export function reAssignPermissions (data) {
  return fetch({
    url: '/authority/permission/reAssignPermissions',
    method: 'POST',
    data
  })
}

// 查询指定权限的被授予对象
export function queryRelated (resourceId, type, data) {
  return fetch({
    url: `/authority/permission/queryGrantee/${resourceId}`,
    method: 'POST',
    data
  })
}
