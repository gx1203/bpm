import { fetch } from '@/bpa/utils'
export function queryProcessTemplateCopy (data) {
  return fetch({
    url: '/mangercenterdoc/queryProcessTemplateCopy',
    method: 'post',
    data
  })
}
export function saveProcessTemplateCopy (data) {
  return fetch({
    url: `/mangercenterdoc/saveProcessTemplateCopy`,
    method: 'post',
    data
  })
}

export function deleteProcessTemplateCopy (id) {
  return fetch({
    url: `/mangercenterdoc/deleteProcessTemplateCopy/${id}`,
    method: 'post'
  })
}
