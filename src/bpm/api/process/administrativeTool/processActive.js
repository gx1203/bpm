import { fetch } from '@/bpm/utils'
// 流程激活
export function activate(data) {
  console.log(data)
  return fetch({
    url: `/process/activate/activate`,
    method: 'PUT',
    data
  })
}
// 流程激活列表查询
export function query(data) {
  return fetch({
    url: `/process/activate/query`,
    method: 'POST',
    data
  })
}
