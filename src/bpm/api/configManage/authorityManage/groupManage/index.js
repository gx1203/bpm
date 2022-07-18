import {
    fetch
  } from '@/bpm/utils'
  
  // 获取组列表
  export function getAuthgroupList(data) {
    return fetch({
      url: '/bpm/authgroup/query',
      method: 'POST',
      data
    })
  }