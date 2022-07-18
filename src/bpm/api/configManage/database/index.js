import {
    fetch
} from '@/bpm/utils'

// 获取数据库表列表
export function getDatabaseList(data) {
  return fetch({
    url: '/table/manage/queryAllTable',
    method: 'POST',
    data
  })
}
// 获取表字段信息
export function queryTableField(params) {
  return fetch({
    url: '/table/manage/queryTableField',
    method: 'GET',
    params
  })
}
// 添加数据库表
export function saveManageTable(data) {
  return fetch({
    url: '/table/manage/saveTable',
    method: 'POST',
    data
  })
}
// 数据库表字段保存接口
export function saveTableField(data) {
  return fetch({
    url: '/table/manage/saveTableField',
    method: 'POST',
    data
  })
}
// 生成库
export function createTable(id) {
  return fetch({
    url: `/table/manage/createTable?tableId=${id}`,
    method: 'POST'
  })
}

// 删除表
export function deleteTable(tableName, id) {
  return fetch({
    url: `/table/manage/deleteTable/${tableName}/${id}`,
    method: 'DELETE'
  })
}

// 删除字段
export function deleteTableField(tableName, fieldName, id) {
  return fetch({
    url: `/table/manage/deleteTableField/${tableName}/${fieldName}/${id}`,
    method: 'DELETE'
  })
}
