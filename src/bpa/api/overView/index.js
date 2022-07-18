import { fetch } from '@/bpa/utils'

// 获取系统中所有的根树
export function findUserOrg(userId) {
  return fetch({
    url: `/modelResponsibility/getPosts/${userId}`,
    method: 'GET',
  })
}


// 获取主岗
export function findUserMainOrg(userId) {
  return fetch({
    url: `/org/manager/findUserMainOrg/${userId}`,
    method: 'GET',
  })
}

// 获取主岗
export function querynotify() {
  return fetch({
    url: `/mangercenterdoc/querynotifyCopy`,
    method: 'POST',
  })
}