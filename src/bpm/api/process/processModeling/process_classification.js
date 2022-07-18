import { fetch } from '@/bpm/utils'
// 获取流程分类列表
export function getProcessCategoryTree(data) {
  return fetch({
    url: '/model/getProcessCategoryTree',
    method: 'POST',
    data
  })
}
// 添加编辑流程分类
export function saveProcessType(data) {
  return fetch({
    url: '/model/saveOrUpdateTree',
    method: 'POST',
    data
  })
}

// 删除流程分类
export function deleteProcessType(id) {
  return fetch({
    url: `/model/delete/${id}`,
    method: 'GET'
  })
}

// 获取流程分类 
export function getProcessTypeId(ids) {
  return fetch({
    url: `/model/get/${ids}`,
    method: 'GET'
  })
}

// 添加同步流程
export function initBpmProcess() {
  return fetch({
    url: '/model/initBpmProcess',
    method: 'POST'
  })
}
// 新增或移除流程
export function updateProcessModel(data) {
  return fetch({
    url: '/model/updateProcessModel',
    method: 'POST',
    data
  })
}
// 获取模型已分配的流程 
export function getProcessInfo(ids) {
  return fetch({
    url: `/model/getProcessInfo/${ids}`,
    method: 'GET'
  })
}

// 获取未分配的流程 
export function getUnLocatedInfo() {
  return fetch({
    url: `/model/getUnLocatedInfo`,
    method: 'GET'
  })
}


