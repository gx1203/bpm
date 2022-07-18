import {
  fetch
} from '@/bpm/utils'
// 自动化测试查询
export function getAutoList(data) {
  return fetch({
    url: '/test/automatic/query',
    method: 'POST',
    data
  })
}
// 添加自动化测试
export function addAuto(data) {
  return fetch({
    url: '/test/automatic/run-test',
    method: 'POST',
    data
  })
}
// 查询审批节点
export function getAutoRecord(data) {
  return fetch({
    url: '/test/automatic/test-record-list',
    method: 'POST',
    data
  })
}
// 删除审批节点
export function deleteAutoRecord(id) {
  return fetch({
    url: `/test/automatic/delete/${id}`,
    method: 'DELETE'
  })
}
// 删除审批节点
export function deleteAutoRecords(ids) {
  return fetch({
    url: `/test/automatic/batch-delete/${ids}`,
    method: 'DELETE'
  })
}