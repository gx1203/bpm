import { fetch } from '@/bpm/utils'

export function loaddragform(id, params) {
  return fetch({
    url: `/processNodeConfig/loaddragform/${id}`,
    method: 'GET',
    params
  })
}
