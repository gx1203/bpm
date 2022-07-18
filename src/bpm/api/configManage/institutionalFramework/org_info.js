import {
  fetch
} from '@/bpm/utils'


export function orgInfo(data) {
  return fetch({
    url: `/org/info/query`,
    method: 'POST',
    data
  })
}
export function getOrgInfo(id) {
  return fetch({
    // url: `/org/info/get/${id}`,
    url: `/orgTreeExtend/getOrgInfo/${id}`,
    method: 'GET'
  })
}
export function getOrgInfopName(id) {
  return fetch({
    url: `/org/manager/getFullOrgInfo/${id}`,
    method: 'GET'
  })
}
export function orgSave(data) {
  return fetch({
    // url: `/org/info/save`,
    url: `/orgTreeExtend/saveOrgData`,
    method: 'POST',
    data
  })
}

//获取责任人
export function queryOrgSuperior(orgId) {
  return fetch({
    url: `/orgTreeExtend/getOrgSuperiorUsers/${orgId}`,
    method: 'GET'
  })
}