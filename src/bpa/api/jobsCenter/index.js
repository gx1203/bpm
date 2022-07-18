import { fetch } from '@/bpa/utils'
// 岗位
export function getstation(data) {
  return fetch({
    url: '/modelResponsibility/getPosts/' + data,
    method: 'get'
  })
}
// 相关流程
export function getRelative(data) {
  return fetch({
    url: '/modelResponsibility/getProcesses/' + data,
    method: 'get'
  })
}
// 责任者
export function getOwners(data) {
  return fetch({
    url: '/modelResponsibility/getProcessesAsR/' + data,
    method: 'get'
  })
}
// 审批者
export function getAppovers(data) {
  return fetch({
    url: '/modelResponsibility/getProcessesAsA/' + data,
    method: 'get'
  })
}
// 咨询者
export function getAskers(data) {
  return fetch({
    url: '/modelResponsibility/getProcessesAsC/' + data,
    method: 'get'
  })
}
// 知会者
export function getNotiers(data) {
  return fetch({
    url: '/modelResponsibility/getProcessesAsI/' + data,
    method: 'get'
  })
}

// 岗位职责列表
export function getStationlists(data) {
  return fetch({
    url: '/modelResponsibility/DMOS/' + data,
    method: 'get'
  })
}

// 风险列表risklists
export function risklists(data) {
  return fetch({
    url: '/modelResponsibility/RISK/' + data,
    method: 'get'
  })
}

// RACI列表
export function racilists(data) {
  return fetch({
    url: '/modelResponsibility/RACI/' + data,
    method: 'get'
  })
}

// 岗位查询
export function getJobsList(data) {
  return fetch({
    url: '/select/user/cqp/getTotalOrgCopy/' + data,
    method: 'POST'
  })
}

// 岗位查询-子接口
export function getJobsChildrenList(data) {
  return fetch({
    url: '/select/user/cqp/getTotalOrg1Copy',
    method: 'POST',
    data
  })
}
// 岗位查询-子接口
export function getTotalOrg1Tree(data) {
  return fetch({
    url: '/select/user/cqp/getTotalOrg1Tree',
    method: 'POST',
    data
  })
}

// 其他岗位数据
// 相关流程
export function getRelativeOther(data) {
  return fetch({
    url: '/modelResponsibility/getProcesses/' + data,
    method: 'get'
  })
}
// 责任者
export function getOwnersOther(data) {
  return fetch({
    url: '/modelResponsibility/getProcessesAsR/' + data,
    method: 'get'
  })
}
// 审批者
export function getAppoversOther(data) {
  return fetch({
    url: '/modelResponsibility/getProcessesAsA/' + data,
    method: 'get'
  })
}
// 知会者
export function getNotiersOther(data) {
  return fetch({
    url: '/modelResponsibility/getProcessesAsI/' + data,
    method: 'get'
  })
}

// 岗位职责列表
export function getStationlistsOther(data) {
  return fetch({
    url: '/modelResponsibility/DMOS/' + data,
    method: 'get'
  })
}

// 风险列表risklists
export function risklistsOther(data) {
  return fetch({
    url: '/modelResponsibility/RISK/' + data,
    method: 'get'
  })
}

// RACI列表
export function racilistsOther(data) {
  return fetch({
    url: '/modelResponsibility/RACI/' + data,
    method: 'get'
  })
}

// 模糊查询
export function abstractSearch(data) {
  return fetch({
    url: '/select/user/cqp/getTotalOrgByNameCopy',
    method: 'post',
    data
  })
}
// export function abstractSearch (data) {
//   return fetch({
//     url: '/org/tree/queryTree' + data,
//     method: 'get'
//   })
// }
