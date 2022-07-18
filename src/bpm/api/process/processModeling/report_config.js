import { fetch } from '@/bpm/utils'
// 获取报表设置列表
export function getQueryList(data) {
  return fetch({
    url: `/report/queryList/${data.attr.processid}`,
    method: 'POST',
    data
  })
}


// 获取报表设置
export function getProcessTablename(id) {
  return fetch({
    url: `/report/getProcessTablename/${id}`,
    method: 'GET'
  })
}


// 添加报表设置
export function saveReport(data) {
  return fetch({
    url: '/report/save',
    method: 'POST',
    data
  })
}

// 删除报表设置
export function deleteReport(id) { 
  return fetch({
    url: `/report/delete/${id}`,
    method: 'DELETE'
  })
}
// 批量报表设置
export function batchDeleteReport(ids) {
  return fetch({
    url: `/report/batch-delete/${ids}`,
    method: 'DELETE'
  })
}

// 报表中心明细列表
export function queryDetailList(ids) {
    return fetch({
        url: `/report/queryDetailList/${ids}`,
        method: 'POST'
    })
}
  
// 添加明细报表
export function saveDetail(data) {
    return fetch({
        url: `/report/saveDetail/${data.reportId}`,
        method: 'POST',
        data:data.data
    })
}