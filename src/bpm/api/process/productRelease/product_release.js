import { fetch } from '@/bpm/utils'
export function getProcessVersionList (data) {
    return fetch({
      url: '/bpm/productRelease/manage/getProductReleaseList',
      method: 'POST',
      data
    })
  }