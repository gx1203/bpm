import { fetch } from '@/bpm/utils'

// 自定义打印页面数据加载
export function getPrintData (data) {
  return fetch({
    url: `/bpm/process/getPrintData`,
    method: 'POST',
    data
  })
}
