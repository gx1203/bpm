import { fetch } from '@/bpa/utils'
export function getWordsList (data) {
  return fetch({
    url: '/modelterm/queryCopy',
    method: 'post',
    data
  })
}
export function saveWord (data) {
  return fetch({
    url: '/modelterm/saveCopy',
    method: 'post',
    data
  })
}
export function deleteWord (id) {
  return fetch({
    url: '/modelterm/deleteCopy/' + id,
    method: 'post'
  })
}
