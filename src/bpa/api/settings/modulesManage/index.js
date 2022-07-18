import { fetch } from '@/bpa/utils'
export function getModuleList (data) {
  return fetch({
    url: '/mangercenterdoc/queryruleCopy',
    method: 'post',
    data
  })
}
export function deleteModule (idliststr) {
  return fetch({
    url: '/mangercenterdoc/deleteruleCopy/' + idliststr,
    method: 'post'
  })
}
