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
