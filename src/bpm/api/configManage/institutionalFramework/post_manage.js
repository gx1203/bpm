import {
  fetch
} from '@/bpm/utils'

  // 获取 岗位组管理列表
export function getPositionsList (data) {
  return fetch({
    url: '/positions/quickquery',
    method: 'POST',
    data
  })
}
// 保存 岗位组管理列表
export function savePositions (data) {
  return fetch({
    url: '/positions/save',
    method: 'POST',
    data
  })
}
// 删除 岗位组管理列表
export function deletePositions (id) {
  return fetch({
    url: `/positions/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除 岗位组管理
export function deleteAllPositions (id) {
  return fetch({
    url: `/positions/batch-delete/${id}`,
    method: 'DELETE'
  })
}

// 获取岗位组
export function getPostGroup (id) {
  return fetch({
    url: `/positions/getPostGroup/${id}`,
    method: 'GET'
  })
}

// 保存岗位组
export function savePositionsCondition (post) {
  return fetch({
    url: `/positions/savePositionsCondition`,
    method: 'POST',
    post
  })
}

export function getPostIds (id) {
  return fetch({
    url: `/positions/getPostIds/${id}`,
    method: 'GET'
  })
}
//获取岗位组信息
export function getPostInfos (id) {
  return fetch({
    url: `/positions/getPostInfos/${id}`,
    method: 'GET'
  })
}
// 保存岗位组分配的岗位
export function savePostOrg (data) {
  return fetch({
    url: `/positions/savePostOrg`,
    method: 'POST',
    data
  })
}

// ---------------------员工管理--------------------
// 获取员工管理用户列表
export function getUserList (data) {
  return fetch({
    url: `/userModel/getUserList`,
    method: 'POST',
    data
  })
}

// 根据用户获取用户详情
export function getUserDetails (userId) {
  return fetch({
    url: `/userModel/get/${userId}`,
    method: 'GET'
  })
}

// 员工管理新增用户保存
export function saveAddUser (data) {
  return fetch({
    url: `/userModel/save`,
    method: 'POST',
    data
  })
}

// 员工管理用户删除
export function deleteUser (userId) {
  return fetch({
    url: `/userModel/delete/${userId}`,
    method: 'DELETE'
  })
}

// 员工管理用户删除
export function deleteUsers (data) {
  return fetch({
    url: `/userModel/deletes`,
    method: 'POST',
    data
  })
}

export function delpostorg (data) {
  return fetch({
    url: `/positions/delpostorg/${data.postId}/${data.orgId}`,
    method: 'delete'
  })
}
export function savepostorgs (data) {
  return fetch({
    url: `/positions/savepostorg/${data.postId}/${data.orgId}`,
    method: 'POST'
  })
}

