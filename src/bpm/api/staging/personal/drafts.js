import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取草稿箱列表
export function getDraftList(data) {
  if (data.filters.findIndex(item => item.key === 'userId') < 0) {
    data.filters.push({
      key: 'userId',
      opt: 'EQ',
      type: 'S',
      value: sessionStorage.getItem('userid')
    })
  }
  return fetch({
    url: '/bpm/draft-box/query',
    method: 'POST',
    data
  })
}

// 获取草稿箱列表
export function quickQueryDraftList(data) {
  if (data.filters.findIndex(item => item.key === 'userId') < 0) {
    data.filters.push({
      key: 'userId',
      opt: 'EQ',
      type: 'S',
      value: sessionStorage.getItem('userid')
    })
  }
  return fetch({
    url: '/bpm/draft-box/quick-query',
    method: 'POST',
    data
  })
}

// 获取草稿箱详情
export function getDraftDetail(id) {
  return fetch({
    url: `/bpm/draft-box/get/${id}`,
    method: 'GET'
  })
}

// 删除草稿箱
export function deleteDraft(id) {
  return fetch({
    url: `/bpm/draft-box/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除草稿箱
export function batchDeleteDraft(ids) {
  return fetch({
    url: `/bpm/draft-box/batch-delete/${ids}`,
    method: 'DELETE'
  })
}
