import { fetch } from '@/bpa/utils'

// 体系审核计划列表
export function getDetailByOrgid (data) {
  return fetch({
    url: '/systemAuditManger/getDetailByOrgid/' + data,
    method: 'GET'
  })
}

// 获取体系下拉
export function getInterListForPlan (data) {
  return fetch({
    url: '/systemManagement/getInterListForPlan',
    method: 'post',
    data
  })
}

// 删除
export function delSystemManagement (data) {
  return fetch({
    url: '/systemAuditManger/delete/' + data,
    method: 'delete'
  })
}

// 保存体系
export function systemAuditMangerSave (data) {
  return fetch({
    url: '/systemAuditManger/save',
    method: 'POST',
    data
  })
}

// 查询体系详情
export function systemAuditMangerById (data) {
  return fetch({
    url: '/systemAuditManger/getDetailById/' + data,
    method: 'GET'
  })
}

// 修订保存信息
export function systemAuditMangerList (data) {
  return fetch({
    url: '/systemAuditManger/revise',
    method: 'POST',
    data
  })
}

// 修订，废止，下发
export function systemAuditMangerisSued (data) {
  return fetch({
    url: '/systemAuditManger/startProcess',
    method: 'POST',
    data
  })
}

// 查看历史版本
export function getHistoryVersion (id) {
  return fetch({
    url: '/systemAuditManger/getHistoryVersion/' + id,
    method: 'GET'
  })
}

// 获取体系章节树
export function getSystemTree (id) {
  return fetch({
    url: '/systemChapterRelation/getTree/' + id,
    method: 'GET'
  })
}

// 获取树的内容
export function getCountsystemChapterRelation (data) {
  return fetch({
    url: '/systemChapterRelation/getCount',
    method: 'POST',
    data
  })
}
