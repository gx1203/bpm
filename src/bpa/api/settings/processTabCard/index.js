import { fetch } from '@/bpa/utils'
export function getTabCardlist (data) {
  return fetch({
    url: '/dictionary/querySheet',
    method: 'post',
    data
  })
}
export function saveTabField (data, id) {
  return fetch({
    url: '/dictionary/saveSheet?username=' + id,
    method: 'post',
    data
  })
}
export function deleteTabField (id) {
  return fetch({
    url: '/dictionary/deleteSheet/' + id,
    method: 'get'
  })
}

