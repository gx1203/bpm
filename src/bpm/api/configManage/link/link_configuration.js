import { fetch } from '@/bpm/utils'

// 获取项目配置链接列表
export function getlinkProjectList(data) {
  return fetch({
    url: '/bpm/linkProject/query',
    method: 'POST',
    data
  })
}
// 修改保存项目配置链接
export function saveLinkProject(data) {
    return fetch({
      url: '/bpm/linkProject/save',
      method: 'POST',
      data
    })
  }
// 删除项目配置链接
export function deleteLinkProject(id) {
    return fetch({
      url: `/bpm/linkProject/delete/${id}`,
      method: 'DELETE'
    })
  }
  


