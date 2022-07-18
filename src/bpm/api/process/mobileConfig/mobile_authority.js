import { fetch } from '@/bpm/utils'

// 添加编辑移动权限
export function saveMobilepope(data) {
  return fetch({
    url: '/bpm/mobilepope/save',
    method: 'POST',
    data
  })
}

// 删除移动权限
export function getMobilepope(id) {
  return fetch({
    url: `/bpm/mobilepope/query/${id}`,
    method: 'GET'
  })
}
