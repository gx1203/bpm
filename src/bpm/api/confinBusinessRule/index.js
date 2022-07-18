import { fetch } from '@/bpm/utils'
// 业务规则树
export function getBrTree (data) {
  return fetch({
    url: '/businessRuleManage/getBrTree',
    method: 'POST',
    data
  })
}
// 流程规则管理列表
export function queryList (data) {
  return fetch({
    url: '/businessRuleManage/queryList',
    method: 'POST',
    data
  })
}
// 保存规则树
export function saveBtType (data) {
  return fetch({
    url: '/businessRuleManage/saveBtType',
    method: 'POST',
    data
  })
}
// 根据ID删除规则树
export function deleteControl (id) {
  return fetch({
    url: `/businessRuleManage/dele/${id}`,
    method: 'DELETE'
  })
}
// 业务规则详情
export function getBusinessRuleDetail (data) {
  return fetch({
    url: '/businessRuleManage/getBusinessRuleDetail',
    method: 'POST',
    data
  })
}
// 保存业务规则
export function saveBusinessRule (data) {
  return fetch({
    url: '/businessRuleManage/saveBusinessRule',
    method: 'POST',
    data
  })
}
// 复制业务规则
export function duplicateRule (data) {
  return fetch({
    url: '/businessRuleManage/duplicateRule',
    method: 'POST',
    data
  })
}
// 业务规则回收站树
export function getBrRecyTree (data) {
  return fetch({
    url: '/businessRuleManage/getBrRecyTree',
    method: 'POST',
    data
  })
}
// 流程规则回收站管理列表
export function queryRecyList (data) {
  return fetch({
    url: '/businessRuleManage/queryRecyList',
    method: 'POST',
    data
  })
}
// 业务规则恢复
export function recoveryBRTree (treeid) {
  return fetch({
    url: `/businessRuleManage/recoveryBRTree/${treeid}`,
    method: 'POST'
  })
}
// 批量删除
export function batchDelete (data) {
  return fetch({
    url: '/businessRuleManage/batchDelete',
    method: 'POST',
    data
  })
}

// 根据流程id,获取节点信息
export function getProcessNodeInfo (processid) {
  return fetch({
    url: `/businessRuleManage/getProcessNodeInfo/${processid}`,
    method: 'GET'
  })
}
// 获取替换数据
export function getReplace (id) {
  return fetch({
    url: `/businessRuleManage/getReplace/${id}`,
    method: 'GET'
  })
}
// 业务规则替换
export function replace (data) {
  return fetch({
    url: '/businessRuleManage/replace',
    method: 'POST',
    data
  })
}
// 删除替换数据
export function deleteReplace (id) {
  return fetch({
    url: `/businessRuleManage/deleteReplace/${id}`,
    method: 'DELETE'
  })
}
// 查询替换列表清单
export function queryReplaceList (data) {
  return fetch({
    url: '/businessRuleManage/queryReplaceList',
    method: 'POST',
    data
  })
}
// 获取特用字段
export function getControlField (processid, params) {
  return fetch({
    url: `/businessRuleManage/getControlField/${processid}`,
    method: 'GET',
    params
  })
}

// 查询应用列表
export function getQueryCopy (data) {
  return fetch({
    url: '/application/queryCopy',
    method: 'post',
    data
  })
}

// 新增应用
export function addApplication(data) {
  return fetch({
    url: '/application/save',
    method: 'post',
    data
  })
}

// 删除应用
export function delApplication(data) {
  return fetch({
    url: '/application/delete/' + data,
    method: 'delete'
  })
}

// 删除应用
export function businessRuleManageimport(processId) {
  return fetch({
    url: `/businessRuleManage/import-brs/${processId}`,
    method: 'psot'
  })
}
