

import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
// 获取计划制定list
export function getPlanTrackingList (data) {
    return fetch({
      url: '/planTracking/query?username=' + username,
      method: 'post',
      data
    })
  }
  
  export function queryForTk (data) {
    return fetch({
      url: '/planTracking/queryForTk?username=' + username,
      method: 'post',
      data
    })
  }
  
  // 导出
  export function exportPlan (data) {
    return fetch({
      url: '/planTracking/exportPlan?username=' + username,
      method: 'post',
      responseType: 'blob',
      data
    })
  }
  // 修编计划
  export function savePlanTracking (data) {
    return fetch({
      url: '/planTracking/report',
      method: 'post',
      data
    })
  }
  
  export function planTracking (id) {
    return fetch({
      url: `/planTracking/urge//${id}`,
      method: 'get'
    })
  }
  export function getDetails (id) {
    return fetch({
      url: '/institution/get/' + id,
      method: 'get'
    })
  }
  // 上报
  export function updateStatus (id) {
    return fetch({
      url: `/institution/updateStatus/${id}`,
      method: 'GET'
    })
  }
  