import {
  fetch
} from '@/bpm/utils'
// 获取导航列表
export function getNavigationList(data) {
  return fetch({
    url: '/bpm/navigation/getAll',
    method: 'POST',
    data
  })
}
//获取导航子路由
export function getChildByPid(id) {
  return fetch({
    url: `/bpm/navigation/getChild/${id}`,
    method: 'POST'
  })
}
