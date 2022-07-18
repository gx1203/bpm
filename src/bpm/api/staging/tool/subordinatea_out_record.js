import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取外出授权列表
export function getOutAuthList(data) {
  if (data.filters.findIndex(item => item.key === 'creatorUid') < 0) {
    data.filters.push({
      key: 'creatorUid',
      opt: 'EQ',
      type: 'S',
      value: sessionStorage.getItem('userid')
    })
  }
  return fetch({
    url: '/bpm/agent/quick-query-under',
    method: 'POST',
    data
  })
}

// 获取管理员外出授权列表
export function getAdminOutAuthList(data) {
  return fetch({
    url: '/bpm/agent/query',
    method: 'POST',
    data
  })
}

