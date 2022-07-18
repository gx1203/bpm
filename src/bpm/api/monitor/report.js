import { fetch } from '@/bpm/utils'


// 加载查询表单元素
export function loadSearchForm (id) {
  return fetch({
    url: `/report/loadSearchForm/${id}`,
    method: 'GET'
  })
}

// 加载查询表单数据
export function getSearchResult (data) {
    return fetch({
      url: `/report/getSearchResult/${data.id}`,
      method: 'post',
      data: data.data
    })
}