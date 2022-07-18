import { fetch } from '@/bpm/utils'

export function queryTodo (data) {
    return fetch({
      url: '/unified-task/query-todo',
      method: 'POST',
      data
    })
}

export function queryTracking (data) {
  return fetch({
    url: '/unified-task/query-tracking',
    method: 'POST',
    data
  })
}

export function queryMyapply (data) {
  return fetch({
    url: '/unified-task/query-myapply',
    method: 'POST',
    data
  })
}

// 我的收藏
export function quickQueryCollection (data = {}) {
  return fetch({
    url: '/bpm/collection/quick-query',
    method: 'POST',
    data
  })
}

// 导航查询
export function queryCopy (data) {
  return fetch({
    url: '/application/queryCopy',
    method: 'POST',
    data
  })
}

// 图片
export function attachment (id) {
  return fetch({
    url: `/bpm/attachment/download/${id}?attachmentType=bpm`,
    method: 'GET'
  })
}

// 图片
export function queryTimeOutCount (userId) {
  return fetch({
    url: `/bpm/todo/timeOutCount/${userId}`,
    method: 'GET'
  })
}
