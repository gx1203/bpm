import { fetch } from '@/bpm/utils'
// 修改流程公司管理员
export function saveDeptAdmin(data) {
  return fetch({
    url: '/oa/processNodeAlias/saveDeptAdmin',
    method: 'POST',
    data
  })
}

// 修改节点别名
export function saveNodeAlias(data) {
  return fetch({
    url: '/oa/processNodeAlias/save',
    method: 'POST',
    data
  })
}

// 根据ID获取节点别名信息
export function getNodeAlias(id) {
  return fetch({
    url: `/oa/processNodeAlias/get/${id}`,
    method: 'GET'
  })
}

// 根据流程id获取公司管理员
export function getDeptAdmin(ids) {
  return fetch({
    url: `/oa/processNodeAlias/getDeptAdmin/${ids}`,
    method: 'GET'
  })
}