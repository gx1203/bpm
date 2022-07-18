// ===================================================
import { fetch } from '@/bpa/utils'
// 获取流程还原
export function queryProcessReduction(data) {
  return fetch({
    url: '/analysis/queryProcessReductionSecond',
    method: 'post',
    data
  })
}
// 获取BPA关键指标
export function queryRegulationCount(data) {
  return fetch({
    url: '/analysis/queryRegulationCount',
    method: 'post',
    data
  })
}
// 获取BPA流程阅读量
export function queryRegulationRunCondition(data) {
  return fetch({
    url: '/analysis/queryRegulationRunCondition/' + data,
    method: 'get'
  })
}

// 制度接收阅读情况
export function queryRegulationReceivedAndReadCondition(data) {
  return fetch({
    url: '/analysis/queryRegulationReceivedAndReadCondition/' + data,
    method: 'get'
  })
}
// 更多制度接收阅读情况
export function queryMoreRegulationReceivedAndReadCondition(data) {
  return fetch({
    url: '/analysis/queryMoreRegulationReceivedAndReadCondition',
    method: 'post',
    data
  })
}
// 更多制度接收阅读情况-明细
export function queryRegulationReceivedAndReadConditionDetail(data) {
  return fetch({
    url: '/analysis/queryRegulationReceivedAndReadConditionDetail',
    method: 'post',
    data
  })
}
// 制度接收阅读情况
export function queryRegulationLineReadCondition(data) {
  return fetch({
    url: '/analysis/queryRegulationLineReadCondition/' + data,
    method: 'get'
  })
}
// 制度接收阅读情况 - 更多
export function queryMoreRegulationLineReadCondition(data) {
  return fetch({
    url: '/analysis/queryMoreRegulationLineReadCondition',
    method: 'post',
    data
  })
}
// 制度未匹配到流程情况
export function queryRegulationNotMatchModelCondition(data) {
  return fetch({
    url: '/analysis/queryRegulationNotMatchModelCondition/' + data,
    method: 'get'
  })
}
// 制度未匹配到流程情况 - 更多
export function queryMoreRegulationNotMatchModelCondition(data) {
  return fetch({
    url: '/analysis/queryMoreRegulationNotMatchModelCondition',
    method: 'post',
    data
  })
}
// 制度未匹配到流程情况 - 更多
export function queryProcessReductionFirst(data) {
  return fetch({
    url: '/analysis/queryProcessReductionFirst',
    method: 'post',
    data
  })
}
