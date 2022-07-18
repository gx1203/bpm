import { fetch } from '@/bpm/utils'
// 获取移动模块菜单列表
export function getMobileMenuList(data) {
  return fetch({
    url: '/bpm/model/query',
    method: 'POST',
    data
  })
}

// 获取移动模块菜单列表
export function quickQueryCenterList(data) {
  return fetch({
    url: '/bpm/model/quickQuery',
    method: 'POST',
    data
  })
}

// 添加编辑移动模块菜单
export function saveMobileMenu(data) {
  return fetch({
    url: '/bpm/model/save',
    method: 'POST',
    data
  })
}

// 删除移动模块菜单
export function deleteMobileMenu(id) {
  return fetch({
    url: `/bpm/model/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除移动模块菜单
export function batchDeleteMobileMenu(ids) {
  return fetch({
    url: `/bpm/model/batch-delete/${ids}`,
    method: 'DELETE'
  })
}