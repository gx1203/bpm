import { fetch } from '@/bpm/utils'
// 获取流程模型列表
export function getModelList(data) {
  return fetch({
    url: '/amodeler/query',
    method: 'POST',
    data
  })
}


// 删除流程模型列表
export function deleteModelList(id) {
  return fetch({
    url: `/amodeler/delete/${id}`,
    method: 'DELETE'
  })
}


// 发布流程模型
export function outRelease(id) {
  return fetch({
    url: `/amodeler/deploy/${id}`,
    method: 'PUT'
  })
}
// 导出模型文件
export function getModelExcel (id) {
  return fetch({
    url: `/amodeler/export/${id}`,
    method: 'GET',
    responseType: 'blob',
    Headers: {
      'Content-Type': 'application/xml;charset=UTF-8'
    }
  })
}

// 导入模型文件
export function saveModelExcel(data) {
  return fetch({
    url: '/amodeler/import',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}



// 批量导出
export function getAllModelExcel (id) {
  return fetch({
    url: `/amodeler/batchExport/${id}`,
    method: 'GET',
    responseType: 'blob',
    Headers: {
      'Content-Type': 'application/xml;charset=UTF-8'
    }
  })
}
