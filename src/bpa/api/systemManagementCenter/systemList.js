import { fetch } from '@/bpa/utils'
// 内部体系新增/编辑
export function saveSystemManagement (data) {
  return fetch({
    url: '/systemManagement/save',
    method: 'post',
    data
  })
}
// 内部体系修订
export function reviseSystemManagement (data) {
  return fetch({
    url: '/systemManagement/revise',
    method: 'post',
    data
  })
}

// 查看历史版本
export function getDetails (systemid) {
  return fetch({
    url: '/systemManagement/getHistory/' + systemid,
    method: 'get'
  })
}

export function delSystemManagement (data) {
  return fetch({
    url: '/systemManagement/delete/' + data,
    method: 'delete'
  })
}

export function getSystemManagement (data) {
  return fetch({
    url: '/systemManagement/page',
    method: 'POST',
    data
  })
}

export function getSystemManagementById (data) {
  return fetch({
    url: '/systemManagement/get/' + data,
    method: 'GET'
  })
}

// 获取内部体系列表(已有流程)
export function getInterList (data) {
  return fetch({
    url: '/systemManagement/getInterList',
    method: 'POST',
    data
  })
}

// 获取外部体系列表
export function getwbSystemList (data) {
  return fetch({
    url: '/wbSystemList/page',
    method: 'POST',
    data
  })
}

// 保存体系列表
export function wbSystemList (data) {
  return fetch({
    url: '/wbSystemList/save',
    method: 'POST',
    data
  })
}

// 删除外部体系列表
export function wbSystemListDelete (data) {
  return fetch({
    url: '/wbSystemList/delete/' + data,
    method: 'delete'
  })
}

// 查看外部体系详情
export function getSystemwbSystemList (data) {
  return fetch({
    url: '/wbSystemList/get/' + data,
    method: 'GET'
  })
}

// 体系发布废止
export function startProcess (data) {
  return fetch({
    url: '/systemManagement/startProcess',
    method: 'POST',
    data
  })
}

// 外部体系发布/废止
export function wbstartProcess (data) {
  return fetch({
    url: '/wbSystemList/startProcess',
    method: 'POST',
    data
  })
}

// 获取外部体系已发布列表
export function getWbSystemListOut (data) {
  return fetch({
    url: '/wbSystemList/getWbSystemList',
    method: 'POST',
    data
  })
}
