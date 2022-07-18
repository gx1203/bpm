import {
    fetch
  } from '@/bpm/utils'
  
  // 获取管理员日志
  export function getAdminslogList(data) {
    return fetch({
      url: '/adminslog/query',
      method: 'POST',
      data
    })
  }
  
  // 快速获取管理员日志
  export function quickAdminsLogList(data) {
    return fetch({
      url: '/adminslog/query',
      method: 'POST',
      data
    })
  }
  