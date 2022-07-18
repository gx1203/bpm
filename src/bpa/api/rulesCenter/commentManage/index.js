import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid

export function getCommentMangementList (data) {
    return fetch({
      url: '/commentMangement/query?username=' + username,
      method: 'post',
      data
    })
  }
  
  export function getDetails (id) {
    return fetch({
      url: '/commentMangement/get/' + id,
      method: 'get'
    })
  }