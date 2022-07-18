import { fetch } from '@/bpa/utils'
// 系统检索
export function attachmentSearch (data) {
  return fetch({
    url: '/attachmentSearch/search',
    method: 'post',
    data
  })
}
// 全文替换
export function replaceAll (data) {
  return fetch({
    url: '/attachmentSearch/replaceAll',
    method: 'post',
    data
  })
}