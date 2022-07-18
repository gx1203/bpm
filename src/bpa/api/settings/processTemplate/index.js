import { fetch } from '@/bpa/utils'

export function getModelListTemplate (data) {
  return fetch({
    url: '/modelListTemplate/query',
    method: 'post',
    data
  })
}
