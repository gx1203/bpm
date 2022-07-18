import { fetch } from '@/bpa/utils'
// 新建日程
export function newSche(data) {
  return fetch({
    url: '/calenders/saveCopy',
    method: 'post',
    data
  })
}
export function getEventDays(date) {
  return fetch({
    url: '/calenders/getEventDaysCopy/' + date,
    method: 'get'
  })
}
export function getEvents(date) {
  return fetch({
    url: '/calenders/getEventsCopy/' + date,
    method: 'get'
  })
}

export function getIntroduction(data) {
  return fetch({
    url: '/service/getHomePegeContent',
    method: 'post',
    data
  })
}

// 首页框架图的一级流程查询
export function getFirstProcess() {
  return fetch({
    url: '/modeltree/queryFirstTree',
    method: 'post'
  })
}

// 获取规章制度
export function queryRegulationFolder(data) {
  return fetch({
    url: '/regulation/queryRegulationFolder',
    method: 'get',
    loading: false
  })
}

// 获取规章制度树id
export function getRegulationTreeId(data) {
  return fetch({
    url: '/service/queryHomePageRegulationFolderTree/' + data,
    method: 'get'
  })
}

// 获取规章制度树id
export function queryRegulationFolderTreeId() {
  return fetch({
    url: '/service/queryRegulationFolderTreeId',
    method: 'get'
  })
}
