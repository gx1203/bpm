import { fetch } from '@/bpm/utils'
  
// 获取管理员日志
export function getArchiveList(data) {
  return fetch({
    url: '/bpm/archive/search',
    method: 'POST',
    data
  })
}

