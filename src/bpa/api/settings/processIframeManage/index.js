import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getProcessTreeList (id) {
  return fetch({
    url: '/modeltree/getTreeNodeWithoutAuthCopy/' + id,
    method: 'post'
  })
}
export function getProcessList (data) {
  return fetch({
    url: '/regulation/queryOperateLogCopy?username=' + username,
    method: 'post',
    data
  })
}
export function queryOperateLog (data) {
  return fetch({
    url: '/frameVersion/queryOperateLog?username=' + username,
    method: 'post',
    data
  })
}
// 历史版本
export function queryFrameVersionList (data) {
  return fetch({
    url: '/frameVersion/queryFrameVersionList?username=' + username,
    method: 'post',
    data
  })
}
export function getProcessIframeTree (id, frameVersionId) {
  return fetch({
    url: '/frameVersion/getTreeNode/' + id + '/' + frameVersionId,
    method: 'post'
  })
}
// 升级版本
export function upgradeVersion (data) {
  return fetch({
    url: '/frameVersion/upgradeVersion?username=' + username,
    method: 'post',
    data
  })
}
// 树搜索
export function searchProcessIframeTree (data) {
  return fetch({
    url: '/frameVersion/getTreeNodeByName',
    method: 'post',
    data
  })
}

// 流程框架 导出
export function exportFrameVersion (frameVersionId) {
  return fetch({
    url: `/frameVersion/export/${frameVersionId}`,
    method: 'post',
    responseType: 'blob'
  })
}

// 流程框架 模板
export function downloadFrameVersion () {
  return fetch({
    url: `/frameVersion/download`,
    method: 'get'
  })
}

// 流程框架 导入
export function uploadFrameVersion (data) {
  return fetch({
    url: `/frameVersion/upload`,
    method: 'post',
    data
  })
}
export function cascadeSaveDisplaymode (data) {
  return fetch({
    url: `/modeltree/cascadeSaveDisplaymode`,
    method: 'post',
    data
  })
}
//框架拖拉
export function frameMove (data) {
  return fetch({
    url: `/modeltree/frameMove`,
    method: 'post',
    data
  })
}