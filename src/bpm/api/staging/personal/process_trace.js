import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取流程跟踪的列表
export function getProcessTraceList(data) {
  return fetch({
    url: `/bpm/tracking/query`,
    method: 'POST',
    data
  })
}

// 获取流程跟踪的列表 快速查询
export function quickQueryProcessTraceList(data) {
  return fetch({
    // url: `/bpm/processquery/v2/tracking`,
    url: `/bpm/processquery/v2/trackingWithoutApply`,
    method: 'POST',
    data
  })
}

// 传阅(多人用逗号分隔)
export function circulate(instanceId, readerUserIds) {
  return fetch({
    url: `/bpm/pass-read/passread/${instanceId}/${readerUserIds}`,
    method: 'GET'
  })
}
