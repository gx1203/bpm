import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取回退列表
export function getProcessTemplateList(data) {
  if (data.filters.findIndex(item => item.key === 'userId') < 0) {
    data.filters.push({
      key: 'userId',
      opt: 'EQ',
      type: 'S',
      value: sessionStorage.getItem('userid')
    })
  }
  return fetch({
    url: '/bpm/stencil/query',
    method: 'POST',
    data
  })
}

// 获取流程模板列表 快速查询
export function quickQueryProcessTemplateList(data) {
  if (data.filters.findIndex(item => item.key === 'userId') < 0) {
    data.filters.push({
      key: 'userId',
      opt: 'EQ',
      type: 'S',
      value: sessionStorage.getItem('userid')
    })
  }
  return fetch({
    url: '/bpm/stencil/quick-query',
    method: 'POST',
    data
  })
}

// 删除模板
export function deleteProcessTemplate(id) {
  return fetch({
    url: `/bpm/stencil/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除模板
export function batchDeleteProcessTemplate(ids) {
  return fetch({
    url: `/bpm/stencil/batch-delete/${ids}`,
    method: 'DELETE'
  })
}
