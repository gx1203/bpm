import {
  fetch
} from '@/bpm/utils'

// 获取计划任务列表
export function getScheduleList(data) {
  return fetch({
    url: '/schedule/task/query',
    method: 'POST',
    data
  })
}

// 保存计划任务列表
export function saveSchedule(data) {
  return fetch({
    url: '/schedule/task/save',
    method: 'POST',
    data
  })
}
// 删除计划任务列表
export function deleteSchedule(id) {
  return fetch({
    url: `/schedule/task/delete/${id}`,
    method: 'DELETE'
  })
}
// 手动执行Task
export function executeTask(data) {
  return fetch({
    url: `/schedule/task/executeTask`,
    method: 'PUT',
    data
  })
}
export function updateState(data) {
  return fetch({
    url: `/schedule/task/updateState`,
    method: 'PUT',
    data
  })
}


// 
export function getJobParams(id) {
  return fetch({
    url: `/schedule/task/getJobParams/${id}`,
    method: 'GET'
  })
}
export function getAvailableJob() {
  return fetch({
    url: `/schedule/task/getAvailableJob`,
    method: 'GET'
  })
}




