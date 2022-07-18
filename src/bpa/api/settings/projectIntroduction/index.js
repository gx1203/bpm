import { fetch } from '@/bpa/utils'
export function getIntroduction(data) {
  return fetch({
    url: '/service/getHomePegeContent',
    method: 'post',
    data
  })
}

export function updateIntroduction(data) {
  return fetch({
    url: '/service/updateHomePegeContent',
    method: 'post',
    data
  })
}
