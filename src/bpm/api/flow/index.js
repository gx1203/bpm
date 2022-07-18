import {
  fetch
} from '@/bpm/utils'

// 获取组织
export function getFirstOrg(data) {
  return fetch({
    url: '/select/user/cqp/getFirstOrg ',
    method: 'POST',
    data: data
  })
}

// 获取组织
export function getTotalOrg1(data) {
  return fetch({
    url: '/select/user/cqp/getTotalOrg1',
    method: 'POST',
    data: data
  })
}

// 获取人员
export function getDirectUserByOrgid(data) {
  return fetch({
    url: '/select/user/cqp/getDirectUserByOrgid',
    method: 'POST',
    data: data
  })
}
// 获取人员
export function getAllUsersInfo(data) {
  return fetch({
    url: '/select/user/cqp/getAllUsersInfo',
    method: 'POST',
    data: data
  })
}

// 获取流程单详情
export function getFlowDetail(data) {
  return fetch({
    url: '/ffrest/api/createFormJson',
    method: 'POST',
    data: data
  })
}

// 获取  发起页面（申请创建，草稿箱，流程模板等页面） 流程单详情
// export function getStartProcessForm(data, listId, modelid, version) {
//   let listUrl = listId ? `?listId=${listId}` : ''
//   return fetch({
//     url: modelid ? `/bpm/process/v2/start?modelid=${modelid}&version=${version}` : `/bpm/process/v2/start${listUrl}`,
//     method: 'POST',
//     data: data
//   })
// }

// 获取  发起页面（申请创建，草稿箱，流程模板等页面） 流程单详情
export function getStartProcessForm(data, listId, modelid, version,docid) {
  let listUrl = listId ? `?listId=${listId}` : ''
  let docidurl = docid? `?docid=${docid}` : ''
  return fetch({
    url: docidurl? `/bpm/process/v2/start?docid=${docid}` : modelid ? `/bpm/process/v2/start?modelid=${modelid}&version=${version}` : `/bpm/process/v2/start${listUrl}`,
    method: 'POST',
    data: data
  })
}

// 发起流程
export function startProcess(data) {
  return fetch({
    url: '/bpm/process/v2/started',
    method: 'POST',
    data: data
  })
}

// 获取 审批页面 流程单详情
export function getApproveProcessForm(data) {
  return fetch({
    url: '/bpm/process/v2/approve',
    method: 'POST',
    data: data
  })
}

// 审批流程
export function approveProcess(data) {
  return fetch({
    url: '/bpm/process/v2/approved',
    method: 'POST',
    data: data
  })
}

// 获取 查看页面（） 流程单详情
export function getViewProcessForm(data) {
  return fetch({
    url: '/bpm/process/view',
    method: 'POST',
    data: data
  })
}

// 保存草稿
export function saveDraft(data) {
  return fetch({
    url: '/bpm/process/saveDraft',
    method: 'POST',
    data: data
  })
}

// 保存模板
export function saveStencil(data) {
  return fetch({
    url: '/bpm/process/saveStencil',
    method: 'POST',
    data: data
  })
}

// 保存业务数据
export function saveProcess(data) {
  return fetch({
    url: '/bpm/process/save',
    method: 'POST',
    data: data
  })
}

// 下载
export function downloadFile(id) {
  return fetch({
    url: `/attach/download/${id}`,
    method: 'GET'
  })
}

// 获取流程模型分类树结构
export function getModelTree(data) {
  return fetch({
    url: '/processModel/getModelTree',
    method: 'POST',
    data: data
  })
}
// 获取流程分类树结构
export function getProcessBaseTree(data) {
  return fetch({
    url: '/model/getProcessCategoryTree',
    method: 'POST',
    data: data
  })
}

// 获取流程分类树结构
export function getProcessBaseTreeVo(data) {
  return fetch({
    url: '/model/getProcessBaseTreeVo',
    method: 'POST',
    data: data
  })
}

// 获取移动端配置树结构
export function getMobileProcesstTree(data) {
  return fetch({
    url: '/mobileProcessConfig/getProcessConfigTree',
    method: 'POST',
    data: data
  })
}

// 获取获取节点类型树结构
export function getNodeBaseTree(pid) {
  return fetch({
    url: `/bpm/processnodetype/getNodeBaseTree/${pid}`,
    method: 'GET'
  })
}

// 获取审批意见历史记录
export function getApprovalRemark(data) {
  return fetch({
    url: `/bpm/todo/approval-remark`,
    method: 'post',
    data
  })
}

// 保存审批意见历史记录
export function saveApprovalRemark(data) {
  return fetch({
    url: `/bpm/todo/save-approval-remark`,
    method: 'post',
    data
  })
}

// 保存审批意见历史记录
export function batchSaveapprovalRemark(data) {
  return fetch({
    url: `/bpm/todo/BatchSaveapprovalRemark`,
    method: 'post',
    data
  })
}

// 删除审批意见历史记录
export function deleteApprovalRemark(id) {
  return fetch({
    url: `/bpm/todo/delete/${id}`,
    method: 'DELETE'
  })
}

// 刪除收藏
export function deleteCollection(id) {
  return fetch({
    url: `/bpm/collection/delete/${id}`,
    method: 'DELETE'
  })
}

// 根据流程实例id 获取收藏信息
export function getbyinstanceid(id) {
  return fetch({
    url: `/bpm/collection/getbyinstanceid/${id}`,
    method: 'GET'
  })
}

// 保存收藏信息
export function saveCollection(data) {
  return fetch({
    url: `/bpm/collection/save`,
    method: 'post',
    data
  })
}

// 判断流程是否是自定义流程
export function checkProcessDefaultPage(data) {
  return fetch({
    url: `/bpm/process/checkProcessDefaultPage`,
    method: 'POST',
    data
  })
}
// 预审批接口
export function getPreviewApproversList(data) {
  return fetch({
    url: `/bpm/process/preview-approvers`,
    method: 'POST',
    data
  })
}

// 获取弹出框级联数据
export function getInfosByLink(data) {
  return fetch({
    url: `/processNodeConfig/getInfosByLink`,
    method: 'POST',
    data
  })
}

// 获取下拉多选数据
export function getInfosByLinkSimple(data) {
  return fetch({
    url: `/processNodeConfig/getInfosByLinkSimple`,
    method: 'POST',
    data
  })
}

// 获取单选弹框配置的所有关联字段
export function getTableRelationField(id) {
  return fetch({
    url: `/processNodeConfig/getTableRelationField/${id}`,
    method: 'GET'
  })
}

// 获取pageOffice 文档id
export function getDocId(id) {
  return fetch({
    url: `/bpmpo/getDocId`,
    method: 'GET'
  })
}
// 电子签章
export function getSignature(id) {
  return fetch({
    url: `/electronicSignature/signature/${id}`,
    method: 'POST'
  })
}
// 获取电子签章开启状态
export function getJurisdiction(name) {
  return fetch({
    url: `/electronicSignature/getJurisdiction/${name}`,
    method: 'POST'
  })
}
// 获取签章文件ID
export function getSignatureAttachmentId(docId) {
  return fetch({
    url: `/electronicSignature/getSignatureAttachmentId/${docId}`,
    method: 'GET'
  })
}

// 风险 
export function getRiskJson(id) {
  return fetch({
    url: `/listhistory/getMyJsonCopy/${id}`,
    method: 'POST',
  })
}

// 制度  
export function getSystemJson(id) {
  return fetch({
    url: `/modellist/getCopy/${id}`,
    method: 'POST'
  })
}

//申请创建-获取发起节点的风险数据
export function getMyJsonCopyForStart(id) {
  return fetch({
    url: `/listhistory/getMyJsonCopyForStart/${id}`,
    method: 'POST'
  })
}

//审批列表-风险节点
export function getMyJsonCopyForApprove(id, name) {
  return fetch({
    url: `/listhistory/getMyJsonCopyForApprove/${id}/${name}`,
    method: 'POST'
  })
}