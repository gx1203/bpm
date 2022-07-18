import { fetch } from '@/bpm/utils'

// 培训统计部分
export function getTrained(data) {
  return fetch({
    url: '/listrelease/trainFlowCountCopy',
    method: 'post',
    data
  })
}
export function getProcessIframeTree(id) {
  return fetch({
    url: '/modeltree/getTreeNodeWithoutAuthCopy/' + id,
    method: 'post'
  })
}

export function searchProcessIframeTree(data) {
  return fetch({
    url: '/modeltree/getTreeNodeByNameWithoutAuthCopy',
    method: 'post',
    data
  })
}
export function exportTrained(data) {
  return fetch({
    url: '/analytical/exportAnalyticTrainDetailData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 培训统计-流程列表
export function getTrainedprocess(data) {
  return fetch({
    url: '/analytical/analyticTrainDetailDataCopy',
    method: 'post',
    data
  })
}
// 超期部分
export function getExceed(data) {
  return fetch({
    url: '/analytical/analyticTimeDataCopy',
    method: 'post',
    data
  })
}

export function exportExceed(data) {
  return fetch({
    url: '/analytical/exportAnalyticTimeData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 最近发布流程
export function getPblish(data) {
  return fetch({
    url: '/analytical/analyticalDataCopy',
    method: 'post',
    data
  })
}

export function exportpblish(data) {
  return fetch({
    url: '/analytical/exportAnalyticalData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function exportpblishnode(data) {
  return fetch({
    url: '/analytical/exportAnalyticalNodeData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 审批效率
export function getRate(data) {
  return fetch({
    url: '/analytical/analyticEfficiencyDataCopy',
    method: 'post',
    data
  })
}
export function getRatedetail(data) {
  return fetch({
    url: '/analytical/analyticEfficiencyDetailDataCopy',
    method: 'post',
    data
  })
}

export function exportRate(data) {
  return fetch({
    url: '/analytical/exportAnalyticEfficiencyData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 获取BPA关键指标
export function getBpaNum(data) {
  return fetch({
    url: '/bpa/num/info?' + data,
    method: 'get'
  })
}
// 获取BPA关键指标
export function getBpaTree(data) {
  return fetch({
    url: '/bpa/tree',
    method: 'post',
    data
  })
}
// 获取BPA关键指标
export function getOneFrameworkList(data) {
  return fetch({
    url: '/bpa/getOneFrameworkList',
    method: 'post',
    data
  })
}
// 获取BPA岗位参与情况Top10
export function getPositionParticipation(data) {
  return fetch({
    url: '/fbcpospar/getPositionParticipation?' + data,
    method: 'get'
  })
}
// 获取BPA岗位参与情况Top10详情
export function getPositionParticipationDetail(data) {
  return fetch({
    url: '/fbcpospar/getPositionParticipationDetail?' + data,
    method: 'get'
  })
}
// 获取BPA流程发布情况详情
export function getFlowInfo(data) {
  return fetch({
    url: '/bpa/flow/info?' + data,
    method: 'get'
  })
}
// 流程发布导出 excel
export function exportProcessReleaseDetailData(data) {
  return fetch({
    url: '/fbcproread/exportProcessReleaseDetailData?' + data,
    method: 'post',
    responseType: 'blob',
    loading: false
  })
}
// 获取BPA流程阅读量
export function getProcessReadingDetail(data) {
  return fetch({
    url: '/fbcproread/getProcessReadingDetail?' + data
  })
}
// 获取BPA流程阅读量
export function getProcessFlow(data) {
  return fetch({
    url: '/bpa/flow/info?' + data,
    method: 'get'
  })
}
// 获取BPA流程发布情况详情
export function getProcessDetail(data) {
  return fetch({
    url: '/bpa/num/detail',
    method: 'post',
    data
  })
}
// 获取本周发布流程数
export function getNewProcessNumRate(data) {
  return fetch({
    url: '/fbcproread/getNewProcessNumRate?' + data,
    method: 'get'
  })
}
// 获取本周更新流程数
export function getUpdateProcessNumRate(data) {
  return fetch({
    url: '/fbcproread/getUpdateProcessNumRate?' + data,
    method: 'get'
  })
}
// 获取流程框架
export function getModel(data) {
  return fetch({
    url: '/process/analysis/getProcessModel',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 获取运行实例数据
export function getOperationList(data) {
  return fetch({
    url: '/process/analysis/instanceStatistical',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 获取流程列表
export function getProcessList(data) {
  return fetch({
    url: '/process/analysis/queryProcess',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 获取关键指标数
export function getKeyList(data) {
  return fetch({
    url: '/process/analysis/getPivotalTarget',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 获取任务效率分析基本数据(按部门)
export function getTaskEfficiencyDept(data) {
  return fetch({
    url: '/process/taskefficiency/getTaskEfficiencyDept',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 查询任务效率分析图表数据(按部门)
export function queryTaskEfficiencyDeptChart(data) {
  return fetch({
    url: '/process/taskefficiency/queryTaskEfficiencyDeptChart',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 查询任务效率分析图表数据(按部门)
export function queryTaskEfficiencyDeptTable(data) {
  return fetch({
    url: '/process/taskefficiency/queryTaskEfficiencyDeptTable',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 查询部门信息
export function getAllDepartment(data) {
  return fetch({
    url: '/org/fbc/queryTree',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 获取任务效率分析基本数据(按流程)
export function getTaskEfficiencyProcess(data) {
  return fetch({
    url: '/process/taskefficiency/getTaskEfficiencyProcess',
    method: 'post',
    type: 'bpm',
    data
  })
}
// 查询任务效率分析图表数据(按流程)
export function queryTaskEfficiencyProcessChart(data) {
  return fetch({
    url: '/process/taskefficiency/queryTaskEfficiencyProcessChart',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 查询任务效率分析图表数据(按部门)
export function queryTaskEfficiencyProcessTable(data) {
  return fetch({
    url: '/process/taskefficiency/queryTaskEfficiencyProcessTable',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 流程发起数排名
export function getProcessRank(data) {
  return fetch({
    url: '/process/analysis/processApplyRanking',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 流程平均审批时长
export function getProcessAverageTime(data) {
  return fetch({
    url: '/process/analysis/processAverageTime',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 岗位平均审批时长
export function getPostAverageTime(data) {
  return fetch({
    url: '/process/analysis/postProcessAverageTime',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 岗位数据 excel
export function exportPositionParticipationDetailData(data) {
  return fetch({
    url: '/fbcpospar/exportPositionParticipationDetailData',
    method: 'post',
    data,
    responseType: 'blob',
    loading: false
  })
}

// 岗位参与审批的流程数排名
export function getPostProcessRank(data) {
  return fetch({
    url: '/process/analysis/postProcessRanking',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 岗位累计处理数量
export function getPostApprovalCount(data) {
  return fetch({
    url: '/process/analysis/postProcessApprovalCount',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 指定岗位流程的平均处理时长排名接口
export function getPostAverage(data) {
  return fetch({
    url: '/process/analysis/postAverageTime',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 流程发起数排名导出接口
export function getExportProcessApplyRanking(data) {
  return fetch({
    url: '/process/analysis/exportProcessApplyRanking',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 岗位参与审批的流程数排名
export function getExportPostProcessRanking(data) {
  return fetch({
    url: '/process/analysis/exportPostProcessRanking',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 平均处理时长排名
export function getExportPostAverageTime(data) {
  return fetch({
    url: '/process/analysis/exportPostAverageTime',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 报表分析-任务效率分析表（按部门）
export function getExportTaskEfficiencyDeptTable(data) {
  return fetch({
    url: '/process/taskefficiency/exportTaskEfficiencyDeptTable',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 报表分析-任务效率分析表（按流程）
export function getExportTaskEfficiencyProcessTable(data) {
  return fetch({
    url: '/process/taskefficiency/exportTaskEfficiencyProcessTable',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 查询一级价值链
export function getChainlist (data) {
  return fetch({
    url: '/modellistjsonname/query',
    method: 'post',
    data
  })
}

// 增加一级价值链
export function newChain (data) {
  return fetch({
    url: '/modellistjsonname/save',
    method: 'post',
    data
  })
}

// 删除一级价值链
export function deleteChain(data) {
  return fetch({
    url: '/modellistjsonname/delete/' + data,
    method: 'get'
  })
}
// 查询一级价值链下的画图数据
export function getProcessChart (data) {
  return fetch({
    url: '/modellistjson/ZCGetJson/' + data.id + '/' + data.state,
    method: 'get'
  })
}

// 保存一级价值链下的画图数据
export function saveStageProcess (data) {
  return fetch({
    url: '/modellistjson/ZCSave',
    method: 'post',
    data
  })
}

// 发布画图数据
export function publishChain (data) {
  return fetch({
    url: '/modellistjson/ZCRelease/' + data,
    method: 'get'
  })
}
