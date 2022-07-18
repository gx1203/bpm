import { fetch } from '@/bpm/utils'

// 保存单号规则
export function saveReqNoRule (data) {
  return fetch({
    url: `/oa/reqNoRule/save`,
    method: 'POST',
    data
  })
}

// 单号规则列表
export function getReqNoRule (data) {
  return fetch({
    url: `/oa/reqNoRule/query`,
    method: 'POST',
    data
  })
}

// 单个刪除
export function deleteReqNoRule (id) {
  return fetch({
    url: `/oa/reqNoRule/delete/${id}`,
    method: 'GET'
  })
}
