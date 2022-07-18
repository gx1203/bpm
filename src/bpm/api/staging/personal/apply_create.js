import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// 获取可申请的流程列表
export function getApplyList(data) {
  return fetch({
    url: `/bpm/createnav/initiate-list`,
    method: 'GET',
    data
  })
}

// 获取快捷列表
export function getShortCutList(data) {
  return fetch({
    url: `/bpm/createnav/query`,
    method: 'POST',
    data
  })
}

// 添加流程到快捷发起栏
export function addToShortCut(data) {
  return fetch({
    url: 'bpm/createnav/save',
    method: 'POST',
    data: {
      userid: sessionStorage.getItem('userid'),
      ...data
    }
  })
}

// 将流程从快速发起栏删除
export function delShortCut(id) {
  return fetch({
    url: `bpm/createnav/delete/${id}`,
    method: 'DELETE'
  })
}
// 将流程从快速发起栏删除
export function postionList(id) {
  return fetch({
    url: `bpm/process/userorg/postionList/${id}`,
    method: 'GET'
  })
}


// 新流程框架数据
export function applyForCreation() {
  return fetch({
    url: `/bpm/createnav/applyForCreation`,
    method: 'GET'
  })
}
