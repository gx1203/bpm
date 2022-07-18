import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid

// 流程框架权限管理的节点权限查询
export function getNodePermissions(data) {
  return fetch({
    url: '/modeltreeauthority/query',
    method: 'post',
    data
  })
}

// 点击添加人员组织按钮
export function addOrganization(id) {
  return fetch({
    url: `/modeltreeauthority/queryWithoutOrg/` + id,
    method: 'get'
  })
}

// 删除按钮
export function deleteOrganization(id) {
  return fetch({
    url: `/modeltreeauthority/delete/` + id,
    method: 'get'
  })
}

// 确认添加和修改
export function addPerson(data) {
  return fetch({
    url: `/modeltreeauthority/save`,
    method: 'post',
    data
  })
}

export function batchSavePerson(data) {
  return fetch({
    url: `/modeltreeauthority/batchSave`,
    method: 'post',
    data
  })
}

export function saveProcessFrameworkAuth(data) {
  return fetch({
    url: `/modeltreeauthority/rewriteSave`,
    method: 'post',
    data
  })
}

// 权限字段全选和取消全选
export const checkAll = (data, type) => {
  return fetch({
    url: `/modeltreeauthority/saveAll/${type}`,
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return fetch({
    url: `/modeltreeauthority/updateModelTreeAuthority`,
    method: 'post',
    data
  })
}

// 修改流程可见权限(已废弃)
export function checkListAuth(data) {
  return fetch({
    url: `/modellistauth/save`,
    method: 'post',
    data
  })
}

// (已废弃)
export function batchSaveAuth(data) {
  return fetch({
    url: `/modellistauth/batchSave`,
    method: 'post',
    data
  })
}
