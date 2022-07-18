import { fetch } from '@/bpa/utils'

//  ----------------工具
// 保存
export function modelRepositoryToolSave (data) {
    return fetch({
      url: '/modelRepositoryTool/save',
      method: 'post',
      data
    })
  }
//   列表
export function modelRepositoryToolQuery (data) {
    return fetch({
      url: '/modelRepositoryTool/query',
      method: 'post',
      data
    })
  }

// 获取
export function modelRepositoryToolGet (id) {
    return fetch({
      url: '/modelRepositoryTool/get/' + id,
      method: 'get'
    })
  }
// 删除
export function modelRepositoryToolDelete (id) {
    return fetch({
      url: `/modelRepositoryTool/delete/${id}`,
      method: 'delete'
    })
  }

//   文档库-------------------------------------
// /modelRepositoryDoc/query
// 列表
export function modelRepositoryDocquery (data) {
  return fetch({
    url: '/modelRepositoryDoc/query',
    method: 'post',
    data
  })
}
// /modelRepositoryDoc/save 保存
export function modelRepositoryDocsave (data) {
  return fetch({
    url: '/modelRepositoryDoc/save',
    method: 'post',
    data
  })
}
// 列表删除
// /modelRepositoryDoc/delete/{id}
// 删除
export function modelRepositoryDocDelete (id) {
  return fetch({
    url: `/modelRepositoryDoc/delete/${id}`,
    method: 'delete'
  })
}

// /modelRepositoryDoc/getBoListByDocid/{docid}
// 获取
export function getBoListByDocid (id) {
  return fetch({
    url: 'modelRepositoryDoc/get/'+id,
    method: 'get'
  })
}
// /service/queryRepositoryDocFolderTreeId
// get请求  获取文档库顶级id
export function queryRepositoryDocFolderTreeId () {
    return fetch({
      url: 'service/queryRepositoryDocFolderTreeId',
      method: 'get'
    })
  }
//   /foldertree/getCopy/{id}
// get请求 查本级
export function foldertree (id) {
  return fetch({
    url: 'regulation/getRegulationFolderCopy/'+id,
    method: 'get'
  })
}

// 保存文档目录
// /foldertree/saveCopy
// post请求 保存
// {"id":"1380","foldername":"2.1总体标准测试","pid":"1362","code":"2.1"}
export function foldertreeSaveCopy (data) {
  return fetch({
    url: '/foldertree/saveCopy',
    method: 'post',
    data
  })
}
// /foldertree/deleteCopy/{id}
// delete请求  删除
export function foldertreeDeleteCopy (id) {
  return fetch({
    url: `/foldertree/deleteCopy/${id}`,
    method: 'delete'
  })
}

// 业务对象————————————————————————————————————

// /repositorybo/page
// 列表

export function repositorybopage (data) {
  return fetch({
    url: '/repositorybo/page',
    method: 'post',
    data
  })
}
// /repositorybo/save
// 新增/编辑
export function repositorybosave (data) {
  return fetch({
    url: '/repositorybo/save',
    method: 'post',
    data
  })
}
// /repositorybo/delete/{id}
// 删除
export function repositoryboDelete (id) {
  return fetch({
    url: `/repositorybo/delete/${id}`,
    method: 'delete'
  })
}
// /repositorybo/get/{id}
// 详情
export function repositoryboget (id) {
  return fetch({
    url: 'repositorybo/get/'+id,
    method: 'get'
  })
}

// 工具库 获取关联节点
export function getNodesByTool (data) {
  return fetch({
    url: `/modelRepositoryTool/getNodesByTool`,
    method: 'post',
    data
  })
}

// 专业库
export function repositorySpecpage (data) {
  return fetch({
    url: `/repositorySpec/page`,
    method: 'post',
    data
  })
}

// 专业库删除
export function repositorydelete (id) {
  return fetch({
    url: `/repositorySpec/delete/${id}`,
    method: 'delete',
  })
}

// 详情
export function repositoryget (id) {
  return fetch({
    url: `/repositorySpec/get/${id}`,
    method: 'get',
  })
}

// 保存 编辑
export function repositorySpecsave (data) {
  return fetch({
    url: `/repositorySpec/save`,
    method: 'post',
    data
  })
}

// 统计所属分类数据量
export function getCountByfolderid (folderId) {
  return fetch({
    url: `/repositorybo/getCountByfolderid/${folderId}`,
    method: 'get'
  })
}