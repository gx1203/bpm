import {
  fetch
} from '@/bpm/utils'

//判断是否是管理员 
export function getIsAdmin (data) {
  return fetch({
    url: `/businessRuleManage/isAdmin`,
    method: 'GET',
    data
  })
}

// 获取所有导航组
export function getAllGroups (id) {
  return fetch({
    url: `/navigation/get/${id}/default`,
    method: 'GET'
  })
}
// 获取所有导航组
export function getAllGroups2 (id) {
  return fetch({
    url: `/navigation/getAllGroups`,
    method: 'GET'
  })
}
// 根据id获取子导航组
export function getNavigations (id) {
  return fetch({
    url: `/navigation/getSubTree/${id}/default`,
    method: 'GET'
  })
}
// 根据ID获取导航组（无关权限）  //true 管理员
export function getNavAll (id) {
  return fetch({
    url: `/navigation/getNavigations/${id}/default`,
    method: 'GET'
  })
}
// 根据ID获取导航组（无关权限） //false 非管理员
export function getNavAll2 (id) {
  return fetch({
    url: `/navigation/getCurrentUserNav/${id}/default`,
    method: 'GET'
  })
}
// 更换PID
export function changepid (id, pid) {
  return fetch({
    url: `/navigationext/changepid/${id}/${pid}/default`,
    method: 'GET'
  })
}
// 根据id获取子导航组
export function getList (id) {
  return fetch({
    url: `/navigation/get/${id}`,
    method: 'GET'
  })
}
// 根据Id获取导航链接
export function getNavigationId (id) {
  return fetch({
    url: `/bpm/navigation/get/${id}`,
    method: 'GET'
  })
}
// 根据Id获取展示编辑页面
export function getNavigationIdShow (id) {
  return fetch({
    url: `/bpm/navigation/show/${id}`,
    method: 'GET'
  })
}
// 保存修改导航
export function saveNavigation (data) {
  return fetch({
    url: `/navigation/save`,
    method: 'POST',
    data
  })
}
// 根据ID删除导航以及该导航的子项
export function deleteFull (id) {
  return fetch({
    url: `/navigation/deleteFull/${id}/default`,
    method: 'DELETE'
  })
}

// 获取该角色下面的所有权限；并数据回渲染
export function getRolePermissions (roleid) {
  return fetch({
    url: `/authority/role/findPermissions/${roleid}/nav`,
    method: 'GET'
  })
}
