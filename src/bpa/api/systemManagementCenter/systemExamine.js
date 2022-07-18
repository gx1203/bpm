import { fetch } from '@/bpa/utils'

// 体系运行审核列表
export function getListById (data) {
  return fetch({
    url: '/systemOperationAudit/getListById/' + data,
    method: 'GET'
  })
}

// 提交审核结果
export function saveResult (data) {
  return fetch({
    url: '/systemOperationAudit/saveResult',
    method: 'post',
    data
  })
}
