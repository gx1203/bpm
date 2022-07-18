import { fetch } from '@/bpm/utils'
// 获取业务角色列表
export function getProcessRolesList(data) {
  return fetch({
    url: '/bpm/processroles/query',
    method: 'POST',
    data
  })
}

// 获取业务角色快速列表
export function getQuickQueryList(data) {
  return fetch({
    url: '/bpm/processroles/quickQuery',
    method: 'POST',
    data
  })
}

export function getProcessRolesById(id) {
    return fetch({
      url: `/bpm/processroles/get/${id}`,
      method: 'GET'
    })
  }


// 添加编辑业务角色
export function saveProcessRoles(data) {
  return fetch({
    url: '/bpm/processroles/save',
    method: 'POST',
    data
  })
}

// 删除业务角色
export function deleteProcessRoles(id) {
  return fetch({
    url: `/bpm/processroles/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除业务角色
export function batchDeleteProcessRoles(ids) {
  return fetch({
    url: `/bpm/processroles/batch-delete/${ids}`,
    method: 'DELETE'
  })
}