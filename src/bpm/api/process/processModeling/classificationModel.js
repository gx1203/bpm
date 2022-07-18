import { fetch } from '@/bpm/utils'
// 获取流程版本
export function getProcessVersionList(data) {
  return fetch({
    url: '/bpm/processversion/query',
    method: 'POST',
    data
  })
}
// 获取流程版本
export function getNodeTypeListByProcessId(id) {
  return fetch({
    url: `/bpm/processnodetype/getNodeTypeListByProcessId/${id}`,
    method: 'POST'
  })
}

// 获取模型流程信息
export function getProcessModeData(data) {
  return fetch({
    url: '/processNodeConfig/getProcessModeData',
    method: 'POST',
    data
  })
}

// 修改模型流程信息
export function updateProcess(data) {
  return fetch({
    url: '/processNodeConfig/updateProcess',
    method: 'POST',
    data
  })
}

// 获取流程模型节点
export function getProcessConfigNode(data) {
  return fetch({
    url: '/processNodeConfig/getProcessConfigNode',
    method: 'POST',
    data
  })
}

// 保存流程模型节点下一个节点
export function saveNextNodeId(data) {
  return fetch({
    url: '/processNodeConfig/saveNextNodeId',
    method: 'POST',
    data
  })
}

// 获取流程模型节点下一个节点
export function getProcessNextNodeId(data) {
  return fetch({
    url: '/processNodeConfig/getProcessNextNodeId',
    method: 'POST',
    data
  })
}

// 获取模型流程重要节点详情
export function getProcessImportantNodeDatas(data) {
  return fetch({
    url: '/processNodeConfig/getProcessImportantNodeDatas',
    method: 'POST',
    data
  })
}

// 修改模型流程重要节点信息
export function updateProcessImportantNode(data) {
  return fetch({
    url: '/processNodeConfig/updateProcessImportantNode',
    method: 'POST',
    data
  })
}

// 获取流程模型可退回节点
export function getProcessConfigBackNode(data) {
  return fetch({
    url: '/processNodeConfig/getProcessConfigBackNode',
    method: 'POST',
    data
  })
}

// 保存流程模型返回节点
export function aveBackNodeId(data) {
  return fetch({
    url: '/processNodeConfig/saveBackNodeId',
    method: 'POST',
    data
  })
}

// 获取模型流程节点详情
export function getProcessNodeData(data) {
  return fetch({
    url: '/processNodeConfig/getProcessNodeData',
    method: 'POST',
    data
  })
}

// 修改模型流程节点信息
export function updateProcessNode(data) {
  return fetch({
    url: '/processNodeConfig/updateProcessNode',
    method: 'POST',
    data
  })
}

// 获取模型流程节点tab详情
export function getProcessNodeTab(data) {
  return fetch({
    url: '/processNodeConfig/getProcessNodeTab',
    method: 'POST',
    data
  })
}

// 保存模型流程节点tab详情
export function saveProcessNodeTab(data) {
  return fetch({
    url: '/processNodeConfig/saveProcessNodeTab',
    method: 'POST',
    data
  })
}

// 删除模型流程节点配置tab
export function deleteProcessNodeTab(data) {
  return fetch({
    url: '/processNodeConfig/deleteProcessNodeTab',
    method: 'POST',
    data
  })
}

// 获取模型流程节点审批类型配置
export function getProcessApproval(data) {
  return fetch({
    url: '/processNodeConfig/getProcessApproval',
    method: 'POST',
    data
  })
}

// 保存模型流程节点审批类型配置
export function saveApprovalType(data) {
  return fetch({
    url: '/processNodeConfig/saveApprovalType',
    method: 'POST',
    data
  })
}

// 获取模型配置tab字段列表
export function getProcessNodeTable(data) {
  return fetch({
    url: '/processNodeConfig/getProcessNodeTable',
    method: 'POST',
    data
  })
}

// 保存模型流程节点tab页字段
export function saveProcessNodeTable(data) {
  return fetch({
    url: '/processNodeConfig/saveProcessNodeTable',
    method: 'POST',
    data
  })
}

// 删除模型流程节点tab页字段
export function deleteProcessNodeTable(data) {
  return fetch({
    url: '/processNodeConfig/deleteProcessNodeTable',
    method: 'POST',
    data
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

// 配置字段权限获取数据
export function getProcessFieldConfig(id, params) {
  return fetch({
    url: `/processNodeConfig/getProcessFieldConfig/${id}`,
    method: 'GET',
    params
  })
}

// 配置区域权限获取数据
export function getProcessTabConfig(id, params) {
  return fetch({
    url: `/processNodeConfig/getProcessTabConfig/${id}`,
    method: 'GET',
    params
  })
}

// 保存配置字段的权限
export function saveProcessField(data) {
  return fetch({
    url: '/processNodeConfig/saveProcessField',
    method: 'POST',
    data
  })
}

// 保存流程区域权限
export function saveProcessTab(data) {
  return fetch({
    url: '/processNodeConfig/saveProcessTab',
    method: 'POST',
    data
  })
}

// 初始化生成库
export function initDataSourceColumn(data) {
  return fetch({
    url: '/processNodeConfig/initDataSourceColumn',
    method: 'POST',
    data
  })
}

// 获取下拉选项
export function getOptions(id) {
  return fetch({
    url: `/processNodeOption/getOptions/${id}`,
    method: 'GET'
  })
}

// 保存下拉选项
export function saveNodeOption(data) {
  return fetch({
    url: '/processNodeOption/saveNodeOption',
    method: 'POST',
    data
  })
}

// 获取所有的职能分类
export function getAllFunction() {
  return fetch({
    url: `/modelFunctions/getAllFunction`,
    method: 'GET'
  })
}

// 检查字段名是否为关键字
export function checkFieldKey(fieldname) {
  return fetch({
    url: `/processNodeConfig/checkFieldKey/${fieldname}`,
    method: 'GET'
  })
}

// 获取tab树结构
export function getTabTree(id, params) {
  return fetch({
    url: `/processNodeConfig/getTabTree/${id}`,
    method: 'GET',
    params
  })
}

// 更换字段所在tab页
export function updateTableToTab(data) {
  return fetch({
    url: '/processNodeConfig/updateTableToTab',
    method: 'POST',
    data
  })
}

// 清空流程配置
export function clearProcessConfigData(id, params) {
  return fetch({
    url: `/processNodeConfig/clearProcessConfigData/${id}`,
    method: 'GET',
    params
  })
}

// 选人组件配置保存接口
export function saveSelectOrg(data) {
  return fetch({
    url: '/processNodeConfig/saveSelectOrg',
    method: 'POST',
    data
  })
}

// 选人组件配置查询接口
export function getNodeOrgs(id) {
  return fetch({
    url: `/processNodeConfig/getNodeOrgs/${id}`,
    method: 'GET'
  })
}

// 选人组件 流程发起表单查询接口
export function getFormNodeOrgs(data) {
  return fetch({
    url: `/processNodeConfig/getFormNodeOrgs?id=${data.id}&postId=${data.postId}`,
    method: 'GET'
  })
}

// 根据表名查询列字段信息接口
export function getTableColumn(params) {
  return fetch({
    url: `/processNodeConfig/getTableColumn`,
    method: 'GET',
    params
  })
}

// 点开配置弹框数据查询（回显接口）
export function getNodeColumnsByNodeTableId(params) {
  return fetch({
    url: `/processNodeConfig/getNodeColumnsByNodeTableId`,
    method: 'GET',
    params
  })
}

// 弹框页面展示接口
export function getTableData(data) {
  return fetch({
    url: '/processNodeConfig/getTableData',
    method: 'POST',
    data
  })
}

// 获取所有流程表单字段
export function getAllTablesByNodeId(nodeid) {
  return fetch({
    url: `/processNodeConfig/getAllTablesByNodeId/${nodeid}`,
    method: 'GET'
  })
}

// 保存超时任务提醒配置
export function batchSave(processnodeid, data) {
  return fetch({
    url: `/processNodeConfig/fns/batchSave/${processnodeid}`,
    method: 'POST',
    data
  })
}

// 提醒列表查询
export function queryProcessNodeConfig(data) {
  return fetch({
    url: '/processNodeConfig/fns/query',
    method: 'POST',
    data
  })
}

// 保存节点提醒配置
export function saveProcessNodeConfig(data) {
  return fetch({
    url: '/processNodeConfig/fns/save',
    method: 'POST',
    data
  })
}

// 单个刪除提醒
export function deleteProcessNodeConfig(id) {
  return fetch({
    url: `/processNodeConfig/fns/delete/${id}`,
    method: 'DELETE'
  })
}

// 流程查询接口
export function queryProcessList(data) {
  return fetch({
    url: `/processNodeConfig/queryProcessList`,
    method: 'POST',
    data
  })
}

// 表单点击流程单据组件弹框数据查询接口
export function queryProcessIntance(data) {
  return fetch({
    url: `/processNodeConfig/queryProcessIntance`,
    method: 'POST',
    data
  })
}

export function queryProcessName(instanceId) {
  return fetch({
    url: `/processNodeConfig/queryProcessName/${instanceId}`,
    method: 'GET'
  })
}

// 查询服务配置列表接口
export function queryEsbServiceConfig(data) {
  return fetch({
    url: `/bpm/process/bpm2esb/queryConfig`,
    method: 'POST',
    data
  })
}

// 保存节点服务配置
export function saveEsbServiceConfig(data) {
  return fetch({
    url: `/bpm/process/bpm2esb/saveConfig`,
    method: 'POST',
    data
  })
}

// 获取ESB服务列表
export function getEsbServiceList(data) {
  return fetch({
    url: `/bpm/process/bpm2esb/getEsbServiceList`,
    method: 'POST',
    data
  })
}

// 获取ESB服务详情
export function getEsbServiceInfo(id) {
  return fetch({
    url: `/bpm/process/bpm2esb/getEsbServiceInfo/${id}`,
    method: 'GET'
  })
}

// 删除节点服务配置
export function deleteEsbServiceConfig(ids) {
  return fetch({
    url: `/bpm/process/bpm2esb/deleteConfig/${ids}`,
    method: 'DELETE'
  })
}

// 获取文件权限
export function getProcessFileFieldConfig(ids, params) {
  return fetch({
    url: `/processNodeConfig/getProcessFileFieldConfig/${ids}`,
    method: 'GET',
    params
  })
}

// 保存文件权限
export function saveProcessFileField(data) {
  return fetch({
    url: `/processNodeConfig/saveProcessFileField`,
    method: 'POST',
    data
  })
}

// 获取发布环境列表  
export function releaseProcessData() {
  return fetch({
    url: `/processMigrate/getEnvList`,
    method: 'GET'
  })
}

// 一键发布
export function deployReleaseProcessData(data) {
  return fetch({
    url: `/processMigrate/deploy`,
    method: 'POST',
    data
  })
}














