import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取授权任务列表
export function getAuthorizationTaskList(data) {
  return fetch({
    url: `/bpm/mandate/query/${sessionStorage.getItem('userid')}`,
    method: 'POST',
    data
  })
}

// 获取授权任务列表
export function quickQueryAuthorizationTaskList(data) {
  return fetch({
    url: `/bpm/mandate/query/${sessionStorage.getItem('userid')}`,
    method: 'POST',
    data
  })
}
