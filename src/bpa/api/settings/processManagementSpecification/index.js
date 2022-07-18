import { fetch } from '@/bpa/utils'
export function queryProcessManagementCopy (data) {
  return fetch({
    url: '/mangercenterdoc/queryProcessManagementCopy',
    method: 'post',
    data
  })
}
export function saveProcessManagementCopy (data) {
  return fetch({
    url: `/mangercenterdoc/saveProcessManagementCopy`,
    method: 'post',
    data
  })
}

export function deleteProcessManagementCopy (id) {
  return fetch({
    url: `/mangercenterdoc/deleteProcessManagementCopy/${id}`,
    method: 'post'
  })
}
