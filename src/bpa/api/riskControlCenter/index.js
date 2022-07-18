import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getRiskControlList (data) {
  return fetch({
    url: '/modellist/QueryRiskControl',
    method: 'POST',
    data
  })
}

// 风险库 列表
export function modelRepositoryRiskQuery (data) {
  return fetch({
    url: '/modelRepositoryRisk/query',
    method: 'post',
    data
  })
}
// 保存 
export function modelRepositoryRiskSave (data) {
  return fetch({
    url: '/modelRepositoryRisk/save',
    method: 'post',
    data
  })
}


// 获取
export function modelRepositoryRiskDel(id) {
  return fetch({
    url: '/modelRepositoryRisk/get/' + id,
    method: 'get'
  })
}


export function modelRepositoryRiskDelete(id) {
  return fetch({
    url: `/modelRepositoryRisk/delete/${id}`,
    method: 'delete'
  })
}