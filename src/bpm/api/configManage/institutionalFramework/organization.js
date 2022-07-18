import { fetch } from '@/bpm/utils'

// 获取 组织下面的用户
export function findOrgUsers(data, orgId, current) {
  return fetch({
    url: `/org/manager/findOrgUsers/${orgId}/${current}`,
    method: 'POST',
    data
  })
}

// 删除 岗位组管理列表
export function deletePositions(id) {
  return fetch({
    url: `/positions/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除 岗位组管理
export function deleteAllPositions(id) {
  return fetch({
    url: `/positions/batch-delete/${id}`,
    method: 'DELETE'
  })
}

// 获取岗位组
export function getPostGroup(id) {
  return fetch({
    url: `/positions/getPostGroup/${id}`,
    method: 'GET'
  })
}

// 向指定组织分配用户
export function assignUser(data) {
  return fetch({
    url: `/org/manager/assignUser`,
    method: 'POST',
    data
  })
}

// 向指定组织分配用户
export function assignUsers(data) {
  return fetch({
    url: `/org/manager/assignUsers`,
    method: 'POST',
    data
  })
}

export function getAllRootTreeByUser(data) {
  return fetch({
    url: `/bpm/process/userorg/getAllRootTreeByUser/${data}`,
    method: 'GET'
  })
}
// 移除指定组已授予的角色
export function removeRole(data) {
  return fetch({
    url: `/org/manager/removeUser`,
    method: 'DELETE',
    data
  })
}

// 对组织树的增加与修改
export function saveOrgTree(data) {
  return fetch({
    url: `/org/tree/save`,
    method: 'POST',
    data
  })
}

export function saveUserorgTop(data) {
  return fetch({
    url: `/bpm/process/userorg/saveTop`,
    method: 'POST',
    data
  })
}

// 保存组织信息-新增
export function saveUserOrg(pid, data) {
  return fetch({
    url: `/bpm/process/userorg/save/${pid}`,
    method: 'POST',
    data
  })
}
//保存组织信息-编辑
export function saveUserOrgEdit(data) {
  return fetch({
    url: `/bpm/process/userorg/saveSelf`,
    method: 'POST',
    data
  })
}

// 获取组织信息
export function getInfo(id) {
  return fetch({
    url: `/org/info/get/${id}`,
    method: 'GET'
  })
}

// 获取所有的根树
export function getAllRootTree() {
  return fetch({
    url: `/org/tree/getAllRootTree`,
    method: 'GET'
  })
}
// 获取分类的直属子分类
export function getChildren(id) {
  return fetch({
    url: `/org/tree/getChildren/${id}`,
    method: 'GET'
  })
}

// 根据id删除组织树信息（不包括子节点，子节点会上移一位成为被删除节点的父节点的子节点）
export function deleteTreeOne(id) {
  return fetch({
    url: `/org/tree/delete/${id}`,
    method: 'DELETE'
  })
}

// 根据id删除组织树信息（包括子节点）
export function deleteTreeAll(id) {
  return fetch({
    url: `/org/tree/deleteTree/${id}`,
    method: 'DELETE'
  })
}

// 过滤树的内容（所有树）
export function searchQueryTree(name) {
  return fetch({
    url: `/org/tree/queryTree/${name}`,
    method: 'GET'
  })
}

// 移动整棵树到指定节点下
export function moveTree(src, target) {
  return fetch({
    url: `/org/tree/moveTreeTo/${src}/${target}`,
    method: 'GET'
  })
}

//组织机构的类型
export function getOrganizationsTypes() {
  return fetch({
    url: `orgTreeExtend/queryOrgTypeList`,
    method: 'GET'
  })
}

//组织机构的导出
export function getOrganizationsTreeList(id) {
  return fetch({
    url: `/orgTreeExtend/export` + id,
    method: 'GET'
  })
}

//组织机构
export function queryPath(id) {
  return fetch({
    url: `/org/tree/getTree/${id}`,
    method: 'GET'
  })
}
// export function getExportProcessApplyRanking(data) {
//   return fetch2({
//     url: '/orgTreeExtend/export',
//     method: 'post',
//     data,
//     type: 'bpm',
//     responseType: 'blob'
//   })
// }

//根据 id 获取公司的详情
export function queryOrgDetailInfo(id) {
  return fetch({
    url: `/org/manager/getFullOrgInfo/${id}`,
    method: 'GET'
  })
}

// 根据ID查询下级列表
export function queryDescendants(id, data) {
  return fetch({
    url: `/orgTreeExtend/queryOrganizationDto/${id}`,
    method: 'post',
    data
  })
}

// 根据ID查询下级列表
export function queryDescendants1(data) {
  return fetch({
    url: `/org/manager/query`,
    method: 'post',
    data
  })
}

// 根据ID删除下级列表一个数据
export function delSingleDes(id) {
  return fetch({
    url: `/org/tree/deleteTree/${id} `,
    method: 'delete'
  })
}

export function disableOrgTree(id) {
  return fetch({
    url: `/org/tree/disable/${id}`,
    method: 'PUT'
  })
}
