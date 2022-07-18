import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取回退列表
export function getReturnTaskList(data) {
  return fetch({
    url: '/bpm/processquery/v2/queryReturnTodo',
    method: 'POST',
    data
  })
}

// 获取回退列表 快速查询
export function quickReturnTaskList(data) {
  return fetch({
    url: '/bpm/processquery/v2/queryReturnTodo',
    method: 'POST',
    data
  })
}
