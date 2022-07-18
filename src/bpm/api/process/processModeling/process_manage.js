import { fetch } from '@/bpm/utils'
// 获取流程版本
export function getProcessVersionList(data) {
  return fetch({
    url: '/bpm/processversion/query',
    method: 'POST',
    data
  })
}
// 获取流程版本快速查询
export function getProcessQuickQuery(data) {
  return fetch({
    url: '/bpm/processversion/quickQuery',
    method: 'POST',
    data
  })
}

// 修改流程版本
export function saveProcess(data) {
  return fetch({
    url: '/bpm/processversion/save',
    method: 'POST',
    data
  })
}
// 获取流程图流程版本
export function getActId(id) {
  return fetch({
    url: `/bpm/processversion/getActId/${id}`,
    method: 'GET'
  })
}
// 修改流程版本
export function sysnVersion(data) {
  return fetch({
    url: '/bpm/processversion/sysnVersion',
    method: 'POST',
    data
  })
}

// 获取bpm流程图id
export function getBpaImg(data) {
  return fetch({
    url: '/bpm/process/bpa/image/'+data,
    method: 'GET'
  })
}

