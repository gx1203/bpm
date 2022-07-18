import { fetch } from '@/bpa/utils'

// 体系关联列表
export function systemConnectioon (data) {
  return fetch({
    url: '/systemConnectioon/page',
    method: 'POST',
    data
  })
}

// 删除体系关联
export function deleteByRelationkey (data) {
  return fetch({
    url: '/systemConnectioon/deleteByRelationkey/' + data,
    method: 'delete'
  })
}

// 保存关联体系
export function saveSystemConnectioon (data) {
  return fetch({
    url: '/systemConnectioon/save',
    method: 'POST',
    data
  })
}

// 获取关联体系详情
export function getByRelationkey (data) {
  return fetch({
    url: '/systemConnectioon/getByRelationkey/' + data,
    method: 'get'
  })
}

// 体系关联展开详情
export function getListByRelationkey (data) {
  return fetch({
    url: '/systemConnectioon/getListByRelationkey/' + data,
    method: 'get'
  })
}

// 体系关联展开保存
export function saveSysList (data) {
  return fetch({
    url: '/systemConnectioon/saveList',
    method: 'POST',
    data
  })
}

// 体系解除关联
export function deleteByChapterkey (data) {
  return fetch({
    url: '/systemConnectioon/deleteByChapterkey/' + data,
    method: 'delete'
  })
}
