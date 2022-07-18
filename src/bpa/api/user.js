import { fetch } from '@/bpa/utils'
import store from '@/bpa/store'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export async function login(data) {
  const res = await fetch({
    // url: '/webservice/loginauth/loginCopy',
    url: '/authentication/form',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    noToken: true,
    data
  }).catch(e => Promise.reject(e))
  return Promise.resolve(res)
}
export function getCurrentUser(data) {
  return fetch({
    url: '/user/getCurrentUser',
    method: 'GET',
    data
  })
}

export function getUserRoleName() {
  return fetch({
    url: '/modellist/getUserRoleNameCopy',
    method: 'post'
  })
}

export function getUserMenulist() {
  return fetch({
    url: '/portalmenu/getMyPortalMenuCopy',
    method: 'get',
    noToken: true
  })
}
