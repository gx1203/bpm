import { fetch } from '@/bpm/utils'
// 获取移动配置所有流程
export function getMobileProcess(data) {
  return fetch({
    url: '/mobileProcessConfig/getMobileProcess',
    method: 'GET',
    data
  })
}

//获取流程配置节点字段
export function getMobileNodeField(data) {
    return fetch({
      url: '/mobileProcessConfig/getMobileNodeField',
      method: 'POST',
      data
    })
  }
  
//保存移动端配置流程节点字段
export function saveProcessNodeField(data) {
    return fetch({
      url: '/mobileProcessConfig/saveProcessNodeField',
      method: 'POST',
      data
    })
  }
  //保存移动端配置流程节点审批类型
export function saveProcessNodeApproval(data) {
    return fetch({
      url: '/mobileProcessConfig/saveProcessNodeApproval',
      method: 'POST',
      data
    })
  }

  //复制移动端配置流程节点字段
export function copyProcessNodeField(data) {
    return fetch({
      url: '/mobileProcessConfig/copyProcessNodeField',
      method: 'POST',
      data
    })
  }
  
// 获取移动配置流程节点
export function getProcessNode(id) {
    return fetch({
      url: `/mobileProcessConfig/getProcessNode/${id}`,
      method: 'GET'
    })
  }
  // 获取节点已配置的审批类型
export function getApprovalType(id) {
    return fetch({
      url: `/mobileProcessConfig/getApprovalType/${id}`,
      method: 'GET'
    })
  }
    // 获取所有的审批类型
export function getAllApprovalType(id) {
    return fetch({
      url: `/processNodeConfig/getAllApprovalType`,
      method: 'GET'
    })
  }
// 添加编辑移动配置流程
export function addMobileProcess(data) {
  return fetch({
    url: '/mobileProcessConfig/addMobileProcess',
    method: 'POST',
    data
  })
}
// 保存移动端配置流程节点
export function saveMobileProcessConfig(data) {
    return fetch({
      url: '/mobileProcessConfig/saveMobileProcessConfig',
      method: 'POST',
      data
    })
  }

