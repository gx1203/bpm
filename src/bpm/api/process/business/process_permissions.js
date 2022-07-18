import { fetch } from '@/bpm/utils'
// 获取流程规则权限管理列表
export function getPowerControlList(data) {
  return fetch({
    url: '/businessrule/powerControl/query',
    method: 'POST',
    data
  })
}

// 添加编辑流程规则权限管理
export function savePowerControl(data) {
  return fetch({
    url: '/businessrule/powerControl/save',
    method: 'POST',
    data
  })
}

// 删除流程规则权限管理
export function deletePowerControl(id) {
  return fetch({
    url: `/businessrule/powerControl/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除流程规则权限管理
export function batchDeletePowerControl(ids) {
  return fetch({
    url: `/businessrule/powerControl/batch-delete/${ids}`,
    method: 'DELETE'
  })
}
