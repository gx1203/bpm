import { fetch } from '@/bpm/utils'
// 获取报表设置列表
export function queryChartList(data) {
  return fetch({
    url: `/chart/query`,
    method: 'POST',
    data
  })
}

// 添加图表
export function saveChart(data) {
  return fetch({
    url: '/chart/save',
    method: 'POST',
    data
  })
}

// 删除图表
export function deleteChart(id) {
  return fetch({
    url: `/chart/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除图表
export function batchDeleteChart(data) {
  return fetch({
    url: `/chart/batchDelete`,
    method: 'POST',
    data
  })
}

// 获取配置详细信息
export function queryDetailList(id) {
  return fetch({
    url: `/chart/getDetail/${id}`,
    method: 'GET'
  })
}
  
// 保存配置详情
export function saveChartDetail(data) {
  return fetch({
    url: `/chart/saveDetail`,
    method: 'POST',
    data
  })
}

//
// 获取数据信息
export function getCharData(id) {
  return fetch({
    url: `/chart/getCharData/${id}`,
    method: 'GET'
  })
}
