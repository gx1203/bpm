import { fetch } from '@/bpm/utils'
// 查询已部署清单列表
export function getDeployedList(data) {
  return fetch({
    url: '/adeployment/query',
    method: 'POST',
    data
  })
}

// 删除部署
export function deleteDeployedList(id) {
  return fetch({
    url: `/adeployment/delete/${id}`,
    method: 'DELETE'
  })
}
