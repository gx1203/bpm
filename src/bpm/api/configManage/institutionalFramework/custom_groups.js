import {
    fetch
  } from '@/bpm/utils'


export function authorityGroup (data) {
    return fetch({
      url: `/base/customgroup/query`,
      method: 'POST',
      data
    })
  }
  export function saveAuthorityGroup (data) {
    return fetch({
      url: `/base/customgroup/save`,
      method: 'POST',
      data
    })
  }
  export function getAuthorityGroup (id) {
    return fetch({
      url: `/base/customgroup/get/${id}`,
      method: 'GET'
    })
  }
  export function deleteAuthorityGroup (id) {
    return fetch({
      url: `/base/customgroup/delete/${id}`,
      method: 'DELETE'
    })
  }