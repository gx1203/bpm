import { fetch } from '@/bpm/utils'

export function postLendMaterialDetails(data) {
  return fetch({
    url: `/wbprocess/lendMaterialDetails`,
    method: 'POST',
    data
  })
}
