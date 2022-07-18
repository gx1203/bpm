import { fetch } from '@/bpm/utils'

// 获取流程传阅列表
export function getPassReadList(data) {
  return fetch({
    url: `/bpm/pass-read/query`,
    method: 'POST',
    data
  })
}

// 获取流程传阅列表  快速查询
export function quickQueryPassReadList(data) {
  return fetch({
    url: `/bpm/pass-read/quick-query`,
    method: 'POST',
    data
  })
}

// 保存流程传阅
export function savePassRead(data) {
  return fetch({
    url: '/bpm/pass-read/save',
    method: 'POST',
    data
  })
}

// 我的抄送
export function mypassread(data) {
  return fetch({
    url: '/bpm/pass-read/mypassread',
    method: 'POST',
    data
  })
}


// 抄送我的
export function passreadtome(data) {
  return fetch({
    url: '/bpm/pass-read/passreadtome',
    method: 'POST',
    data
  })
}