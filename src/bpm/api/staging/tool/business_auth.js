import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

//获取左侧业务树-根据登录人及规则获取业务树
export function getAllTree (data) {
  return fetch({
    url: '/businessRuleAuth/getAllTree',
    // url: '/process/model/getAllTree',
    method: 'GET',
    data
  })
}

// 获取数列表
export function queryList (data) {
  return fetch({
    url: '/businessRuleAuth/queryList',
    method: 'POST',
    data
  })
}
// 保存与修改
export function saveOrUpdate (data) {
  return fetch({
    url: '/businessRuleAuth/saveOrUpdate',
    method: 'POST',
    data
  })
}
//收回业务授权
export function updateState (data) {
  return fetch({
    url: '/businessRuleAuth/updateState',
    method: 'POST',
    data
  })
}


//根据ID获取业务授权详情
export function getAuthInfoDetail (id) {
  return fetch({
    url: `/businessRuleAuth/get/${id}`,
    method: 'GET'
  })
}

//获取业务授权控制字段的数据
export function getAuthControlData (id) {
  return fetch({
    url: `/businessRuleAuth/getAuthControl/${id}`,
    method: 'GET'
  })
}

// 获取可授权节点的数据
export function getAuthNodeData (id) {
  return fetch({
    url: `/businessRuleAuth/getNode/${id}`,
    method: 'GET'
  })
}

// 根据ID删除业务授权
export function deleteAuth (id) {
  return fetch({
    url: `/businessRuleAuth/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除业务授权
export function batchDelete (data) {
  return fetch({
    url: '/businessRuleAuth/batchDelete',
    method: 'POST',
    data
  })
}

// 获取数列表
export function queryListAll (data) {
  return fetch({
    url: '/businessRuleAuth/queryListAll',
    method: 'POST',
    data
  })
}

// 获取可授权节点的数据
export function getAllNode (processId) {
  return fetch({
    url: `/businessRuleAuth/getAllNode/${processId}`,
    method: 'GET'
  })
}

// 获取节点的授权人
export function getAuthorizedUser (processId,nodeId) {
  return fetch({
    url: `/businessRuleAuth/getAuthorizedUser/${processId}/${nodeId}`,
    method: 'get',
  })
}



















