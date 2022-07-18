import { fetch } from '@/bpm/utils'
  
// 获取管理员日志
export function getAdminslogList(data) {
  return fetch({
    url: '/audit/event/query',
    method: 'POST',
    data
  })
}

// 快速获取管理员日志
export function quickAdminsLogList(data) {
  return fetch({
    url: '/audit/event/query',
    method: 'POST',
    data
  })
}
  
// 获取日志详情
export function getAdminLogItem(id) {
  return fetch({
    url: `/audit/event/get/${id}`,
    method: 'GET'
  })
}