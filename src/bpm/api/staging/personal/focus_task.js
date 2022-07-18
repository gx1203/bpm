import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取回退列表
export function getFocusTaskList(data) {
  return fetch({
    url: `/bpm/todo/query-under/${sessionStorage.getItem('userid')}`,
    method: 'POST',
    data
  })
}

// 获取回退列表  快速查询
export function quickFocusTaskList(data) {
  return fetch({
    url: `/bpm/processquery/v2/queryPutUnderTodo`,
    method: 'POST',
    data
  })
}
