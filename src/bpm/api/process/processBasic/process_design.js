import { fetch } from '@/bpm/utils'

// 获取人员变更列表
export function getAllocatedProcess (data) {
  return fetch({
    url: '/processModel/getAllocatedProcess',
    method: 'POST',
    data
  })
}

// 查询流程版本
export function getProcessVersionList (data) {
  return fetch({
    url: '/listrelease/queryRelease',
    method: 'post',
    data
  })
}

