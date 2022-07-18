import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
  .empuid
export function getBooksList(data) {
  return fetch({
    url: '/regulation/queryCopy?username=' + username,
    method: 'post',
    data
  })
}
export function saveBooks(data) {
  return fetch({
    url: '/regulation/save2Copy',
    method: 'post',
    data
  })
}
export function deleteBooks(id) {
  return fetch({
    url: '/regulation/deleteByIdCopy',
    method: 'post',
    data: {
      id
    }
  })
}
export function getDetails(id) {
  return fetch({
    url: '/regulation/queryDocInfoCopy/' + id,
    method: 'get'
  })
}

// 发布拒绝跳转接口
export function pblishRefuse(data) {
  return fetch({
    url: '/regulationBpm/getBpmUrl',
    method: 'post',
    data
  })
}

// 获取体系分类
export function getSystem(data) {
  return fetch({
    url: '/systemClassify/querySystemClassify',
    method: 'post',
    data
  })
}

// 获取规章制度树
export function getRuleIframeTree(data) {
  return fetch({
    url: '/regulation/getRegulationFolderCopy/' + data,
    method: 'get'
  })
}

// 查询章节
export function queryChapters(docid) {
  return fetch({
    url: `/regulation/queryChapters/${docid}`,
    method: 'get'
  })
}

// 获取体系条款
export function getSystemClause(data) {
  return fetch({
    url: '/regulation/getSystemClause/' + data,
    method: 'get'
  })
}
// 保存
export function systemClauseSave(data) {
  return fetch({
    url: '/systemClause/save',
    method: 'post',
    data
  })
}
// 查询当前流程当前体系下已选的条款
export function getSystemQueryCopy(data) {
  return fetch({
    url: '/systemClause/query',
    method: 'post',
    data
  })
}
// 列表
export function getSystemClauseList(data) {
  return fetch({
    url: '/systemClause/query',
    method: 'post',
    data
  })
}
// 列表
export function systemClauseDelete(data) {
  return fetch({
    url: '/systemClause/delete',
    method: 'post',
    data
  })
}
//
export function getQueryClause(data) {
  return fetch({
    url: '/systemClause/queryClause',
    method: 'post',
    data
  })
}
// // 获取流程卡片规章制度章节树
// regulation/getSystemFolderCopy
export function getSystemFolderCopy(data) {
  return fetch({
    url: '/regulation/getSystemFolderCopy/' + data,
    method: 'get'
  })
}
// 根据制度ID获取数据
export function getFolderListById(id) {
  return fetch({
    url: '/modelDmRele/getFolderListById/' + id,
    method: 'get'
  })
}
// 作废标准
export function getReleasedelList(data) {
  return fetch({
    url: '/regulation/queryReleasedel',
    method: 'post',
    data
  })
}
// 制度查看
export function queryReleasedCopy(data) {
  return fetch({
    url: '/regulation/queryReleasedCopy',
    method: 'post',
    data
  })
}
// 保存规章制度
export function queryFolderTreeOperateLog(data) {
  return fetch({
    url: '/foldertree/queryOperateLog',
    method: 'post',
    data
  })
}

//
export function saveDmInfomation(data) {
  return fetch({
    url: '/dmInfomation/save',
    method: 'post',
    data
  })
}

export function getDmInfomation(id) {
  return fetch({
    url: `/dmInfomation/get/${id}`,
    method: 'get'
  })
}

export function deleteDmInfomation(id) {
  return fetch({
    url: `/dmInfomation/delete/${id}`,
    method: 'delete'
  })
}

export function queryDmInfomationList(data) {
  return fetch({
    url: `/dmInfomation/page`,
    method: 'post',
    data
  })
}

// 制度支持文件 新增/编辑
export function saveDmDoc(data) {
  return fetch({
    url: `/dmDoc/save`,
    method: 'post',
    data
  })
}

// 制度支持文件 详情
export function getDmDoc(id) {
  return fetch({
    url: `/dmDoc/get/${id}`,
    method: 'get'
  })
}

export function deleteDmDoc(id) {
  return fetch({
    url: `/dmDoc/delete/${id}`,
    method: 'delete'
  })
}

export function queryDmDocList(data) {
  return fetch({
    url: `/dmDoc/page`,
    method: 'post',
    data
  })
}

// 请求企业标准的顶级id
export function queryEnterpriseStandardFolderTreeId() {
  return fetch({
    url: `/service/queryEnterpriseStandardFolderTreeId`,
    method: 'get'
  })
}

// 在线编辑
export function saveOnlineEdit(fileId) {
  return fetch({
    url: `/pageOffice/onlineEdit/save/${fileId}`,
    method: 'get'
  })
}

// 在线编辑 获取id
export function getRegulationById(id) {
  return fetch({
    url: `/regulation/getById/${id}`,
    method: 'get'
  })
}

// 重置tempfileid
export function resetTempfileId(id) {
  return fetch({
    url: `/regulation/resetTempfileId/${id}`,
    method: 'get'
  })
}

// 制度内容管理办法
export function manageContentMethods(dmId) {
  return fetch({
    url: `/modelInstitutionContent/queryByDmId/${dmId}`,
    method: 'get'
  })
}

// 评审意见
export function getReviewComments(docId) {
  return fetch({
    url: `/regulation/queryReviewComments/${docId}`,
    method: 'get'
  })
}

// 征求意见的接口
export function getReviewCommentsStart(docId) {
  return fetch({
    url: `/regulation/started/${docId}`,
    method: 'get'
  })
}

// 获取流程详情
export function getProcessDetails(data) {
  return fetch({
    url: '/regulation/queryListInfo',
    method: 'post',
    data
  })
}

// 根据制度id获取关联流程列表
export function getRelationalProcessList(docId) {
  return fetch({
    url: `/regulation/queryListInfoCopy/${docId}`
  })
}

// 保存制度关联流程id
export function saveRelationalProcessIds(data) {
  return fetch({
    url: `/regulation/saveProcessid`,
    method: 'post',
    data
  })
}

// 调用接口通知制度关联流程责任人
export function noticeRelationalProcessManagers(docId) {
  return fetch({
    url: `/noticeo/sendEmail/${docId}`,
    method: 'post'
  })
}