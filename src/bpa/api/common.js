import { fetch } from '@/bpa/utils'

export function uploadFile(data) {
  return fetch({
    url: '/document/saveCopy',
    method: 'put',
    data
  })
}

export function deluploadFile(id) {
  return fetch({
    url: '/document/docdeleteCopy/' + id,
    method: 'get'
  })
}

// 获取已发布的文件的列表
export function getfilelist(data) {
  return fetch({
    url: '/modellistdoc/querysCopy',
    method: 'post',
    data
  })
}

// 规章制度的直接发布、作废接口
export function updateStatusRule(data) {
  return fetch({
    url: '/regulation/updateStatusNewCopy',
    method: 'post',
    data
  })
}

// 获取行数的接口
export function getNum(data) {
  return fetch({
    url: '/modelLegend/query',
    method: 'post',
    data
  })
}
// 保存行数的接口
export function saveNum(data) {
  return fetch({
    url: '/modelLegend/save',
    method: 'post',
    data
  })
}

// 获取导航菜单下拉框
export function navigationMenu(data) {
  return fetch({
    url: '/navigation/getAllGroups',
    method: 'GET'
  })
}

// 根据ID获取当前用户有权限访问的导航组
export function getUserNav (id) {
  return fetch({
    url: `/navigation/getCurrentUserNav/${id}/default`,
    method: 'GET'
  })
}



