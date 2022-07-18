import { fetch } from '@/bpa/utils'

// 运行记录列表
export function getDetailBySystemid (data) {
  return fetch({
    url: '/systemRuningManger/getDetailBySystemid',
    method: 'POST',
    data
  })
}

// 文件详情
export function getFileList (data) {
  return fetch({
    url: '/systemRuningManger/getFileList/' + data,
    method: 'GET'
  })
}

// 流程详情
export function getProcessList (data) {
  return fetch({
    url: '/systemRuningManger/getProcessList/' + data,
    method: 'GET'
  })
}
