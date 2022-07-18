import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getCommunityList (data,staus) {
  return fetch({
    url: `/listrelease/queryCopy/${staus}`,
    method: 'post',
    data
  })
}
// 查询流程版本
export function getCommunityhistoryList (data) {
  return fetch({
    url: '/listrelease/queryReleaseCopy',
    method: 'post',
    data
  })
}

export function getRelease (data) {
  return fetch({
    url: '/listrelease/Copy?username=' + username,
    method: 'post',
    data
  })
}
export function getRecords (id) {
  return fetch({
    url: '/processDuration/selectByProcessCardCopy/' + id,
    method: 'get'
  })
}
export function getProcessProps (id) {
  return fetch({
    url: '/modellist/getByReleaseidCopy/' + id,
    method: 'post'
  })
}
export function getProcessProps2 (data, type) {
  return fetch({
    url: `/listrelease/queryCopy/${type}`,
    method: 'post',
    data
  })
}
export function queryComment (data) {
  return fetch({
    url: '/listcomment/queryCommentCopy',
    method: 'post',
    data
  })
}
export function getWordJpg (data) {
  return fetch({
    url: '/html2jpg/getWordJpgCopy',
    method: 'post',
    data
  })
}
export function getRecentPublished (data, type) {
  return fetch({
    url: `/listrelease/queryCopy/${type}`,
    method: 'post',
    data
  })
}
export function saveComment (data) {
  return fetch({
    url: '/listcomment/saveCommentCopy',
    method: 'post',
    data
  })
}
export function saveCommentReply (data) {
  return fetch({
    url: '/listcomment/saveCommentReplyCopy',
    method: 'post',
    data
  })
}
export function deleteComment (id) {
  return fetch({
    url: '/listcomment/deleteCommentCopy/' + id,
    method: 'post'
  })
}
export function deleteCommentReply (id) {
  return fetch({
    url: '/listcomment/deleteCommentReplyCopy/' + id,
    method: 'post'
  })
}
// 取消点赞
export function badAction (id) {
  return fetch({
    url: '/listrelease/badActionCopy/' + id,
    method: 'post'
  })
}
// 点赞
export function goodAction (id) {
  return fetch({
    url: '/listrelease/goodActionCopy/' + id,
    method: 'post'
  })
}

// 查看流程文档
export function viewProcessDoc (data) {
  return fetch({
    url: '/importWord/word2pdfCopy',
    method: 'post',
    data
  })
}

// 获取流程文件
export function getImportWord (data) {
  return fetch({
    url: '/importWord/importCopy',
    method: 'post',
    data
  })
}
// 获取流程文档
export function getProcessDoc (data) {
  return fetch({
    url: '/modellistdoc/queryCopy',
    method: 'post',
    data
  })
}

// 添加查看数目
export function addComments (id) {
  return fetch({
    url: '/listrelease/addBrowsernumCopy/' + id,
    method: 'post'
  })
}

// 查询已作废流程历史版本
export function getRecentabolished1 (data) {
  return fetch({
    url: 'listrelease/queryReleasedel',
    method: 'post',
    data
  })
}

// 作废
export function getRecentabolished (data) {
  return fetch({
    url: '/listrelease/queryReleasedelCopy',
    method: 'post',
    data
  })
}

// 预览文件
export function PreviewFile (id) {
  return fetch({
    url: '/document/print/' + id,
    method: 'post'
  })
}

// 节点
export function getNodeByListid2 (listid) {
  return fetch({
    url: `/modellist/getNodeByListid2/${listid}`,
    method: 'get'
  })
}


// 业务对象
export function getBoByListAndKey (listid,keyid) {
  return fetch({
    url: `/repositorybo/getBoByListAndKey/${listid}/${keyid}`,
    method: 'get'
  })
}
