import {
    fetch
  } from '@/bpm/utils'
  // 获取组织列表
  export function getOrganizationList() {
    return fetch({
      url: '/org/tree/query',
      method: 'POST'
    })
  }

  