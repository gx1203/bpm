import { fetch } from '@/bpa/utils'

// 获取内部管理文件列表
export function getinterneldm (data) {
  return fetch({
    url: '/interneldm/page',
    method: 'post',
    data
  })
}

// 获取已发布的内部体系
export function getInterList (data) {
  return fetch({
    url: '/systemManagement/getInterList',
    method: 'post',
    data
  })
}

// 保存
export function saveinterneldm (data) {
  return fetch({
    url: '/interneldm/save',
    method: 'post',
    data
  })
}

// 修订保存
export function reviseinterneldm (data) {
  return fetch({
    url: '/interneldm/revise',
    method: 'post',
    data
  })
}

// 发布/废止
export function startProcess (data) {
  return fetch({
    url: '/interneldm/startProcess',
    method: 'post',
    data
  })
}

// 获取详情
export function getinterneldmList (data) {
  return fetch({
    url: '/interneldm/get/' + data,
    method: 'GET'
  })
}

// 删除
export function interneldmDelete (data) {
  return fetch({
    url: '/interneldm/delete/' + data,
    method: 'delete'
  })
}

// 获取外来文件列表
export function getexternaldm (data) {
  return fetch({
    url: '/externaldm/page',
    method: 'post',
    data
  })
}

// 获取外部体系
export function gewbSystemList (data) {
  return fetch({
    url: '/wbSystemList/page',
    method: 'post',
    data
  })
}

// 保存外部体系
export function saveExternaldm (data) {
  return fetch({
    url: '/externaldm/save',
    method: 'post',
    data
  })
}

// 修订保存外部体系
export function reviseExternaldm (data) {
  return fetch({
    url: '/externaldm/revise',
    method: 'post',
    data
  })
}

// 获取外部详情
export function getexternaldmList (data) {
  return fetch({
    url: '/externaldm/get/' + data,
    method: 'GET'
  })
}

// 外部文件下发/废止
export function startexternaldm (data) {
  return fetch({
    url: '/externaldm/startProcess',
    method: 'post',
    data
  })
}

// 删除外部文件

export function externaldmDelete (data) {
  return fetch({
    url: '/externaldm/delete/' + data,
    method: 'delete'
  })
}

// 记录文件列表获取
export function getrecordingdm (data) {
  return fetch({
    url: '/recordingdm/page',
    method: 'post',
    data
  })
}

// 记录文件详情查询
export function getrecordingdmList (data) {
  return fetch({
    url: '/recordingdm/get/' + data,
    method: 'GET'
  })
}
// 记录文件保存
export function saverecordingdm (data) {
  return fetch({
    url: '/recordingdm/save',
    method: 'post',
    data
  })
}

// 记录文件修订
export function reviserecordingdm (data) {
  return fetch({
    url: '/recordingdm/revise',
    method: 'post',
    data
  })
}

// 记录文件下发/废止
export function startProcessrecordingdm (data) {
  return fetch({
    url: '/recordingdm/startProcess',
    method: 'post',
    data
  })
}

// 记录文件删除
export function recordingdmDelete (data) {
  return fetch({
    url: '/recordingdm/delete/' + data,
    method: 'delete'
  })
}

// 获取文件数量
export function getRecordCount (data) {
  return fetch({
    url: '/interneldm/getCount',
    method: 'post',
    data
  })
}

// 查询内部管理文件历史版本
export function getDetails (data) {
  return fetch({
    url: '/interneldm/getHistory/' + data,
    method: 'GET'
  })
}
