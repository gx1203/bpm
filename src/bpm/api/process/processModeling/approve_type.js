import { fetch } from '@/bpm/utils'
// 获取固定审批列表
export function getApproveTypeList(data) {
  return fetch({
    url: '/oa/approvetype/query',
    method: 'POST',
    data
  })
}

// 流程数据查询列表
export function getprocessArchive(data) {
  return fetch({
    url: '/bpm/processquery/v2/processArchive',
    method: 'POST',
    data
  })
}


// 流程数据归档
export function setarchive(data) {
  return fetch({
    url: '/bpm/process/manage/archive',
    method: 'POST',
    data
  })
}


// 流程数据归档记录
export function getarchiveRecord(data) {
  return fetch({
    url: '/bpm/process/manage/archiveRecord',
    method: 'POST',
    data
  })
}




// 归档数据恢复-根据归档记录id
export function dataRecoverys(data) {
  return fetch({
    url: '/bpm/process/manage/dataRecovery',
    method: 'POST',
    data
  })
}
// 归档数据恢复-根据归档记录id
export function dataRecoveryByInstid(data) {
  return fetch({
    url: '/bpm/process/manage/dataRecoveryByInstid',
    method: 'POST',
    data
  })
}
// 保存天数设置
export function saveProcessArchiveKeepDay(data) {
  return fetch({
    url: '/bpm/process/manage/saveProcessArchiveKeepDay',
    method: 'POST',
    data
  })
}
// 获取固定审批快速列表
export function getApproveQuickQuery(data) {
  return fetch({
    url: '/oa/approvetype/quickQuery',
    method: 'POST',
    data
  })
}

// 添加编辑固定审批
export function saveApproveType(data) {
  return fetch({
    url: '/oa/approvetype/save',
    method: 'POST',
    data
  })
}

// 删除固定审批
export function deleteApproveType(id) {
  return fetch({
    url: `/oa/approvetype/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除固定审批
export function batchDeleteApproveType(ids) {
  return fetch({
    url: `/oa/approvetype/batch-delete/${ids}`,
    method: 'DELETE'
  })
}