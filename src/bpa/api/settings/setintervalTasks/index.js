import { fetch } from '@/bpa/utils'
// var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getTasksList(data) {
  return fetch({
    // url: '/schedule/task/queryCopy',
    url: '/schedule/task/query',
    method: 'post',
    data
  })
}
export function enableTask(data) {
  return fetch({
    url: '/schedule/task/updateState',
    method: 'put',
    data
  })
}

// 获取执行者列表
export function getOperatlist(data) {
  return fetch({
    // url: '/schedule/task/getAvailableJobCopy',
    url: '/schedule/task/getAvailableJob',
    method: 'get',
    data
  })
}
// 定时任务保存
export function intervalSave(data) {
  return fetch({
    url: '/schedule/task/save',
    method: 'post',
    data
  })
}
// 编辑保存
export function edit2Save(data) {
  return fetch({
    url: '/schedule/task/save',
    method: 'post',
    data
  })
}
// 删除定时任务
export function delintervalTask(data) {
  return fetch({
    url: '/schedule/task/updateState',
    method: 'put',
    data
  })
}



