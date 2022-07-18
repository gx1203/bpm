import { fetch } from '@/bpa/utils'
// 查询审批时长
export function getTimeList (data) {
  return fetch({
    url: '/approvetime/queryApproveTimeCopy',
    method: 'post',
    data
  })
}
// 保存审批时长
export function saveTime (data) {
  return fetch({
    url: '/approvetime/saveApproveTimeCopy',
    method: 'post',
    data
  })
}
// 查询审批时长详情
export function getTimeDetail (id) {
  return fetch({
    url: '/approvetime/getApproveTimeCopy/' + id,
    method: 'post'
  })
}
// 删除审批时长
export function deleteTime (id) {
  return fetch({
    url: '/approvetime/deleteApproveTimeCopy/' + id,
    method: 'post'
  })
}

// 获取适用审批流
export function getAppoval (data) {
  return fetch({
    url: '/process/queryProcessCopy',
    method: 'post',
    data
  })
}
