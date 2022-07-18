import {
    fetch
  } from '@/bpm/utils'

  // 获取组织机构管理员列表
  export function getUserList (data) {
    return fetch({
      url: `/businessRulePower/get`,
      method: 'POST',
      data
    })
  }
  
  // 员工管理新增用户保存
  export function saveBusinessRulePower (data) {
    return fetch({
      url: `/businessRulePower/save`,
      method: 'POST',
      data
    })
  }
  
  // 组织机构管理员删除
  export function deleteUser (data) {
    return fetch({
      url: `/businessRulePower/delete/${data.orgid}/${data.params}`,
      method: 'GET'
    })
  }
  