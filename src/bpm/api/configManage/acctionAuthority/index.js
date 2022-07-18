import {
    fetch
  } from '@/bpm/utils'
  
  // 获取角色列表
  export function getAuthroleList(data) {
    return fetch({
      url: '/bpm/authrole/query',
      method: 'POST',
      data
    })
  }
   