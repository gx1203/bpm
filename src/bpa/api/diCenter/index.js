import { fetch } from '@/bpa/utils'

// 主页获取KPI值
export function getKPI(id) {
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

// 获取使用率
export function getUseRate(data) {
  return fetch({
    url: '/om/getProcessUtilization',
    method: 'post',
    data
  })
}

// 获取树
export function getTreelist(id) {
  return fetch({
    url: '/vckpi/queryTree/' + id,
    method: 'get'
  })
}

// 获取树
export function getTreeD2Dlist() {
  return fetch({
    url: '/vckpi/queryTreeD2D/',
    method: 'get'
  })
}

// 获取价值链KPI
export function getDataBaseList(id) {
  return fetch({
    url: '/vckpi/get/' + id,
    method: 'get'
  })
}

// 获取子节点
export function getChildrenList(id) {
  return fetch({
    url: '/vckpi/queryChildrenKpi/' + id,
    method: 'get'
  })
}

// 价值链保存
export function saveDataBaseList(data) {
  return fetch({
    url: '/vckpi/save',
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
    url: '/om/getPretaxProfit?month=' + data,
    method: 'get'
  })
}

// 详情仪表盘
export function detailChart(data) {
  return fetch({
    url: '/vckpi/getVCKpi',
    method: 'post',
    data
  })
}

// 获取表格数据
export function getFormList(data) {
  return fetch({
    url: '/vckpi/getList' ,
    method: 'post',
    data
  })
}
