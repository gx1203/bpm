import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
// 获取计划制定list
export function getInstitutionList (data) {
    return fetch({
      url: '/institution/query?username=' + username,
      method: 'post',
      data
    })
  }
  
  // 判断是否有报告
  export function isHzById (ids) {
    return fetch({
      url: '/institution/isHzById/' + ids + '?username=' + username,
      method: 'get'
    })
  }
  
  export function getDetailByModelIds (data) {
    return fetch({
      url: '/institution/getDetailByModelIds?username=' + username,
      method: 'post',
      data
    })
  }
  // 计划制定 汇总上报
export function updateStatusPlan (data) {
  return fetch({
    url: `/institution/updateStatus`,
    method: 'post',
    data
  })
}
  // 判断是否有报告
  export function getDetailByids (ids) {
    return fetch({
      url: '/institution/getDetailByids/' + ids + '?username=' + username,
      method: 'get'
    })
  }
  
  export function getInstitutionQueryAllPlanList (data) {
    return fetch({
      url: '/institution/queryAllPlan?username=' + username,
      method: 'post',
      data
    })
  }
  
  export function restartProcess (data) {
    return fetch({
      url: '/institution/restartProcess?username=' + username,
      method: 'post',
      data
    })
  }
  
  // 获取计划制定list
  export function getInstitutionQueryForHZList (data) {
    return fetch({
      url: '/institution/queryForHZ?username=' + username,
      method: 'post',
      data
    })
  }
  
  // 获取保存计划制定
  export function saveInstitution (data) {
    return fetch({
      url: '/institution/save',
      method: 'post',
      data
    })
  }
  
  export function deleteInstitution (id) {
    return fetch({
      url: `/institution/delete/${id}`,
      method: 'delete'
    })
  }
  export function getDetails (id) {
    return fetch({
      url: '/institution/get/' + id,
      method: 'get'
    })
  }
  // 上报
  export function updateStatus (data) {
    return fetch({
      url: `/institution/updateStatus`,
      method: 'post',
      data
    })
  }


  