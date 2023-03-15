import { fetch } from '@/bpm/utils'

export function postloaddragform(data) {
  return fetch({
    url: '/wbprocess/lendMaterialDetails',
    method: 'POST',
    data
  })
}
