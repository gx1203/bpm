import { fetch } from '@/bpm/utils'

export function loaddragform (id, params) {
  return fetch({
    url: `/processNodeConfig/loaddragform/${id}`,
    method: 'GET',
    params
  })
}

export function savedragform (data) {
  return fetch({
    url: `/processNodeConfig/savedragform`,
    method: 'POST',
    data
  })
}

export function loaddragformByAnotherProcessid (processId) {
  return fetch({
    url: `/processNodeConfig/loaddragform-by-another-processid/${processId}`,
    method: 'GET'
  })
}


export function builddatabaseindragform (data) {
  return fetch({
    url: `/processNodeConfig/builddatabaseindragform`,
    method: 'POST',
    data
  })
}

