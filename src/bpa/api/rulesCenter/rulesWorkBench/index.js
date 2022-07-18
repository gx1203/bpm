

import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid

export function getTodoList (data) {
    return fetch({
      url: '/systemNotic/todolist?username=' + username,
      method: 'post',
      data
    })
  }
  
  export function getList (data) {
    return fetch({
      url: '/workbench/getLsit?username=' + username,
      method: 'post',
      data
    })
  }
  
  //我的待办
  export function myBeingTodoList (data) {
    return fetch({
      url: '/unified-task/query-todo?username=' + username,
      method: 'post',
      data
    })
  }

//我的已办
export function myBeenTodoList (data) {
  return fetch({
    url: '/bpm/processquery/v2/mySponsor?username=' + username,
    method: 'post',
    data
  })
}

//我的申请
export function myRequestList (data) {
  return fetch({
    url: '/bpm/processquery/v2/mySponsor?username=' + username,
    method: 'post',
    data
  })
}

//征求意见跟踪表
export function feedbackTrackingForm(data) {
  return fetch({
    url: '/bpm/processquery/v2/todo?username=' + username,
    method: 'post',
    data
  })
}