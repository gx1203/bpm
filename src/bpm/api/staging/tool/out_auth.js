import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取外出授权列表
export function getOutAuthList(data) {
  if (data.filters.findIndex(item => item.key === 'creatorUid') < 0) {
    data.filters.push({
      key: 'creatorUid',
      opt: 'EQ',
      type: 'S',
      value: sessionStorage.getItem('userid')
    })
  }
  return fetch({
    url: '/bpm/agent/query',
    method: 'POST',
    data
  })
}

// 获取管理员外出授权列表
export function getAdminOutAuthList(data) {
  return fetch({
    url: '/bpm/agent/query',
    method: 'POST',
    data
  })
}


// 获取单个授权详情
export function getOutAuthDetail(id) {
  return fetch({
    url: `/bpm/agent/get/${id}`,
    method: 'GET'
  })
}

// 添加编辑授权详情
export function saveOutAuth(data) {
  return fetch({
    url: '/bpm/agent/save',
    method: 'POST',
    data
  })
}

// 删除外出授权
export function deleteOutAuth(id) {
  return fetch({
    url: `/bpm/agent/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除外出授权
export function batchDeleteOutAuth(ids) {
  return fetch({
    url: `/bpm/agent/batch-delete/${ids}`,
    method: 'DELETE'
  })
}

// 获取业务授权列表
export function queryListAll(data) {
  if (data.filters.findIndex(item => item.key === 'creatorUid') < 0) {
    data.filters.push({
      key: 'creatorUid',
      opt: 'EQ',
      type: 'S',
      value: sessionStorage.getItem('userid')
    })
  }
  return fetch({
    url: '/bpm/agent/queryListAll',
    method: 'POST',
    data
  })
}
