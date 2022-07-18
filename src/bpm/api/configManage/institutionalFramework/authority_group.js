import {
    fetch
  } from '@/bpm/utils'


export function authorityGroup (data) {
    return fetch({
      url: `/authority/group/query`,
      method: 'POST',
      data
    })
  }
  export function saveAuthorityGroup (data) {
    return fetch({
      url: `/authority/group/save`,
      method: 'POST',
      data
    })
  }
  export function getAuthorityGroup (id) {
    return fetch({
      url: `/authority/group/get/${id}`,
      method: 'GET'
    })
  }
  export function deleteAuthorityGroup (id) {
    return fetch({
      url: `/authority/group/delete/${id}`,
      method: 'DELETE'
    })
  }