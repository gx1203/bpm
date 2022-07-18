import { fetch2 } from '@/bpa/utils'

// 获取系统中所有的根树
export function getAllRootTree() {
  return fetch2({
    url: `/org/tree/getAllRootTree`,
    method: 'GET',
    type: 'bpm'

  })
}

// 根据组织节点的id获取组织节点的直属子节点
export function getChildren(id) {
  return fetch2({
    url: `/org/tree/getChildren/${id}`,
    method: 'GET',
    type: 'bpm'
  })
}

// 查询指定组织下的用户信息
export function findOrgUsers(data) {
  return fetch2({
    url: `/user/fbc/query`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 查询部门信息
export function getAllDepartment(data) {
  return fetch2({
    url: `/org/info/query`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 获取职务分类
export function getAllJobClass(data) {
  return fetch2({
    url: `/positiontype/query`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 获取职务
export function getAllJob(data) {
  return fetch2({
    url: `/position/query`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 获取系统组列表
export function getAllSystemGroup(data) {
  return fetch2({
    url: `/group/querysysgroup`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 获取自定义组列表
export function getAllCustomGroup(data) {
  return fetch2({
    url: `/group/querymygroup`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 获取组信息
export function getGroupInfo(id) {
  return fetch2({
    url: `/group/get/${id}`,
    method: 'GET',
    type: 'bpm'
  })
}

// 保存组
export function ajaxGroupSave(data) {
  return fetch2({
    url: `/group/save`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 组列表查询
export function getAllGroup(data) {
  return fetch2({
    url: `/group/query`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 添加组成员
export function addGroupmember(data) {
  return fetch2({
    url: `/group/addgroupmember`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}

// 删除组
export function deleteGroup(id) {
  return fetch2({
    url: `/group/delete/${id}`,
    method: 'PUT',
    type: 'bpm'
  })
}

// bpa相关接口
// 查询组织结构树形列表数据接口
export function getDepartmentList(data) {
  return fetch2({
    url: `/org/fbc/queryTree`,
    method: 'POST',
    data,
    type: 'bpm'
  })
}
