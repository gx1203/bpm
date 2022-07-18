import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getDocInfo (docId, revId) {
  return fetch({
    url: '/document/getCopy/' + docId + '/' + revId + '?username=' + username+'&released=true',
    method: 'get'
  })
}
export function getDocInfos (docId, revId) {
  return fetch({
    url: '/document-modeling/getCopy/' + docId + '/' + revId + '?username=' + username+'&released=true',
    method: 'get'
  })
}
export function getTableInfo (url, docId) {
  return fetch({
    url: '/processDuration/selectHistoryByDocIdCopy/' + url + '/' + docId + '?username=' + username,
    method: 'get'
  })
}

//搜索规章制度树接口
export function searchRulestree (data) {
  return fetch({
    url: '/regulation/getTreeNodeByName',
    method: 'post',
    data
  })
}

//查阅量的接口
export function getReadNum (id) {
  return fetch({
    url: '/regulation/addReadNum/' + id,
    method: 'post',
  })
}

//规章制度历史版本的接口
export function getRegulationHistory (data) {
  return fetch({
    url: '/regulation/queryHistory',
    method: 'post',
    data
  })
}

