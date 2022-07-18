import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取外出授权列表
export function getOutAuthViewList(data) {
  return fetch({
    url: '/bpm/processquery/v2/queryAgentTask',
    method: 'POST',
    data
  })
}
