import { fetch } from '@/bpa/utils'

// 获取所有样式
export function getAllStyle(){
  return fetch({
    url:'/modelIcon/getAllStyle',
    method: 'get'
  })
}

// 新增样式
export function addNewStyle(styleName) {
  return fetch({
    url: `/modelIcon/addStyle/${styleName}`,
    method: 'post'
  })
}

// 编辑样式
export function editStyle(data) {
  return fetch({
    url: '/modelIcon/updateStyle',
    method: 'post',
    data
  })
}

// 删除样式
export function deleteStyle(styleId){
  return fetch({
    url: `/modelIcon/deleteStyle/${styleId}`,
    method: 'delete'
  })
}



// 图片上传
export const uploadImg = data => {
  return fetch({
    url: '/attach/upload?attachmentType=bpm',
    method: 'post',
    data
  })
}

// 获取上传图片
export const getImg = iconid => {
  return fetch({
    url: `/bpm/attachment/download/${iconid}?attachmentType=bpm`,
    method: 'get'
  })
}

// 新增图例 + 编辑图例
export const saveLegend = data => {
  return fetch({
    url: '/modelIcon/save',
    method: 'post',
    data
  })
}

// 获取图例(根据id)
export const getLegend = id => {
  return fetch({
    url: `/modelIcon/get/${id}`,
    method: 'get'
  })
}

// 获取所有图例
export const getLegendList = (data) => {
  return fetch({
    url: '/modelIcon/queryTree',
    method: 'post',
    data
  })
}

// 删除图例
export const removeLegend = id => {
  return fetch({
    url: `/modelIcon/delete/${id}`,
    method: 'delete'
  })
}

// 更新分类状态

export const updateStatus = ({ styleId,classifyName, status }) => {
  return fetch({
    url: `/modelIcon/updateStatus/${styleId}/${classifyName}/${status}`,
    method: 'post'
  })
}
