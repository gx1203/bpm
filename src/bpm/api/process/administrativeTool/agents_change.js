import { fetch } from '@/bpm/utils'

// 获取人员变更列表
export function getBpmUserChange (data) {
  return fetch({
    url: '/basBpmUserChange/query',
    method: 'POST',
    data
  })
}

// 删除人员变更列表
export function deleteBpmUserChange (id) {
  return fetch({
    url: `/basBpmUserChange/delete/${id}`,
    method: 'delete'
  })
}

// 获取人员变更列表
export function saveBpmUserChange (data) {
    return fetch({
      url: `/basBpmUserChange/save`,
      method: 'POST',
      data
    })
  }
// 获取人员变更列表
export function getBpmUserChangeId (id) {
    return fetch({
      url: `/basBpmUserChange/get/${id}`,
      method: 'get'
    })
  }
// 获取用户的所有代办流程信息
export function getUserProcess (id) {
  return fetch({
    url: `/basBpmUserChange/getUserProcess/${id}`,
    method: 'get'
  })
}
// 获取用户的所有代办流程信息
export function getPost (id) {
  return fetch({
    // url: `/userModel/getPost/${id}`,
    url: `/userModel/getCurrentUserPost`,
    method: 'get'
  })
}

export function getPostById (id) {
  return fetch({
    url: `/userModel/getPost/${id}`,
    method: 'get'
  })
}

export function basBpmUserChange (id) {
  return fetch({
    url: `/basBpmUserChange/getPost/${id}`,
    method: 'get'
  })
}

