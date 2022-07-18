import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取查找中心列表
export function getQueryCenterList(data) {
  return fetch({
    url: `/bpm/searchcenter/query`,
    method: 'POST',
    data
  })
}

// 获取查找中心列表  快速查询
export function quickQueryCenterList(data) {
  return fetch({
    url: `/bpm/processquery/v2/searching`,
    method: 'POST',
    data
  })
}
