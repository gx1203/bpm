import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid

export function getWhetherDelete (id) {
  return fetch({
    url: '/modeltree/queryWhetherDelete/' + id,
    method: 'get'
  })
}
export function getGroupTreeList (data) {
  return fetch({
    url: '/select/user/cqp/getTotalOrg1Copy',
    method: 'post',
    data
  })
}
export function getRuleList (id) {
  return fetch({
    url: '/service/getProcessRuleData/' + id,
    method: 'get'
  })
}

// 根据字典名称code获取字典值
export function getDictionaryOption(params) {
  return fetch({
    url: '/datadictionary/getDictionaryOption',
    method: 'GET',
    params
  })
}

export function getUserList (data) {
  return fetch({
    url: '/portalorg/querytOrgUserCopy',
    method: 'post',
    data
  })
}

// export function getProcessIframeTree (id) {
//   return fetch({
//     url: '/modeltree/getTreeNodeWithoutAuthCopy/' + id,
//     method: 'post'
//   })
// }
export function getProcessIframeTree(id, type) {
  return fetch({
    url: `/modeltree/getTreeNodeByTypeNew/${id}/${type || 'rulemanagement'}`,
    method: 'post'
  })
}

export function getAuthTreeNode (id) {
  return fetch({
    url: '/modeltree/getAuthTreeNode/' + id,
    method: 'get'
  })
}
export function getLastReleaseByModelid (id) {
  return fetch({
    url: '/modellist/getLastReleaseByModelid/' + id,
    method: 'get'
  })
}
export function queryRoomDetails (id) {
  return fetch({
    url: '/modeltree/queryRoomDetails/' + id,
    method: 'get'
  })
}

export function searchProcessIframeTreeNew (data) {
  return fetch({
    url: '/modeltree/queryTreeByNamee/' + data,
    method: 'get'
  })
}

export function searchProcessIframeTree (data) {
  return fetch({
    url: '/modeltree/getTreeNodeByNameWithoutAuthCopy',
    method: 'post',
    data
  })
}

export function searchProcessIframeTree1(data) {
  return fetch({
    url: '/modeltree/getTreeNodeByNameAndType',
    method: 'post',
    data
  })
}

export function getProcessTreeNodeCode (id) {
  return fetch({
    url: '/modeltree/getOrderCodeCopy/' + id,
    method: 'post'
  })
}
// 企业流程架构-保存新建
export function getProcessTreesave (data) {
  return fetch({
    url: '/modeltree/saveProCopy',
    method: 'post',
    data
  })
}
// 企业流程架构-保存新建+需要打开bpm
export function getProcessTreesaveT (data) {
  return fetch({
    url: '/modeltree/save',
    method: 'post',
    data
  })
}
// 企业流程架构-保存更新
export function getProcessTreeupdate (data) {
  return fetch({
    url: '/modeltree/updateProCopy',
    method: 'post',
    data
  })
}
// 企业流程架构-保存更新+需要打开bpm
export function getProcessTreeupdateT (data) {
  return fetch({
    url: '/modeltree/update',
    method: 'post',
    data
  })
}
// 企业流程架构-查询需要更新的组织的流程责任人
export function getProcessTreeofprincipal (id) {
  return fetch({
    url: '/modeltree/getTreeCopy/' + id,
    method: 'post'
  })
}
// 企业流程架构-删除
export function getProcessTreedelete (id) {
  return fetch({
    url: '/modeltree/deleteCopy/' + id,
    method: 'post'
  })
}
export function fileUploadStep2 (data) {
  return fetch({
    url: '/mangercenterdoc/saveruleCopy?username=' + username,
    method: 'post',
    data
  })
}
// 角色列表
export function rolelist (data) {
  return fetch({
    url: '/portalmenu/queryWithoutRelatedRoleCopy',
    method: 'post',
    data
  })
}

// 按钮菜单列表
export function getButtonList (data) {
  return fetch({
    url: '/button/query',
    method: 'post',
    data
  })
}
// 按钮菜单列表
export function dictionaryQuery (data) {
  return fetch({
    url: '/dictionary/query',
    method: 'post',
    data
  })
}

// 按钮菜单添加
export function ButtonSave (data) {
  return fetch({
    url: '/button/save',
    method: 'post',
    data
  })
}

// 按钮菜单删除
export function ButtonDelete (id) {
  return fetch({
    url: '/button/delete/' + id,
    method: 'get'
  })
}

// 流程框架中的流程层级的type
export function getProcessLevel (data) {
  return fetch({
    url: '/modeltree/queryTreeType',
    method: 'get',
    data
  })
}

// 流程框架权限管理中的点击添加组织人员按钮
export function addOrganization (id) {
  return fetch({
    url: `/modeltreeauthority/queryWithoutOrg/` + id,
    method: 'get'
  })
}

// 流程框架权限管理中的点击添加角色按钮按钮
export function addRole (id) {
  return fetch({
    url: `/modeltreeauthority/queryWithoutRole/` + id,
    method: 'get'
  })
}

// 获取显示的流程框架
export function requireOrgData (id) {
  return fetch({
    url: `/listhistory/queryModelTrees`,
    method: 'get'
  })
}

// 获取显示的流程框架
export function queryModelTrees (id) {
  return fetch({
    url: `/modeltree/queryModelTrees/${id}`,
    method: 'get'
  })
}

// http://127.0.0.1:8043/bpa/listhistory/queryModelTreesAndRegulations?username=00041956
// 获取显示的流程框架（带规章制度）
export function queryModelTreesAndRegulations () {
  return fetch({
    url: `/listhistory/queryModelTreesAndRegulations?username=00041956`,
    method: 'get'
  })
}

export function requireChecked (id) {
  return fetch({
    url: `/modeltreeauthority/queryWithOrgid/${id}`,
    method: 'get'
  })
}

// 流程卡片的权限执行表获取数据接口
export function getPermissionTableList (data) {
  return fetch({
    url: '/modellist/QueryProcessList',
    method: 'post',
    data
  })
}

// 流程卡片的相关性支撑内容-修编制度获取数据接口
export function getRevisionSystemList (data) {
  return fetch({
    url: '/modellist/QueryMessageList',
    method: 'post',
    data
  })
}

// 朗基-首页流程框架图-获取业务流程
export function getYewuDate (data) {
  return fetch({
    url: '/modeltree/queryTreeBusinessByid/' + data,
    method: 'GET'
  })
}

// 朗基-首页流程框架图-获取管理流程
export function getGuanliDate (data) {
  return fetch({
    url: '/modeltree/queryTreeAdministrationByid/' + data,
    method: 'GET'
  })
}

// 获取是否跳转流程框架权限
export function modelapproveget (data) {
  return fetch({
    url: `/modelapprove/get/${data}`,
    method: 'GET'
  })
}

// 朗基-首页流程框架图-获取管理流程componentsApi
export function getDownloadAuthByModelId (modelId,userId) {
  return fetch({
    url: `/wdqxsp/getDownloadAuthByModelId/${modelId}/${userId}`,
    method: 'GET'
  })
}

export const fileUploadUrl = `${process.env.VUE_APP_BPA_HOST_URL + process.env.VUE_APP_BPA_BASE_URL}/mangercenterdoc/uploadCopy?username=${username}`
