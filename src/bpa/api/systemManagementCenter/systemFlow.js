import { fetch } from '@/bpa/utils'

// 体系流程列表
export function systemProcessRelation (data) {
  return fetch({
    url: '/systemProcessRelation/getBySystemId',
    method: 'POST',
    data
  })
}
