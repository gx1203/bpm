// import { fetch } from '@/bpa/utils'
// // 培训统计部分
// export function getTrained(data) {
//   return fetch({
//     url: '/listrelease/trainFlowCountCopy',
//     method: 'post',
//     data
//   })
// }
// export function exportTrained(data) {
//   return fetch({
//     url: '/analytical/exportAnalyticTrainDetailData',
//     method: 'post',
//     data,
//     responseType: 'blob'
//   })
// }
// // 培训统计-流程列表
// export function getTrainedprocess(data) {
//   return fetch({
//     url: '/analytical/analyticTrainDetailDataCopy',
//     method: 'post',
//     data
//   })
// }
// // 超期部分
// export function getExceed(data) {
//   return fetch({
//     url: '/analytical/analyticTimeDataCopy',
//     method: 'post',
//     data
//   })
// }

// export function exportExceed(data) {
//   return fetch({
//     url: '/analytical/exportAnalyticTimeData',
//     method: 'post',
//     data,
//     responseType: 'blob'
//   })
// }

// // 最近发布流程
// export function getPblish(data) {
//   return fetch({
//     url: '/analytical/analyticalDataCopy',
//     method: 'post',
//     data
//   })
// }

// export function exportpblish(data) {
//   return fetch({
//     url: '/analytical/exportAnalyticalData',
//     method: 'post',
//     data,
//     responseType: 'blob'
//   })
// }

// export function exportpblishnode(data) {
//   return fetch({
//     url: '/analytical/exportAnalyticalNodeData',
//     method: 'post',
//     data,
//     responseType: 'blob'
//   })
// }

// // 审批效率
// export function getRate(data) {
//   return fetch({
//     url: '/analytical/analyticEfficiencyDataCopy',
//     method: 'post',
//     data
//   })
// }
// export function getRatedetail(data) {
//   return fetch({
//     url: '/analytical/analyticEfficiencyDetailDataCopy',
//     method: 'post',
//     data
//   })
// }

// ===================================================
import { fetch } from '@/bpa/utils'
import { fetch2 } from '@/bpa/utils'
import { fetch3 } from '@/bpa/utils'

/****************制度总览与制度看板********************/
// 总览分析 - 流程制度
export function queryRegulationProcessInformation(data) {
  return fetch({
    url: '/analysis/queryRegulationProcessInformation',
    method: 'post',
    data
  })
}
// 总览分析 - 流程标准化
export function queryRegulationCount(data) {
  return fetch({
    url: '/analysis/queryRegulationCount',
    method: 'post',
    data
  })
}
// 查询岗位到流程匹配情况接口
export function queryPostToProcessMatchedCondition(data) {
  return fetch({
    url: '/analysis/queryPostToProcessMatchedCondition',
    method: 'post',
    data
  })
}
// 流程标准化
export function queryDocumentOfProcessCondition(data) {
  return fetch({
    url: '/analysis/queryDocumentOfProcessCondition',
    method: 'post',
    data
  })
} 
// 制度流程标准化接口
export function queryDocumentProcessizeDegree(data) {
  return fetch({
    url: '/analysis/queryDocumentProcessizeDegree',
    method: 'post',
    data
  })
} 
// 制度流程标准化接口
export function queryProcessInformatizationDegree(data) {
  return fetch({
    url: '/analysis/queryProcessInformatizationDegree',
    method: 'post',
    data
  })
} 
// 制度流程标准化接口
export function queryRegulationDocumentInformation(data) {
  return fetch({
    url: '/analysis/queryRegulationDocumentInformation',
    method: 'post',
    data
  })
} 
// 制度落地执行效率接口
export function queryProcessExecutionEfficiency(data) {
  return fetch({
    url: '/analysis/queryProcessExecutionEfficiency',
    method: 'post',
    data
  })
} 
// 覆盖岗位程度
export function queryProcessCoverPostCondition(data) {
  return fetch({
    url: '/analysis/queryProcessCoverPostCondition',
    method: 'post',
    data
  })
} 
// 制度流程标准化程度
export function queryDocumentProcessizeDegreeLineChart(data) {
  return fetch({
    url: '/analysis/queryDocumentProcessizeDegreeLineChart',
    method: 'post',
    data
  })
}



//------------------------------------------------------------------------------
// 培训统计部分
export function getTrained(data) {
  return fetch2({
    url: '/listrelease/trainFlowCountCopy',
    method: 'post',
    data
  })
}
export function exportTrained(data) {
  return fetch2({
    url: '/analytical/exportAnalyticTrainDetailData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 培训统计-流程列表
export function getTrainedprocess(data) {
  return fetch2({
    url: '/analytical/analyticTrainDetailDataCopy',
    method: 'post',
    data
  })
}
// 超期部分
export function getExceed(data) {
  return fetch2({
    url: '/analytical/analyticTimeDataCopy',
    method: 'post',
    data
  })
}

export function exportExceed(data) {
  return fetch2({
    url: '/analytical/exportAnalyticTimeData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 最近发布流程
export function getPblish(data) {
  return fetch2({
    url: '/analytical/analyticalDataCopy',
    method: 'post',
    data
  })
}

export function exportpblish(data) {
  return fetch2({
    url: '/analytical/exportAnalyticalData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function exportpblishnode(data) {
  return fetch2({
    url: '/analytical/exportAnalyticalNodeData',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 审批效率
export function getRate(data) {
  return fetch2({
    url: '/analytical/analyticEfficiencyDataCopy',
    method: 'post',
    data
  })
}
export function getRatedetail(data) {
  return fetch2({
    url: '/analytical/analyticEfficiencyDetailDataCopy',
    method: 'post',
    data
  })
}

export function exportRate(data) {
  return fetch2({
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
    loading: false,
    headers: {
      'Content-Type': 'application/json'
    },
    data
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
  return fetch2({
    url: '/process/analysis/getProcessModel',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 获取运行实例数据
export function getOperationList(data) {
  return fetch2({
    url: '/process/analysis/instanceStatistical',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 获取业务域数据
export function getTreeNodeWithoutAuthCopy(data) {
  return fetch({
    url: '/modeltree/getTreeNodeWithoutAuthCopy/79957553BD2F3978E053BF1A13ACD486',
    method: 'post',
    data
  })
}
// 获取流程列表
export function getProcessList(data) {
  return fetch2({
    url: '/process/analysis/queryProcess',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 获取关键指标数
export function getKeyList(data) {
  return fetch2({
    url: '/process/analysis/getPivotalTarget',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 获取任务效率分析基本数据(按部门)
export function getTaskEfficiencyDept(data) {
  return fetch2({
    url: '/process/taskefficiency/getTaskEfficiencyDept',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 查询任务效率分析图表数据(按部门)
export function queryTaskEfficiencyDeptChart(data) {
  return fetch2({
    url: '/process/taskefficiency/queryTaskEfficiencyDeptChart',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 查询任务效率分析图表数据(按部门)
export function queryTaskEfficiencyDeptTable(data) {
  return fetch2({
    url: '/process/taskefficiency/queryTaskEfficiencyDeptTable',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 查询部门信息
export function getAllDepartment(data) {
  return fetch2({
    url: '/org/fbc/queryTree',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 获取任务效率分析基本数据(按流程)
export function getTaskEfficiencyProcess(data) {
  return fetch2({
    url: '/process/taskefficiency/getTaskEfficiencyProcess',
    method: 'post',
    type: 'bpm',
    data
  })
}
// 查询任务效率分析图表数据(按流程)
export function queryTaskEfficiencyProcessChart(data) {
  return fetch2({
    url: '/process/taskefficiency/queryTaskEfficiencyProcessChart',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 查询任务效率分析图表数据(按部门)
export function queryTaskEfficiencyProcessTable(data) {
  return fetch2({
    url: '/process/taskefficiency/queryTaskEfficiencyProcessTable',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 流程发起数排名
export function getProcessRank(data) {
  return fetch2({
    url: '/process/analysis/processApplyRanking',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 流程平均审批时长
export function getProcessAverageTime(data) {
  return fetch2({
    url: '/process/analysis/processAverageTime',
    method: 'post',
    data,
    type: 'bpm'
  })
}
// 岗位平均审批时长
export function getPostAverageTime(data) {
  return fetch2({
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
  return fetch2({
    url: '/process/analysis/postProcessRanking',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 岗位累计处理数量
export function getPostApprovalCount(data) {
  return fetch2({
    url: '/process/analysis/postProcessApprovalCount',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 指定岗位流程的平均处理时长排名接口
export function getPostAverage(data) {
  return fetch2({
    url: '/process/analysis/postAverageTime',
    method: 'post',
    data,
    type: 'bpm'
  })
}

// 流程发起数排名导出接口
export function getExportProcessApplyRanking(data) {
  return fetch2({
    url: '/process/analysis/exportProcessApplyRanking',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 岗位参与审批的流程数排名
export function getExportPostProcessRanking(data) {
  return fetch2({
    url: '/process/analysis/exportPostProcessRanking',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 平均处理时长排名
export function getExportPostAverageTime(data) {
  return fetch2({
    url: '/process/analysis/exportPostAverageTime',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 报表分析-任务效率分析表（按部门）
export function getExportTaskEfficiencyDeptTable(data) {
  return fetch2({
    url: '/process/taskefficiency/exportTaskEfficiencyDeptTable',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}
// 报表分析-任务效率分析表（按流程）
export function getExportTaskEfficiencyProcessTable(data) {
  return fetch2({
    url: '/process/taskefficiency/exportTaskEfficiencyProcessTable',
    method: 'post',
    data,
    type: 'bpm',
    responseType: 'blob'
  })
}

// =================
// 运营监控
// 主页获取KPI值
export function getKPI() {
  return fetch({
    url: '/om/getKpiIndexNum',
    method: 'get'
  })
}
// 主页获取风险控制点值
export function getRiskIndexNum() {
  return fetch({
    url: '/om/getRiskIndexNum',
    method: 'get'
  })
}

// 获取流程效率
export function getEFFiciency(data) {
  return fetch({
    url: '/om/getProcessEfficiency',
    method: 'post',
    data
  })
}

// 仪表盘
export function dashboardChart(data) {
  return fetch({
    url: '/vckpi/queryVCKpi',
    method: 'post',
    data
  })
}

// 利润仪表盘
export function profitDashboard(data) {
  return fetch({
    url: '/om/getPretaxProfit/' + data,
    method: 'get'
  })
}

// 获取使用率
export function getUseRate(data) {
  return fetch({
    url: '/om/getProcessUtilization',
    method: 'post',
    data
  })
}

// 流程分析获取数据接口
// export function getinfo(data) {
//   return fetch({
//     url: '/bpa/num/info',
//     method: 'get',
//     data
//   })
// }

//新流程还原-左侧树tree   
export function recoveryOfProcessSearching(id, data) {
  return fetch({
    url: `/bpm/processquery/v2/recoveryOfProcessSearching/${id}`,
    method: 'post',
    data
  })
} 
// 新流程还原-流程图 
export function getProcessRecovery(data) {
  return fetch({
    url: `/bpm/process/getProcessRecovery`,
    method: 'post',
    data
  })
}

// 分析报告-查询列表
export function queryReport(data) {
  return fetch({
    url: `/process/da/report/query`,
    method: 'post',
    data
  })
}
