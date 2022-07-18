import { fetch } from '@/bpm/utils'
// 查询流程
export function getDefinitionList(data) {
  return fetch({
    url: '/processdef/queryMain',
    method: 'POST',
    data
  })
}
// 获取流程图片
export function getDefinitionPhoto (id) {
  return fetch({
    responseType: 'arraybuffer',
    url: `/processdef/getProcessImage/${id}`,
    method: 'GET'
  })
}
