import { fetch } from '@/bpm/utils'

// 获取计划内容
export function getPlan(params) {
  return fetch({
    url: '/planmanage/get',
    method: 'GET',
    params
  })
}

// 获取版本列表
export function getPlanManageList(data) {
  return fetch({
    url: '/planmanage/getPlanManageList',
    method: 'GET',
    data
  })
}

// 保存审批类型
export function savePlan(data) {
  return fetch({
    url: '/planmanage/save',
    method: 'POST',
    data
  })
}

// 版本升级
export function versionUpgrade(data) {
  return fetch({
    url: '/planmanage/versionUpgrade',
    method: 'POST',
    data
  })
}

// 计划 数据导出
export function exportExcelPlan(id) {
  return fetch({
    url: `/planmanage/exportExcel/${id}`,
    method: 'GET'
  })
}

// 计划 下载模板
export function downloadPlan() {
  return fetch({
    url: `/planmanage/download`,
    method: 'GET'
  })
}

// 计划 数据导入
export function importExcelPlan(data) {
  return fetch({
    url: `/planmanage/importExcel`,
    method: 'POST',
    data
  })
}
// 计划 数据导出校验
export function verificationDataPlan(id) {
  return fetch({
    url: `/planmanage/verificationData/${id}`,
    method: 'GET'
  })
}

// 岗位流程的导出功能
export function exportOrg(id) {
  return fetch({
    url: `/postProcess/exportOrg/${id}`,
    method: 'POST'
  })
}
